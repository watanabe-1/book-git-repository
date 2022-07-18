package org.watanabe.app.study.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.time.ZoneId;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Objects;
import org.terasoluna.gfw.common.exception.BusinessException;
import org.terasoluna.gfw.common.message.ResultMessages;

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
      throw new BusinessException(ResultMessages.error().add("1.01.01.1001"));
    }

    Calendar cal = dateToCalendar(date);
    // 初もしくは末の値を取得
    int value =
        Objects.equals(START, type) ? cal.getActualMinimum(field) : cal.getActualMaximum(field);
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

    while (currentDate.compareTo(max) < 0) {
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
   * 引数から年/月のみ抜き出し返却
   * 
   * @param date 取得対象
   * @return 年/月 文字列
   */
  public static String getYearMonth(Date date) {
    return dateToStr(date, StudyDateUtil.FMT_YEAR_MONTH_SLASH);
  }

  /**
   * 引数から年/月/日のみ抜き出し返却
   * 
   * @param date 取得対象
   * @return 年/月/日 文字列
   */
  public static String getYearMonthDay(Date date) {
    return dateToStr(date, StudyDateUtil.FMT_YEAR_MONTH_DAY_SLASH);
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
      throw new BusinessException(ResultMessages.error().add("1.01.01.1002",
          new StringBuffer().append(str).append(":").append(fmtPattern).toString()));
    }

    return date;
  }

  /**
   * DateからStringに変換
   * 
   * @param date 変換対象
   * @param fmtPattern 変換パターン
   * @return Date
   */
  public static String dateToStr(Date date, String fmtPattern) {
    SimpleDateFormat sdfYyyyMm = new SimpleDateFormat(fmtPattern);

    return sdfYyyyMm.format(date);
  }

  /**
   * 指定の日に置き換えて返却
   * 
   * @param Date 変更したい日付
   * @param String 置き換え先の日
   * @return Date 変換語の日付
   */
  public static Date replaceDay(Date date, String newDay) {
    Date newdate = new Date();
    StringBuffer sb = new StringBuffer();

    sb.append(getYearMonth(date)).append(newDay);
    newdate = strToDate(sb.toString(), FMT_YEAR_MONTH_DAY_SLASH);

    return newdate;
  }
}
