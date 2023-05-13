import { Field, FieldArray, FormikProvider, useFormik } from 'formik';
import React, { useEffect, useRef } from 'react';
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
  validateButton,
  hiddenSubmitButton = false,
}: {
  tableFormConfig: TableFormObjConfig;
  handleFormSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
  isFormSubmitLoading?: boolean;
  validateButton?: React.MutableRefObject<HTMLButtonElement>;
  hiddenSubmitButton?: boolean;
}) => {
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

  const formik = useFormik<{}>({
    validationSchema: schema,
    onSubmit: handleFormSubmit,
    initialValues: initialValues,
    enableReinitialize: true,
  });

  // useEffect(() => {
  //   // マウント時に初期値を設定
  //   console.log('mount');
  //   formik.setValues(initialValues);
  //   return () => {
  //     // アンマウント時にフォームをリセット
  //     console.log('unmount');
  //     // formik.setValues(initialValues);
  //     //formik.resetForm();
  //   };
  // }, [initialValues]);

  return (
    <FormikProvider value={formik}>
      <Form noValidate onSubmit={formik.handleSubmit}>
        <div className="text-end">
          <SubmitButton
            title="更新"
            isLoading={isFormSubmitLoading}
            hidden={hiddenSubmitButton}
          />
          <Button
            ref={validateButton}
            onClick={(event) => {
              formik.validateForm(formik.values);
            }}
            hidden
          >
            バリデーション実施
          </Button>
        </div>
        <FieldArray name={rowName}>
          {(fieldArrayProps) => {
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
      </Form>
    </FormikProvider>
  );
};

export default SortAndFilterFormTable;
