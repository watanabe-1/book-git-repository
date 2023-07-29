package org.book.app.study.entity;

import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 * DEFAULT_CATEGORY:デフォルトカテゴリー(家計簿につける項目ごとのデフォルトカテゴリーを設定)のentityクラス
 */
@Data
public class DefaultCategory implements Serializable, Entity {

  /**
   * シリアルキー
   */
  private String serialKey;

  /**
   * ユーザーID
   */
  private String userId;

  /**
   * 場所(収入元、購入先)
   */
  private String booksPlace;

  /**
   * 帳簿の種類(収入、支出を選ぶ)
   */
  private String booksType;

  /**
   * 方法(受け取り方、支払い方)
   */
  private String booksMethod;

  /**
   * カテゴリーコード
   */
  private String catCode;

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

