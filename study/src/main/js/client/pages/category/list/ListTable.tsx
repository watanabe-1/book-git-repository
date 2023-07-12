import { FastField, Field, FieldProps, FormikProps } from 'formik';
import React, { useEffect, useState } from 'react';

import {
  BuildListTableFormObjConfig,
  CategoryFormList,
  CategoryUi,
  ErrorResults,
  Image,
} from '../../../../@types/studyUtilType';
import { classConst } from '../../../../constant/classConstant';
import { fieldConst } from '../../../../constant/fieldConstant';
import { onServerConst } from '../../../../constant/on-serverConstant';
import { urlConst } from '../../../../constant/urlConstant';
import { getSetInputFileFunc } from '../../../../study/util/studyFormUtil';
import { fetchGet, fetchPost, keyJoin } from '../../../../study/util/studyUtil';
import {
  buildListTableFormObj,
  objArrayToObj,
} from '../../../../study/util/studyYupUtil';
import BodysLodingSpinner from '../../../components/BodysLodingSpinner';
import CheckBox from '../../../components/CheckBox';
import FileBoxAndImg from '../../../components/FileBoxAndImg';
import ModalSlider from '../../../components/ModalSlider';
import RadioBtn from '../../../components/RadioBtn';
import SelectBox from '../../../components/SelectBox';
import SortAndFilterFormTable from '../../../components/SortAndFilterFormTable';
import TextArea from '../../../components/TextArea';
import TextBox from '../../../components/TextBox';
import { executeFuncIfNeeded, onServer } from '../../../on-server';
import yup from '../../../yup/message/ja';

/**
 * カテゴリー リスト形式確認画面
 * @returns リスト
 */
const ListTable = () => {
  const [initialInfo, initInfoScript] = onServer(
    (api) => api.getInfo(),
    [],
    onServerConst.category.INFO
  ) as [CategoryUi, JSX.Element];
  const [info, setInfo] = useState(initialInfo);
  const [initialList, initListScript] = onServer(
    (api) => api.getListData(),
    [],
    onServerConst.category.LIST
  ) as [CategoryFormList, JSX.Element];
  const [list, setList] = useState(initialList);
  const [errData, setErrData] = useState() as [
    ErrorResults,
    React.Dispatch<React.SetStateAction<unknown>>
  ];
  const [initialImageList, initlImageListScript] = onServer(
    (api) => api.getImageList(),
    [],
    onServerConst.category.IMAGE_LIST
  ) as [Image[], JSX.Element];
  const [imageList, setImageList] = useState(initialImageList);

  /**
   * 送信ボタン
   * @param form 送信パラメータ
   */
  const handleSubmit = async (form: unknown) => {
    const res = await fetchUpdListData(
      objArrayToObj(form[classConst.CAT_DATA_LIST], classConst.CAT_DATA_LIST)
    );
    const json = await res.json();
    console.log('soushinkekka');
    console.log(json);
    if (res.ok) {
      setList(json);
    } else {
      setErrData(json);
    }

    return res;
  };

  /**
   * 画面情報取得
   */
  const fetchInfo = async () => {
    const response = await fetchGet(urlConst.category.INFO);
    setInfo(await response.json());
  };

  /**
   * 画面リスト情報取得
   */
  const fetchListData = async () => {
    const response = await fetchGet(urlConst.category.LISTDATA);
    setList(await response.json());
  };

  /**
   * 画像リスト情報取得
   */
  const fetchImageListData = async () => {
    const response = await fetchGet(urlConst.category.IMAGELISTDATA);
    setImageList(await response.json());
  };

  /**
   * リストデータ更新
   */
  const fetchUpdListData = async (form) => {
    return await fetchPost(urlConst.category.LISTDATAUPDATE, form);
  };

  useEffect(() => {
    // SSRが実行されたかされていないかで処理が変わる
    executeFuncIfNeeded(onServerConst.category.INFO, fetchInfo);
    executeFuncIfNeeded(onServerConst.category.LIST, fetchListData);
    executeFuncIfNeeded(onServerConst.category.IMAGE_LIST, fetchImageListData);
  }, []);

  if (!info.catTypes || !list.catDataList) return <BodysLodingSpinner />;

  console.log(info);
  console.log(list);

  // obj[]からobjに変換し、必要な情報を定義したオブジェクトを作成するための設定
  const toObjConfig: BuildListTableFormObjConfig = {
    className: classConst.CAT_DATA_LIST,
    primaryKey: fieldConst.category.CAT_CODE,
    list: [
      {
        name: fieldConst.category.DELETE,
        table: {
          head: '削除',
          getCell: (props: FormikProps<unknown>, names: unknown) => {
            const name = names[fieldConst.category.DELETE];
            return (
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
                      flag={info.delete}
                      onChange={field.onChange}
                    />
                  );
                }}
              </FastField>
            );
          },
          hidden: false,
        },
        addition: null,
      },
      {
        name: fieldConst.category.CAT_CODE,
        table: {
          head: 'カテゴリーコード',
          getCell: (props: FormikProps<unknown>, names: unknown) => {
            const name = names[fieldConst.category.CAT_CODE];
            return (
              <FastField name={name}>
                {({ field, meta }: FieldProps<string>) => {
                  return (
                    <TextBox
                      name={field.name}
                      value={field.value}
                      validate
                      touched={meta.touched}
                      error={meta.error}
                      onChange={field.onChange}
                    />
                  );
                }}
              </FastField>
            );
          },
          hidden: true,
        },
        addition: {
          yup: yup.string().required().server(errData),
        },
      },
      {
        name: fieldConst.category.CAT_NAME,
        table: {
          head: 'カテゴリー名',
          getCell: (props: FormikProps<unknown>, names: unknown) => {
            const name = names[fieldConst.category.CAT_NAME];
            return (
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
            );
          },
          hidden: false,
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
            return (
              <FastField name={name}>
                {({ field }: FieldProps<string>) => {
                  return (
                    <RadioBtn
                      name={field.name}
                      value={field.value}
                      typeList={info.catTypes}
                      dirty={props.dirty}
                      onChange={field.onChange}
                      isOnClickEditable
                    />
                  );
                }}
              </FastField>
            );
          },
          hidden: false,
        },
        addition: null,
      },
      {
        name: fieldConst.category.NOTE,
        table: {
          head: 'メモ',
          getCell: (props: FormikProps<unknown>, names: unknown) => {
            const name = names[fieldConst.category.NOTE];
            return (
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
            );
          },
          hidden: false,
        },
        addition: null,
      },
      {
        name: fieldConst.category.IMG_TYPE,
        table: {
          head: '画像タイプ',
          getCell: (props: FormikProps<unknown>, names: unknown) => {
            const name = names[fieldConst.category.IMG_TYPE];
            return (
              <FastField name={name}>
                {({ field }: FieldProps<string>) => {
                  return (
                    <SelectBox
                      name={field.name}
                      value={field.value}
                      typeList={info.imgTypes}
                      dirty={props.dirty}
                      // onChangeにセットすると入力するたびにソートが走るので、画面が動きすぎて見づらいため、onBlurに設定
                      onBlur={field.onChange}
                      isOnClickEditable
                    />
                  );
                }}
              </FastField>
            );
          },
          hidden: false,
        },
        addition: null,
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
            return (
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
                          readonly
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
            );
          },
          hidden: false,
        },
        addition: null,
      },
      {
        name: fieldConst.category.ACTIVE,
        table: {
          head: 'アクティブフラグ',
          getCell: (props: FormikProps<unknown>, names: unknown) => {
            const name = names[fieldConst.category.ACTIVE];
            return (
              <FastField name={name}>
                {({ field }: FieldProps<string>) => {
                  return (
                    <CheckBox
                      name={field.name}
                      value={field.value}
                      flag={info.active}
                      dirty={props.dirty}
                      onChange={field.onChange}
                      isOnClickEditable
                      noLabel
                    />
                  );
                }}
              </FastField>
            );
          },
          hidden: false,
        },
        addition: null,
      },
      {
        name: fieldConst.category.CAT_ICON,
        table: {
          head: '画像',
          getCell: (props: FormikProps<unknown>, names: unknown) => {
            const name = names[fieldConst.category.CAT_ICON];
            return (
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
            );
          },
          hidden: false,
        },
        addition: {
          yup: yup.mixed().nullable().server(errData),
        },
      },
    ],
  };
  // obj[]からobjに変換し、必要な情報を定義したオブジェクトを作成
  const listTableFormObj = buildListTableFormObj(list.catDataList, toObjConfig);

  return (
    <div className="container">
      <SortAndFilterFormTable
        tableFormConfig={listTableFormObj}
        handleFormSubmit={handleSubmit}
        errData={errData}
      />
      {initInfoScript}
      {initListScript}
      {initlImageListScript}
    </div>
  );
};

export default ListTable;
