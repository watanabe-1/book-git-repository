package org.book.app.study.form;

import java.io.Serializable;
import lombok.Data;

/**
 * DEFAULT_CATEGORY:デフォルトカテゴリー(家計簿につける項目ごとのデフォルトカテゴリーを設定)のformクラス
 */
@Data
public class DefaultCategoryForm implements Serializable, Form {

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
   * 削除フラグ
   */
  private String delete;

  /**
   * ssr判定
   */
  private String ssr;

}

