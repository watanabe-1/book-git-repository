import { FormikHelpers, useFormik } from 'formik';
import { useCallback, useMemo, useState } from 'react';

import { NestedObject } from '../../../../../@types/studyUtilType';
import yup from '../../../../locale/yup.locale';
import {
  buildListTableFormObj,
  filterRowValues,
} from '../functions/formTableUtils';

/** update用ボタン名 */
const UPDATE_BUTTON_NAME = 'update';
/** insert用ボタン名 */
const INSERT_BUTTON_NAME = 'insert';

export const useFormTable = ({
  objArray,
  tableFormConfig,
  handleFormSubmit,
  handlePushSubmit,
  onEnterSubmit,
  submitModifiedRowsOnly,
}: FormTableProps) => {
  const [isSubmitLoading, setSubmitLoading] = useState(false);
  const { additions, initialValues, columns, getRows, rowName } = useMemo(
    () => buildListTableFormObj(objArray, tableFormConfig),
    [objArray, tableFormConfig]
  );
  const [submitButtonName, setSubmitButtonName] = useState('');

  // console.log(`initialValuesです。\n ${JSON.stringify(initialValues)}`);
  // スキーマにセット
  const schema = useMemo(() => yup.object().shape(additions), [yup, additions]);

  /**
   * 送信処理の実行
   *
   * @param submitButtonName 送信する種類
   * @param submitValues 送信する値
   */
  const executeSubmit = useCallback(
    async (submitButtonName: string, submitValues: NestedObject) => {
      if (submitButtonName === UPDATE_BUTTON_NAME) {
        return await handleFormSubmit(submitValues);
      } else if (submitButtonName === INSERT_BUTTON_NAME) {
        return await handlePushSubmit(submitValues);
      }
    },
    [handleFormSubmit, handlePushSubmit]
  );

  /**
   *  送信制御関数
   * @param props formikのprops
   * @param onSubmit 送信関数
   */
  const handleSubmit = useCallback(
    async (
      values: NestedObject,
      formikHelpers: FormikHelpers<NestedObject>
    ) => {
      const submitValues = filterRowValues(
        values,
        initialValues,
        rowName,
        submitModifiedRowsOnly
      );

      try {
        setSubmitLoading(true);
        //console.log(`submitButtonName:${submitButtonName}`);
        const res = await executeSubmit(submitButtonName, submitValues);

        if (res?.ok) {
          // formを現在のvalueでリセット実施することでdirty（formのどこかの値を編集したかどうか）のフラグがfalseに設定される
          formikHelpers.resetForm({ values: values });
        }
      } catch (error) {
        console.error('Error occurred during submission:', error);
      } finally {
        //console.log('handleSubmit が完了しました');
        setSubmitLoading(false);
      }
    },
    [
      executeSubmit,
      filterRowValues,
      setSubmitLoading,
      initialValues,
      rowName,
      submitModifiedRowsOnly,
      submitButtonName,
    ]
  );

  /**
   * key押下時のイベント制御
   * @param event
   */
  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLElement>) => {
      // ENTERでのform送信を行うかどうか
      if (!onEnterSubmit && event.key === 'Enter') {
        // デフォルトのEnterキーの動作を無効化
        event.preventDefault();
      }
    },
    [onEnterSubmit]
  );

  const formik = useFormik<NestedObject>({
    validationSchema: schema,
    // 複数のボタンごとに使い分けたいため、ここにonsubmitを設定しない
    onSubmit: handleSubmit,
    initialValues: initialValues,
    enableReinitialize: true,
  });

  const rows = useMemo(() => getRows(formik), [getRows, formik]);

  return {
    isSubmitLoading,
    columns,
    rows,
    rowName,
    formik,
    handleKeyDown,
    setSubmitButtonName,
    UPDATE_BUTTON_NAME,
    INSERT_BUTTON_NAME,
  };
};
