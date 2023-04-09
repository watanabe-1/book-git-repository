import { FormikProps } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import {
  BuildListTableFormObjConfig,
  CategoryFormList,
  CategoryUi,
  ErrorResults,
  Image,
} from '../../../../@types/studyUtilType';
import { ClassConst } from '../../../../constant/classConstant';
import { FieldConst } from '../../../../constant/fieldConstant';
import { UrlConst } from '../../../../constant/urlConstant';
import { getSetInputFileFunc } from '../../../../study/util/studyFormUtil';
import {
  addContextPath,
  fetchGet,
  fetchPost,
  keyJoin,
} from '../../../../study/util/studyUtil';
import { buildListTableFormObj } from '../../../../study/util/studyYupUtil';
import BodysLodingSpinner from '../../../components/BodysLodingSpinner';
import CheckBox from '../../../components/CheckBox';
import FileBoxOnValidateAndImg from '../../../components/FileBoxOnValidateAndImg';
import RadioBtn from '../../../components/RadioBtn';
import SelectBox from '../../../components/SelectBox';
import SortAndFilterFormTable from '../../../components/SortAndFilterFormTable';
import TextArea from '../../../components/TextArea';
import TextBox from '../../../components/TextBox';
import TextBoxOnValidate from '../../../components/TextBoxOnValidate';
import {
  executeFuncIfNeeded,
  executeFuncsIfNeeded,
  onServer,
} from '../../../on-server';
import yup from '../../../yup/message/ja';
import Slider from '../../../components/Slider';
import ModalSlider from '../../../components/ModalSlider';

/**
 * カテゴリー リスト形式確認画面
 * @returns リスト
 */
const ListTable = () => {
  const [initialInfo, initInfoScript] = onServer(
    (api) => api.getInfo(),
    [],
    'category.info'
  ) as [CategoryUi, JSX.Element];
  const [info, setInfo] = useState(initialInfo);
  const [initialList, initListScript] = onServer(
    (api) => api.getListData(),
    [],
    'category.list'
  ) as [CategoryFormList, JSX.Element];
  const [list, setList] = useState(initialList);
  const [errData, setErrData] = useState() as [
    ErrorResults,
    React.Dispatch<React.SetStateAction<{}>>
  ];
  const [initialImageList, initlImageListScript] = onServer(
    (api) => api.getImageList(),
    [],
    'category.imageList'
  ) as [Image[], JSX.Element];
  const [imageList, setImageList] = useState(initialImageList);
  const [isUpdListLoading, setUpdListLoading] = useState(false);
  const buttonElement = useRef<HTMLButtonElement>(null);

  /**
   * 送信ボタン
   * @param form 送信パラメータ
   */
  const handleSubmit = async (form: {}) => {
    const res = await fetchUpdListData(form);
    const json = await res.json();
    console.log('sousinkekka');
    console.log(json);
    if (res.ok) {
      setList(json);
    } else {
      setErrData(json);
      // 再バリデーション実施
      buttonElement.current.click();
    }
  };

  /**
   * 画面情報取得
   */
  const fetchInfo = async () => {
    const response = await fetchGet(UrlConst.Category.INFO);
    setInfo(await response.json());
  };

  /**
   * 画面情報取得
   */
  const fetchListData = async () => {
    const response = await fetchGet(UrlConst.Category.LISTDATA);
    setList(await response.json());
  };

  /**
   * 画像リスト情報取得
   */
  const fetchImageListData = async () => {
    const response = await fetchGet(UrlConst.Category.IMAGELISTDATA);
    setImageList(await response.json());
  };

  /**
   * リストデータ更新
   */
  const fetchUpdListData = async (form) => {
    setUpdListLoading(true);
    const response = await fetchPost(UrlConst.Category.LISTDATAUPDATE, form);
    setUpdListLoading(false);

    return response;
  };

  useEffect(() => {
    // SSRが実行されたかされていないかで処理が変わる
    executeFuncsIfNeeded([fetchInfo, fetchListData, fetchImageListData]);
  }, []);

  if (!info.catTypes || !list.catDataList) return <BodysLodingSpinner />;

  console.log(info);
  console.log(list);

  // obj[]からobjに変換し、必要な情報を定義したオブジェクトを作成するための設定
  const toObjConfig: BuildListTableFormObjConfig = {
    className: ClassConst.CAT_DATA_LIST,
    list: [
      {
        name: FieldConst.Category.DELETE,
        table: {
          head: '削除',
          getCell: (props: FormikProps<{}>, names: {}) => {
            const name = names[FieldConst.Category.DELETE];
            return (
              <CheckBox
                name={name}
                value={props.values[name]}
                flag={info.delete}
                onChange={(e) => props.handleChange(e)}
              />
            );
          },
          hidden: false,
        },
        addition: null,
      },
      {
        name: FieldConst.Category.CAT_CODE,
        table: {
          head: 'カテゴリーコード',
          getCell: (props: FormikProps<{}>, names: {}) => {
            const name = names[FieldConst.Category.CAT_CODE];
            return (
              <TextBoxOnValidate
                name={name}
                value={props.values[name]}
                touched={props.touched[name]}
                error={props.errors[name]}
                onChange={props.handleChange}
              />
            );
          },
          hidden: true,
        },
        addition: {
          yup: yup.string().required(),
          isServerValidation: true,
          errData: errData,
          setErrData: setErrData,
        },
      },
      {
        name: FieldConst.Category.CAT_NAME,
        table: {
          head: 'カテゴリー名',
          getCell: (props: FormikProps<{}>, names: {}) => {
            const name = names[FieldConst.Category.CAT_NAME];
            return (
              <TextBoxOnValidate
                name={name}
                value={props.values[name]}
                touched={props.touched[name]}
                error={props.errors[name]}
                onChange={props.handleChange}
              />
            );
          },
          hidden: false,
        },
        addition: {
          yup: yup.string().required(),
          isServerValidation: true,
          errData: errData,
          setErrData: setErrData,
        },
      },
      {
        name: FieldConst.Category.CAT_TYPE,
        table: {
          head: 'カテゴリータイプ',
          getCell: (props: FormikProps<{}>, names: {}) => {
            const name = names[FieldConst.Category.CAT_TYPE];
            return (
              <RadioBtn
                name={name}
                value={props.values[name]}
                typeList={info.catTypes}
                onChange={props.handleChange}
              />
            );
          },
          hidden: false,
        },
        addition: null,
      },
      {
        name: FieldConst.Category.NOTE,
        table: {
          head: 'メモ',
          getCell: (props: FormikProps<{}>, names: {}) => {
            const name = names[FieldConst.Category.NOTE];
            return (
              <TextArea
                name={name}
                value={props.values[name]}
                onChange={props.handleChange}
              />
            );
          },
          hidden: false,
        },
        addition: null,
      },
      {
        name: FieldConst.Category.IMG_TYPE,
        table: {
          head: '画像タイプ',
          getCell: (props: FormikProps<{}>, names: {}) => {
            const name = names[FieldConst.Category.IMG_TYPE];
            return (
              <SelectBox
                name={name}
                value={props.values[name]}
                typeList={info.imgTypes}
                onChange={props.handleChange}
              />
            );
          },
          hidden: false,
        },
        addition: null,
      },
      {
        name: keyJoin(FieldConst.Category.IMG_IDS, FieldConst.Category.IMG_ID),
        table: {
          head: '画像ID',
          getCell: (props: FormikProps<{}>, names: {}) => {
            const name =
              names[
                keyJoin(FieldConst.Category.IMG_IDS, FieldConst.Category.IMG_ID)
              ];
            return (
              <>
                <label>{props.values[name]}</label>
                <ModalSlider
                  imageList={imageList}
                  setImage={(image) => {
                    props.setFieldValue(name, image.imgId);
                    props.setFieldValue(
                      names[
                        keyJoin(
                          FieldConst.Category.IMG_IDS,
                          FieldConst.Image.IMG_PATH
                        )
                      ],
                      image.imgPath
                    );
                    props.setFieldValue(
                      names[
                        keyJoin(
                          FieldConst.Category.IMG_IDS,
                          FieldConst.Image.IMG_NAME
                        )
                      ],
                      image.imgName
                    );
                  }}
                />
              </>
            );
          },
          hidden: false,
        },
        addition: null,
      },
      {
        name: FieldConst.Category.ACTIVE,
        table: {
          head: 'アクティブフラグ',
          getCell: (props: FormikProps<{}>, names: {}) => {
            const name = names[FieldConst.Category.ACTIVE];
            return (
              <CheckBox
                name={name}
                value={props.values[name]}
                flag={info.active}
                onChange={props.handleChange}
              />
            );
          },
          hidden: false,
        },
        addition: null,
      },
      {
        name: FieldConst.Category.CAT_ICON,
        table: {
          head: '画像',
          getCell: (props: FormikProps<{}>, names: {}) => {
            const name = names[FieldConst.Category.CAT_ICON];
            return (
              <FileBoxOnValidateAndImg
                name={name}
                error={props.errors[name]}
                accept="image/*"
                path={
                  props.values[
                    names[
                      keyJoin(
                        FieldConst.Category.IMG_IDS,
                        FieldConst.Image.IMG_PATH
                      )
                    ]
                  ]
                }
                fileName={
                  props.values[
                    names[
                      keyJoin(
                        FieldConst.Category.IMG_IDS,
                        FieldConst.Image.IMG_NAME
                      )
                    ]
                  ]
                }
                onChange={getSetInputFileFunc(
                  props.setFieldValue,
                  name,
                  names[
                    keyJoin(
                      FieldConst.Category.IMG_IDS,
                      FieldConst.Image.IMG_PATH
                    )
                  ],
                  names[
                    keyJoin(
                      FieldConst.Category.IMG_IDS,
                      FieldConst.Image.IMG_NAME
                    )
                  ]
                )}
              />
            );
          },
          hidden: false,
        },
        addition: {
          yup: yup.mixed(),
          isServerValidation: true,
          errData: errData,
          setErrData: setErrData,
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
        isFormSubmitLoading={isUpdListLoading}
      />
      {initInfoScript}
      {initListScript}
      {initlImageListScript}
    </div>
  );
};

export default ListTable;
