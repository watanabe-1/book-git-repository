import { FieldArray, FormikHelpers, FormikProvider, useFormik } from 'formik';
import React, { useState } from 'react';
import Form from 'react-bootstrap/Form';
import isEqual from 'react-fast-compare';

import AutoValidateToken from './AutoValidateToken';
import {
  ErrorResults,
  TableFormObjConfig,
} from '../../../@types/studyUtilType';
import { isObjEmpty } from '../../../study/util/studyUtil';
import yup from '../../locale/yup.locale';
import SubmitButton from '../elements/button/SubmitButton';
import SortAndFilterTable from '../elements/table/SortAndFilterTable';

type SortAndFilterFormTableProps = {
  /** form table用 設定*/
  tableFormConfig: TableFormObjConfig;
  /** 送信制御用関数 */
  handleFormSubmit: (values: unknown) => Promise<Response>;
  /** submitボタンをhiddenにするかどうか */
  hiddenSubmitButton?: boolean;
  /** enterで送信するかどうか */
  onEnterSubmit?: boolean;
  /** エラーデータ(主にサーバー側を想定) */
  errData?: ErrorResults;
  /** 追加でボタンを設置する場合はここに設定 */
  customeButton?: React.ReactElement | React.ReactElement[];
  /** 修正した行のみ送信対象とする */
  modifiedRowsOnlySubmitFlag?: boolean;
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
  customeButton = null,
  modifiedRowsOnlySubmitFlag = true,
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

  // console.log(`initialValuesです。\n ${JSON.stringify(initialValues)}`);
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
    values: object,
    formikHelpers: FormikHelpers<unknown>
  ) => {
    const submitValues = { ...values };
    // 修正した行のみに送信対象を絞り込む
    if (modifiedRowsOnlySubmitFlag) {
      const rows: [] = values[rowName];
      const initialRows: [] = initialValues[rowName];
      const editRows = rows.filter((row, index) => {
        const initialRow = initialRows[index];
        // console.log(`row is edited : ${!isEqual(row, initialRow)}`);

        return !isEqual(row, initialRow);
      });
      submitValues[rowName] = isObjEmpty(editRows) ? null : editRows;
      // console.log(`editValues:${JSON.stringify(submitValues)}`);
    }

    setSubmitLoading(true);
    const res = await handleFormSubmit(submitValues);
    setSubmitLoading(false);
    //console.log('handleSubmit が完了しました');

    if (res?.ok) {
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
          {Array.isArray(customeButton)
            ? customeButton.map((button) => button)
            : customeButton}
          <SubmitButton
            title="更新"
            isLoading={isSubmitLoading}
            hidden={hiddenSubmitButton}
            disabled={!formik.dirty || isSubmitLoading}
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
