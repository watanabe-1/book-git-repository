package org.watanabe.app.study.enums.type;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

/**
 * アカウント権限
 */
@AllArgsConstructor
@Getter
@ToString(of = "code")
public enum AccountType implements Type {

  SYSTEM("01", "システム管理者", "ROLE_SYSTEM"), ADMIN("02", "管理者", "ROLE_ADMIN"), USER("03", "一般ユーザ",
      "ROLE_USER");

  /**
   * コード
   */
  private final String code;

  /**
   * 名称
   */
  private final String name;

  /**
   * ロール
   */
  private final String role;
}
