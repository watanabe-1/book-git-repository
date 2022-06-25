package org.watanabe.app.study.enums.type;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NonNull;
import lombok.ToString;

/**
 * 家計簿の種類
 */
@AllArgsConstructor
@Getter
@ToString(of = "code")
public enum BooksType implements Type {

  INCOME("01", "収入"), EXPENSES("02", "支出");

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
  public static BooksType codeOf(@NonNull Object code) {
    return Type.codeOf(BooksType.class, code);
  }

  /**
   * タイプ用に拡張したEnumのname値から取得した拡張Enumを生成する
   *
   * @param name テーブルや定数として指定しているcode値
   * @return nameに一致するEnumクラス
   */
  public static BooksType nameOf(@NonNull String name) {
    return Type.nameOf(BooksType.class, name);
  }
}
