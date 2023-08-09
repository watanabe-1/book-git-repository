import addMonths from 'date-fns/addMonths';
import getMonth from 'date-fns/getMonth';
import parse from 'date-fns/parse';
import startOfMonth from 'date-fns/startOfMonth';
import subMonths from 'date-fns/subMonths';

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
  options?: {
    locale?: Locale;
    weekStartsOn?: 0 | 1 | 2 | 3 | 4 | 5 | 6;
    firstWeekContainsDate?: 1 | 2 | 3 | 4 | 5 | 6 | 7;
    useAdditionalWeekYearTokens?: boolean;
    useAdditionalDayOfYearTokens?: boolean;
  }
): Date {
  return parse(dateString, formatString, new Date(), options);
}

/**
 * 年、月、日、時、分、秒を元にDateオブジェクトを作成する
 * new Date()で作成したときと違い存在しない日付の場合は
 * invalid date が返却される
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
  //console.log('call createDate');
  const TOP_DELIM = '-';
  const LOWER_DELIM = ':';
  const topParts: (number | string)[] = [];
  const lowerParts: (number | string)[] = [];

  if (year) topParts.push(year);
  if (month) topParts.push(month);
  if (day) topParts.push(day);

  if (hours) lowerParts.push(hours);
  if (minutes) lowerParts.push(minutes);
  if (seconds) lowerParts.push(seconds);

  const topString = topParts.join(TOP_DELIM);
  const lowerString = lowerParts.join(LOWER_DELIM);
  const middleString = lowerString ? ' ' : '';
  const dateString = `${topString}${middleString}${lowerString}`;
  const formatString = determineFormatString(
    dateString,
    TOP_DELIM,
    LOWER_DELIM
  );

  //console.log(`dateString:${dateString} formatString:${formatString}`);
  const date = parseDate(dateString, formatString);
  //console.log(`date:${date} `);
  return date;
}

/**
 * 提供された日時文字列の構造に基づいてフォーマット文字列を決定する
 *
 * @param dateString 分析する日時文字列
 * @returns 日付をパースするためのフォーマット文字列
 * @throws 日時文字列の構造が無効な場合にエラーがスローされる
 */
export function determineFormatString(
  dateString: string,
  topDelim: string,
  lowerDelim?: string
): string {
  const parts = dateString.split(new RegExp(`[${topDelim}${lowerDelim}]`));

  if (parts.length === 6) {
    return `yyyy${topDelim}MM${topDelim}dd HH${lowerDelim}mm${lowerDelim}ss`;
  } else if (parts.length === 5) {
    return `yyyy${topDelim}MM${topDelim}dd HH${lowerDelim}mm`;
  } else if (parts.length === 3) {
    return `yyyy${topDelim}MM${topDelim}dd`;
  } else if (parts.length === 2) {
    return `yyyy${topDelim}MM`;
  } else if (parts.length === 1) {
    return 'yyyy';
  } else {
    throw new Error('Invalid date string');
  }
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
export function convertToFlatpickrFormat(inputFormat) {
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
