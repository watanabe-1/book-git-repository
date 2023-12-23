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
