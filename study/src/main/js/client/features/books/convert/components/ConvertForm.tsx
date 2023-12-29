import { Formik, FormikProps } from 'formik';
import React, { useCallback, useState } from 'react';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';

import { fieldConst } from '../../../../../constant/fieldConstant';
import { urlConst } from '../../../../../constant/urlConstant';
import {
  downloadFile,
  getFilenameFromResponse,
} from '../../../../../study/util/studyFileUtil';
import { getInputFile } from '../../../../../study/util/studyFormUtil';
import { fetchPost } from '../../../../../study/util/studyUtil';
import SubmitButton from '../../../../components/elements/button/SubmitButton';
import AutoValidateToken from '../../../../components/form/AutoValidateToken';
import FileBox from '../../../../components/form/FileBox';
import SelectBox from '../../../../components/form/SelectBox';
import { useConvertInfoSWR } from '../../../../hooks/useBooks';
import { useErrData } from '../../../../hooks/useCommon';
import yup from '../../../../locale/yup.locale';

/**
 * 家計簿変換用Form
 */
export type BooksConvertForm = {
  fileType: string;
  file: File;
};

const ConvertForm = () => {
  const { data: info, initScript } = useConvertInfoSWR();
  const [errData, setErrData] = useErrData();
  const [isResultLoading, setResultLoading] = useState(false);

  /**
   * 登録
   */
  const fetchConvertFile = useCallback(
    async (form: BooksConvertForm) => {
      setResultLoading(true);
      const response = await fetchPost(urlConst.books.CONVERT_FILE, form);
      setResultLoading(false);

      return response;
    },
    [setResultLoading]
  );

  /**
   * 送信ボタン
   * @param form 送信パラメータ
   */
  const handleSubmit = useCallback(
    async (form: BooksConvertForm) => {
      const res = await fetchConvertFile(form);

      if (res.ok) {
        // ファイルダウンロード
        const blob = await res.blob();
        downloadFile(blob, getFilenameFromResponse(res));
      } else {
        setErrData(await res.json());
      }
    },
    [fetchConvertFile, setErrData]
  );

  //console.log({ ...info });

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
                    title="変換するファイルの種類を選択"
                    name={fieldConst.booksConvert.FILE_TYPE}
                    value={values.fileType}
                    initialValue={initialValues.fileType}
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
                    onChange={(e) =>
                      props.setFieldValue(
                        fieldConst.booksConvert.FILE,
                        getInputFile(e)
                      )
                    }
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
