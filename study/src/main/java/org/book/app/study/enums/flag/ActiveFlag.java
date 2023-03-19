package org.book.app.study.enums.flag;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NonNull;
import lombok.ToString;

/**
 * アクティブ
 */
@AllArgsConstructor
@Getter
@ToString(of = "value")
@JsonFormat(shape = JsonFormat.Shape.OBJECT)
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

  /**
   * value値から適応する拡張Enumを生成する
   *
   * @param value テーブルや定数として指定しているvalue値
   * @return valueに一致するEnumクラス
   */
  public static ActiveFlag valueOf(@NonNull Object value) {
    return Flag.valueOf(ActiveFlag.class, value);
  }

  /**
   * name値から適応する拡張Enumを生成する
   *
   * @param name テーブルや定数として指定しているname値
   * @return nameに一致するEnumクラス
   */
  public static ActiveFlag nameOf(@NonNull String name) {
    return Flag.nameOf(ActiveFlag.class, name);
  }
}
