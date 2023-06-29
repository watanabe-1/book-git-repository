import { FieldArray, FormikProvider, useFormik } from 'formik';
import React, { useRef, useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';

import { TableFormObjConfig } from '../../@types/studyUtilType';
import yup from '../yup/message/ja';
import SortAndFilterTable from './SortAndFilterTable';
import SubmitButton from './SubmitButton';

type SortAndFilterFormTableProps = {
  tableFormConfig: TableFormObjConfig;
  handleFormSubmit: (
    event: React.FormEvent<HTMLFormElement>
  ) => Promise<Response>;
  validateButton?: React.MutableRefObject<HTMLButtonElement>;
  hiddenSubmitButton?: boolean;
};

/**
 * ソート、フィルター可能なフォームテーブル
 * @returns フォームテーブル
 */
const SortAndFilterFormTable: React.FC<SortAndFilterFormTableProps> = ({
  tableFormConfig,
  handleFormSubmit,
  hiddenSubmitButton = false,
}) => {
  const validetaButton = useRef<HTMLButtonElement>(null);
  const resetButton = useRef<HTMLButtonElement>(null);
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
   * 送信
   * @param event formイベント
   */
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    setSubmitLoading(true);
    const res = await handleFormSubmit(event);
    setSubmitLoading(false);
    //console.log('handleSubmit が完了しました');
    if (res) {
      if (res.ok) {
        // formのリセット(dirty→false)
        resetButton.current.click();
      } else {
        // バリデーション実施
        validetaButton.current.click();
      }
    }
  };

  const formik = useFormik<unknown>({
    validationSchema: schema,
    onSubmit: handleSubmit,
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
      <Form
        noValidate
        onSubmit={(event) => {
          formik.handleSubmit(event);
        }}
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
        <Button
          ref={validetaButton}
          onClick={() => {
            formik.validateForm(formik.values);
          }}
          hidden
        >
          バリデーション実施
        </Button>
        <Button
          ref={resetButton}
          onClick={() => {
            // formを現在のvalueでリセット実施することでdirty（formのどこかの値を編集したかどうか）のフラグがfalseに設定される
            formik.resetForm({ values: formik.values });
          }}
          hidden
        >
          formのリセット実施
        </Button>
      </Form>
    </FormikProvider>
  );
};

export default SortAndFilterFormTable;
