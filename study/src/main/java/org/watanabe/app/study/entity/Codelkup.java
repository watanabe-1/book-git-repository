package org.watanabe.app.study.entity;

import java.util.Date;
import lombok.Data;

/**
 * CODELKUP:コードルックアップ(コード定義テーブル(明細))のentityクラス
 */
@Data
public class Codelkup {

  /**
   * シリアルキー
   */
  private String serialKey;

  /**
   * リストネーム
   */
  private String listName;

  /**
   * コード
   */
  private String code;

  /**
   * 説明
   */
  private String description;

  /**
   * 値(短)(コードに対する値(短縮形)を設定)
   */
  private String shortValue;

  /**
   * 値(長)(コードに対する値(全文)を設定)
   */
  private String longValue;

  /**
   * 編集可否(編集可否 1 = 可能 それ以外 = 不可)
   */
  private String editable;

  /**
   * 有効化フラグ(有効化フラグ 1 = 有効 それ以外 = 無効)
   */
  private String active;

  /**
   * シークエンス(コードリストに対する子コード同士の順番を定義)
   */
  private Integer sequence;

  /**
   * 備考(なんでも)1
   */
  private String udf1;

  /**
   * 備考(なんでも)2
   */
  private String udf2;

  /**
   * 備考(なんでも)3
   */
  private String udf3;

  /**
   * 備考(なんでも)4
   */
  private String udf4;

  /**
   * 備考(なんでも)5
   */
  private String udf5;

  /**
   * 備考(なんでも)6
   */
  private String udf6;

  /**
   * 備考(なんでも)7
   */
  private String udf7;

  /**
   * メモ
   */
  private String note;

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

