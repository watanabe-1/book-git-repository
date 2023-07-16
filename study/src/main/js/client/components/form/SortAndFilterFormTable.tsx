import { FieldArray, FormikHelpers, FormikProvider, useFormik } from 'formik';
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';

import AutoValidateToken from './AutoValidateToken';
import {
  ErrorResults,
  TableFormObjConfig,
} from '../../../@types/studyUtilType';
import yup from '../../yup/message/ja';
import SubmitButton from '../elements/button/SubmitButton';
import SortAndFilterTable from '../elements/table/SortAndFilterTable';

type SortAndFilterFormTableProps = {
  tableFormConfig: TableFormObjConfig;
  handleFormSubmit: (values: unknown) => Promise<Response>;
  validateButton?: React.MutableRefObject<HTMLButtonElement>;
  hiddenSubmitButton?: boolean;
  onEnterSubmit?: boolean;
  errData?: ErrorResults;
};

/**
 * ソート、フィルター可能なフォームテーブル
 * @returns フォームテーブル
 */
const SortAndFilterFormTable: React.FC<SortAndFilterFormTableProps> = ({
  tableFormConfig,
  handleFormSubmit,
  hiddenSubmitButton = false,
  onEnterSubmit = false,
  errData = null,
}) => {
  const [isSubmitLoading, setSubmitLoading] = useState(false);
  // yupで使用するスキーマの設定
  const additions = tableFormConfig.additions;
  // 初期値
  const initialValues = tableFormConfig.initialValues;
  // テーブル：ヘッダー
  const columns = tableFormConfig.columns;
  //テーブル: 行
  const getRows = tableFormConfig.getRows;
  const rowName = tableFormConfig.rowName;

  // console.log('initialValuesです。');
  // console.log(JSON.stringify(initialValues));
  // スキーマにセット
  const schema = yup.object().shape(additions);

  /**
   * key押下時のイベント制御
   * @param event
   */
  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    // ENTERでのform送信を行うかどうか
    if (!onEnterSubmit && event.key === 'Enter') {
      // デフォルトのEnterキーの動作を無効化
      event.preventDefault();
    }
  };

  /**
   * 送信
   * @param event formイベント
   */
  const handleSubmit = async (
    values: unknown,
    formikHelpers: FormikHelpers<unknown>
  ) => {
    setSubmitLoading(true);
    const res = await handleFormSubmit(values);
    setSubmitLoading(false);
    //console.log('handleSubmit が完了しました');
    if (res && res.ok) {
      // formを現在のvalueでリセット実施することでdirty（formのどこかの値を編集したかどうか）のフラグがfalseに設定される
      formikHelpers.resetForm({ values: values });
    }
  };

  const formik = useFormik<unknown>({
    validationSchema: schema,
    onSubmit: handleSubmit,
    initialValues: initialValues,
    enableReinitialize: true,
  });

  return (
    <FormikProvider value={formik}>
      <Form
        noValidate
        onSubmit={(event) => {
          formik.handleSubmit(event);
        }}
        onKeyDown={handleKeyDown}
      >
        <div className="text-end">
          <SubmitButton
            title="更新"
            isLoading={isSubmitLoading}
            hidden={hiddenSubmitButton}
          />
        </div>
        <FieldArray name={rowName}>
          {() => {
            // const { push, remove, form } = fieldArrayProps;
            // // const {
            // //   values: { valuesの値を取り出すよう },
            // // } = form;
            // console.log('FieldArray form');
            // console.log(form);
            return (
              <div>
                <SortAndFilterTable
                  pColumns={columns}
                  pRows={getRows(formik)}
                />
              </div>
            );
          }}
        </FieldArray>
        <AutoValidateToken errData={errData} />
      </Form>
    </FormikProvider>
  );
};

export default SortAndFilterFormTable;
