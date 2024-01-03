import { FastField, FieldProps } from 'formik';
import React, { useCallback } from 'react';

import InputAllButton from './InputAllButton';
import {
  BuildListTableFormObjConfig,
  NestedObject,
} from '../../../../../@types/studyUtilType';
import { classConst } from '../../../../../constant/classConstant';
import { fieldConst } from '../../../../../constant/fieldConstant';
import { urlConst } from '../../../../../constant/urlConstant';
import { objArrayToObj } from '../../../../../study/util/studyYupUtil';
import CheckBox, {
  getCheckBoxDetails,
  modifierCheckBox,
} from '../../../../components/form/CheckBox';
import FormTable from '../../../../components/form/formTable/FormTable';
import SelectBox, {
  getSelectBoxDetails,
} from '../../../../components/form/SelectBox';
import TextBox, {
  getTextBoxTextValue,
  modifierTextBox,
} from '../../../../components/form/TextBox';
import { useErrData, useFetch } from '../../../../hooks/useCommon';
import {
  useDefaultCategoryInfoSWR,
  useDefaultCategoryListSWR,
} from '../../../../hooks/useDefaultCategory';
import yup from '../../../../locale/yup.locale';

/**
 * デフォルトカテゴリー リスト形式確認画面
 * @returns リスト
 */
const ListTable = () => {
  const { data: info, initScript: initInfoScript } =
    useDefaultCategoryInfoSWR();
  const {
    data: list,
    mutate: setList,
    initScript: initListScript,
  } = useDefaultCategoryListSWR();
  // const { data: imageList, initScript: initlImageListScript } =
  //   useImageListSWR();
  const [errData, setErrData] = useErrData();
  const { secureFetchPost } = useFetch();

  /**
   * リストデータ更新
   */
  const fetchUpdListData = useCallback(async (form) => {
    return await secureFetchPost(
      urlConst.defaultCategory.LIST_DATA_UPDATE,
      form
    );
  }, []);

  /**
   * 新規リストデータ追加
   */
  const fetchPushData = useCallback(async (form: NestedObject) => {
    return await secureFetchPost(urlConst.defaultCategory.LIST_DATA_PUSH, form);
  }, []);

  /**
   * 送信実行
   *
   * @param fetch 送信関数
   * @param form 送信データ
   * @param listname 送信対象リスト名
   */
  const executeSubmit = useCallback(
    async (
      fetch: (form: NestedObject) => Promise<Response>,
      form: NestedObject,
      listname: string
    ) => {
      const res = await fetch(
        objArrayToObj(form[listname] as NestedObject[], listname)
      );
      const json = await res.json();
      // console.log('soushinkekka');
      // console.log(json);
      if (res.ok) {
        setList(json);
      } else {
        setErrData(json);
      }

      return res;
    },
    [setList, setErrData]
  );

  /**
   * 送信ボタン
   * @param form 送信パラメータ
   */
  const handleSubmit = useCallback(
    async (form: NestedObject) => {
      return await executeSubmit(
        fetchUpdListData,
        form,
        classConst.DEF_CAT_DATA_LIST
      );
    },
    [executeSubmit, fetchUpdListData]
  );

  /**
   * 送信ボタン(新規)
   * @param form 送信パラメータ
   */
  const handlePushData = useCallback(
    async (form: NestedObject) => {
      return await executeSubmit(fetchPushData, form, classConst.CAT_DATA_LIST);
    },
    [executeSubmit, fetchUpdListData]
  );

  // console.log({ ...info });
  // console.log({ ...list });

  // console.log(info);
  // console.log(list);

  // obj[]からobjに変換し、必要な情報を定義したオブジェクトを作成するための設定
  const tableFormConfig: BuildListTableFormObjConfig = {
    className: classConst.DEF_CAT_DATA_LIST,
    primaryKey: fieldConst.defaultCategory.DEFAULT_CATEGORY_ID,
    list: [
      {
        name: fieldConst.defaultCategory.DELETE,
        modifier: modifierCheckBox,
        table: {
          head: '削除',
          getCell: ({ value, initialValue, name }) => {
            const flag = info.delete;

            return {
              element: (
                <FastField name={name}>
                  {({ field }: FieldProps<string>) => {
                    return (
                      <CheckBox
                        name={field.name}
                        value={field.value}
                        initialValue={initialValue}
                        flag={flag}
                        onChange={field.onChange}
                      />
                    );
                  }}
                </FastField>
              ),
              value: value,
              textValue: getCheckBoxDetails(flag, value).textValue,
            };
          },
        },
      },
      {
        name: fieldConst.defaultCategory.BOOKS_TYPE,
        table: {
          head: '家計簿タイプ',
          getCell: ({ value, initialValue, name }, { props }) => {
            const typeList = info.booksTypes;

            // console.log(`${name}:${getInitialValue(props, name)}`);
            // console.log(props.initialValues);

            return {
              element: (
                <FastField name={name}>
                  {({ field, meta }: FieldProps<string>) => {
                    return (
                      <SelectBox
                        name={field.name}
                        value={field.value}
                        initialValue={initialValue}
                        validate
                        touched={meta.touched}
                        error={meta.error}
                        typeList={typeList}
                        dirty={props.dirty}
                        onBlur={field.onChange}
                        isOnClickEditable
                      />
                    );
                  }}
                </FastField>
              ),
              value: value,
              textValue: getSelectBoxDetails(typeList, value).textValue,
            };
          },
        },
        addition: {
          yup: yup.string().required().server(errData),
        },
      },
      {
        name: fieldConst.defaultCategory.BOOKS_PLACE,
        table: {
          head: '名称',
          getCell: ({ value, initialValue, name }, { props }) => {
            return {
              element: (
                <FastField name={name}>
                  {({ field, meta }: FieldProps<string>) => {
                    return (
                      <TextBox
                        name={field.name}
                        value={field.value}
                        initialValue={initialValue}
                        validate
                        touched={meta.touched}
                        error={meta.error}
                        dirty={props.dirty}
                        onBlur={field.onChange}
                        isOnClickEditable
                      />
                    );
                  }}
                </FastField>
              ),
              value: value,
              textValue: getTextBoxTextValue(value),
            };
          },
        },
        addition: {
          yup: yup.string().required().server(errData),
        },
      },
      {
        name: fieldConst.defaultCategory.BOOKS_METHOD,
        table: {
          head: '決済方法',
          getCell: ({ value, initialValue, name }, { props }) => {
            return {
              element: (
                <FastField name={name}>
                  {({ field, meta }: FieldProps<string>) => {
                    return (
                      <TextBox
                        name={field.name}
                        value={field.value}
                        initialValue={initialValue}
                        validate
                        touched={meta.touched}
                        error={meta.error}
                        dirty={props.dirty}
                        onBlur={field.onChange}
                        isOnClickEditable
                      />
                    );
                  }}
                </FastField>
              ),
              value: value,
              textValue: getTextBoxTextValue(value),
            };
          },
        },
        addition: {
          yup: yup.string().required().server(errData),
        },
      },
      {
        name: fieldConst.defaultCategory.BOOKS_AMMOUNT_MIN,
        modifier: modifierTextBox,
        table: {
          head: '金額(最小)',
          getCell: ({ value, initialValue, name }, { props }) => {
            return {
              element: (
                <FastField name={name}>
                  {({ field, meta }: FieldProps<string>) => {
                    return (
                      <TextBox
                        name={field.name}
                        value={field.value}
                        initialValue={initialValue}
                        validate
                        touched={meta.touched}
                        error={meta.error}
                        dirty={props.dirty}
                        onBlur={field.onChange}
                        isOnClickEditable
                      />
                    );
                  }}
                </FastField>
              ),
              value: value,
              textValue: getTextBoxTextValue(value),
            };
          },
        },
        addition: {
          yup: yup.number().required().server(errData),
        },
      },
      {
        name: fieldConst.defaultCategory.BOOKS_AMMOUNT_MAX,
        modifier: modifierTextBox,
        table: {
          head: '金額(最大)',
          getCell: ({ value, initialValue, name }, { props }) => {
            return {
              element: (
                <FastField name={name}>
                  {({ field, meta }: FieldProps<string>) => {
                    return (
                      <TextBox
                        name={field.name}
                        value={field.value}
                        initialValue={initialValue}
                        validate
                        touched={meta.touched}
                        error={meta.error}
                        dirty={props.dirty}
                        onBlur={field.onChange}
                        isOnClickEditable
                      />
                    );
                  }}
                </FastField>
              ),
              value: value,
              textValue: getTextBoxTextValue(value),
            };
          },
        },
        addition: {
          yup: yup.number().required().server(errData),
        },
      },
      {
        name: fieldConst.defaultCategory.CAT_CODE,
        table: {
          head: 'カテゴリー',
          getCell: ({ value, initialValue, name }, { props }) => {
            const typeList = info.categories;

            return {
              element: (
                <FastField name={name}>
                  {({ field, meta }: FieldProps<string>) => {
                    return (
                      <SelectBox
                        name={field.name}
                        value={field.value}
                        initialValue={initialValue}
                        validate
                        touched={meta.touched}
                        error={meta.error}
                        typeList={typeList}
                        dirty={props.dirty}
                        onBlur={field.onChange}
                        isOnClickEditable
                      />
                    );
                  }}
                </FastField>
              ),
              value: value,
              textValue: getSelectBoxDetails(typeList, value).textValue,
            };
          },
        },
        addition: {
          yup: yup.string().required().server(errData),
        },
      },
      {
        name: fieldConst.defaultCategory.PRIORITY,
        modifier: modifierTextBox,
        table: {
          head: '優先度',
          getCell: ({ value, initialValue, name }, { props }) => {
            return {
              element: (
                <FastField name={name}>
                  {({ field, meta }: FieldProps<string>) => {
                    return (
                      <TextBox
                        name={field.name}
                        value={field.value}
                        initialValue={initialValue}
                        validate
                        touched={meta.touched}
                        error={meta.error}
                        dirty={props.dirty}
                        onBlur={field.onChange}
                        isOnClickEditable
                      />
                    );
                  }}
                </FastField>
              ),
              value: value,
              textValue: getTextBoxTextValue(value),
            };
          },
        },
        addition: {
          yup: yup.number().required().server(errData),
        },
      },
      {
        name: fieldConst.defaultCategory.REGEX_ENABLED,
        modifier: modifierCheckBox,
        table: {
          head: '正規表現',
          getCell: ({ value, initialValue, name }, { props }) => {
            const flag = info.regexEnabled;
            const noLabel = true;

            return {
              element: (
                <FastField name={name}>
                  {({ field }: FieldProps<string>) => {
                    return (
                      <CheckBox
                        name={field.name}
                        value={field.value}
                        initialValue={initialValue}
                        flag={flag}
                        dirty={props.dirty}
                        onChange={field.onChange}
                        isOnClickEditable
                        noLabel={noLabel}
                      />
                    );
                  }}
                </FastField>
              ),
              value: value,
              textValue: getCheckBoxDetails(flag, value, noLabel).textValue,
            };
          },
        },
      },
    ],
  };

  return (
    <div className="container">
      <FormTable
        objArray={list.defCatDataList}
        tableFormConfig={tableFormConfig}
        handlePushSubmit={handlePushData}
        handleFormSubmit={handleSubmit}
        errData={errData}
        customeButton={<InputAllButton setList={setList} />}
      />
      {initInfoScript}
      {initListScript}
      {/* {initlImageListScript} */}
    </div>
  );
};

export default ListTable;
