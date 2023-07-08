import { Formik, FormikHelpers, FormikProps } from 'formik';
import React, { useEffect, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import { ErrorResults, Type } from '../../../../@types/studyUtilType';
import { fieldConst } from '../../../../constant/fieldConstant';
import { onServerConst } from '../../../../constant/on-serverConstant';
import { urlConst } from '../../../../constant/urlConstant';
import {
  downloadFile,
  getFilenameFromResponse,
} from '../../../../study/util/studyFileUtil';
import { getSetInputFileFunc } from '../../../../study/util/studyFormUtil';
import { fetchGet, fetchPost } from '../../../../study/util/studyUtil';
import AutoValidateToken from '../../../components/AutoValidateToken';
import BodysLodingSpinner from '../../../components/BodysLodingSpinner';
import FileBox from '../../../components/FileBox';
import SelectBox from '../../../components/SelectBox';
import SubmitButton from '../../../components/SubmitButton';
import { executeFuncIfNeeded, onServer } from '../../../on-server';
import yup from '../../../yup/message/ja';

/**
 * 家計簿変換UI
 */
export type BooksConvertUi = {
  fileTypes: Type[];
};

/**
 * 家計簿変換用Form
 */
export type BooksConvertForm = {
  fileType: string;
  file: File;
};

const ConvertForm = () => {
  const [initialInfo, initScript] = onServer(
    (api) => api.getConvertInfo(),
    [],
    onServerConst.books.CONVERT_INFO
  ) as [BooksConvertUi, JSX.Element];
  const [info, setInfo] = useState(initialInfo);
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
  const handleSubmit = async (
    form: BooksConvertForm,
    formikHelpers: FormikHelpers<BooksConvertForm>
  ) => {
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
   * 画面情報取得
   */
  const fetchInfo = async () => {
    const response = await fetchGet(urlConst.books.CONVERT_INFO);
    setInfo(await response.json());
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

  useEffect(() => {
    // SSRが実行されたかされていないかで処理が変わる
    executeFuncIfNeeded(onServerConst.books.CONVERT_INFO, fetchInfo);
  }, []);

  console.log(info);
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
