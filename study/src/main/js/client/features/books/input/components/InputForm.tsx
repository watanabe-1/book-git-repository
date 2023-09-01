import { Formik, FormikProps } from 'formik';
import React, { useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import { ErrorResults } from '../../../../../@types/studyUtilType';
import { fieldConst } from '../../../../../constant/fieldConstant';
import { urlConst } from '../../../../../constant/urlConstant';
import { getSetInputFileFunc } from '../../../../../study/util/studyFormUtil';
import { fetchPost } from '../../../../../study/util/studyUtil';
import SubmitButton from '../../../../components/elements/button/SubmitButton';
import AutoValidateToken from '../../../../components/form/AutoValidateToken';
import FileBox from '../../../../components/form/FileBox';
import SelectBox from '../../../../components/form/SelectBox';
import { useUploadtInfoSWR } from '../../../../hooks/useBooks';
import yup from '../../../../locale/yup.locale';

/**
 * 家計簿アップロードForm
 */
export type BooksUplodeForm = {
  booksType: string;
  booksFile: File;
};

const InputForm = (props: { handleNext: () => void }) => {
  const { data: info, initScript } = useUploadtInfoSWR();
  const [errData, setErrData] = useState() as [
    ErrorResults,
    React.Dispatch<React.SetStateAction<unknown>>
  ];
  const [isResultLoading, setResultLoading] = useState(false);
  //const [validated, setValidated] = useState(false);
  const buttonElement = useRef<HTMLButtonElement>(null);

  /**
   * 送信ボタン
   * @param form 送信パラメータ
   */
  const handleSubmit = async (form: BooksUplodeForm) => {
    const res = await fetchResult(form);

    if (res.ok) {
      // 完了画面へ
      props.handleNext();
    } else {
      setErrData(await res.json());
    }
  };

  /**
   * 登録
   */
  const fetchResult = async (form: {
    booksType?: string;
    booksFile?: File;
  }) => {
    setResultLoading(true);
    const response = await fetchPost(urlConst.books.RESULT, form);
    setResultLoading(false);

    return response;
  };

  //console.log(info);

  //yupで使用するスキーマの設定
  const additions = {};
  additions[fieldConst.books.BOOKS_TYPE] = yup
    .string()
    .required()
    .server(errData);
  additions[fieldConst.books.BOOKS_FILE] = yup
    .mixed()
    .required()
    .server(errData);
  // スキーマにセット
  const schema = yup.object().shape(additions);

  return (
    <div>
      <Formik
        validationSchema={schema}
        onSubmit={handleSubmit}
        initialValues={
          {
            booksType: info.booksTypes[0].code,
            booksFile: '',
          } as unknown as BooksUplodeForm
        }
      >
        {(props: FormikProps<BooksUplodeForm>) => {
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
                <Col sm="12">
                  <SelectBox
                    title="収入or支出"
                    name={fieldConst.books.BOOKS_TYPE}
                    value={values.booksType}
                    typeList={info.booksTypes}
                    validate
                    error={errors.booksType}
                    touched={touched.booksType}
                    onChange={handleChange}
                  />
                </Col>
              </Row>
              <hr className="my-4" />
              <Row g="3">
                <Col sm="12">
                  <FileBox
                    title="家計簿情報のアップロード"
                    name={fieldConst.books.BOOKS_FILE}
                    validate
                    error={errors.booksFile}
                    accept=".csv"
                    onChange={getSetInputFileFunc(
                      props.setFieldValue,
                      fieldConst.books.BOOKS_FILE
                    )}
                  />
                </Col>
              </Row>
              <hr className="my-4" />
              <SubmitButton title="確認" isLoading={isResultLoading} />
              <Button
                ref={buttonElement}
                onClick={() => {
                  validateForm(values);
                }}
                hidden
              >
                バリデーション実施
              </Button>
              <AutoValidateToken errData={errData} />
            </Form>
          );
        }}
      </Formik>
      {initScript}
    </div>
  );
};

export default InputForm;
