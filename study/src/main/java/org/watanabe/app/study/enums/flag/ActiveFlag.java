package org.watanabe.app.study.enums.flag;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

/**
 * アクティブ
 */
@AllArgsConstructor
@Getter
@ToString(of = "value")
public enum ActiveFlag implements Flag {

  NON_ACTIVE(NON_SET_UP_FLAG_VALUE, "無効"), ACTIVE(SET_UP_FLAG_VALUE, "有効");

  /**
   * フラグの値
   */
  private final String value;

  /**
   * 名称
   */
  private final String name;

  /**
   * フラグが立っているか判定
   * 
   * @return true = 立っている flase = 立っていない
   */
  public static Boolean isActive(String value) {
    return Flag.isSetUp(value);
  }

  /**
   * フラグが立っていないか判定
   * 
   * @return true = 立っていない flase = 立っている
   */
  public static Boolean isNonActive(String value) {
    return Flag.isNonSetUp(value);
  }
}
