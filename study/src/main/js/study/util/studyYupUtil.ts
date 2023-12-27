import { getIn, setIn } from 'formik';
import { FormikProps } from 'formik/dist/types';
import { AnyObject, ArraySchema, array, object } from 'yup/index';

import { getValueObj } from './studyFormUtil';
import { isObjEmpty, keyJoin } from './studyUtil';
import {
  ErrorResults,
  BuildListTableFormObjConfig,
  ErrorResult,
  TableColumn,
  BuildListTableFormObjConfigItem,
} from '../../@types/studyUtilType';

type NestedObject = Record<string, unknown>;

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

// /**
//  * サーバーでバリデーションを行った結果を反映するようの関数をyupにセット
//  *
//  * @param yup yup
//  * @param target 対象変数名
//  * @param errData エラー結果格納変数
//  * @param setErrData エラー結果格納変数更新メソッド
//  */
// export function addServerValidateFunc(
//   yup: Schema<string, AnyObject, string>,
//   target: string,
//   errData: ErrorResults
// ) {
//   // let path = null;
//   //  yup.test(
//   //   CommonConst.SERVER_TEST_NAME,
//   //   function () {
//   //     console.log(`path:${path}`);
//   //     console.log(path);
//   //     // pathの値は第三引数のファンクションが実行されたときにセットされる
//   //     return getServerErrMsg(errData, path, setErrData);
//   //   },
//   //   // testのコールバック関数としてarrow functionを使うとthisが束縛されてしまうので、function()の形で記載
//   //   function (value) {
//   //     // console.log(`this:${this}`);
//   //     // console.log(this);
//   //     // ここでkey(this.path)の値をgetServerErrMsgで取得できるようにセット
//   //     path = this.path;
//   //     return !isServerErr(errData, path);
//   //   }
//   // );

//   return yup.test(
//     commonConst.SERVER_TEST_NAME,
//     (value, { createError, path }) => {
//       const error = getServerErr(errData, path);
//       if (error)
//         return createError({
//           path,
//           message: extractAndDeleteServerErrMsg(error),
//         });
//       else return true;
//     }
//   );
// }

// /**
//  * サーバーでバリデーションを行った結果を反映するようの関数をyupにセット
//  *
//  * @param additions yupが定義されているオブジェクト
//  * @param targets 対象変数名達
//  * @param errData エラー結果格納変数
//  * @param setErrData エラー結果格納変数更新メソッド
//  */
// export function addServerValidateFuncs(
//   additions: { [x: string]: Schema<string, AnyObject, string> },
//   targets: string[],
//   errData: ErrorResults
// ) {
//   targets.forEach((target) => {
//     additions[target] = addServerValidateFunc(
//       additions[target],
//       target,
//       errData
//     );
//   });
// }

/**
 * サーバーでエラーがあった場合のエラーメッセージを取得
 *
 * @param errData エラー結果格納変数
 * @param key エラー対象判別用key
 * @param setErrData エラー結果格納変数更新メソッド
 * @returns サーバーエラー格納object
 */
export function getServerErr(errData: ErrorResults, key: string) {
  //console.log('call getServerErr');
  if (errData) {
    const errors = errData.errorResults;
    return errors.find((error) => {
      // console.log(`getServerErr`);
      // console.log(`key:${key}`);
      // console.log(`error.itemPath:${error.itemPath}`);
      return error.itemPath === key;
    });
  }
  return undefined;
}

/**
 * サーバーでエラーがあった場合のエラーメッセージを取得
 *
 * @param errData エラー結果格納変数
 * @param key エラー対象判別用key
 * @param setErrData エラー結果格納変数更新メソッド
 * @returns エラーメッセージ
 */
export function extractAndDeleteServerErrMsg(errData: ErrorResult) {
  //console.log('call extractAndDeleteServerErrMsg');
  // console.log(errData);
  if (errData) {
    // 次回検索時に取得対象にならないようにキーを削除
    errData.itemPath = '';
    return errData.message;
  }
  return 'エラーです';
}

// /**
//  * サーバーでエラーがあったかの判定を行う
//  *
//  * @param errData エラー結果格納変数
//  * @param key エラー対象判別用key
//  * @returns 判定結果
//  */
// export function isServerErr(errData: ErrorResults, key: string) {
//   console.log(errData);
//   if (errData) {
//     const errors = errData.errorResults;
//     console.log('isServerErrエラー：' + errors);
//     for (let i = 0; i < errors.length; ++i) {
//       const fieldName = errors[i].itemPath;
//       // console.log(`key:${key}`);
//       // console.log(`itemPath:${fieldName}`);
//       if (fieldName === key) {
//         return true;
//       }
//     }
//   }

//   return false;
// }

// /**
//  * リスト表示用のエスケープ済みの一意の名称の取得
//  * @param classname クラス名
//  * @param base ベース
//  * @param index インデックス
//  * @returns
//  */
// export function buildEscapeListItemId(
//   classname: string,
//   base: string,
//   index: number
// ) {
//   return (
//     classname +
//     CommonConst.FORMAT_SPECIFIER +
//     index +
//     CommonConst.FORMAT_SPECIFIER +
//     base.replace(/\./g, CommonConst.FORMAT_SPECIFIER)
//   );
// }

// /**
//  * エスケープをおこなっていたbuildEscapeListItemIdからサーバーに返却用のIDに変換
//  * @param escapeListItemId  対象
//  * @param args 変換用引数
//  * @returns 返還後の値
//  */
// export function formatEscapeListItemId(escapeListItemId: string) {
//   const args = escapeListItemId
//     .split(CommonConst.FORMAT_SPECIFIER)
//     .map((target, index) => {
//       if (index === 0) {
//         return '[';
//       } else if (index === 1) {
//         return '].';
//       } else {
//         return '.';
//       }
//     });
//   // console.log('format:' + j);
//   return format(escapeListItemId, args);
// }

/**
 * オブジェクトの並列探索を行いFormDataに変換
 * @param obj 変換対象オブジェクト
 * @return FormData
 */
export function objToFormData(obj: NestedObject): FormData {
  const formData = new FormData();
  //console.log(obj);

  function processKey(parentKey: string, value: unknown): void {
    if (value && value.constructor === Object && !Array.isArray(value)) {
      //console.log(`parentKey:${parentKey} value:${value}`);
      Object.keys(value).forEach((key) => {
        // console.log(`parentKey[key]:${parentKey}[${key}]`);
        processKey(keyJoin(parentKey, key), value[key]);
      });
    } else if (value !== undefined && value !== null) {
      // console.log(`parentKey:${parentKey} value:${value}`);
      formData.set(parentKey, value as string | Blob);
    }
    // else {
    //   console.log(`parentKey:${parentKey} value:${value}`);
    // }
  }

  Object.keys(obj).forEach((key) => {
    //console.log(`key:${key} obj[key]:${obj[key]}`);
    processKey(key, obj[key]);
  });

  //console.log(formData);
  return formData;
}

/**
 * オブジェクトの配列を並列探索を行いオジェクトに変換
 *
 * @param objArray 対象
 * @param arrayName 配列名
 * @return {}
 */
export function objArrayToObj(
  objArray: NestedObject[],
  arrayName: string
): NestedObject | undefined {
  if (isObjEmpty(objArray)) return;

  const data: NestedObject = {};

  function processObject(obj: NestedObject, parentKey: string): void {
    Object.keys(obj).forEach((key) => {
      const fullKey = keyJoin(parentKey, key);
      if (
        obj[key] &&
        obj[key].constructor === Object &&
        !Array.isArray(obj[key])
      ) {
        processObject(obj[key] as NestedObject, fullKey);
      } else if (obj[key] !== undefined && obj[key] !== null) {
        data[fullKey] = obj[key];
      }
    });
  }

  objArray.forEach((obj, index) => {
    processObject(obj, `${arrayName}[${index}]`);
  });

  return data;
}

// 変換することがなくなった(もう使わない？)のでコメントアウト
// /**
//  * buildListTableFormObjメソッドでobj[]からobjに変換したobjをobj[]に変換
//  * @param obj 対象
//  * @return 配列
//  */
// export function objToObjArray(obj: {}) {
//   let objArray: {}[] = [];
//   for (const key in obj) {
//     const keyArray = key.split(CommonConst.FORMAT_SPECIFIER);
//     if (keyArray.length > 1) {
//       let newObj = {};
//       // console.log(keyArray);
//       keyArray.forEach((value, index) => {
//         if (index === 1) {
//           // console.log(value);
//           if (objArray[value]) {
//             newObj = objArray[value];
//           } else {
//             objArray[value] = newObj;
//           }
//         } else if (index >= 2) {
//           // console.log(JSON.stringify(newObj[value]));
//           // console.log(JSON.stringify(objArray));
//           if (newObj[value]) {
//             newObj = newObj[value];
//           } else {
//             newObj[value] = {};
//           }
//           // 最終周の時
//           if (keyArray.length - 1 === index) {
//             // 他の項目とかぶりが生じた場合はそれはオブジェクトではなくなっているので
//             //判定を行うが基本的にかぶりが起きないように修正済みのためかぶりない想定
//             // またかぶりがあった場合は上書き
//             if (newObj && newObj.constructor === Object) {
//               newObj[value] = obj[key];
//             } else {
//               newObj = obj[key];
//             }
//           }
//         }
//       });
//     }
//   }
//   console.log(objArray);
//   return objArray;
// }

// エスケープなどで自力で作成した方
// formlikのfieldを使用するようにしたため使用しなくなった
// /**
//  * リストテーブルフォーム画面用にobj[]からobjに変換し、必要な情報を定義したオブジェクトを作成
//  *
//  * @param objArray オブジェクト配列
//  * @param config 設定
//  * @returns ビルドしたオブジェクト
//  */
// export function buildListTableFormObj(
//   objArray: {}[],
//   config: BuildListTableFormObjConfig
// ) {
//   // //yupで使用するスキーマの設定
//   const additions = {};
//   // 初期値
//   const initialValues = {};
//   // リスト表示用一意の識別名称
//   const nameList: {}[] = [];

//   objArray.forEach((obj, index) => {
//     const names = {};
//     let stack = [];

//     stack.push(obj);

//     while (stack.length) {
//       for (const j in stack[0]) {
//         // 設定を取得
//         const mutchconfig = config.list.find((v) => v.name === j);
//         if (
//           stack[0][j] &&
//           stack[0][j].constructor === Object &&
//           !stack[0][j].length
//         ) {
//           // console.log(`pushu側${j} : ${stack[0][j]}`);
//           const childStack = {};
//           for (const k in stack[0][j]) {
//             // 再帰的に検索する場合key情報を引き継ぐ
//             childStack[keyJoin(j, k)] = stack[0][j][k];
//           }
//           // 取得結果がobjectの場合は再帰的に探索するため対象に改めて追加
//           stack.push(childStack);
//         } else {
//           // console.log(j);
//           names[j] = buildEscapeListItemId(config.className, j, index);
//           // 個別の設定が指定されていなかったら
//           if (mutchconfig) {
//             // console.log(j);
//             // スキーマ設定用
//             if (
//               mutchconfig &&
//               mutchconfig.addition &&
//               mutchconfig.addition.yup
//             ) {
//               additions[names[j]] = mutchconfig.addition.yup;
//               // サーバーでのバリデーション結果を反映する関数をセット
//               if (mutchconfig.addition.isServerValidation) {
//                 addServerValidateFuncs(
//                   additions,
//                   [names[j]],
//                   mutchconfig.addition.errData,
//                   mutchconfig.addition.setErrData
//                 );
//               }
//             }
//           }
//           // 設定が指定されていなくても初期値として保持する(送り返すよう)
//           // 初期値設定用
//           initialValues[names[j]] = stack[0][j];
//         }
//       }
//       stack.shift();
//     }
//     nameList[index] = names;
//   });
//   const result = {
//     additions: additions,
//     initialValues: initialValues,
//     getRows: (props: FormikProps<unknown>) => {
//       return nameList.map((names) => {
//         return {
//           cells: config.list.map((v) => {
//             return {
//               name: v.name,
//               value: props.values[names[v.name]],
//               element: v.table.getCell(props, names),
//               hidden: v.table.hidden,
//             };
//           }),
//         };
//       });
//     },
//     columns: config.list.map((v) => {
//       return {
//         name: v.name,
//         value: v.table.head,
//         filterValue: '',
//         hidden: v.table.hidden,
//       };
//     }),
//   };

//   console.log('nakami');
//   console.log(result);

//   return result;
// }

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
  names: object,
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
