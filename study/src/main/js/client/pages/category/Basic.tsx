import React, { useState, useEffect, useRef, useContext } from 'react';
import { Context } from './Content';
import { onServer, isSSR } from '../../on-server';
import {
  fetchGet,
  fetchPost,
  getServerErrMsg,
  isServerErr,
  getInputFile,
} from '../../../study/util/studyUtil';
import { CategoryUi, ErrorResults } from '../../../@types/studyUtilType';
import { Formik } from 'formik';
import yup from '../../yup/message/ja';
import BodysLodingSpinner from '../../components/BodysLodingSpinner';
import TextBoxOnValidate from '../../components/TextBoxOnValidate';
import TextArea from '../../components/TextArea';
import SelectBox from '../../components/SelectBox';
import RadioBtn from '../../components/RadioBtn';
import CheckBox from '../../components/CheckBox';
import FileBoxOnValidate from '../../components/FileBoxOnValidate';
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
    const response = await fetchGet('/category/info');
    setInfo(await response.json());
  };

  /**
   * 確認画面情報取得
   */
  const fetchConfirm = async (form) => {
    setConfirmLoading(true);
    const response = await fetchPost('/category/confirm', form);
    setConfirmLoading(false);

    return response;
  };

  useEffect(() => {
    //ssrが行われなかった時
    if (!isSSR()) {
      fetchInfo();
    }
  }, []);

  console.log(info);
  // 非同期が完了するまで次の処理に進まない
  if (!info.catTypes) return <BodysLodingSpinner />;

  const schema = yup.object().shape({
    catCode: yup
      .string()
      .required()
      .test(
        'server',
        () => {
          return getServerErrMsg(errData, 'catCode', setErrData);
        },
        (value) => {
          return isServerErr(errData, 'catCode');
        }
      ),
    catName: yup
      .string()
      .required()
      .test(
        'server',
        () => {
          return getServerErrMsg(errData, 'catName', setErrData);
        },
        (value) => {
          return isServerErr(errData, 'catName');
        }
      ),
    note: yup.string(),
    imgType: yup.string(),
    catType: yup.string(),
    active: yup.bool(),
    catIcon: yup.mixed().test(
      'server',
      () => {
        return getServerErrMsg(errData, 'catIcon', setErrData);
      },
      (value) => {
        return isServerErr(errData, 'catIcon');
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
                    name="catCode"
                    value={values.catCode}
                    touched={touched.catCode}
                    error={errors.catCode}
                    onChange={handleChange}
                  />
                </Col>
                <Col sm="6">
                  <TextBoxOnValidate
                    title="カテゴリー名"
                    name="catName"
                    value={values.catName}
                    touched={touched.catName}
                    error={errors.catName}
                    onChange={handleChange}
                  />
                </Col>
                <Col sm="12">
                  <TextArea
                    title="メモ"
                    name="note"
                    value={values.note}
                    onChange={handleChange}
                  />
                </Col>
                <Col sm="12">
                  <SelectBox
                    title="画像タイプ"
                    name="imgType"
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
                    name="catType"
                    value={values.catType}
                    typeList={info.catTypes}
                    onChange={handleChange}
                  />
                </Col>
                <Col sm="4">
                  <CheckBox
                    name="active"
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
                    name="catIcon"
                    value={values.catIcon}
                    error={errors.catIcon}
                    accept="image/*"
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      setFieldValue('catIcon', getInputFile(event));
                    }}
                  />
                </Col>
              </Row>
              <hr className="my-4" />
              {isConfirmLoading ? (
                <Button variant="outline-primary" disabled>
                  <BodysLodingSpinner />;
                </Button>
              ) : (
                <Button variant="primary" type="submit">
                  確認
                </Button>
              )}
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
