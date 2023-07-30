package org.book.app.study.enums.dbcode;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NonNull;

/**
 * default_category_target:デフォルトカテゴリー置き換え対象カテゴリーのenumクラス
 */
@AllArgsConstructor
@Getter
@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum DefaultCategoryTarget implements DbCode {

  CATEGORY1("default_category_target", "category1", "対象カテゴリー1");

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
  public static DefaultCategoryTarget listNameOf(@NonNull String listName) {
    return DbCode.listNameOf(DefaultCategoryTarget.class, listName);
  }

  /**
   * code値から適応するEnumを生成する
   * @param code テーブルや定数として指定しているcode
   * @return codeに一致するEnumクラス
   */
  public static DefaultCategoryTarget codeOf(@NonNull String code) {
    return DbCode.codeOf(DefaultCategoryTarget.class, code);
  }

  /**
   * description値から適応するEnumを生成する
   * @param description テーブルや定数として指定しているdescription
   * @return descriptionに一致するEnumクラス
   */
  public static DefaultCategoryTarget descriptionOf(@NonNull String description) {
    return DbCode.descriptionOf(DefaultCategoryTarget.class, description);
  }
}