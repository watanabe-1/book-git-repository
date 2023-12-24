import { FastField, Field, FieldProps } from 'formik';
import React, { useMemo } from 'react';

import { BuildListTableFormObjConfig } from '../../../../../@types/studyUtilType';
import { classConst } from '../../../../../constant/classConstant';
import { fieldConst } from '../../../../../constant/fieldConstant';
import { urlConst } from '../../../../../constant/urlConstant';
import { getInputFile } from '../../../../../study/util/studyFormUtil';
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
import ImageBox, {
  getImageBoxTextValue,
} from '../../../../components/form/ImageBox';
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
import { useErrData } from '../../../../hooks/useCommon';
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
  const [errData, setErrData] = useErrData();

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

  const CATEGORY_IMGIDS_IMGID = useMemo(
    () => keyJoin(fieldConst.category.IMG_IDS, fieldConst.image.IMG_ID),
    [fieldConst.category.IMG_IDS, fieldConst.image.IMG_ID]
  );

  const CATEGORY_IMGIDS_IMGPATH = useMemo(
    () => keyJoin(fieldConst.category.IMG_IDS, fieldConst.image.IMG_PATH),
    [fieldConst.category.IMG_IDS, fieldConst.image.IMG_PATH]
  );

  const CATEGORY_IMGIDS_IMGNAME = useMemo(
    () => keyJoin(fieldConst.category.IMG_IDS, fieldConst.image.IMG_NAME),
    [fieldConst.category.IMG_IDS, fieldConst.image.IMG_NAME]
  );

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
          getCell: ({ value, initialValue, name }) => {
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
        name: fieldConst.category.CAT_NAME,
        table: {
          head: 'カテゴリー名',
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
          getCell: ({ value, initialValue, name }, { props }) => {
            const typeList = info.catTypes;

            return {
              element: (
                <FastField name={name}>
                  {({ field }: FieldProps<string>) => {
                    return (
                      <RadioBtn
                        name={field.name}
                        value={field.value}
                        initialValue={initialValue}
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
          getCell: ({ value, initialValue, name }, { props }) => {
            return {
              element: (
                <FastField name={name}>
                  {({ field }: FieldProps<string>) => {
                    return (
                      <TextArea
                        name={field.name}
                        value={field.value}
                        initialValue={initialValue}
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
          getCell: ({ value, initialValue, name }, { props }) => {
            const typeList = info.imgTypes;

            return {
              element: (
                <FastField name={name}>
                  {({ field }: FieldProps<string>) => {
                    return (
                      <SelectBox
                        name={field.name}
                        value={field.value}
                        initialValue={initialValue}
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
        name: CATEGORY_IMGIDS_IMGID,
        table: {
          head: '画像ID',
          getCell: ({ value, initialValue, name }, { props, getName }) => {
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
                            initialValue={initialValue}
                            dirty={props.dirty}
                            isReadonly
                          />
                          <ModalSlider
                            imageList={imageList}
                            startIndex={startIndex}
                            setImage={(image) => {
                              props.setFieldValue(name, image.imgId);
                              props.setFieldValue(
                                getName(CATEGORY_IMGIDS_IMGPATH),
                                image.imgPath
                              );
                              props.setFieldValue(
                                getName(CATEGORY_IMGIDS_IMGNAME),
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
          getCell: ({ value, initialValue, name }, { props }) => {
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
      {
        name: fieldConst.category.CAT_ICON,
        table: {
          head: '画像',
          getCell: ({ value, initialValue, name }, { props, getName }) => {
            return {
              element: (
                // 他の入力項目から変更されることがある項目のためFastFieldではなくFieldを使用
                <Field name={name}>
                  {({ field, meta }: FieldProps<File>) => {
                    return (
                      <ImageBox
                        name={field.name}
                        value={field.value}
                        initialValue={initialValue}
                        validate
                        error={meta.error}
                        dirty={props.dirty}
                        initialPath={
                          props.getFieldProps(getName(CATEGORY_IMGIDS_IMGPATH))
                            .value
                        }
                        initialFileName={
                          props.getFieldProps(getName(CATEGORY_IMGIDS_IMGNAME))
                            .value
                        }
                        onChange={(e) =>
                          props.setFieldValue(name, getInputFile(e))
                        }
                        showPreview
                        isOnClickEditable
                      />
                    );
                  }}
                </Field>
              ),
              value: value,
              textValue: getImageBoxTextValue(),
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
