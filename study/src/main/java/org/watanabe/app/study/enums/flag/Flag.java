package org.watanabe.app.study.enums.flag;

import java.util.Arrays;
import java.util.Objects;
import lombok.NonNull;

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

  /**
   * タイプ用に拡張したEnumのcode値から取得した拡張Enumを生成する
   *
   * @param <E> Typeで拡張したEnumClass
   * @param enumType 生成対象となるEnumClassの型となるClass
   * @param value テーブルや定数として指定しているcode値
   * @return valueに一致するEnumクラス
   */
  public static <E extends Enum<E> & Flag> E valueOf(Class<E> enumType, @NonNull Object value) {
    return Arrays.stream(enumType.getEnumConstants()).filter(type -> type.getValue().equals(value))
        .findFirst()
        .orElseThrow((() -> new IllegalArgumentException("enum class has not value : " + value)));
  }

  /**
   * タイプ用に拡張したEnumのname値から取得した拡張Enumを生成する
   *
   * @param <E> Typeで拡張したEnumClass
   * @param enumType 生成対象となるEnumClassの型となるClass
   * @param property propertiesの検索に使用するname
   * @return nameに一致するEnumクラス
   */
  public static <E extends Enum<E> & Flag> E nameOf(Class<E> enumType, @NonNull String name) {
    return Arrays.stream(enumType.getEnumConstants()).filter(type -> type.getName().equals(name))
        .findFirst()
        .orElseThrow((() -> new IllegalArgumentException("enum class has not name : " + name)));
  }
}
