package org.book.app.study.enums.type;

import java.util.Arrays;
import java.util.Objects;
import lombok.NonNull;

/**
 * タイプの定義
 */
interface Type {

  /**
   * コードを取得します.
   * 
   * @return コード
   */
  public String getCode();

  /**
   * 名称を取得します.
   * 
   * @return 名称
   */
  public String getName();

  /**
   * タイプ用に拡張したEnumのcode値から取得した拡張Enumを生成する
   *
   * @param <E>      Typeで拡張したEnumClass
   * @param enumType 生成対象となるEnumClassの型となるClass
   * @param code     テーブルや定数として指定しているcode値
   * @return codeに一致するEnumクラス
   */
  public static <E extends Enum<E> & Type> E codeOf(Class<E> enumType, @NonNull String code) {
    return Arrays.stream(enumType.getEnumConstants())
        .filter(type -> Objects.equals(type.getCode(), code))
        .findFirst()
        .orElseThrow((() -> new IllegalArgumentException("enum class has not code : " + code)));
  }

  /**
   * タイプ用に拡張したEnumのname値から取得した拡張Enumを生成する
   *
   * @param <E>      Typeで拡張したEnumClass
   * @param enumType 生成対象となるEnumClassの型となるClass
   * @param property propertiesの検索に使用するname
   * @return nameに一致するEnumクラス
   */
  public static <E extends Enum<E> & Type> E nameOf(Class<E> enumType, @NonNull String name) {
    return Arrays.stream(enumType.getEnumConstants())
        .filter(type -> Objects.equals(type.getName(), name))
        .findFirst()
        .orElseThrow((() -> new IllegalArgumentException("enum class has not name : " + name)));
  }
}
