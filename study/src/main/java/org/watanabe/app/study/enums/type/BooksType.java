package org.watanabe.app.study.enums.type;

import lombok.AllArgsConstructor;
import lombok.Getter;
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
}
