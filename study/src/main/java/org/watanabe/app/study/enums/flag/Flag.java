package org.watanabe.app.study.enums.flag;

import java.util.Objects;

/**
 * フラグの定義
 */
interface Flag {

  /**
   * フラグが立っている時の値
   */
  public final String SET_UP_FLAG_VALUE = "1";

  /**
   * フラグが立っていない時の値
   */
  public final String NON_SET_UP_FLAG_VALUE = "0";


  /**
   * フラグの値を取得します.
   * 
   * @return フラグの値
   */
  public String getValue();

  /**
   * 状態を取得します.
   * 
   * @return 状態の名称
   */
  public String getName();

  /**
   * フラグが立っているか判定
   * 
   * @param value 判定対象
   * @return true = 立っている flase = 立っていない
   */
  public static Boolean isSetUp(String value) {
    return Objects.equals(SET_UP_FLAG_VALUE, value);
  };

  /**
   * フラグが立っているか判定
   *
   * @param flag 判定基準
   * @param value 判定対象
   * @return true = 立っている flase = 立っていない
   */
  public static Boolean isSetUp(Flag flag, String value) {
    return Objects.equals(flag.getValue(), value);
  }

  /**
   * フラグが立っていないか判定
   * 
   * @param value 判定対象
   * @return true = 立っていない flase = 立っている
   */
  public static Boolean isNonSetUp(String value) {
    return Objects.equals(NON_SET_UP_FLAG_VALUE, value);
  }

  /**
   * フラグが立っていないか判定
   * 
   * @param flag 判定基準
   * @param value 判定対象
   * @return true = 立っていない flase = 立っている
   */
  public static Boolean isNonSetUp(Flag flag, String value) {
    return Objects.equals(flag.getValue(), value);
  }

}
