package org.book.app.study.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Objects;

import org.book.app.common.exception.BusinessException;

/**
 * 日付けを扱うutilクラス
 */
public class StudyDateUtil {

  /**
   * 開始日
   */
  public static final String START = "start";

  /**
   * 終了日
   */
  public static final String END = "end";

  /**
   * 日付けフォーマット 年
   */
  public static final String FMT_YEAR = "yyyy";

  /**
   * 日付けフォーマット 月
   */
  public static final String FMT_MONTH = "MM";

  /**
   * 日付けフォーマット 日
   */
  public static final String FMT_DAY = "dd";

  /**
   * 日付けフォーマット 時間
   */
  public static final String FMT_HOUR = "hh";

  /**
   * 日付けフォーマット 分
   */
  public static final String FMT_MINUTE = "mm";

  /**
   * 日付けフォーマット 年/月
   */
  public static final String FMT_YEAR_MONTH_SLASH = "yyyy/MM";

  /**
   * 日付けフォーマット 年/月/日
   */
  public static final String FMT_YEAR_MONTH_DAY_SLASH = "yyyy/MM/dd";

  /**
   * タイムゾーン 世界標準時
   */
  public static final String TIMEZONE_UTC = "UTC";

  /**
   * タイムゾーン 東京
   */
  public static final String TIMEZONE_ASIA_TOKYO = "Asia/Tokyo";

  /**
   * 日付けに対して計算を行う
   * 
   * @param Date 計算したい日付
   * @param field 計算したい日付の種類(年、月、日、時間、分) Calendar.YEARなどを利用して指定
   * @param amount 値
   * @return String 変換語の日付
   */
  public static Date calculateDate(Date date, int field, int amount) {
    Calendar cal = dateToCalendar(date);
    // 計算
    cal.add(field, amount);

    return cal.getTime();
  }

  /**
   * 1月加算してから返却
   * 
   * @param date 加算したい日付
   * @return Date 変換語の日付
   */
  public static Date getNextMonth(Date date) {
    return calculateDate(date, Calendar.MONTH, 1);
  }

  /**
   * 1月減算してしてから返却
   * 
   * @param date 減算したい日付
   * @return Date 変換語の日付
   */
  public static Date getBackMonth(Date date) {
    return calculateDate(date, Calendar.MONTH, -1);
  }

  /**
   * その月の最初の日に変換して返却
   * 
   * @param date 変更したい日付
   * @return Date 変換語の日付
   */
  public static Date getStartDateByMonth(Date date) {
    return getEdgeDate(date, START, Calendar.MONTH);
  }

  /**
   * その月の最後の日に変換して返却
   * 
   * @param date 変更したい日付
   * @return Date 変換語の日付
   */
  public static Date getEndDateByMonth(Date date) {
    return getEdgeDate(date, END, Calendar.MONTH);
  }

  /**
   * その年の最初の日に変換して返却
   * 
   * @param date 変更したい日付
   * @return Date 変換語の日付
   */
  public static Date getStartDateByYear(Date date) {
    return getStartDateByMonth(getEdgeDate(date, START, Calendar.YEAR));
  }

  /**
   * その年の最後の日に変換して返却
   * 
   * @param date 変更したい日付
   * @return Date 変換語の日付
   */
  public static Date getEndDateByYear(Date date) {
    return getEndDateByMonth(getEdgeDate(date, END, Calendar.YEAR));
  }

  /**
   * 1年前の月の最初の日を取得
   * 
   * @param date 変更したい日付
   * @return Date 変換語の日付
   */
  public static Date getOneYearAgoMonth(Date date) {
    Date startMonth = calculateDate(date, Calendar.MONTH, -12);

    return getEdgeDate(startMonth, START, Calendar.MONTH);
  }

  /**
   * 初もしくは末の日付けを取得
   * 
   * @param date 変更したい日付
   * @param type "start" or "end"
   * @param dateType 計算したい日付の種類(年、月、日、時間、分) Calendar.YEARなどを利用して指定
   * @return Date 変換語の日付
   */
  public static Date getEdgeDate(Date date, String type, int dateType) {
    int field = 0;

    if (Objects.equals(Calendar.YEAR, dateType)) {
      field = Calendar.MONTH;
    } else if (Objects.equals(Calendar.MONTH, dateType)) {
      field = Calendar.DATE;
    } else if (Objects.equals(Calendar.DATE, dateType)) {
      field = Calendar.HOUR;
    } else if (Objects.equals(Calendar.HOUR, dateType)) {
      field = Calendar.MINUTE;
    } else if (Objects.equals(Calendar.MINUTE, dateType)) {
      field = Calendar.SECOND;
    } else {
      throw new BusinessException("1.01.01.1008", "dateTypeにはCalendar.YEARなどを利用して指定されていないため");
    }

    Calendar cal = dateToCalendar(date);
    // 初もしくは末の値を取得
    int value = Objects.equals(START, type) ? cal.getActualMinimum(field) : cal.getActualMaximum(field);
    // 取得した値をセット
    cal.set(field, value);

    return cal.getTime();
  }

  /**
   * 指定した日付けの最小値と最大値の間の年のリストを取得
   * 
   * @param min 最小日付
   * @param max 最大日付
   * @return 年のリスト
   */
  public static List<String> getbetweenYears(Date min, Date max) {
    List<String> result = new ArrayList<>();
    Date currentDate = min;
    int maxYear = getYearOfInt(max);

    while (getYearOfInt(currentDate) <= maxYear) {
      result.add(getYearOfStr(currentDate));
      currentDate = calculateDate(currentDate, Calendar.YEAR, 1);
    }

    return result;
  }

  /**
   * 引数から年のみ抜き出し返却
   * 
   * @param date 取得対象
   * @return 年 数値
   */
  public static int getYearOfInt(Date date) {
    return dateToLocalDate(date).getYear();
  }

  /**
   * 引数から年のみ抜き出し返却
   * 
   * @param date 取得対象
   * @return 年 文字列
   */
  public static String getYearOfStr(Date date) {
    return String.valueOf(getYearOfInt(date));
  }

  /**
   * 引数から月のみ抜き出し返却
   * 
   * @param date 取得対象
   * @return 月 数値
   */
  public static int getMonthOfInt(Date date) {
    return dateToLocalDate(date).getMonthValue();
  }

  /**
   * 引数から月のみ抜き出し返却
   * 
   * @param date 取得対象
   * @return 月 文字列
   */
  public static String getMonthOfStr(Date date) {
    return String.valueOf(getMonthOfInt(date));
  }

  /**
   * 引数から日のみ抜き出し返却
   * 
   * @param date 取得対象
   * @return 日 数値
   */
  public static int getDayOfInt(Date date) {
    return dateToLocalDate(date).getDayOfMonth();
  }

  /**
   * 引数から日のみ抜き出し返却
   * 
   * @param date 取得対象
   * @return 日 文字列
   */
  public static String getDayOfStr(Date date) {
    return String.valueOf(getDayOfInt(date));
  }

  /**
   * 引数から年/月のみ抜き出し返却
   * 
   * @param date 取得対象
   * @return 年/月 文字列
   */
  public static String getYearMonth(Date date) {
    return dateToStr(date, FMT_YEAR_MONTH_SLASH);
  }

  /**
   * 引数から年/月/日のみ抜き出し返却
   * 
   * @param date 取得対象
   * @return 年/月/日 文字列
   */
  public static String getYearMonthDay(Date date) {
    return dateToStr(date, FMT_YEAR_MONTH_DAY_SLASH);
  }

  /**
   * 基準となる日付から指定された週数だけさかのぼった範囲に含まれる月の年を取得
   *
   * @param baseDate 基準となる日付
   * @param weeksToGoBack さかのぼる週数
   * @param targetMonth 検索する対象の月
   * @return 指定された週数だけさかのぼった範囲に含まれる対象の月の年 見つからなかった場合は-1。
   */
  public static int getYearOfMonthInPreviousWeeks(LocalDate baseDate, int weeksToGoBack,
      int targetMonth) {
    LocalDate startDate = baseDate.minusWeeks(weeksToGoBack);
    LocalDate endDate = baseDate;

    int year = startDate.getYear();
    int month = startDate.getMonthValue();

    while (startDate.isBefore(endDate) || startDate.isEqual(endDate)) {
      if (month == targetMonth) {
        return year;
      }

      startDate = startDate.plusDays(1);
      year = startDate.getYear();
      month = startDate.getMonthValue();
    }

    return -1; // マッチする月が見つからなかった場合は-1を返す
  }

  /**
   * DateからLocalDateに変換
   * 
   * @param date 変換対象
   * @return LocalDate
   */
  public static LocalDate dateToLocalDate(Date date) {
    ZoneId timeZone = ZoneId.systemDefault();

    return date.toInstant().atZone(timeZone).toLocalDate();
  }

  /**
   * LocalDateからDateに変換
   * 
   * @param localDate 変換対象
   * @return Date
   */
  public static Date LocalDateToDate(LocalDate localDate) {
    return Date.from(localDate.atStartOfDay(ZoneId.systemDefault()).toInstant());
  }

  /**
   * DateからCalendarに変換
   * 
   * @param date 変換対象
   * @return Calendar
   */
  public static Calendar dateToCalendar(Date date) {
    Calendar cal = Calendar.getInstance();
    cal.setTime(date);

    return cal;
  }

  /**
   * StringからDateに変換
   * 
   * @param str 変換対象
   * @param fmtPattern 変換パターン
   * @return Date
   */
  public static Date strToDate(String str, String fmtPattern) {
    SimpleDateFormat sdFormat = new SimpleDateFormat(fmtPattern);
    Date date = new Date();

    try {
      date = sdFormat.parse(str);
    } catch (ParseException e) {
      throw new BusinessException("1.01.01.1008",
          new StringBuffer().append(str).append(":").append(fmtPattern).toString());
    }

    return date;
  }

  /**
   * StringからDateに変換
   * 
   * @param str 変換対象
   * @param fmtPattern 変換パターン
   * @return Date
   */
  public static LocalDate strToDLocalate(String str, String fmtPattern) {
    return LocalDate.parse(str, DateTimeFormatter.ofPattern(fmtPattern));
  }

  /**
   * DateからStringに変換
   * 
   * @param date 変換対象
   * @param fmtPattern 変換パターン
   * @return Date
   */
  public static String dateToStr(Date date, String fmtPattern) {
    SimpleDateFormat sdFormat = new SimpleDateFormat(fmtPattern);

    return sdFormat.format(date);
  }

}
