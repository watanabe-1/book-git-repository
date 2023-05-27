import { Formik, FormikProps } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { BooksUi, ErrorResults } from '../../../../@types/studyUtilType';
import { FieldConst } from '../../../../constant/fieldConstant';
import { UrlConst } from '../../../../constant/urlConstant';
import {
  downloadFile,
  getFilenameFromResponse,
} from '../../../../study/util/studyFileUtil';
import { fetchGet, fetchPost } from '../../../../study/util/studyUtil';
import { addServerValidateFuncs } from '../../../../study/util/studyYupUtil';
import BodysLodingSpinner from '../../../components/BodysLodingSpinner';
import SelectBoxOnValidate from '../../../components/SelectBoxOnValidate';
import SubmitButton from '../../../components/SubmitButton';
import { executeFuncIfNeeded, onServer } from '../../../on-server';
import yup from '../../../yup/message/ja';
import { OnServerConst } from '../../../../constant/on-serverConst';

/**
 * 家計簿ダウンロードForm
 */
export type BooksDownloadForm = {
  booksType: string;
  booksYear: string;
};

const InputForm = (props) => {
  const [initialInfo, initScript] = onServer(
    (api) => api.getDownloadInfo(),
    [],
    OnServerConst.Books.DOWNLOAD_INFO
  ) as [BooksUi, JSX.Element];
  const [info, setInfo] = useState(initialInfo);
  const [errData, setErrData] = useState() as [
    ErrorResults,
    React.Dispatch<React.SetStateAction<{}>>
  ];
  const [isResultLoading, setResultLoading] = useState(false);
  //const [validated, setValidated] = useState(false);
  const buttonElement = useRef<HTMLButtonElement>(null);

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
      // 再バリデーション実施
      buttonElement.current.click();
    }
  };

  /**
   * 画面情報取得
   */
  const fetchInfo = async () => {
    const response = await fetchGet(UrlConst.Books.DOWNLOAD_INFO);
    setInfo(await response.json());
  };

  /**
   * 登録
   */
  const fetchResult = async (form) => {
    setResultLoading(true);
    const response = await fetchPost(UrlConst.Books.DOWNLOAD, form);
    setResultLoading(false);

    return response;
  };

  useEffect(() => {
    // SSRが実行されたかされていないかで処理が変わる
    executeFuncIfNeeded(OnServerConst.Books.DOWNLOAD_INFO, fetchInfo);
  }, []);

  console.log(info);
  // 非同期が完了するまで次の処理に進まない
  if (!info.booksTypes) return <BodysLodingSpinner />;

  //yupで使用するスキーマの設定
  const additions = {};
  additions[FieldConst.Books.BOOKS_TYPE] = yup.string().required();
  additions[FieldConst.Books.BOOKS_YEAR] = yup.string().required();
  // サーバーでのバリデーション結果を反映する関数をセット
  addServerValidateFuncs(
    additions,
    [FieldConst.Books.BOOKS_TYPE, FieldConst.Books.BOOKS_YEAR],
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
            booksType: info.booksTypes[0].code,
            booksYear: '',
          } as BooksDownloadForm
        }
      >
        {(props: FormikProps<BooksDownloadForm>) => {
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
                <Col sm="12">
                  <SelectBoxOnValidate
                    title="収入or支出"
                    name={FieldConst.Books.BOOKS_TYPE}
                    value={values.booksType}
                    typeList={info.booksTypes}
                    error={errors.booksType}
                    touched={touched.booksType}
                    onChange={handleChange}
                  />
                </Col>
              </Row>
              <Row g="3">
                <Col sm="12">
                  <SelectBoxOnValidate
                    title="出力年選択"
                    name={FieldConst.Books.BOOKS_YEAR}
                    value={values.booksYear}
                    typeList={info.booksYears}
                    error={errors.booksYear}
                    touched={touched.booksYear}
                    onChange={handleChange}
                    isUnshiftEmpty
                  />
                </Col>
              </Row>
              <hr className="my-4" />
              <SubmitButton title="ダウンロード" isLoading={isResultLoading} />
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

export default InputForm;
