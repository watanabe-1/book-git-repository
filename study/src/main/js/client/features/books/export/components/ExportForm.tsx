import { Formik, FormikProps } from 'formik';
import React, { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import { fieldConst } from '../../../../../constant/fieldConstant';
import { urlConst } from '../../../../../constant/urlConstant';
import {
  downloadFile,
  getFilenameFromResponse,
} from '../../../../../study/util/studyFileUtil';
import { fetchPost } from '../../../../../study/util/studyUtil';
import SubmitButton from '../../../../components/elements/button/SubmitButton';
import AutoValidateToken from '../../../../components/form/AutoValidateToken';
import SelectBox from '../../../../components/form/SelectBox';
import { useDownloadtInfoSWR } from '../../../../hooks/useBooks';
import { useErrData } from '../../../../hooks/useCommon';
import yup from '../../../../locale/yup.locale';

/**
 * 家計簿ダウンロードForm
 */
export type BooksDownloadForm = {
  booksType: string;
  booksYear: string;
};

const InputForm = () => {
  const { data: info, initScript } = useDownloadtInfoSWR();
  const [errData, setErrData] = useErrData();
  const [isResultLoading, setResultLoading] = useState(false);

  /**
   * 送信ボタン
   * @param form 送信パラメータ
   */
  const handleSubmit = async (form: BooksDownloadForm) => {
    const res = await fetchResult(form);

    if (res.ok) {
      // ファイルダウンロード
      const blob = await res.blob();
      downloadFile(blob, getFilenameFromResponse(res));
    } else {
      setErrData(await res.json());
    }
  };

  /**
   * 登録
   */
  const fetchResult = async (form: BooksDownloadForm) => {
    setResultLoading(true);
    const response = await fetchPost(urlConst.books.DOWNLOAD, form);
    setResultLoading(false);

    return response;
  };

  //console.log({ ...info });

  //yupで使用するスキーマの設定
  const additions = {};
  additions[fieldConst.books.BOOKS_TYPE] = yup
    .string()
    .required()
    .server(errData);
  additions[fieldConst.books.BOOKS_YEAR] = yup.string().server(errData);
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
            booksYear: '',
          } as BooksDownloadForm
        }
      >
        {(props: FormikProps<BooksDownloadForm>) => {
          const {
            values,
            initialValues,
            touched,
            errors,
            handleChange,
            handleSubmit,
          } = props;
          return (
            <Form noValidate onSubmit={handleSubmit}>
              <Row g="3">
                <Col sm="12">
                  <SelectBox
                    title="収入or支出"
                    name={fieldConst.books.BOOKS_TYPE}
                    value={values.booksType}
                    initialValue={initialValues.booksType}
                    typeList={info.booksTypes}
                    validate
                    error={errors.booksType}
                    touched={touched.booksType}
                    onChange={handleChange}
                  />
                </Col>
              </Row>
              <Row g="3">
                <Col sm="12">
                  <SelectBox
                    title="出力年選択"
                    name={fieldConst.books.BOOKS_YEAR}
                    value={values.booksYear}
                    initialValue={initialValues.booksYear}
                    typeList={info.booksYears}
                    validate
                    error={errors.booksYear}
                    touched={touched.booksYear}
                    onChange={handleChange}
                    isUnshiftEmpty
                  />
                </Col>
              </Row>
              <hr className="my-4" />
              <SubmitButton title="ダウンロード" isLoading={isResultLoading} />
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
