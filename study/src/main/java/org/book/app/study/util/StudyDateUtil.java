package org.book.app.study.util;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.List;

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
  * 日付けフォーマット 年/月/日
  */
  public static final String FMT_ONEYEAR_ONEMONTH_DAY_SLASH = "yyyy/M/d";

  /**
   * タイムゾーン 世界標準時
   */
  public static final String TIMEZONE_UTC = "UTC";

  /**
   * タイムゾーン 東京
   */
  public static final String TIMEZONE_ASIA_TOKYO = "Asia/Tokyo";

  /**
  * 1月加算してから返却
  * 
  * @param date 加算したい日付
  * @return LocalDateTime 変換後の日付
  */
  public static LocalDateTime getNextMonth(LocalDate date) {
    return getNextMonth(localDatetoLocalDateTime(date));
  }

  /**
   * 1月加算してから返却
   * 
   * @param date 加算したい日付
   * @return LocalDateTime 変換後の日付
   */
  public static LocalDateTime getNextMonth(LocalDateTime date) {
    return date.plusMonths(1);
  }

  /**
   * 1月減算してから返却
   * 
   * @param date 減算したい日付
   * @return LocalDateTime 変換後の日付
   */
  public static LocalDateTime getBackMonth(LocalDate date) {
    return getBackMonth(localDatetoLocalDateTime(date));
  }

  /**
   * 1月減算してから返却
   * 
   * @param date 減算したい日付
   * @return LocalDateTime 変換後の日付
   */
  public static LocalDateTime getBackMonth(LocalDateTime date) {
    return date.minusMonths(1);
  }

  /**
   * その月の最初の日に変換して返却
   * 
   * @param date 変更したい日付
   * @return LocalDateTime 変換後の日付
   */
  public static LocalDateTime getFirstDayOfMonth(LocalDateTime date) {
    return date.with(TemporalAdjusters.firstDayOfMonth());
  }

  /**
   * その月の最後の日に変換して返却
   * 
   * @param date 変更したい日付
   * @return LocalDateTime 変換後の日付
   */
  public static LocalDateTime getLastDayOfMonth(LocalDateTime date) {
    return date.with(TemporalAdjusters.lastDayOfMonth());
  }

  /**
   * その年の最初の日に変換して返却
   * 
   * @param date 変更したい日付
   * @return LocalDateTime 変換後の日付
   */
  public static LocalDateTime getFirstDayOfYear(LocalDateTime date) {
    return date.with(TemporalAdjusters.firstDayOfYear());
  }

  /**
   * その年の最後の日に変換して返却
   * 
   * @param date 変更したい日付
   * @return LocalDateTime 変換後の日付
   */
  public static LocalDateTime getLastDayOfYear(LocalDateTime date) {
    return date.with(TemporalAdjusters.lastDayOfYear());
  }

  /**
   * 1年前の月の最初の日を取得
   * 
   * @param date 変更したい日付
   * @return LocalDateTime 変換後の日付
   */
  public static LocalDateTime getOneYearAgoMonth(LocalDateTime date) {
    LocalDateTime startMonth = date.minusYears(1);

    return getFirstDayOfMonth(startMonth);
  }

  /**
   * 指定した日付の最小値と最大値の間の年のリストを取得
   * 
   * @param min 最小日付
   * @param max 最大日付
   * @return 年のリスト
   */
  public static List<String> getbetweenYears(LocalDateTime min, LocalDateTime max) {
    List<String> result = new ArrayList<>();
    LocalDateTime currentDate = min;
    int maxYear = max.getYear();

    while (currentDate.getYear() <= maxYear) {
      result.add(getYearOfStr(currentDate));
      currentDate = currentDate.plusYears(1);
    }

    return result;
  }

  /**
   * 引数から年のみ抜き出し返却
   * 
   * @param date 取得対象
   * @return 年 文字列
   */
  public static String getYearOfStr(LocalDateTime date) {
    return String.valueOf(date.getYear());
  }

  /**
   * 引数から月のみ抜き出し返却
   * 
   * @param date 取得対象
   * @return 月 文字列
   */
  public static String getMonthOfStr(LocalDateTime date) {
    return String.valueOf(date.getMonthValue());
  }

  /**
   * 引数から日のみ抜き出し返却
   * 
   * @param date 取得対象
   * @return 日 文字列
   */
  public static String getDayOfStr(LocalDateTime date) {
    return String.valueOf(date.getDayOfMonth());
  }

  /**
  * 引数から年/月のみ抜き出し返却
  * 
  * @param date 取得対象
  * @return 年/月 文字列
  */
  public static String getYearMonth(LocalDate date) {
    return getYearMonth(localDatetoLocalDateTime(date));
  }

  /**
   * 引数から年/月のみ抜き出し返却
   * 
   * @param date 取得対象
   * @return 年/月 文字列
   */
  public static String getYearMonth(LocalDateTime date) {
    return LocalDateTimeToStr(date, FMT_YEAR_MONTH_SLASH);
  }

  /**
  * 引数から年/月/日のみ抜き出し返却
  * 
  * @param date 取得対象
  * @return 年/月/日 文字列
  */
  public static String getYearMonthDay(LocalDate date) {
    return getYearMonthDay(localDatetoLocalDateTime(date));
  }

  /**
   * 引数から年/月/日のみ抜き出し返却
   * 
   * @param date 取得対象
   * @return 年/月/日 文字列
   */
  public static String getYearMonthDay(LocalDateTime date) {
    return LocalDateTimeToStr(date, FMT_YEAR_MONTH_DAY_SLASH);
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
   * LocalDateをLocalDateTimeに変換する（その日の始まり、つまり真夜中に設定）
   * 
   * @param date 変換するLocalDate
   * @return 変換されたLocalDateTime
   */
  public static LocalDateTime localDatetoLocalDateTime(LocalDate date) {
    return date.atStartOfDay();
  }

  /**
  * StringからLocalDateに変換
  * 
  * @param str 変換対象
  * @param fmtPattern 変換パターン
  * @return LocalDateTime
  */
  public static LocalDate strToLocalDate(String str, String fmtPattern) {
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern(fmtPattern);

    return LocalDate.parse(str, formatter);
  }

  /**
   * StringからLocalDateTimeに変換
   * 
   * @param str 変換対象
   * @param fmtPattern 変換パターン
   * @return LocalDateTime
   */
  public static LocalDateTime strToLocalDateTime(String str, String fmtPattern) {
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern(fmtPattern);

    return LocalDateTime.parse(str, formatter);
  }

  /**
   * LocalDateTimeからStringに変換
   * 
   * @param localDateTimeLocalDateTime 変換対象
   * @param fmtPattern 変換パターン
   * @return 文字列形式の日付
   */
  public static String LocalDateTimeToStr(LocalDateTime localDateTimeLocalDateTime, String fmtPattern) {
    DateTimeFormatter formatter = DateTimeFormatter.ofPattern(fmtPattern);

    return localDateTimeLocalDateTime.format(formatter);
  }

}
