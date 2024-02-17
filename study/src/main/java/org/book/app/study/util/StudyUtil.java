package org.book.app.study.util;

import java.time.LocalDateTime;
import java.util.Optional;

import org.book.app.study.service.AppUserDetails;
import org.springframework.lang.Nullable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContext;
import org.springframework.security.core.context.SecurityContextHolder;

/**
 * 便利メソッドクラス
 */
public class StudyUtil {

  /**
   * ログインユーザーIdを取得する
   * ユーザが取得できなかった時はノーユーザ(デフォルトユーザ)を返却する
   * 
   * @return String ログインユーザーId
   */
  public static String getLoginUser() {
    // ログインユーザーのユーザーIDを取得
    return Optional.ofNullable(SecurityContextHolder.getContext())
        .map(SecurityContext::getAuthentication)
        .map(StudyUtil::getUserIdFromAuthentication)
        .orElseGet(() -> getNoUser());
  }

  /**
   * ログインユーザーIdを認証情報から取得
   * 認証情報がnullであることも考慮
   * 
   * @param authentication
   * @return
   */
  private static String getUserIdFromAuthentication(@Nullable Authentication authentication) {
    if (authentication == null || authentication.getPrincipal() == null) {
      return null;
    }

    if (authentication.getPrincipal() instanceof AppUserDetails userDetails) {
      return userDetails.getAccount().getUserId();
    }

    return null;
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
  * ユーザが存在しないときのデフォルトユーザを取得する
  * 
  * @return String デフォルトユーザId
  */
  public static String getNoUser() {
    return "no_user";
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
  public static LocalDateTime getNowDate() {
    return LocalDateTime.now();
  }

}
