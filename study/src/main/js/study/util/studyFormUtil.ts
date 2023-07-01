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
 * @param setFieldValue フィールドにセットするformikの関数
 * @param fileKey  セット対象名
 * @param imgPathKey セット対象パス名
 * @param imgNameKey セット対象画像名
 * @returns
 */
export function getSetInputFileFunc(
  setFieldValue: (
    field: string,
    value: unknown,
    shouldValidate?: boolean
  ) => void,
  fileKey: string,
  imgPathKey?: string,
  imgNameKey?: string
) {
  return (event: React.ChangeEvent<HTMLInputElement>) => {
    setFieldValue(fileKey, getInputFile(event));
    // 以下画像置き換え処理
    if (imgPathKey && imgNameKey) {
      const file = event.target.files[0];
      // fileの存在チェック
      if (!file) {
        return;
      }

      // ファイルタイプのチェック
      if (!file.type.startsWith('image/')) {
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        setFieldValue(imgPathKey, reader.result);
        setFieldValue(imgNameKey, null);
      };
      reader.readAsDataURL(file);
    }
  };
}
