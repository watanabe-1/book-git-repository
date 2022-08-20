package org.watanabe.app.study.enums.type;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NonNull;
import lombok.ToString;

/**
 * アカウント権限
 */
@AllArgsConstructor
@Getter
@ToString(of = "code")
@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum AccountType implements Type {

  SYSTEM("01", "システム管理者", "SYSTEM"), ADMIN("02", "管理者", "ADMIN"), USER("03", "一般ユーザ", "USER");

  /**
   * コード
   */
  private final String code;

  /**
   * 名称
   */
  private final String name;

  /**
   * ロールのベース
   */
  private final String baseRole;

  /**
   * ロールを返却
   * 
   * @return
   */
  public String getRole() {
    return new StringBuffer().append("ROLE_").append(this.baseRole).toString();
  }

  /**
   * タイプ用に拡張したEnumのcode値から取得した拡張Enumを生成する
   *
   * @param code テーブルや定数として指定しているcode値
   * @return codeに一致するEnumクラス
   */
  public static AccountType codeOf(@NonNull String code) {
    return Type.codeOf(AccountType.class, code);
  }

  /**
   * タイプ用に拡張したEnumのname値から取得した拡張Enumを生成する
   *
   * @param name テーブルや定数として指定しているname値
   * @return nameに一致するEnumクラス
   */
  public static AccountType nameOf(@NonNull String name) {
    return Type.nameOf(AccountType.class, name);
  }
}
