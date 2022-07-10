package org.watanabe.app.study.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
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
   * 日付けに対して計算を行う
   * 
   * @param Date 計算したい日付
   * @param field 計算したい日付の種類(年、月、日、時間、分) Calendar.YEARなどを利用して指定
   * @param amount 値
   * @return String 変換語の日付
   */
  public static Date calculateDate(Date date, int field, int amount) {
    Calendar cal = Calendar.getInstance();
    cal.setTime(date);
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
   * @param field 計算したい日付の種類(年、月、日、時間、分) Calendar.YEARなどを利用して指定
   * @return Date 変換語の日付
   */
  public static Date getEdgeDate(Date date, String type, int dateType) {
    int amount = START.equals(type) ? -1 : 1;
    String fm = "";
    int field = 0;

    if (Objects.equals(Calendar.YEAR, dateType)) {
      fm = "yyyy";
      field = Calendar.MONTH;
    } else if (Objects.equals(Calendar.MONTH, dateType)) {
      fm = "MM";
      field = Calendar.DATE;
    } else if (Objects.equals(Calendar.DATE, dateType)) {
      fm = "dd";
      field = Calendar.HOUR;
    } else if (Objects.equals(Calendar.HOUR, dateType)) {
      fm = "hh";
      field = Calendar.MINUTE;
    } else if (Objects.equals(Calendar.MINUTE, dateType)) {
      fm = "mm";
      field = Calendar.SECOND;
    } else {
      throw new BusinessException(ResultMessages.error().add("1.01.01.1001"));
    }

    SimpleDateFormat sdfMm = new SimpleDateFormat(fm);
    Date currentDate = date;
    String fmDate = sdfMm.format(date);
    String currentFmDate = fmDate;
    int cnt = 0;

    // 無限ループ防止のため1000周以下の条件を追加
    while (cnt < 1000) {
      currentDate = calculateDate(date, field, amount);
      currentFmDate = sdfMm.format(currentDate);
      if (fmDate.equals(currentFmDate)) {
        date = currentDate;
      } else {
        break;
      }
      cnt++;
    }

    return date;
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
    SimpleDateFormat getYearFormat = new SimpleDateFormat("yyyy");
    Date currentDate = min;

    while (currentDate.compareTo(max) < 0) {
      result.add(getYearFormat.format(currentDate));
      currentDate = calculateDate(currentDate, Calendar.YEAR, 1);
    }

    return result;
  }

  /**
   * 指定の日に置き換えて返却
   * 
   * @param Date 変更したい日付
   * @param String 置き換え先の日
   * @return Date 変換語の日付
   */
  public static Date replaceDay(Date date, String newDay) {
    SimpleDateFormat sdFormat = new SimpleDateFormat("yyyy/MM/");
    SimpleDateFormat sdNewFormat = new SimpleDateFormat("yyyy/MM/dd");
    Date newdate = new Date();
    StringBuffer sb = new StringBuffer();

    sb.append(sdFormat.format(date)).append(newDay);
    try {
      newdate = sdNewFormat.parse(sb.toString());
    } catch (ParseException e) {
      e.printStackTrace();
    }

    return newdate;
  }
}
