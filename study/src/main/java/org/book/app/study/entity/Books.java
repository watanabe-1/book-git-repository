package org.book.app.study.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import lombok.Data;

/**
 * BOOKS:家計簿(家計簿データ保存テーブル)のentityクラス
 */
@Data
public class Books implements Serializable, Entity {

  /**
   * シリアルキー
   */
  private String serialKey;

  /**
   * 家計簿ID
   */
  private String booksId;

  /**
   * ユーザーID
   */
  private String userId;

  /**
   * 帳簿の種類(収入、支出を選ぶ)
   */
  private String booksType;

  /**
   * 日付(収入日、購入日)
   */
  private LocalDateTime booksDate;

  /**
   * 場所(収入元、購入先)
   */
  private String booksPlace;

  /**
   * カテゴリーコード
   */
  private String catCode;

  /**
   * 方法(受け取り方、支払い方)
   */
  private String booksMethod;

  /**
   * 金額
   */
  private Integer booksAmmount;

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
   * カテゴリークラスの要素(親1対子1).
   */
  private Category catCodes;

}
