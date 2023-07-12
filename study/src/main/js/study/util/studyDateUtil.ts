import addMonths from 'date-fns/addMonths';
import startOfMonth from 'date-fns/startOfMonth';
import subMonths from 'date-fns/subMonths';

/**
 * 次月を取得
 * @param date 日付け
 * @returns 次月
 */
export function getNextMonthDate(date: Date) {
  // 次月の日付
  const nextMonth = addMonths(date, 1);
  // 最初の日にちを取得
  const firstDayOfNextMonth = startOfMonth(nextMonth);
  return firstDayOfNextMonth;
}

/**
 * 前月を取得
 * @param date 日付け
 * @returns 前月
 */
export function getPreviousMonthDate(date: Date) {
  // 先月の日付
  const previousMonth = subMonths(date, 1);
  // 最初の日にちを取得
  const firstDayOfPreviousMonth = startOfMonth(previousMonth);
  return firstDayOfPreviousMonth;
}

/**
 * JavaScript の Date クラスが返す、不正な日付を生成しようとしたときの値かどうかを判定
 * @param date
 * @returns 不正な日付け true それ以外 false
 */
export function isInvalidDate(date: Date) {
  return Number.isNaN(date.getTime());
}
