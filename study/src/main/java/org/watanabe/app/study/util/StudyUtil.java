package org.watanabe.app.study.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Map;
import java.util.Objects;
import org.mozilla.universalchardet.UniversalDetector;
import org.springframework.core.io.ClassPathResource;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.multipart.MultipartFile;
import org.terasoluna.gfw.common.exception.BusinessException;
import org.terasoluna.gfw.common.message.ResultMessages;
import org.watanabe.app.study.service.AppUserDetails;

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
   * ログインユーザーIdを取得する
   * 
   * @return String ログインユーザーId
   */
  public static String getLoginUser() {
    AppUserDetails userDetails =
        (AppUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    return userDetails.getAccount().getUserId();// get logged in userId
  }

  /**
   * 共通ユーザーIdを取得する
   * 
   * @return String 共通ユーザーId
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
   * 初もしくは末の日付けを取得
   * 
   * @param date 変更したい日付
   * @param type "start" or "end"
   * @param field 計算したい日付の種類(年、月、日、時間、分) Calendar.YEARなどを利用して指定
   * @return Date 変換語の日付
   */
  public static Date getEdgeDate(Date date, String type, int dateType) {
    int amount = 1;
    if (START.equals(type)) {
      amount = -1;
    }
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
      currentDate = StudyUtil.calculateDate(date, field, amount);
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

    return str.charAt(0) == c && str.charAt(str.length() - 1) == c
        ? str.substring(1, str.length() - 1)
        : str;
  }

  /**
   * urlにセットするパラムを作成
   * 
   * @param param keyにパラム名、itemにvalue
   * @return String urlにセットするパラム
   */
  public static String createUrlParam(Map<String, String> param) {
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

  /**
   * ファイルの文字コードを判定
   * 
   * @param MultipartFile アップロードされたfileデータ
   * @return result 文字コード
   */
  public static String detectFileEncoding(MultipartFile file) {
    String result = null;

    try (InputStream fis = file.getInputStream()) {
      result = detectFileEncoding(fis);
    } catch (IOException e) {
      throw new BusinessException(ResultMessages.error().add("1.01.01.1001"));
    }

    return result;
  }

  /**
   * ファイルの文字コードを判定
   * 
   * @param file アップロードされたfileデータ
   * @return result 文字コード
   */
  public static String detectFileEncoding(File file) {
    String result = null;

    try (InputStream fis = new FileInputStream(file)) {
      result = detectFileEncoding(fis);
    } catch (IOException e) {
      throw new BusinessException(ResultMessages.error().add("1.01.01.1001"));
    }

    return result;
  }

  /**
   * ファイルの文字コードを判定
   * 
   * @param ClassPathResource fileデータ
   * @return result 文字コード
   */
  public static String detectFileEncoding(ClassPathResource file) {
    String result = null;

    try (InputStream fis = file.getInputStream()) {
      result = detectFileEncoding(fis);
    } catch (IOException e) {
      throw new BusinessException(ResultMessages.error().add("1.01.01.1001"));
    }

    return result;
  }

  /**
   * ファイルの文字コードを判定
   * 
   * @param InputStream fileのInputStream
   * @return result 文字コード
   */
  public static String detectFileEncoding(InputStream fis) {
    String result = null;
    byte[] buf = new byte[4096];

    try {
      UniversalDetector detector = new UniversalDetector(null);
      int nread;
      while ((nread = fis.read(buf)) > 0 && !detector.isDone()) {
        detector.handleData(buf, 0, nread);
      }
      detector.dataEnd();
      result = detector.getDetectedCharset();
      detector.reset();
    } catch (IOException e) {
      throw new BusinessException(ResultMessages.error().add("1.01.01.1001"));
    }

    return result;
  }

}
