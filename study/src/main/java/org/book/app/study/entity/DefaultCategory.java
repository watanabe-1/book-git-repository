package org.book.app.study.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

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
   * デフォルトカテゴリーID
   */
  private String defaultCategoryId;

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
   * 金額(最小値)(金額(最小値) マイナスの場合は検索対象から除外)
   */
  private Integer booksAmmountMin;

  /**
   * 金額(最大値)(金額(最大値) マイナスの場合は検索対象から除外)
   */
  private Integer booksAmmountMax;

  /**
   * カテゴリーコード
   */
  private String catCode;

  /**
   * 優先度(優先順(昇順))
   */
  private Integer priority;

  /**
   * 正規表現使用可否(正規表現使用可否 1 = 使用 それ以外 = 使用しない)
   */
  private String regexEnabled;

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

}
