import React, { useState, useEffect, useRef, useContext } from 'react';
import { initialize } from '../../../init';
import Table from 'react-bootstrap/Table';
import { FormConfirmData } from '../../../../@types/studyUtilType';
import { TypeConst } from '../../../../constant/typeConstant';
import { onServer, executeFirst } from '../../../on-server';
import {
  fetchGet,
  fetchPost,
  getContextPath,
  addContextPath,
  pathJoin,
  keyJoin,
} from '../../../../study/util/studyUtil';
import {
  getInputFile,
  getSetInputFileFunc,
} from '../../../../study/util/studyFormUtil';
import {
  getServerErrMsg,
  isServerErr,
  objToObjArray,
} from '../../../../study/util/studyYupUtil';
import {
  addServerValidateFuncs,
  buildEscapeListItemId,
  buildListTableFormObj,
} from '../../../../study/util/studyYupUtil';
import {
  CategoryUi,
  Category,
  CategoryFormList,
  ErrorResults,
  buildListTableFormObjConfig,
} from '../../../../@types/studyUtilType';
import { FieldConst } from '../../../../constant/fieldConstant';
import { ClassConst } from '../../../../constant/classConstant';
import { CommonConst } from '../../../../constant/commonConstant';
import { UrlConst } from '../../../../constant/urlConstant';
import yup from '../../../yup/message/ja';
import { Formik, FormikProps } from 'formik';
import BodysLodingSpinner from '../../../components/BodysLodingSpinner';
import TextBox from '../../../components/TextBox';
import TextBoxOnValidate from '../../../components/TextBoxOnValidate';
import TextArea from '../../../components/TextArea';
import SelectBox from '../../../components/SelectBox';
import RadioBtn from '../../../components/RadioBtn';
import CheckBox from '../../../components/CheckBox';
import FileBoxOnValidate from '../../../components/FileBoxOnValidate';
import SubmitButton from '../../../components/SubmitButton';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import FileBoxOnValidateAndImg from '../../../components/FileBoxOnValidateAndImg';
import TextBoxExclusionForm from '../../../components/TextBoxExclusionForm';
import SortAndFilterTable from '../../../components/SortTable';

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
   * 送信ボタン
   * @param form 送信パラメータ
   */
  const handleChangeTest = async (e) => {
    console.log(e.target.value);
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
    executeFirst(fetchInfo);
    executeFirst(fetchListData);
  }, []);

  if (!info.catTypes || !list.catDataList) return <BodysLodingSpinner />;

  console.log(info);
  console.log(list);

  // obj[]からobjに変換し、必要な情報を定義したオブジェクトを作成するための設定
  const toObjConfig: buildListTableFormObjConfig = {
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
                onChange={(e) => {
                  console.log(e.target.value);
                  console.log(JSON.stringify(props.values));
                  props.handleChange(e);
                }}
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
                <TextBox
                  name={name}
                  value={props.values[name]}
                  onChange={props.handleChange}
                  hidden
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
                onChange={getSetInputFileFunc(name, props.setFieldValue)}
              ></FileBoxOnValidateAndImg>
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
  // yupで使用するスキーマの設定
  const additions = listTableFormObj.additions;
  // 初期値
  const initialValues = listTableFormObj.initialValues;
  // テーブル：ヘッダー
  const columns = listTableFormObj.columns;
  //テーブル: 行
  const getRows = listTableFormObj.getRows;

  // console.log('initialValuesです。');
  console.log(initialValues);
  // スキーマにセット
  const schema = yup.object().shape(additions);

  return (
    <div className="container">
      <Formik
        validationSchema={schema}
        onSubmit={handleSubmit}
        initialValues={initialValues}
        enableReinitialize
      >
        {(props: FormikProps<{}>) => {
          const {
            values,
            touched,
            errors,
            dirty,
            isSubmitting,
            handleChange,
            handleBlur,
            handleSubmit,
            handleReset,
            setFieldValue,
            validateForm,
          } = props;
          return (
            <Form noValidate onSubmit={handleSubmit}>
              <div className="text-end">
                <SubmitButton title="更新" isLoading={isUpdListLoading} />
                <Button
                  ref={buttonElement}
                  onClick={(event) => {
                    validateForm(values);
                  }}
                  hidden
                >
                  バリデーション実施
                </Button>
              </div>
              <SortAndFilterTable pColumns={columns} pRows={getRows(props)} />
            </Form>
          );
        }}
      </Formik>
      {initInfoScript}
      {initListScript}
    </div>
  );
};

export default ListTable;
