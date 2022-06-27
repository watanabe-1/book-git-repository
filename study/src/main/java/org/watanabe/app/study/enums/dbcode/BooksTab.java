package org.watanabe.app.study.enums.dbcode;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NonNull;

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

  /**
   * listName値から適応するEnumを生成する
   * @param listName テーブルや定数として指定しているlistName
   * @return listNameに一致するEnumクラス
   */
  public static BooksTab listNameOf(@NonNull String listName) {
    return DbCode.listNameOf(BooksTab.class, listName);
  }

  /**
   * code値から適応するEnumを生成する
   * @param code テーブルや定数として指定しているcode
   * @return codeに一致するEnumクラス
   */
  public static BooksTab codeOf(@NonNull String code) {
    return DbCode.codeOf(BooksTab.class, code);
  }

  /**
   * description値から適応するEnumを生成する
   * @param description テーブルや定数として指定しているdescription
   * @return descriptionに一致するEnumクラス
   */
  public static BooksTab descriptionOf(@NonNull String description) {
    return DbCode.descriptionOf(BooksTab.class, description);
  }
}