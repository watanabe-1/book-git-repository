package org.book.app.study.util;

import java.util.Date;
import org.springframework.security.core.context.SecurityContextHolder;
import org.book.app.study.service.AppUserDetails;

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
    AppUserDetails userDetails = (AppUserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    // ログインユーザーのユーザーIDを取得
    return userDetails.getAccount().getUserId();
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

}
