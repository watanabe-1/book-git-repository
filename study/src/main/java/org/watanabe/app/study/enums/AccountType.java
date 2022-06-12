package org.watanabe.app.study.enums;

public enum AccountType {

  SYSTEM("01", "システム管理者", "ROLE_SYSTEM"), ADMIN("02", "管理者", "ROLE_ADMIN"), USER("03", "一般ユーザ",
      "ROLE_USER");

  /* コード. */
  private final String code;

  /* 名称. */
  private final String name;

  /* ロール. */
  private final String role;

  private AccountType(String code, String name, String role) {
    this.code = code;
    this.name = name;
    this.role = role;
  }

  /**
   * コードを取得します.
   * 
   * @return コード
   */
  public String getCode() {
    return code;
  }

  /**
   * 名称を取得します.
   * 
   * @return 名称
   */
  public String getName() {
    return name;
  }

  /**
   * ロールを取得します.
   * 
   * @return ロール
   */
  public String getRole() {
    return role;
  }

  @Override
  public String toString() {
    return code;
  }
}
