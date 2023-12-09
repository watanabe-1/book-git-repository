import { FastField, Field, FieldProps, FormikProps } from 'formik';
import React, { useMemo, useState } from 'react';

import {
  ErrorResults,
  BuildListTableFormObjConfig,
} from '../../../../../@types/studyUtilType';
import { classConst } from '../../../../../constant/classConstant';
import { fieldConst } from '../../../../../constant/fieldConstant';
import { urlConst } from '../../../../../constant/urlConstant';
import { getSetInputFileFunc } from '../../../../../study/util/studyFormUtil';
import { fetchPost, keyJoin } from '../../../../../study/util/studyUtil';
import {
  objArrayToObj,
  buildListTableFormObj,
} from '../../../../../study/util/studyYupUtil';
import ModalSlider from '../../../../components/elements/slider/ModalSlider';
import CheckBox, {
  getCheckBoxLabelValue,
  getCheckBoxTextValue,
  modifierCheckBox,
} from '../../../../components/form/CheckBox';
import FileBoxAndImg, {
  getFileBoxAndImageTextValue,
} from '../../../../components/form/FileBoxAndImg';
import RadioBtn, {
  getRadioBtnTextValue,
  getRadioBtnTypeList,
} from '../../../../components/form/RadioBtn';
import SelectBox, {
  getSelectBoxTextValue,
  getSelectBoxTypeList,
} from '../../../../components/form/SelectBox';
import SortAndFilterFormTable from '../../../../components/form/SortAndFilterFormTable';
import TextArea, {
  getTextAreaTextValue,
} from '../../../../components/form/TextArea';
import TextBox, {
  getTextBoxTextValue,
  modifierTextBox,
} from '../../../../components/form/TextBox';
import {
  useCategoryInfoSWR,
  useCategoryListSWR,
  useImageListSWR,
} from '../../../../hooks/useCategory';
import yup from '../../../../locale/yup.locale';

/**
 * カテゴリー リスト形式確認画面
 * @returns リスト
 */
const ListTable = () => {
  const { data: info, initScript: initInfoScript } = useCategoryInfoSWR();
  const {
    data: list,
    mutate: setList,
    initScript: initListScript,
  } = useCategoryListSWR();
  const { data: imageList, initScript: initlImageListScript } =
    useImageListSWR();
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
      objArrayToObj(form[classConst.CAT_DATA_LIST], classConst.CAT_DATA_LIST)
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
    return await fetchPost(urlConst.category.LIST_DATA_UPDATE, form);
  };

  console.log({ ...info });
  console.log({ ...list });

  // console.log(info);
  // console.log(list);

  // obj[]からobjに変換し、必要な情報を定義したオブジェクトを作成するための設定
  const toObjConfig: BuildListTableFormObjConfig = {
    className: classConst.CAT_DATA_LIST,
    primaryKey: fieldConst.category.CAT_CODE,
    list: [
      {
        name: fieldConst.category.DELETE,
        modifier: modifierCheckBox,
        table: {
          head: '削除',
          getCell: (props: FormikProps<unknown>, names: unknown) => {
            const name = names[fieldConst.category.DELETE];
            const value = props.getFieldProps(name).value;
            const flag = info.delete;
            return {
              element: (
                <FastField name={name}>
                  {({ field }: FieldProps<string>) => {
                    // console.log('Field');
                    // console.log(field);
                    // console.log('form');
                    // console.log(form);
                    // console.log('meta');
                    // console.log(meta);
                    // console.log('values');
                    // console.log(props.values);
                    // getFieldPropsで取得できる値はFieldタグのfieldと同じ(内部的に同じ関数が呼ばれている)
                    // console.log('props.getFieldProps');
                    // console.log(props.getFieldProps(name));
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
        name: fieldConst.category.CAT_NAME,
        table: {
          head: 'カテゴリー名',
          getCell: (props: FormikProps<unknown>, names: unknown) => {
            const name = names[fieldConst.category.CAT_NAME];
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
                        // onChangeにセットすると入力するたびにソートが走るので、画面が動きすぎて見づらいため、onBlurに設定
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
        name: fieldConst.category.CAT_TYPE,
        table: {
          head: 'カテゴリータイプ',
          getCell: (props: FormikProps<unknown>, names: unknown) => {
            const name = names[fieldConst.category.CAT_TYPE];
            const value = props.getFieldProps(name).value;
            const typeList = info.catTypes;
            return {
              element: (
                <FastField name={name}>
                  {({ field }: FieldProps<string>) => {
                    return (
                      <RadioBtn
                        name={field.name}
                        value={field.value}
                        typeList={typeList}
                        dirty={props.dirty}
                        onChange={field.onChange}
                        isOnClickEditable
                      />
                    );
                  }}
                </FastField>
              ),
              value: value,
              textValue: getRadioBtnTextValue(
                getRadioBtnTypeList(typeList),
                value
              ),
            };
          },
        },
      },
      {
        name: fieldConst.category.NOTE,
        modifier: modifierTextBox,
        table: {
          head: 'メモ',
          getCell: (props: FormikProps<unknown>, names: unknown) => {
            const name = names[fieldConst.category.NOTE];
            const value = props.getFieldProps(name).value;
            return {
              element: (
                <FastField name={name}>
                  {({ field }: FieldProps<string>) => {
                    return (
                      <TextArea
                        name={field.name}
                        value={field.value}
                        dirty={props.dirty}
                        onBlur={field.onChange}
                        isOnClickEditable
                      />
                    );
                  }}
                </FastField>
              ),
              value: value,
              textValue: getTextAreaTextValue(value),
            };
          },
        },
      },
      {
        name: fieldConst.category.IMG_TYPE,
        table: {
          head: '画像タイプ',
          getCell: (props: FormikProps<unknown>, names: unknown) => {
            const name = names[fieldConst.category.IMG_TYPE];
            const value = props.getFieldProps(name).value;
            const typeList = info.imgTypes;
            return {
              element: (
                <FastField name={name}>
                  {({ field }: FieldProps<string>) => {
                    return (
                      <SelectBox
                        name={field.name}
                        value={field.value}
                        typeList={typeList}
                        dirty={props.dirty}
                        // onChangeにセットすると入力するたびにソートが走るので、画面が動きすぎて見づらいため、onBlurに設定
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
      },
      {
        name: keyJoin(fieldConst.category.IMG_IDS, fieldConst.category.IMG_ID),
        table: {
          head: '画像ID',
          getCell: (props: FormikProps<unknown>, names: unknown) => {
            const name =
              names[
                keyJoin(fieldConst.category.IMG_IDS, fieldConst.category.IMG_ID)
              ];
            const value = props.getFieldProps(name).value;
            return {
              element: (
                <>
                  <FastField name={name}>
                    {({ field }: FieldProps<string>) => {
                      const startIndex = imageList.findIndex(
                        (image) => image.imgId === field.value
                      );
                      return (
                        <>
                          <TextBox
                            name={field.name}
                            value={field.value}
                            dirty={props.dirty}
                            isReadonly
                          />
                          <ModalSlider
                            imageList={imageList}
                            startIndex={startIndex}
                            setImage={(image) => {
                              props.setFieldValue(name, image.imgId);
                              props.setFieldValue(
                                names[
                                  keyJoin(
                                    fieldConst.category.IMG_IDS,
                                    fieldConst.image.IMG_PATH
                                  )
                                ],
                                image.imgPath
                              );
                              props.setFieldValue(
                                names[
                                  keyJoin(
                                    fieldConst.category.IMG_IDS,
                                    fieldConst.image.IMG_NAME
                                  )
                                ],
                                image.imgName
                              );
                            }}
                          />
                        </>
                      );
                    }}
                  </FastField>
                </>
              ),
              value: value,
              textValue: getTextBoxTextValue(value),
            };
          },
        },
      },
      {
        name: fieldConst.category.ACTIVE,
        modifier: modifierCheckBox,
        table: {
          head: 'アクティブフラグ',
          getCell: (props: FormikProps<unknown>, names: unknown) => {
            const name = names[fieldConst.category.ACTIVE];
            const value = props.getFieldProps(name).value;
            const flag = info.active;
            return {
              element: (
                <FastField name={name}>
                  {({ field }: FieldProps<string>) => {
                    // console.log(
                    //   `name:${name} value:${JSON.stringify(
                    //     field.value
                    //   )} type:${typeof field.value}`
                    // );
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
      {
        name: fieldConst.category.CAT_ICON,
        table: {
          head: '画像',
          getCell: (props: FormikProps<unknown>, names: unknown) => {
            const name = names[fieldConst.category.CAT_ICON];
            const value = props.getFieldProps(name).value;
            return {
              element: (
                // 他の入力項目から変更されることがある項目のためFastFieldではなくFieldを使用
                <Field name={name}>
                  {({ field, meta }: FieldProps<string>) => {
                    return (
                      <FileBoxAndImg
                        name={field.name}
                        validate
                        error={meta.error}
                        dirty={props.dirty}
                        accept="image/*"
                        path={
                          props.getFieldProps(
                            names[
                              keyJoin(
                                fieldConst.category.IMG_IDS,
                                fieldConst.image.IMG_PATH
                              )
                            ]
                          ).value
                        }
                        fileName={
                          props.getFieldProps(
                            names[
                              keyJoin(
                                fieldConst.category.IMG_IDS,
                                fieldConst.image.IMG_NAME
                              )
                            ]
                          ).value
                        }
                        onChange={getSetInputFileFunc(
                          props.setFieldValue,
                          name,
                          names[
                            keyJoin(
                              fieldConst.category.IMG_IDS,
                              fieldConst.image.IMG_PATH
                            )
                          ],
                          names[
                            keyJoin(
                              fieldConst.category.IMG_IDS,
                              fieldConst.image.IMG_NAME
                            )
                          ]
                        )}
                        isOnClickEditable
                      />
                    );
                  }}
                </Field>
              ),
              value: value,
              textValue: getFileBoxAndImageTextValue(),
            };
          },
        },
        addition: {
          yup: yup.mixed().nullable().server(errData),
        },
      },
    ],
  };
  // obj[]からobjに変換し、必要な情報を定義したオブジェクトを作成
  const listTableFormObj = useMemo(
    () => buildListTableFormObj(list.catDataList, toObjConfig),
    [list.catDataList, toObjConfig]
  );

  return (
    <div className="container">
      <SortAndFilterFormTable
        tableFormConfig={listTableFormObj}
        handleFormSubmit={handleSubmit}
        hiddenPushButton
        errData={errData}
      />
      {initInfoScript}
      {initListScript}
      {initlImageListScript}
    </div>
  );
};

export default ListTable;
