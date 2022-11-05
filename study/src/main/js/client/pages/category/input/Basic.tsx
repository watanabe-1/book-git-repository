import React, { useState, useEffect, useRef, useContext } from 'react';
import { Context } from './Content';
import { onServer, executeFirst } from '../../../on-server';
import {
  fetchGet,
  fetchPost,
  getServerErrMsg,
  isServerErr,
  getInputFile,
} from '../../../../study/util/studyUtil';
import { CategoryUi, ErrorResults } from '../../../../@types/studyUtilType';
import { FieldConst } from '../../../../constant/fieldConstant';
import { CommonConst } from '../../../../constant/commonConstant';
import { UrlConst } from '../../../../constant/urlConstant';
import yup from '../../../yup/message/ja';
import { Formik } from 'formik';
import BodysLodingSpinner from '../../../components/BodysLodingSpinner';
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

const Basic = (props) => {
  const [initialInfo, initScript] = onServer(
    (api) => api.getInfo(),
    [],
    'category.info'
  ) as [CategoryUi, JSX.Element];
  const [info, setInfo] = useState(initialInfo);
  const [errData, setErrData] = useState() as [
    ErrorResults,
    React.Dispatch<React.SetStateAction<{}>>
  ];
  const [isConfirmLoading, setConfirmLoading] = useState(false);
  // コンテキストに保存しておきたいデータ
  const { currentState, setCurrentState } = useContext(Context);
  //const [validated, setValidated] = useState(false);
  const buttonElement = useRef<HTMLButtonElement>(null);

  /**
   * 送信ボタン
   * @param form 送信パラメータ
   */
  const handleSubmit = async (form) => {
    const res = await fetchConfirm(form);
    const json = await res.json();

    if (res.ok) {
      //コンテキストにform,confirmDataデータをセット
      setCurrentState({ ...currentState, form: form, confirm: json });
      // 確認画面へ
      props.handleNext();
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
   * 確認画面情報取得
   */
  const fetchConfirm = async (form) => {
    setConfirmLoading(true);
    const response = await fetchPost(UrlConst.Category.CONFIRM, form);
    setConfirmLoading(false);

    return response;
  };

  useEffect(() => {
    // SSRが実行されたかされていないかで処理が変わる
    executeFirst(fetchInfo);
  }, []);

  console.log(info);
  // 非同期が完了するまで次の処理に進まない
  if (!info.catTypes) return <BodysLodingSpinner />;

  const schema = yup.object().shape({
    catCode: yup
      .string()
      .required()
      .test(
        CommonConst.SERVER_TEST_NAME,
        () => {
          return getServerErrMsg(
            errData,
            FieldConst.Category.CAT_CODE,
            setErrData
          );
        },
        (value) => {
          return isServerErr(errData, FieldConst.Category.CAT_CODE);
        }
      ),
    catName: yup
      .string()
      .required()
      .test(
        CommonConst.SERVER_TEST_NAME,
        () => {
          return getServerErrMsg(
            errData,
            FieldConst.Category.CAT_NAME,
            setErrData
          );
        },
        (value) => {
          return isServerErr(errData, FieldConst.Category.CAT_NAME);
        }
      ),
    note: yup.string(),
    imgType: yup.string(),
    catType: yup.string(),
    active: yup.bool(),
    catIcon: yup.mixed().test(
      CommonConst.SERVER_TEST_NAME,
      () => {
        return getServerErrMsg(
          errData,
          FieldConst.Category.CAT_ICON,
          setErrData
        );
      },
      (value) => {
        return isServerErr(errData, FieldConst.Category.CAT_ICON);
      }
    ),
  });

  return (
    <div>
      <Formik
        validationSchema={schema}
        onSubmit={handleSubmit}
        initialValues={{
          catCode: currentState.form ? currentState.form.catCode : '',
          catName: currentState.form ? currentState.form.catName : '',
          note: currentState.form ? currentState.form.note : '',
          imgType: currentState.form
            ? currentState.form.imgType
            : info.imgTypes[0].code,
          catType: currentState.form ? currentState.form.catType : '',
          active: currentState.form ? currentState.form.active : '0',
          catIcon: currentState.form ? currentState.form.catIcon : null,
        }}
      >
        {(props) => {
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
              <Row g="3">
                <Col sm="6">
                  <TextBoxOnValidate
                    title="カテゴリーコード"
                    name={FieldConst.Category.CAT_CODE}
                    value={values.catCode}
                    touched={touched.catCode}
                    error={errors.catCode}
                    onChange={handleChange}
                  />
                </Col>
                <Col sm="6">
                  <TextBoxOnValidate
                    title="カテゴリー名"
                    name={FieldConst.Category.CAT_NAME}
                    value={values.catName}
                    touched={touched.catName}
                    error={errors.catName}
                    onChange={handleChange}
                  />
                </Col>
                <Col sm="12">
                  <TextArea
                    title="メモ"
                    name={FieldConst.Category.NOTE}
                    value={values.note}
                    onChange={handleChange}
                  />
                </Col>
                <Col sm="12">
                  <SelectBox
                    title="画像タイプ"
                    name={FieldConst.Category.IMG_TYPE}
                    value={values.imgTypes}
                    typeList={info.imgTypes}
                    onChange={handleChange}
                  />
                </Col>
              </Row>
              <hr className="my-4" />
              <Row g="3">
                <Col sm="4">
                  <RadioBtn
                    title="カテゴリータイプ"
                    name={FieldConst.Category.CAT_TYPE}
                    value={values.catType}
                    typeList={info.catTypes}
                    onChange={handleChange}
                  />
                </Col>
                <Col sm="4">
                  <CheckBox
                    name={FieldConst.Category.ACTIVE}
                    value={values.active}
                    flag={info.active}
                    onChange={handleChange}
                  />
                </Col>
              </Row>
              <hr className="my-4" />
              <Row g="3">
                <Col sm="12">
                  <FileBoxOnValidate
                    title="アイコンのアップロード"
                    name={FieldConst.Category.CAT_ICON}
                    value={values.catIcon}
                    error={errors.catIcon}
                    accept="image/*"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldValue(
                        FieldConst.Category.CAT_ICON,
                        getInputFile(event)
                      );
                    }}
                  />
                </Col>
              </Row>
              <hr className="my-4" />
              <SubmitButton title="確認" isLoading={isConfirmLoading} />
              <Button
                ref={buttonElement}
                onClick={(event) => {
                  validateForm(values);
                }}
                hidden
              >
                バリデーション実施
              </Button>
            </Form>
          );
        }}
      </Formik>
      {initScript}
    </div>
  );
};

export default Basic;
