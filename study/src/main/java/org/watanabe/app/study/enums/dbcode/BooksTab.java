package org.watanabe.app.study.enums.dbcode;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * books_tab:家計簿画面タブのenumクラス
 */
@AllArgsConstructor
@Getter
public enum BooksTab implements DbCode {

  DEFALT_TAB("books_tab", "defalt_tab", "初期表示");

  /**
   * リストネーム
   */
  private final String listName;

  /**
   * コード
   */
  private final String code;

  /**
   * 説明
   */
  private final String description;
}
