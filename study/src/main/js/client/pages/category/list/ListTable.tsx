import React, { useState, useEffect, useRef, useContext } from 'react';
import { initialize } from '../../../init';
import Table from 'react-bootstrap/Table';
import { FormConfirmData } from '../../../../@types/studyUtilType';
import { TypeConst } from '../../../../constant/typeConstant';
import { onServer, executeFirst } from '../../../on-server';
import {
  fetchGet,
  fetchPost,
  getServerErrMsg,
  isServerErr,
  getInputFile,
  getListItemId,
  getContextPath,
  addContextPath,
  pathJoin,
} from '../../../../study/util/studyUtil';
import { addServerValidateFuncs } from '../../../../study/util/studyYupUtil';
import {
  CategoryUi,
  Category,
  CategoryFormList,
  ErrorResults,
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

  // //yupで使用するスキーマの設定
  const additions = {};
  // 初期値
  const initialValues = {};
  // リスト表示用一意の識別名称
  const nameList = [];
  list.catDataList.forEach((value, index) => {
    const names = {};
    names[FieldConst.Category.CAT_CODE] = getListItemId(
      ClassConst.CAT_DATA_LIST,
      FieldConst.Category.CAT_CODE,
      index
    );
    names[FieldConst.Category.CAT_NAME] = getListItemId(
      ClassConst.CAT_DATA_LIST,
      FieldConst.Category.CAT_NAME,
      index
    );
    names[FieldConst.Category.NOTE] = getListItemId(
      ClassConst.CAT_DATA_LIST,
      FieldConst.Category.NOTE,
      index
    );
    names[FieldConst.Category.IMG_TYPE] = getListItemId(
      ClassConst.CAT_DATA_LIST,
      FieldConst.Category.IMG_TYPE,
      index
    );
    names[FieldConst.Category.IMG_ID] = getListItemId(
      ClassConst.CAT_DATA_LIST,
      FieldConst.Category.IMG_ID,
      index
    );
    names[FieldConst.Category.CAT_TYPE] = getListItemId(
      ClassConst.CAT_DATA_LIST,
      FieldConst.Category.CAT_TYPE,
      index
    );
    names[FieldConst.Category.ACTIVE] = getListItemId(
      ClassConst.CAT_DATA_LIST,
      FieldConst.Category.ACTIVE,
      index
    );
    names[FieldConst.Category.CAT_ICON] = getListItemId(
      ClassConst.CAT_DATA_LIST,
      FieldConst.Category.CAT_ICON,
      index
    );
    names[FieldConst.Category.IMG_IDS] = getListItemId(
      ClassConst.CAT_DATA_LIST,
      FieldConst.Category.IMG_IDS,
      index
    );
    names[FieldConst.Category.DELETE] = getListItemId(
      ClassConst.CAT_DATA_LIST,
      FieldConst.Category.DELETE,
      index
    );
    nameList[index] = names;

    // スキーマ設定用
    additions[names[FieldConst.Category.CAT_CODE]] = yup.string().required();
    additions[names[FieldConst.Category.CAT_NAME]] = yup.string().required();
    additions[names[FieldConst.Category.CAT_ICON]] = yup.mixed();
    // サーバーでのバリデーション結果を反映する関数をセット
    addServerValidateFuncs(
      additions,
      [
        names[FieldConst.Category.CAT_CODE],
        names[FieldConst.Category.CAT_NAME],
        names[FieldConst.Category.CAT_ICON],
      ],
      errData,
      setErrData
    );

    // 初期値設定用
    initialValues[names[FieldConst.Category.CAT_CODE]] = value.catCode;
    initialValues[names[FieldConst.Category.CAT_NAME]] = value.catName;
    initialValues[names[FieldConst.Category.NOTE]] = value.note;
    initialValues[names[FieldConst.Category.IMG_TYPE]] = value.imgType;
    initialValues[names[FieldConst.Category.CAT_TYPE]] = value.catType;
    initialValues[names[FieldConst.Category.IMG_ID]] = value.imgIds.imgId;
    initialValues[names[FieldConst.Category.ACTIVE]] = value.active;
    initialValues[names[FieldConst.Category.CAT_ICON]] = value.catIcon;
    initialValues[names[FieldConst.Category.IMG_IDS]] = value.imgIds;
    initialValues[names[FieldConst.Category.DELETE]] = value.delete;
  });

  // console.log('initialValuesです。');
  console.log(initialValues);
  // スキーマにセット
  const schema = yup.object().shape(additions);

  // 初期値がキチンとセットされたことを確認して画面に表示
  if (
    !initialValues[
      getListItemId(ClassConst.CAT_DATA_LIST, FieldConst.Category.CAT_CODE, 0)
    ]
  )
    return <BodysLodingSpinner />;

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
              <Table bordered>
                <thead>
                  <tr>
                    <th>削除</th>
                    <th hidden>カテゴリーコード</th>
                    <th>カテゴリー名</th>
                    <th>カテゴリータイプ</th>
                    <th>メモ</th>
                    <th>画像タイプ</th>
                    <th>画像ID</th>
                    <th>アクティブフラグ</th>
                    <th>画像</th>
                  </tr>
                </thead>
                <tbody>
                  {nameList.map((names, index) => {
                    // console.log('valuesです');
                    // console.log(values);
                    // console.log(values.catCode0);
                    // console.log(values['catCode0']);
                    return (
                      <tr key={index}>
                        <td>
                          <CheckBox
                            name={names[FieldConst.Category.DELETE]}
                            value={values[names[FieldConst.Category.DELETE]]}
                            flag={info.delete}
                            onChange={handleChange}
                          />
                        </td>
                        <td hidden>
                          <TextBoxOnValidate
                            title={null}
                            name={names[FieldConst.Category.CAT_CODE]}
                            value={values[names[FieldConst.Category.CAT_CODE]]}
                            touched={
                              touched[names[FieldConst.Category.CAT_CODE]]
                            }
                            error={errors[names[FieldConst.Category.CAT_CODE]]}
                            onChange={handleChange}
                          />
                        </td>
                        <td>
                          <TextBoxOnValidate
                            title={null}
                            name={names[FieldConst.Category.CAT_NAME]}
                            value={values[names[FieldConst.Category.CAT_NAME]]}
                            touched={
                              touched[names[FieldConst.Category.CAT_NAME]]
                            }
                            error={errors[names[FieldConst.Category.CAT_NAME]]}
                            onChange={handleChange}
                          />
                        </td>
                        <td>
                          <RadioBtn
                            title={null}
                            name={names[FieldConst.Category.CAT_TYPE]}
                            value={values[names[FieldConst.Category.CAT_TYPE]]}
                            typeList={info.catTypes}
                            onChange={handleChange}
                          />
                        </td>
                        <td>
                          <TextArea
                            title={null}
                            name={names[FieldConst.Category.NOTE]}
                            value={values[names[FieldConst.Category.NOTE]]}
                            onChange={handleChange}
                          />
                        </td>
                        <td>
                          <SelectBox
                            title={null}
                            name={names[FieldConst.Category.IMG_TYPE]}
                            value={values[names[FieldConst.Category.IMG_TYPE]]}
                            typeList={info.imgTypes}
                            onChange={handleChange}
                          />
                        </td>
                        <td>
                          <label>
                            {values[names[FieldConst.Category.IMG_ID]]}
                          </label>
                          <TextBox
                            title={null}
                            name={names[FieldConst.Category.IMG_ID]}
                            value={values[names[FieldConst.Category.IMG_ID]]}
                            onChange={handleChange}
                            hidden
                          />
                        </td>
                        <td>
                          <CheckBox
                            name={names[FieldConst.Category.ACTIVE]}
                            value={values[names[FieldConst.Category.ACTIVE]]}
                            flag={info.active}
                            onChange={handleChange}
                          />
                        </td>
                        <td>
                          <img
                            src={addContextPath(
                              pathJoin(
                                values[names[FieldConst.Category.IMG_IDS]][
                                  FieldConst.Image.IMG_PATH
                                ],
                                values[names[FieldConst.Category.IMG_IDS]][
                                  FieldConst.Image.IMG_NAME
                                ]
                              )
                            )}
                            className="mh-100 mw-100"
                            width="50"
                            height="30"
                          ></img>
                          <FileBoxOnValidate
                            title={null}
                            name={names[FieldConst.Category.CAT_ICON]}
                            value={values[names[FieldConst.Category.CAT_ICON]]}
                            error={errors[names[FieldConst.Category.CAT_ICON]]}
                            accept="image/*"
                            onChange={(
                              event: React.ChangeEvent<HTMLInputElement>
                            ) => {
                              setFieldValue(
                                names[FieldConst.Category.CAT_ICON],
                                getInputFile(event)
                              );
                            }}
                          />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
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
