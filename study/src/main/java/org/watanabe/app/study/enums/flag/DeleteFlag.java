package org.watanabe.app.study.enums.flag;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

/**
 * 削除フラグ
 */
@AllArgsConstructor
@Getter
@ToString(of = "value")
public enum DeleteFlag implements Flag {

  NON_DELETE(NON_SET_UP_FLAG_VALUE, "削除しない"), DELETE(SET_UP_FLAG_VALUE, "削除する");

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
  public static Boolean isDelete(String value) {
    return Flag.isSetUp(value);
  }

  /**
   * フラグが立っていないか判定
   * 
   * @return true = 立っていない flase = 立っている
   */
  public static Boolean isNonDelete(String value) {
    return Flag.isNonSetUp(value);
  }
}
