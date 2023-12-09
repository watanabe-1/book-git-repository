import { FastField, FieldProps, FormikProps } from 'formik';
import React, { useMemo, useState } from 'react';

import InputAllButton from './InputAllButton';
import {
  ErrorResults,
  BuildListTableFormObjConfig,
} from '../../../../../@types/studyUtilType';
import { classConst } from '../../../../../constant/classConstant';
import { fieldConst } from '../../../../../constant/fieldConstant';
import { urlConst } from '../../../../../constant/urlConstant';
import { fetchPost } from '../../../../../study/util/studyUtil';
import {
  objArrayToObj,
  buildListTableFormObj,
} from '../../../../../study/util/studyYupUtil';
import CheckBox, {
  getCheckBoxLabelValue,
  getCheckBoxTextValue,
  modifierCheckBox,
} from '../../../../components/form/CheckBox';
import SelectBox, {
  getSelectBoxTextValue,
  getSelectBoxTypeList,
} from '../../../../components/form/SelectBox';
import SortAndFilterFormTable from '../../../../components/form/SortAndFilterFormTable';
import TextBox, {
  getTextBoxTextValue,
  modifierTextBox,
} from '../../../../components/form/TextBox';
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
  const [errData, setErrData] = useState() as [
    ErrorResults,
    React.Dispatch<React.SetStateAction<unknown>>
  ];

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
  const handlePushData = async (form: unknown) => {
    const res = await fetchPushData(
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
   * リストデータ更新
   */
  const fetchUpdListData = async (form) => {
    return await fetchPost(urlConst.defaultCategory.LIST_DATA_UPDATE, form);
  };

  /**
   * 新規リストデータ追加
   */
  const fetchPushData = async (form: object) => {
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
          getCell: (props: FormikProps<unknown>, names: unknown) => {
            const name = names[fieldConst.defaultCategory.DELETE];
            const value = props.getFieldProps(name).value;
            const flag = info.delete;
            return {
              element: (
                <FastField name={name}>
                  {({ field }: FieldProps<string>) => {
                    return (
                      <CheckBox
                        name={field.name}
                        value={field.value}
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
          getCell: (props: FormikProps<unknown>, names: unknown) => {
            const name = names[fieldConst.defaultCategory.BOOKS_TYPE];
            const value = props.getFieldProps(name).value;
            const typeList = info.booksTypes;
            return {
              element: (
                <FastField name={name}>
                  {({ field, meta }: FieldProps<string>) => {
                    return (
                      <SelectBox
                        name={field.name}
                        value={field.value}
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
          getCell: (props: FormikProps<unknown>, names: unknown) => {
            const name = names[fieldConst.defaultCategory.BOOKS_PLACE];

            const value = props.getFieldProps(name).value;
            return {
              element: (
                <FastField name={name}>
                  {({ field, meta }: FieldProps<string>) => {
                    return (
                      <TextBox
                        name={field.name}
                        value={field.value}
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
          getCell: (props: FormikProps<unknown>, names: unknown) => {
            const name = names[fieldConst.defaultCategory.BOOKS_METHOD];
            const value = props.getFieldProps(name).value;
            return {
              element: (
                <FastField name={name}>
                  {({ field, meta }: FieldProps<string>) => {
                    return (
                      <TextBox
                        name={field.name}
                        value={field.value}
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
          getCell: (props: FormikProps<unknown>, names: unknown) => {
            const name = names[fieldConst.defaultCategory.BOOKS_AMMOUNT_MIN];
            const value = props.getFieldProps(name).value;
            return {
              element: (
                <FastField name={name}>
                  {({ field, meta }: FieldProps<string>) => {
                    return (
                      <TextBox
                        name={field.name}
                        value={field.value}
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
          getCell: (props: FormikProps<unknown>, names: unknown) => {
            const name = names[fieldConst.defaultCategory.BOOKS_AMMOUNT_MAX];
            const value = props.getFieldProps(name).value;
            return {
              element: (
                <FastField name={name}>
                  {({ field, meta }: FieldProps<string>) => {
                    return (
                      <TextBox
                        name={field.name}
                        value={field.value}
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
          getCell: (props: FormikProps<unknown>, names: unknown) => {
            const name = names[fieldConst.defaultCategory.CAT_CODE];
            const value = props.getFieldProps(name).value;
            const typeList = info.categories;
            return {
              element: (
                <FastField name={name}>
                  {({ field, meta }: FieldProps<string>) => {
                    return (
                      <SelectBox
                        name={field.name}
                        value={field.value}
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
          getCell: (props: FormikProps<unknown>, names: unknown) => {
            const name = names[fieldConst.defaultCategory.PRIORITY];
            const value = props.getFieldProps(name).value;
            return {
              element: (
                <FastField name={name}>
                  {({ field, meta }: FieldProps<string>) => {
                    return (
                      <TextBox
                        name={field.name}
                        value={field.value}
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
          getCell: (props: FormikProps<unknown>, names: unknown) => {
            const name = names[fieldConst.defaultCategory.REGEX_ENABLED];
            const value = props.getFieldProps(name).value;
            const flag = info.regexEnabled;
            return {
              element: (
                <FastField name={name}>
                  {({ field }: FieldProps<string>) => {
                    return (
                      <CheckBox
                        name={field.name}
                        value={field.value}
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
  // obj[]からobjに変換し、必要な情報を定義したオブジェクトを作成
  const listTableFormObj = useMemo(
    () => buildListTableFormObj(list.defCatDataList, toObjConfig),
    [list.defCatDataList, toObjConfig]
  );

  return (
    <div className="container">
      <SortAndFilterFormTable
        tableFormConfig={listTableFormObj}
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
