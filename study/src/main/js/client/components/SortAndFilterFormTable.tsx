import { Formik, FormikProps } from 'formik';
import React, { useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { TableFormObjConfig } from '../../@types/studyUtilType';
import SortAndFilterTable from './SortAndFilterTable';
import SubmitButton from './SubmitButton';
import yup from '../yup/message/ja';

/**
 * ソート、フィルター可能なフォームテーブル
 * @returns フォームテーブル
 */
const SortAndFilterFormTable = ({
  tableFormConfig,
  handleFormSubmit,
  isFormSubmitLoading = false,
  buttonElement,
}: {
  tableFormConfig: TableFormObjConfig;
  handleFormSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isFormSubmitLoading?: boolean;
  buttonElement: React.MutableRefObject<HTMLButtonElement>;
}) => {
  // yupで使用するスキーマの設定
  const additions = tableFormConfig.additions;
  // 初期値
  const initialValues = tableFormConfig.initialValues;
  // テーブル：ヘッダー
  const columns = tableFormConfig.columns;
  //テーブル: 行
  const getRows = tableFormConfig.getRows;

  // console.log('initialValuesです。');
  console.log(initialValues);
  // スキーマにセット
  const schema = yup.object().shape(additions);

  return (
    <Formik
      validationSchema={schema}
      onSubmit={handleFormSubmit}
      initialValues={initialValues}
      enableReinitialize
    >
      {(props: FormikProps<{}>) => {
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
            <div className="text-end">
              <SubmitButton title="更新" isLoading={isFormSubmitLoading} />
              <Button
                ref={buttonElement}
                onClick={(event) => {
                  validateForm(values);
                }}
                hidden
              >
                バリデーション実施
              </Button>
            </div>
            <SortAndFilterTable pColumns={columns} pRows={getRows(props)} />
          </Form>
        );
      }}
    </Formik>
  );
};

export default SortAndFilterFormTable;
