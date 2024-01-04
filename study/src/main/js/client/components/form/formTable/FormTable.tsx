import { FieldArray, FormikProvider } from 'formik';
import React from 'react';
import Form from 'react-bootstrap/Form';

import { useFormTable } from './hooks/useFormTable';
import SubmitButton from '../../elements/button/SubmitButton';
import ListTable from '../../elements/table/listTable/ListTable';
import AutoValidateToken from '../AutoValidateToken';

/**
 * ソート、フィルター可能なフォームテーブル
 * @returns フォームテーブル
 */
const FormTable: React.FC<FormTableProps> = ({
  objArray,
  tableFormConfig,
  handleFormSubmit,
  handlePushSubmit,
  hiddenSubmitButton = false,
  hiddenPushButton = false,
  onEnterSubmit = false,
  errData = null,
  customeButton = null,
  submitModifiedRowsOnly = true,
  isSort = true,
  isFilter = true,
}) => {
  const {
    formik,
    columns,
    rows,
    isSubmitLoading,
    rowName,
    handleKeyDown,
    setSubmitButtonName,
    INSERT_BUTTON_NAME,
    UPDATE_BUTTON_NAME,
  } = useFormTable({
    objArray,
    tableFormConfig,
    handleFormSubmit,
    handlePushSubmit,
    onEnterSubmit,
    submitModifiedRowsOnly,
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
          {Array.isArray(customeButton)
            ? customeButton.map((button) => button)
            : customeButton}
          {handlePushSubmit && (
            <SubmitButton
              title="新規"
              isLoading={isSubmitLoading}
              hidden={hiddenPushButton}
              disabled={formik.dirty}
              onClick={() => {
                setSubmitButtonName(INSERT_BUTTON_NAME);
              }}
            />
          )}
          {handleFormSubmit && (
            <SubmitButton
              title="更新"
              isLoading={isSubmitLoading}
              hidden={hiddenSubmitButton}
              disabled={!formik.dirty || isSubmitLoading}
              onClick={() => {
                // console.log(UPDATE_BUTTON_NAME);
                setSubmitButtonName(UPDATE_BUTTON_NAME);
              }}
            />
          )}
        </div>

        <FieldArray name={rowName}>
          {() => {
            // const { push, remove, form } = fieldArrayProps;
            // // const {
            // //   values: { valuesの値を取り出すよう },
            // // } = form;
            //console.log('FieldArray form');
            //console.log(form.values[rowName]);
            return (
              <div>
                <ListTable
                  columns={columns}
                  rows={rows}
                  isSort={isSort}
                  isFilter={isFilter}
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

export default FormTable;
