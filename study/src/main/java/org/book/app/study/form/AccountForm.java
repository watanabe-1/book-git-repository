package org.book.app.study.form;

import java.io.Serializable;
import java.time.LocalDateTime;

import lombok.Data;

/**
 * ACCOUNT:アカウント(アカウント情報保持テーブル)のformクラス
 */
@Data
public class AccountForm implements Serializable, Form {

  /**
   * シリアルキー
   */
  private String serialKey;

  /**
   * ユーザーID
   */
  private String userId;

  /**
   * パスワード
   */
  private String password;

  /**
   * ユーザー名
   */
  private String userName;

  /**
   * アカウント種別
   */
  private String accountType;

  /**
   * 登録日時
   */
  private LocalDateTime insDate;

  /**
   * 登録ユーザー
   */
  private String insUser;

  /**
   * 更新日時
   */
  private LocalDateTime updDate;

  /**
   * 更新ユーザー
   */
  private String updUser;

  /**
   * ssr判定
   */
  private String ssr;
}
