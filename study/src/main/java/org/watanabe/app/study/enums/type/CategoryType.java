package org.watanabe.app.study.enums.type;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

/**
 * カテゴリーのタイプ
 */
@AllArgsConstructor
@Getter
@ToString(of = "code")
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
}
