import { getIn, setIn, FormikProps } from 'formik';
import isEqual from 'react-fast-compare';
import { array, object, ArraySchema, AnyObject } from 'yup';

import {
  BuildListTableFormObjConfig,
  BuildListTableFormObjConfigItem,
  NestedObject,
  TableColumn,
} from '../../../../../@types/studyUtilType';
import { getValueObj } from '../../../../../study/util/studyFormUtil';
import { isObjEmpty, keyJoin } from '../../../../../study/util/studyUtil';

type ListTableFormCell = {
  name: string;
  value: string;
  textValue: string;
  element: JSX.Element;
  hidden: boolean;
};

type ListTableFormRow = {
  primaryKey: string;
  cells: ListTableFormCell[];
  hidden: boolean;
};

/**
 * 修正が行われた行のみに送信データをフィルターする
 *
 * @param values formデータ
 * @param initialValues form初期値
 * @param rowName 行の名前
 * @param submitModifiedRowsOnly 行をフィルタするか
 * @returns
 */
export const filterRowValues = (
  values: NestedObject,
  initialValues: NestedObject,
  rowName: string,
  submitModifiedRowsOnly: boolean
) => {
  const submitValues = { ...values } as NestedObject;

  // 修正した行のみに送信対象を絞り込む
  if (submitModifiedRowsOnly) {
    const rows = values[rowName] as [];
    const initialRows = initialValues[rowName] as [];
    const editRows = rows.filter((row, index) => {
      const initialRow = initialRows[index];
      // console.log(`row is edited : ${!isEqual(row, initialRow)}`);

      return !isEqual(row, initialRow);
    });
    submitValues[rowName] = isObjEmpty(editRows) ? null : editRows;
    // console.log(`editValues:${JSON.stringify(submitValues)}`);
  }

  return submitValues;
};

/**
 * buildListTableFormObj用
 * nameをつめたListを作成
 *
 * @param objArray オブジェクト配列
 * @param config 設定
 * @returns
 */
function createNameList(
  objArray: NestedObject[],
  config: BuildListTableFormObjConfig
): NestedObject[] {
  function processObject(
    obj: NestedObject,
    parentKey: string,
    index: number,
    names: NestedObject
  ): void {
    Object.keys(obj).forEach((key) => {
      const fullKey = keyJoin(parentKey, key);
      //console.log(fullKey);
      if (
        obj[key] &&
        obj[key].constructor === Object &&
        !Array.isArray(obj[key])
      ) {
        processObject(obj[key] as NestedObject, fullKey, index, names);
      } else {
        names[fullKey] = keyJoin(`${config.className}[${index}]`, fullKey);
      }
    });
  }

  return objArray.map((obj, index) => {
    const names = {};
    processObject(obj, '', index, names);

    return names;
  });
}

/**
 * buildListTableFormObj用
 * 初期値を設定
 *
 * @param objArray オブジェクト配列
 * @param config 設定
 * @returns
 */
function createInitialValues(
  objArray: NestedObject[],
  config: BuildListTableFormObjConfig,
  nameList: NestedObject[]
) {
  return nameList.reduce(
    (accumulatedValues, names) => {
      config.list.forEach((v) => {
        const name = names[v.name] as string;
        if (name && v.modifier) {
          const initialValue = getIn(accumulatedValues, name);
          // console.log(name);
          // console.log(initialValue);
          // console.log(v.modifier(initialValue));
          accumulatedValues = setIn(
            accumulatedValues,
            name,
            v.modifier(initialValue)
          );
        }
      });

      return accumulatedValues;
    },
    { [config.className]: objArray } as NestedObject
  );
}

/**
 * buildListTableFormObj用
 * yupバリデーション用Additions(LIST)の作成
 *
 * @param config 設定
 * @returns
 */
function createAdditions(config: BuildListTableFormObjConfig) {
  const arrayAdditions = config.list.reduce((acc, v) => {
    if (v.addition) {
      acc[v.name] = v.addition.yup;
    }
    return acc;
  }, {});

  return {
    [config.className]: array().of(object().shape(arrayAdditions)),
  } as Record<string, ArraySchema<Record<string, never>[], AnyObject, '', ''>>;
}

/**
 * buildListTableFormObj用
 * tableformの行を一位に区別するkeyの作成
 *
 * @param primaryKeyName primaryKeyを指定したname
 * @param names nameが詰められたオブジェクト
 * @param props FormikProps
 * @returns
 */
function getPrimaryKey(
  primaryKeyName: string | string[],
  names: NestedObject,
  props: FormikProps<unknown>
): string {
  return typeof primaryKeyName === 'string'
    ? props.getFieldProps(names[primaryKeyName] as string).value
    : primaryKeyName.reduce(
        (ret, primaryKey) =>
          ret + props.getFieldProps(names[primaryKey] as string).value,
        ''
      );
}

/**
 * buildListTableFormObj用
 * form tableのcellの作成
 *
 * @param props FormikProps
 * @param items table form 用の行定義オブジェクト
 * @param names nameが詰められたオブジェクト
 * @returns
 */
function createCells(
  props: FormikProps<unknown>,
  items: BuildListTableFormObjConfigItem[],
  names: NestedObject
): ListTableFormCell[] {
  return items.map((item) => {
    // console.log('cells');
    // console.log(item.name);
    // console.log(names);
    // console.log(props.getFieldProps(names[item.name]).value);

    /**
     * names(listのindexに応じたname)から特定のnameを取得
     *
     * @param key
     */
    const getName = (key: string) => {
      return names[key] as string;
    };

    const name = getName(item.name);
    const { value, initialValue } = getValueObj(props, name);
    const cellField = { value, initialValue, name };

    const cellForm = {
      props,
      names,
      getName,
    };

    const cellObj = item.table.getCell(cellField, cellForm);

    //console.log(cellField);

    return {
      name: item.name,
      value: cellObj.value as string,
      textValue: cellObj.textValue,
      element: cellObj.element,
      hidden: item.table.hidden,
    };
  });
}

/**
 * buildListTableFormObj用
 * form tableのrowの作成
 *
 * @param props FormikProps
 * @param nameList nameがつめられたnamesオブジェクトのリスト
 * @param config 設定
 * @returns
 */
function createRow(
  props: FormikProps<unknown>,
  nameList: NestedObject[],
  config: BuildListTableFormObjConfig
): ListTableFormRow[] {
  return nameList.map((names) => {
    const primaryKey = getPrimaryKey(config.primaryKey, names, props);

    return {
      primaryKey: primaryKey,
      cells: createCells(props, config.list, names),
      hidden: false,
    };
  });
}

/**
 * buildListTableFormObj用
 * form tableのヘッダーの作成
 *
 * @param config 設定
 * @returns
 */
function createColumns(config: BuildListTableFormObjConfig): TableColumn[] {
  return config.list.map((v) => {
    return {
      name: v.name,
      value: v.table.head,
      filterValue: '',
      hidden: v.table.hidden,
      showSuggestions: false,
      activeSuggestionIndex: 0,
    };
  });
}

/**
 * リストテーブルフォーム画面用にobj[]からobjに変換し、必要な情報を定義したオブジェクトを作成
 *
 * @param objArray オブジェクト配列
 * @param config 設定
 * @returns ビルドしたオブジェクト
 */
export function buildListTableFormObj(
  objArray: NestedObject[],
  config: BuildListTableFormObjConfig
) {
  // //yupで使用するスキーマの設定
  const additions = createAdditions(config);
  // リスト表示用一意の識別名称
  const nameList = createNameList(objArray, config);
  // 初期値
  const initialValues = createInitialValues(objArray, config, nameList);
  // console.log('nameList');
  // console.log(nameList);
  const columns = createColumns(config);

  const result = {
    additions: additions,
    initialValues: initialValues,
    rowName: config.className,
    getRows: (props: FormikProps<unknown>) => {
      return createRow(props, nameList, config);
    },
    columns: columns,
  };

  // console.log('nakami');
  // console.log(result);

  return result;
}
