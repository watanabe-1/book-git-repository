import { FastField, FieldProps } from 'formik';
import React from 'react';

import InputAllButton from './InputAllButton';
import {
  BuildListTableFormObjConfig,
  NestedObject,
} from '../../../../../@types/studyUtilType';
import { classConst } from '../../../../../constant/classConstant';
import { fieldConst } from '../../../../../constant/fieldConstant';
import { urlConst } from '../../../../../constant/urlConstant';
import { fetchPost } from '../../../../../study/util/studyUtil';
import { objArrayToObj } from '../../../../../study/util/studyYupUtil';
import CheckBox, {
  getCheckBoxLabelValue,
  getCheckBoxTextValue,
  modifierCheckBox,
} from '../../../../components/form/CheckBox';
import SortAndFilterFormTable from '../../../../components/form/formTable/FormTable';
import SelectBox, {
  getSelectBoxTextValue,
  getSelectBoxTypeList,
} from '../../../../components/form/SelectBox';
import TextBox, {
  getTextBoxTextValue,
  modifierTextBox,
} from '../../../../components/form/TextBox';
import { useErrData } from '../../../../hooks/useCommon';
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

  /**
   * 送信ボタン
   * @param form 送信パラメータ
   */
  const handleSubmit = async (form: unknown) => {
    const res = await fetchUpdListData(
      objArrayToObj(
        form[classConst.DEF_CAT_DATA_LIST],
        classConst.DEF_CAT_DATA_LIST
      )
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
  };

  /**
   * 送信ボタン(新規)
   * @param form 送信パラメータ
   */
  const handlePushData = async (form: NestedObject) => {
    const res = await fetchPushData(
      objArrayToObj(
        form[classConst.DEF_CAT_DATA_LIST] as NestedObject[],
        classConst.DEF_CAT_DATA_LIST
      )
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
  };

  /**
   * リストデータ更新
   */
  const fetchUpdListData = async (form) => {
    return await fetchPost(urlConst.defaultCategory.LIST_DATA_UPDATE, form);
  };

  /**
   * 新規リストデータ追加
   */
  const fetchPushData = async (form: NestedObject) => {
    return await fetchPost(urlConst.defaultCategory.LIST_DATA_PUSH, form);
  };

  // console.log({ ...info });
  // console.log({ ...list });

  // console.log(info);
  // console.log(list);

  // obj[]からobjに変換し、必要な情報を定義したオブジェクトを作成するための設定
  const toObjConfig: BuildListTableFormObjConfig = {
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
              textValue: getCheckBoxLabelValue(
                flag,
                getCheckBoxTextValue(flag, value)
              ),
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
              textValue: getSelectBoxTextValue(
                getSelectBoxTypeList(typeList),
                value
              ),
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
              textValue: getSelectBoxTextValue(
                getSelectBoxTypeList(typeList),
                value
              ),
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
                        noLabel
                      />
                    );
                  }}
                </FastField>
              ),
              value: value,
              textValue: getCheckBoxTextValue(flag, value),
            };
          },
        },
      },
    ],
  };

  return (
    <div className="container">
      <SortAndFilterFormTable
        objArray={list.defCatDataList}
        tableFormConfig={toObjConfig}
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
