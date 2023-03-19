package org.book.app.study.enums.type;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NonNull;
import lombok.ToString;

/**
 * カテゴリーのタイプ
 */
@AllArgsConstructor
@Getter
@ToString(of = "code")
@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum CategoryType implements Type {

  TEST1("01", "テスト1"), TEST2("02", "テスト2");

  /**
   * コード
   */
  private final String code;

  /**
   * 名称
   */
  private final String name;

  /**
   * タイプ用に拡張したEnumのcode値から取得した拡張Enumを生成する
   *
   * @param code テーブルや定数として指定しているcode値
   * @return codeに一致するEnumクラス
   */
  public static CategoryType codeOf(@NonNull String code) {
    return Type.codeOf(CategoryType.class, code);
  }

  /**
   * タイプ用に拡張したEnumのname値から取得した拡張Enumを生成する
   *
   * @param name テーブルや定数として指定しているname値
   * @return nameに一致するEnumクラス
   */
  public static CategoryType nameOf(@NonNull String name) {
    return Type.nameOf(CategoryType.class, name);
  }
}
