/**
 * 次月を取得
 * @param date 日付け
 * @returns 次月
 */
export function getNextMonthDate(date: Date) {
  // 現在の月に1を加算し、日付を1に設定
  const nextMonthDate = new Date(date.getFullYear(), date.getMonth() + 1, 1);
  // 日付を1日戻して、先月の最終日に設定
  nextMonthDate.setDate(nextMonthDate.getDate() - 1);
  return nextMonthDate;
}

/**
 * 前月を取得
 * @param date 日付け
 * @returns 前月
 */
export function getPreviousMonthDate(date: Date) {
  // 現在の月から1を減算し、日付を1に設定
  const previousMonthDate = new Date(
    date.getFullYear(),
    date.getMonth() - 1,
    1
  );
  // 日付を1日戻して、先月の最終日に設定
  previousMonthDate.setDate(previousMonthDate.getDate() - 1);
  return previousMonthDate;
}
