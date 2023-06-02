import { Formik, FormikProps } from 'formik';
import React, { useState, useEffect, useRef, useContext } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import {
  CategoryUi,
  Category,
  ErrorResults,
} from '../../../../@types/studyUtilType';
import { fieldConst } from '../../../../constant/fieldConstant';
import { onServerConst } from '../../../../constant/on-serverConst';
import { urlConst } from '../../../../constant/urlConstant';
import { getSetInputFileFunc } from '../../../../study/util/studyFormUtil';
import { fetchGet, fetchPost } from '../../../../study/util/studyUtil';
import { addServerValidateFuncs } from '../../../../study/util/studyYupUtil';
import BodysLodingSpinner from '../../../components/BodysLodingSpinner';
import CheckBox from '../../../components/CheckBox';
import FileBoxOnValidate from '../../../components/FileBoxOnValidate';
import RadioBtn from '../../../components/RadioBtn';
import SelectBox from '../../../components/SelectBox';
import SubmitButton from '../../../components/SubmitButton';
import TextArea from '../../../components/TextArea';
import TextBoxOnValidate from '../../../components/TextBoxOnValidate';
import { onServer, executeFuncIfNeeded } from '../../../on-server';
import yup from '../../../yup/message/ja';
import { Context } from './Content';

const Basic = (props: { handleNext: () => void }) => {
  const [initialInfo, initScript] = onServer(
    (api) => api.getInfo(),
    [],
    onServerConst.category.INFO
  ) as [CategoryUi, JSX.Element];
  const [info, setInfo] = useState(initialInfo);
  const [errData, setErrData] = useState() as [
    ErrorResults,
    React.Dispatch<React.SetStateAction<unknown>>
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
  const handleSubmit = async (form: Category) => {
    const res = await fetchConfirm(form);

    if (res.ok) {
      //コンテキストにform,confirmDataデータをセット
      setCurrentState({
        ...currentState,
        form: form,
        info: info,
      });
      // 確認画面へ
      props.handleNext();
    } else {
      setErrData(await res.json());
      // 再バリデーション実施
      buttonElement.current.click();
    }
  };

  /**
   * 画面情報取得
   */
  const fetchInfo = async () => {
    const response = await fetchGet(urlConst.category.INFO);
    setInfo(await response.json());
  };

  /**
   * 確認画面情報取得
   */
  const fetchConfirm = async (form: Category) => {
    setConfirmLoading(true);
    const response = await fetchPost(urlConst.category.CONFIRM, form);
    setConfirmLoading(false);

    return response;
  };

  useEffect(() => {
    // SSRが実行されたかされていないかで処理が変わる
    executeFuncIfNeeded(onServerConst.category.INFO, fetchInfo);
  }, []);

  console.log(info);
  // 非同期が完了するまで次の処理に進まない
  if (!info.catTypes) return <BodysLodingSpinner />;

  //yupで使用するスキーマの設定
  const additions = {};
  additions[fieldConst.category.CAT_CODE] = yup.string().required();
  additions[fieldConst.category.CAT_NAME] = yup.string().required();
  additions[fieldConst.category.NOTE] = yup.string();
  additions[fieldConst.category.IMG_TYPE] = yup.string();
  additions[fieldConst.category.CAT_TYPE] = yup.string();
  additions[fieldConst.category.ACTIVE] = yup.bool();
  additions[fieldConst.category.CAT_ICON] = yup.mixed();
  // サーバーでのバリデーション結果を反映する関数をセット
  addServerValidateFuncs(
    additions,
    [
      fieldConst.category.CAT_CODE,
      fieldConst.category.CAT_NAME,
      fieldConst.category.CAT_ICON,
    ],
    errData,
    setErrData
  );
  // スキーマにセット
  const schema = yup.object().shape(additions);

  return (
    <div>
      <Formik
        validationSchema={schema}
        onSubmit={handleSubmit}
        initialValues={
          {
            catCode: currentState.form ? currentState.form.catCode : '',
            catName: currentState.form ? currentState.form.catName : '',
            note: currentState.form ? currentState.form.note : '',
            imgType: currentState.form
              ? currentState.form.imgType
              : info.imgTypes[0].code,
            catType: currentState.form ? currentState.form.catType : '',
            active: currentState.form ? currentState.form.active : '0',
            catIcon: currentState.form ? currentState.form.catIcon : '',
          } as Category
        }
      >
        {(props: FormikProps<Category>) => {
          const {
            values,
            touched,
            errors,
            handleChange,
            handleSubmit,
            validateForm,
          } = props;
          return (
            <Form noValidate onSubmit={handleSubmit}>
              <Row g="3">
                <Col sm="6">
                  <TextBoxOnValidate
                    title="カテゴリーコード"
                    name={fieldConst.category.CAT_CODE}
                    value={values.catCode}
                    touched={touched.catCode}
                    error={errors.catCode}
                    onChange={handleChange}
                  />
                </Col>
                <Col sm="6">
                  <TextBoxOnValidate
                    title="カテゴリー名"
                    name={fieldConst.category.CAT_NAME}
                    value={values.catName}
                    touched={touched.catName}
                    error={errors.catName}
                    onChange={handleChange}
                  />
                </Col>
                <Col sm="12">
                  <TextArea
                    title="メモ"
                    name={fieldConst.category.NOTE}
                    value={values.note}
                    onChange={handleChange}
                  />
                </Col>
                <Col sm="12">
                  <SelectBox
                    title="画像タイプ"
                    name={fieldConst.category.IMG_TYPE}
                    value={values.imgType}
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
                    name={fieldConst.category.CAT_TYPE}
                    value={values.catType}
                    typeList={info.catTypes}
                    onChange={handleChange}
                  />
                </Col>
                <Col sm="4">
                  <CheckBox
                    name={fieldConst.category.ACTIVE}
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
                    name={fieldConst.category.CAT_ICON}
                    error={errors.catIcon}
                    accept="image/*"
                    onChange={getSetInputFileFunc(
                      props.setFieldValue,
                      fieldConst.category.CAT_ICON
                    )}
                  />
                </Col>
              </Row>
              <hr className="my-4" />
              <SubmitButton title="確認" isLoading={isConfirmLoading} />
              <Button
                ref={buttonElement}
                onClick={() => {
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
