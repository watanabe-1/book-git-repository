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
import BodysHead from '../../components/BodysHead';
import BodysLodingSpinner from '../../components/BodysLodingSpinner';
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
      <BodysHead title="カテゴリー情報登録フォーム" />
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
              <Col md="7" lg="8">
                <Row g="3">
                  <Col sm="6">
                    <Form.Group controlId="catCode">
                      <Form.Label>カテゴリーコード</Form.Label>
                      <Form.Control
                        type="text"
                        name="catCode"
                        value={values.catCode}
                        onChange={handleChange}
                        isValid={touched.catCode && !errors.catCode}
                        isInvalid={!!errors.catCode}
                      />
                      <Form.Control.Feedback>OK!</Form.Control.Feedback>
                      <Form.Control.Feedback type="invalid">
                        {(errors as any).catCode}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col sm="6">
                    <Form.Group controlId="catName">
                      <Form.Label>カテゴリー名</Form.Label>
                      <Form.Control
                        type="text"
                        name="catName"
                        value={values.catName}
                        onChange={handleChange}
                        isValid={touched.catName && !errors.catName}
                        isInvalid={!!errors.catName}
                      />
                      <Form.Control.Feedback>OK!</Form.Control.Feedback>
                      <Form.Control.Feedback type="invalid">
                        {(errors as any).catName}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                  <Col sm="12">
                    <Form.Group controlId="note">
                      <Form.Label>メモ</Form.Label>
                      <Form.Control
                        as="textarea"
                        value={values.note}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                  <Col sm="12">
                    <Form.Group controlId="imgType">
                      <Form.Label>画像タイプ</Form.Label>
                      <Form.Select name="imgType" onChange={handleChange}>
                        {info.imgTypes.map((i) => (
                          <option value={i.code}>{i.name}</option>
                        ))}
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>
                <hr className="my-4" />
                <Row g="3">
                  <Col sm="4">
                    <Form.Group controlId="catType">
                      <Form.Label>カテゴリータイプ</Form.Label>
                      <br />
                      {info.catTypes.map((i) => (
                        <Form.Check
                          type="radio"
                          inline
                          value={i.code}
                          label={i.name}
                          checked={i.code == values.catType}
                          onChange={handleChange}
                        />
                      ))}
                    </Form.Group>
                  </Col>
                  <Col sm="4">
                    <Form.Group controlId="active">
                      <Form.Check
                        type="checkbox"
                        value={info.active.value}
                        label={info.active.name}
                        checked={info.active.value == values.active}
                        onChange={handleChange}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                <hr className="my-4" />
                <Row g="3">
                  <Col sm="12">
                    <Form.Group controlId="catIcon">
                      <Form.Label>アイコンのアップロード</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={(
                          event: React.ChangeEvent<HTMLInputElement>
                        ) => {
                          setFieldValue('catIcon', getInputFile(event));
                        }}
                        isInvalid={!!errors.catIcon}
                      />
                      <Form.Control.Feedback type="invalid">
                        {(errors as any).catIcon}
                      </Form.Control.Feedback>
                    </Form.Group>
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
              </Col>
            </Form>
          );
        }}
      </Formik>
      {initScript}
    </div>
  );
};

export default Basic;
