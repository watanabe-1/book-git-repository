import { FormikProps, getIn } from 'formik';

/**
 * inputのファイルを取得
 * @param event inputのチェンジイベント
 * @returns ファイル
 */
export function getInputFile(event: React.ChangeEvent<HTMLInputElement>) {
  return event.currentTarget.files[0] || null;
}

/**
 * formikの初期値から値を指定して取得
 * @param props formikのprops
 * @param key 取得したい値のキー
 * @returns 初期値
 */
export function getInitialValue(props: FormikProps<unknown>, key: string) {
  return getIn(props.initialValues, key);
}

/**
 * formikの指定した初期値と現在の値を取得
 * @param props formikのprops
 * @param key 取得したい値のキー
 * @returns 初期値と現在の値
 */
export function getValueObj(props: FormikProps<unknown>, key: string) {
  return {
    value: props.getFieldProps(key).value,
    initialValue: getInitialValue(props, key),
  };
}
