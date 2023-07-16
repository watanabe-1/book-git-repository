import { Formik, FormikProps } from 'formik';
import React, { useState } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import { ErrorResults } from '../../../../../@types/studyUtilType';
import { fieldConst } from '../../../../../constant/fieldConstant';
import { urlConst } from '../../../../../constant/urlConstant';
import {
  downloadFile,
  getFilenameFromResponse,
} from '../../../../../study/util/studyFileUtil';
import { getSetInputFileFunc } from '../../../../../study/util/studyFormUtil';
import { fetchPost } from '../../../../../study/util/studyUtil';
import SubmitButton from '../../../../components/elements/button/SubmitButton';
import BodysLodingSpinner from '../../../../components/elements/spinner/BodysLodingSpinner';
import AutoValidateToken from '../../../../components/form/AutoValidateToken';
import FileBox from '../../../../components/form/FileBox';
import SelectBox from '../../../../components/form/SelectBox';
import { useConvertInfoSWR } from '../../../../hooks/useBooks';
import yup from '../../../../yup/message/ja';

/**
 * 家計簿変換用Form
 */
export type BooksConvertForm = {
  fileType: string;
  file: File;
};

const ConvertForm = () => {
  const { data: info, initScript } = useConvertInfoSWR();
  const [errData, setErrData] = useState() as [
    ErrorResults,
    React.Dispatch<React.SetStateAction<unknown>>
  ];
  const [isResultLoading, setResultLoading] = useState(false);
  //const [validated, setValidated] = useState(false);

  /**
   * 送信ボタン
   * @param form 送信パラメータ
   */
  const handleSubmit = async (form: BooksConvertForm) => {
    const res = await fetchConvertFile(form);

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
  const fetchConvertFile = async (form: BooksConvertForm) => {
    setResultLoading(true);
    const response = await fetchPost(urlConst.books.CONVERT_FILE, form);
    setResultLoading(false);

    return response;
  };

  console.log({ ...info });
  // 非同期が完了するまで次の処理に進まない
  if (!info.fileTypes) return <BodysLodingSpinner />;

  //yupで使用するスキーマの設定
  const additions = {};
  additions[fieldConst.booksConvert.FILE_TYPE] = yup
    .string()
    .required()
    .server(errData);
  additions[fieldConst.booksConvert.FILE] = yup
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
            fileType: info.fileTypes[0].code,
            file: '',
          } as unknown as BooksConvertForm
        }
      >
        {(props: FormikProps<BooksConvertForm>) => {
          const { values, touched, errors, handleChange, handleSubmit } = props;
          return (
            <Form noValidate onSubmit={handleSubmit}>
              <Row g="3">
                <Col sm="12">
                  <SelectBox
                    title="変換するファイルの種類を選択"
                    name={fieldConst.booksConvert.FILE_TYPE}
                    value={values.fileType}
                    typeList={info.fileTypes}
                    validate
                    error={errors.fileType}
                    touched={touched.fileType}
                    onChange={handleChange}
                  />
                </Col>
              </Row>
              <hr className="my-4" />
              <Row g="3">
                <Col sm="12">
                  <FileBox
                    title="変換ファイルのアップロード"
                    name={fieldConst.booksConvert.FILE}
                    validate
                    error={errors.file}
                    accept="*.*"
                    onChange={getSetInputFileFunc(
                      props.setFieldValue,
                      fieldConst.booksConvert.FILE
                    )}
                  />
                </Col>
              </Row>
              <hr className="my-4" />
              <SubmitButton title="確認" isLoading={isResultLoading} />
              <AutoValidateToken errData={errData} />
            </Form>
          );
        }}
      </Formik>
      {initScript}
    </div>
  );
};

export default ConvertForm;
