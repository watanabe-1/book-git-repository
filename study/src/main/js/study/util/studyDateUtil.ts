/**
 * 次月を取得
 * @param date 日付け
 * @returns 次月
 */
export function getNextMonthDate(date: Date) {
  // 2ヶ月後の1日目に
  const nextMonthDate = new Date(date.getFullYear(), date.getMonth() + 2, 1);
  // 日付を1日戻して、次月の最終日に設定
  nextMonthDate.setDate(nextMonthDate.getDate() - 1);
  return nextMonthDate;
}

/**
 * 前月を取得
 * @param date 日付け
 * @returns 前月
 */
export function getPreviousMonthDate(date: Date) {
  // 月は変わらず1日目に
  const previousMonthDate = new Date(date.getFullYear(), date.getMonth(), 1);
  // 日付を1日戻して、先月の最終日に設定
  previousMonthDate.setDate(previousMonthDate.getDate() - 1);
  return previousMonthDate;
}

/**
 * JavaScript の Date クラスが返す、不正な日付を生成しようとしたときの値かどうかを判定
 * @param date
 * @returns 不正な日付け true それ以外 false
 */
export function isInvalidDate(date: Date) {
  return Number.isNaN(date.getTime());
}
