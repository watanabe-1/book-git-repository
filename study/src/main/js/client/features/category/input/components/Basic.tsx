import { Formik, FormikProps } from 'formik';
import React, { useState, useContext } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import { Context } from './Content';
import { ErrorResults, Category } from '../../../../../@types/studyUtilType';
import { fieldConst } from '../../../../../constant/fieldConstant';
import { urlConst } from '../../../../../constant/urlConstant';
import { getSetInputFileFunc } from '../../../../../study/util/studyFormUtil';
import { fetchPost, isObjEmpty } from '../../../../../study/util/studyUtil';
import SubmitButton from '../../../../components/elements/button/SubmitButton';
import BodysLodingSpinner from '../../../../components/elements/spinner/BodysLodingSpinner';
import AutoValidateToken from '../../../../components/form/AutoValidateToken';
import CheckBox from '../../../../components/form/CheckBox';
import FileBox from '../../../../components/form/FileBox';
import RadioBtn from '../../../../components/form/RadioBtn';
import SelectBox from '../../../../components/form/SelectBox';
import TextArea from '../../../../components/form/TextArea';
import TextBox from '../../../../components/form/TextBox';
import { useCategoryInfoSWR } from '../../../../hooks/useCategory';
import yup from '../../../../yup/message/ja';

type BasicProps = {
  /** 次画面へ */
  handleNext: () => void;
};

const Basic: React.FC<BasicProps> = (props) => {
  const { data: info, initScript } = useCategoryInfoSWR();
  const [errData, setErrData] = useState() as [
    ErrorResults,
    React.Dispatch<React.SetStateAction<unknown>>
  ];
  const [isConfirmLoading, setConfirmLoading] = useState(false);
  // コンテキストに保存しておきたいデータ
  const { currentState, setCurrentState } = useContext(Context);

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
    }
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

  console.log(info);
  // 非同期が完了するまで次の処理に進まない
  if (isObjEmpty(info)) return <BodysLodingSpinner />;

  //yupで使用するスキーマの設定
  const additions = {};
  additions[fieldConst.category.CAT_CODE] = yup
    .string()
    .required()
    .server(errData);
  additions[fieldConst.category.CAT_NAME] = yup
    .string()
    .required()
    .server(errData);
  additions[fieldConst.category.NOTE] = yup.string().notRequired().nullable();
  additions[fieldConst.category.IMG_TYPE] = yup
    .string()
    .notRequired()
    .nullable();
  additions[fieldConst.category.CAT_TYPE] = yup
    .string()
    .notRequired()
    .nullable();
  additions[fieldConst.category.ACTIVE] = yup.array().notRequired().nullable();
  additions[fieldConst.category.CAT_ICON] = yup.mixed().server(errData);
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
            active: currentState.form ? currentState.form.active : [],
            catIcon: currentState.form ? currentState.form.catIcon : '',
          } as Category
        }
      >
        {(props: FormikProps<Category>) => {
          const { values, touched, errors, handleChange, handleSubmit } = props;
          return (
            <Form noValidate onSubmit={handleSubmit}>
              <Row g="3">
                <Col sm="6">
                  <TextBox
                    title="カテゴリーコード"
                    name={fieldConst.category.CAT_CODE}
                    value={values.catCode}
                    validate
                    touched={touched.catCode}
                    error={errors.catCode}
                    onChange={handleChange}
                  />
                </Col>
                <Col sm="6">
                  <TextBox
                    title="カテゴリー名"
                    name={fieldConst.category.CAT_NAME}
                    value={values.catName}
                    validate
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
                  <FileBox
                    title="アイコンのアップロード"
                    name={fieldConst.category.CAT_ICON}
                    validate
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
              <AutoValidateToken errData={errData} />
            </Form>
          );
        }}
      </Formik>
      {initScript}
    </div>
  );
};

export default Basic;