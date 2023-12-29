import { format } from 'date-fns';
import { isValid } from 'date-fns/isValid';

import {
  convertToFlatpickrFormat,
  createDate,
  getActualMonth,
  getNextMonthDate,
  getPreviousMonthDate,
  parseDate,
} from '../../../../main/js/study/util/studyDateUtil';

describe('parseDate', () => {
  it('should parse a date string correctly with the given format', () => {
    const dateString = '2023-01-01';
    const formatString = 'yyyy-MM-dd';
    const result = parseDate(dateString, formatString);
    expect(result).toBeInstanceOf(Date);
    expect(format(result, formatString)).toBe(dateString);
  });

  it('should handle different date formats', () => {
    const dateString = '01/01/2023';
    const formatString = 'MM/dd/yyyy';
    const result = parseDate(dateString, formatString);
    expect(result).toBeInstanceOf(Date);
    expect(format(result, formatString)).toBe(dateString);
  });

  it('should return Invalid Date for invalid date string', () => {
    const dateString = 'invalid-date';
    const formatString = 'yyyy-MM-dd';
    const result = parseDate(dateString, formatString);
    expect(result).toBeInstanceOf(Date);
    // Invalid Dateの場合、getTime()はNaNを返す
    expect(isNaN(result.getTime())).toBeTruthy();
  });

  it('should throw an error for invalid format string', () => {
    const dateString = '2023-01-01';
    const formatString = 'invalid-format';
    expect(() => parseDate(dateString, formatString)).toThrow(RangeError);
  });

  it('should return Invalid Date for mismatched date string and format', () => {
    const dateString = '2023/01/01'; // yyyy/MM/dd形式
    const formatString = 'dd-MM-yyyy'; // dd-MM-yyyy形式
    const result = parseDate(dateString, formatString);
    expect(result).toBeInstanceOf(Date);
    expect(isNaN(result.getTime())).toBeTruthy();
  });
});

describe('createDate function', () => {
  it('should create a valid date with all parameters', () => {
    const date = createDate(2023, 3, 15, 12, 30, 45);
    expect(isValid(date)).toBeTruthy();
    expect(date).toEqual(new Date(2023, 2, 15, 12, 30, 45)); // Months are 0-indexed in JS Date
  });

  it('should throw an error for invalid dates', () => {
    expect(() => createDate(2023, 2, 30)).toThrow('Invalid date');
  });

  it('should handle string inputs', () => {
    const date = createDate('2023', '3', '15', '12', '30', '45');
    expect(isValid(date)).toBeTruthy();
    expect(date).toEqual(new Date(2023, 2, 15, 12, 30, 45));
  });

  it('should create a valid date with missing optional parameters', () => {
    const date = createDate(2023, 3);
    expect(isValid(date)).toBeTruthy();
    expect(date).toEqual(new Date(2023, 2, 1, 0, 0, 0));
  });
});

describe('getNextMonthDate function', () => {
  it('should return the first day of the next month for a mid-month date', () => {
    const date = new Date(2023, 5, 15); // June 15, 2023
    const nextMonthDate = getNextMonthDate(date);
    expect(nextMonthDate).toEqual(new Date(2023, 6, 1)); // July 1, 2023
  });

  it('should handle end-of-month dates correctly', () => {
    const date = new Date(2023, 0, 31); // January 31, 2023
    const nextMonthDate = getNextMonthDate(date);
    expect(nextMonthDate).toEqual(new Date(2023, 1, 1)); // February 1, 2023
  });

  it('should handle leap year dates correctly', () => {
    const date = new Date(2024, 1, 29); // February 29, 2024
    const nextMonthDate = getNextMonthDate(date);
    expect(nextMonthDate).toEqual(new Date(2024, 2, 1)); // March 1, 2024
  });

  it('should handle year transition when the month is December', () => {
    const date = new Date(2023, 11, 31); // December 31, 2023
    const nextMonthDate = getNextMonthDate(date);
    expect(nextMonthDate).toEqual(new Date(2024, 0, 1)); // January 1, 2024
  });
});

describe('getPreviousMonthDate function', () => {
  it('should return the first day of the previous month for a mid-month date', () => {
    const date = new Date(2023, 6, 15); // July 15, 2023
    const previousMonthDate = getPreviousMonthDate(date);
    expect(previousMonthDate).toEqual(new Date(2023, 5, 1)); // June 1, 2023
  });

  it('should handle beginning-of-month dates correctly', () => {
    const date = new Date(2023, 1, 1); // February 1, 2023
    const previousMonthDate = getPreviousMonthDate(date);
    expect(previousMonthDate).toEqual(new Date(2023, 0, 1)); // January 1, 2023
  });

  it('should handle leap year dates correctly', () => {
    const date = new Date(2024, 2, 1); // March 1, 2024
    const previousMonthDate = getPreviousMonthDate(date);
    expect(previousMonthDate).toEqual(new Date(2024, 1, 1)); // February 1, 2024
  });

  it('should handle year transition when the month is January', () => {
    const date = new Date(2023, 0, 1); // January 1, 2023
    const previousMonthDate = getPreviousMonthDate(date);
    expect(previousMonthDate).toEqual(new Date(2022, 11, 1)); // December 1, 2022
  });
});

describe('getActualMonth function', () => {
  it('should return the correct month for a given date', () => {
    expect(getActualMonth(new Date(2023, 0, 15))).toBe(1); // January
    expect(getActualMonth(new Date(2023, 5, 10))).toBe(6); // June
    expect(getActualMonth(new Date(2023, 11, 31))).toBe(12); // December
  });

  it('should handle the first month of the year', () => {
    expect(getActualMonth(new Date(2023, 0, 1))).toBe(1); // January
  });

  it('should handle the last month of the year', () => {
    expect(getActualMonth(new Date(2023, 11, 1))).toBe(12); // December
  });
});

describe('convertToFlatpickrFormat function', () => {
  it('should correctly convert standard date formats', () => {
    expect(convertToFlatpickrFormat('yyyy/MM/dd')).toBe('Y/m/d');
    expect(convertToFlatpickrFormat('MM-dd-yyyy')).toBe('m-d-Y');
    expect(convertToFlatpickrFormat('yyyy-MM-dd')).toBe('Y-m-d');
  });

  it('should handle mixed format strings', () => {
    expect(convertToFlatpickrFormat('dd/MM/yyyy hh:mm:ss')).toBe('d/m/Y H:i:S');
    expect(convertToFlatpickrFormat('M/d/yyyy h:mm')).toBe('n/j/Y G:i');
  });

  it('should correctly handle format strings with unsupported tokens', () => {
    expect(convertToFlatpickrFormat('yyyy年MM月dd日')).toBe('Y年m月d日');
  });

  it('should return an empty string for an empty input format', () => {
    expect(convertToFlatpickrFormat('')).toBe('');
  });
});
