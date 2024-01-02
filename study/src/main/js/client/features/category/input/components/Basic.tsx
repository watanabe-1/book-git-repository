import { Formik, FormikProps } from 'formik';
import React, { useCallback, useContext, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import { Context } from './Content';
import { Category } from '../../../../../@types/studyUtilType';
import { fieldConst } from '../../../../../constant/fieldConstant';
import { urlConst } from '../../../../../constant/urlConstant';
import { getInputFile } from '../../../../../study/util/studyFormUtil';
import { fetchPost } from '../../../../../study/util/studyUtil';
import SubmitButton from '../../../../components/elements/button/SubmitButton';
import AutoValidateToken from '../../../../components/form/AutoValidateToken';
import CheckBox from '../../../../components/form/CheckBox';
import ImageBox from '../../../../components/form/ImageBox';
import RadioBtn from '../../../../components/form/RadioBtn';
import SelectBox from '../../../../components/form/SelectBox';
import TextArea from '../../../../components/form/TextArea';
import TextBox from '../../../../components/form/TextBox';
import { useCategoryInfoSWR } from '../../../../hooks/useCategory';
import { useErrData } from '../../../../hooks/useCommon';
import yup from '../../../../locale/yup.locale';

type BasicProps = {
  /** 次画面へ */
  handleNext: () => void;
};

const Basic: React.FC<BasicProps> = (props) => {
  const { data: info, initScript } = useCategoryInfoSWR();
  const [errData, setErrData] = useErrData();
  const [isConfirmLoading, setConfirmLoading] = useState(false);
  // コンテキストに保存しておきたいデータ
  const { currentState, setCurrentState } = useContext(Context);

  /**
   * 確認画面情報取得
   */
  const fetchConfirm = useCallback(
    async (form: Category) => {
      setConfirmLoading(true);
      const response = await fetchPost(urlConst.category.CONFIRM, form);
      setConfirmLoading(false);

      return response;
    },
    [setConfirmLoading]
  );

  /**
   * 送信ボタン
   * @param form 送信パラメータ
   */
  const handleSubmit = useCallback(
    async (form: Category) => {
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
    },
    [fetchConfirm, setCurrentState, props.handleNext, setErrData]
  );

  console.log(info);

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
  additions[fieldConst.category.CAT_ICON] = yup
    .mixed()
    .notRequired()
    .nullable()
    .server(errData);
  const schema = yup.object().shape(additions);

  return (
    <div>
      <Formik
        validationSchema={schema}
        onSubmit={handleSubmit}
        initialValues={
          {
            catCode: currentState?.form.catCode || '',
            catName: currentState?.form.catName || '',
            note: currentState?.form.note || '',
            imgType: currentState.form
              ? currentState.form.imgType
              : info.imgTypes[0].code,
            catType: currentState?.form.catType || '',
            active: currentState?.form.active || [],
            catIcon: currentState?.form.catIcon || null,
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
            initialValues,
          } = props;
          return (
            <Form noValidate onSubmit={handleSubmit}>
              <Row g="3">
                <Col sm="6">
                  <TextBox
                    title="カテゴリーコード"
                    name={fieldConst.category.CAT_CODE}
                    value={values.catCode}
                    initialValue={initialValues.catCode}
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
                    initialValue={initialValues.catName}
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
                    initialValue={initialValues.note}
                    onChange={handleChange}
                  />
                </Col>
                <Col sm="12">
                  <SelectBox
                    title="画像タイプ"
                    name={fieldConst.category.IMG_TYPE}
                    value={values.imgType}
                    initialValue={initialValues.imgType}
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
                    initialValue={initialValues.catType}
                    typeList={info.catTypes}
                    onChange={handleChange}
                  />
                </Col>
                <Col sm="4">
                  <CheckBox
                    name={fieldConst.category.ACTIVE}
                    value={values.active}
                    initialValue={initialValues.active}
                    flag={info.active}
                    onChange={handleChange}
                    isLabelTextValue={false}
                  />
                </Col>
              </Row>
              <hr className="my-4" />
              <Row g="3">
                <Col sm="12">
                  <ImageBox
                    title="アイコンのアップロード"
                    name={fieldConst.category.CAT_ICON}
                    validate
                    error={errors.catIcon}
                    onChange={(e) =>
                      props.setFieldValue(
                        fieldConst.category.CAT_ICON,
                        getInputFile(e)
                      )
                    }
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
