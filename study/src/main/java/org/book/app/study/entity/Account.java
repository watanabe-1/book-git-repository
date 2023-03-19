package org.book.app.study.entity;

import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 * ACCOUNT:アカウント(アカウント情報保持テーブル)のentityクラス
 */
@Data
public class Account implements Serializable, Entity {

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
  private Date insDate;

  /**
   * 登録ユーザー
   */
  private String insUser;

  /**
   * 更新日時
   */
  private Date updDate;

  /**
   * 更新ユーザー
   */
  private String updUser;

}
