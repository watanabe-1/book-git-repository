package org.watanabe.app.study.util;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Map;
import java.util.Objects;
import org.springframework.web.util.UriUtils;

/**
 * 便利メソッドクラス
 */
public class StudyUtil {

  /**
   * 開始日
   */
  public static final String START = "start";

  /**
   * 終了日
   */
  public static final String END = "end";

  /**
   * null、もしくは空文字の判断を行う
   * 
   * @param value チェック対象
   * @return String nullもしくは空白の時にtrue それ以外はfalse
   */
  public static boolean isNullOrEmpty(String value) {
    if (value == null || value.isEmpty()) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * ベースのパスと追加のパスを結合し返却する
   * 
   * @param basePath ベースとなるパス
   * @param addPath 追加したいパス
   * @return String 結合したパス
   */
  public static String pathJoin(String basePath, String addPath) {

    final String SLASH = "/";
    final String ENMARK = "\\";
    StringBuffer sb = new StringBuffer();
    // 「/」が文字列の先頭ににあった場合そのまま結合、なければ「/」をはさんで結合
    if (addPath.indexOf(SLASH) == 0 || addPath.indexOf(ENMARK) == 0) {
      return sb.append(basePath).append(addPath).toString();
    } else {
      return sb.append(basePath).append(SLASH).append(addPath).toString();
    }
  }

  /**
   * 置換対象が文字列の先頭にあった場合のみ置換、それ以外は置換せずに返却
   * 
   * @param str 置換対象
   * @param target 置換文字列
   * @param addPath 置換語文字列
   * @return String 結合したパス
   */
  public static String replaceFirstOneLeft(String str, String target, String replaceMent) {

    // 置換対象が文字列の先頭ににあった場合のみ置換、それ以外は置換せずに返却
    if (Objects.equals(target.indexOf(replaceMent), 0)) {
      return str.replace(target, replaceMent);
    } else {
      return str;
    }

  }

  /**
   * 置換対象が文字列の最後尾にあった場合のみ置換、それ以外は置換せずに返却
   * 
   * @param str 置換対象
   * @param target 置換文字列
   * @param addPath 置換語文字列
   * @return String 結合したパス
   */
  public static String replaceFirstOneRight(String str, String target, String replaceMent) {

    // 置換対象が文字列の最後尾ににあった場合のみ置換、それ以外は置換せずに返却
    if (Objects.equals(target.lastIndexOf(replaceMent), replaceMent.length())) {
      return str.replace(target, replaceMent);
    } else {
      return str;
    }

  }

  /**
   * ログインユーザー名を取得する
   * 
   * @return String ログインユーザー名
   */
  public static String getLoginUser() {
    return "TEST";
  }

  /**
   * 共通ユーザー名を取得する
   * 
   * @return String 共通ユーザー名
   */
  public static String getCommonUser() {
    return "common";
  }

  /**
   * NoImage画像のコードを取得
   * 
   * @return String NoImage画像コード
   */
  public static String getNoImageCode() {
    return "no_image";
  }

  /**
   * 現在の日時を取得する
   * 
   * @return Date 現在の日付
   */
  public static Date getNowDate() {
    return new Date();
  }

  /**
   * 指定の日に置き換えて返却
   * 
   * @param Date 変更したい日付
   * @param String 置き換え先の日
   * @return Date 変換語の日付
   */
  public static Date changeDay(Date date, String newDay) {
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

  /**
   * 月初もしくは月末の日付けを取得
   * 
   * @param date 変更したい日付
   * @param type "START" or "END"
   * @return Date 変換語の日付
   */
  public static Date getEdgeDate(Date date, String type) {
    int amount = 1;
    if (START.equals(type)) {
      amount = -1;
    }
    SimpleDateFormat sdfMm = new SimpleDateFormat("MM");
    Date currentDate = date;
    String month = sdfMm.format(date);
    String currentMonth = month;
    int cnt = 0;
    // 無限ループ防止のため1000周以下の条件を追加
    while (cnt < 1000) {
      currentDate = StudyUtil.calculateDate(date, Calendar.DATE, amount);
      currentMonth = sdfMm.format(currentDate);
      if (month.equals(currentMonth)) {
        date = currentDate;
      } else {
        break;
      }
      cnt++;
    }

    return date;
  }

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
   * 文字列前後のダブルクォーテーションを削除するFunction
   * 
   * @param str 文字列
   * @return 前後のダブルクォーテーションを削除した文字列
   */
  public static String trimDoubleQuot(String str) {
    char c = '"';
    if (str.charAt(0) == c && str.charAt(str.length() - 1) == c) {
      return str.substring(1, str.length() - 1);
    } else {
      return str;
    }
  }

  /**
   * urlにセットするパラムを作成
   * 
   * @param param keyにパラム名、itemにvalue
   * @return String urlにセットするパラム
   */
  public static String CreateUrlParam(Map<String, String> param) {
    int index = 0;
    StringBuffer sb = new StringBuffer();
    for (String key : param.keySet()) {
      if (index == 0) {
        sb.append("?");
      } else {
        sb.append("&");
      }
      sb.append(key).append("=").append(param.get(key));
      index++;
    }
    return sb.toString();
  }

  public static String encodeUrlString(String target) {
    return UriUtils.encode(target, "UTF-8");
  }

}