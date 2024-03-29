package org.book.app.study.entity;

import java.io.Serializable;
import java.time.LocalDateTime;

import lombok.Data;

/**
 * CODELIST:コードリスト(コード定義テーブル(ヘッダー))のentityクラス
 */
@Data
public class CodeList implements Serializable, Entity {

  /**
   * シリアルキー
   */
  private String serialKey;

  /**
   * リストネーム
   */
  private String listName;

  /**
   * 説明
   */
  private String description;

  /**
   * 編集可否(編集可否 1 = 可能 それ以外 = 不可)
   */
  private String editable;

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
