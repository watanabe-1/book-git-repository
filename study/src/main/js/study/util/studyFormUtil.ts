/**
 * inputのファイルを取得
 * @param event inputのチェンジイベント
 * @returns ファイル
 */
export function getInputFile(event: React.ChangeEvent<HTMLInputElement>) {
  return event.currentTarget.files !== null
    ? event.currentTarget.files[0]
    : null;
}

/**
 * inputされたファイルをセットする関数を返却
 * @param name セット対象名
 * @param setFieldValue フィールドにセットするformikの関数
 * @returns inputされたファイルをセットする関数
 */
export function getSetInputFileFunc(
  name: string,
  setFieldValue: (
    field: string,
    value: unknown,
    shouldValidate?: boolean
  ) => void
) {
  return (event: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue(name, getInputFile(event));
  };
}
