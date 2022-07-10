package org.watanabe.app.study.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Date;
import java.util.Map;
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
