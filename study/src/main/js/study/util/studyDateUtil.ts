import { addMonths } from 'date-fns/addMonths';
import { getMonth } from 'date-fns/getMonth';
import { isValid } from 'date-fns/isValid';
import { ParseOptions, parse } from 'date-fns/parse';
import { startOfMonth } from 'date-fns/startOfMonth';
import { subMonths } from 'date-fns/subMonths';

/**
 * date型文字列をパーズする
 *
 * @param dateString date文字列
 * @param formatString date format
 * @param options オプション
 * @returns
 */
export function parseDate(
  dateString: string,
  formatString: string,
  options?: ParseOptions
): Date {
  return parse(dateString, formatString, new Date(), options);
}

/**
 * 年、月、日、時、分、秒を元にDateオブジェクトを作成する
 * 存在しない日付の場合はエラーとなる
 *
 * @param year 年
 * @param month 月 (1-12)。
 * @param day 日 (1-31)。
 * @param hours 時間 (0-23)。
 * @param minutes 分 (0-59)。
 * @param seconds 秒 (0-59)。
 * @returns 提供された日時を表すDateオブジェクト
 * @throws 有効な引数が提供されなかった場合にエラーがスローされる
 */
export function createDate(
  year: number | string,
  month?: number | string,
  day?: number | string,
  hours?: number | string,
  minutes?: number | string,
  seconds?: number | string
): Date {
  // パラメーターのデフォルト値を設定
  month = month ?? 1;
  day = day ?? 1;
  hours = hours ?? 0;
  minutes = minutes ?? 0;
  seconds = seconds ?? 0;

  // 日付の文字列を作成
  const dateString = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  // 日付を解析するフォーマットを定義
  const formatString = 'yyyy-MM-dd HH:mm:ss';

  // 日付を解析
  const date = parseDate(dateString, formatString);

  // 日付の妥当性をチェック
  if (!isValid(date)) {
    throw new Error('Invalid date');
  }

  return date;
}

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
 *
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
 * 実際の月を取得
 *
 * @param date 日付
 * @returns 実月
 */
export function getActualMonth(date: Date) {
  const monthIndex = getMonth(date);
  const actualMonth = monthIndex + 1;

  return actualMonth;
}

/**
 * flatpickerのフォーマットに変換
 * 例: yyyy/MM/dd → "Y/m/d"
 *
 * @param inputFormat 変換元フォーマット
 * @returns
 */
export function convertToFlatpickrFormat(inputFormat: string) {
  const conversionTable = {
    // 年
    yyyy: 'Y',
    // 月
    MM: 'm',
    M: 'n',
    // 日
    dd: 'd',
    d: 'j',
    // 時
    hh: 'H',
    h: 'G',
    // 分
    mm: 'i',
    // 秒
    ss: 'S',
  };

  const flatpickrFormat = inputFormat.replace(
    /(yyyy|MM|M|dd|d|hh|h|mm|ss)/g,
    (match) => {
      return conversionTable[match];
    }
  );

  return flatpickrFormat;
}
