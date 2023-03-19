package org.book.app.study.enums.dbcode;

import java.util.Arrays;
import java.util.Objects;
import lombok.NonNull;

/**
 * コードの定義
 */
interface DbCode {

  /**
   * リストネームを取得します.
   * 
   * @return リストネーム
   */
  public String getListName();

  /**
   * コードを取得します.
   * 
   * @return コード
   */
  public String getCode();

  /**
   * 説明を取得します.
   * 
   * @return 説明
   */
  public String getDescription();

  /**
   * タイプ用に拡張したEnumのlistName値から取得した拡張Enumを生成する
   *
   * @param <E>      Typeで拡張したEnumClass
   * @param enumType 生成対象となるEnumClassの型となるClass
   * @param listName listNameの検索に使用するname
   * @return listNameに一致するEnumクラス
   */
  public static <E extends Enum<E> & DbCode> E listNameOf(Class<E> enumType,
      @NonNull String listName) {
    return Arrays.stream(enumType.getEnumConstants())
        .filter(type -> Objects.equals(type.getListName(), listName)).findFirst().orElseThrow(
            (() -> new IllegalArgumentException("enum class has not listName : " + listName)));
  }

  /**
   * タイプ用に拡張したEnumのcode値から取得した拡張Enumを生成する
   *
   * @param <E>      Typeで拡張したEnumClass
   * @param enumType 生成対象となるEnumClassの型となるClass
   * @param code     テーブルや定数として指定しているcode値
   * @return codeに一致するEnumクラス
   */
  public static <E extends Enum<E> & DbCode> E codeOf(Class<E> enumType, @NonNull Object code) {
    return Arrays.stream(enumType.getEnumConstants())
        .filter(type -> Objects.equals(type.getCode(), code))
        .findFirst()
        .orElseThrow((() -> new IllegalArgumentException("enum class has not code : " + code)));
  }

  /**
   * タイプ用に拡張したEnumのcode値から取得した拡張Enumを生成する
   *
   * @param <E>         Typeで拡張したEnumClass
   * @param enumType    生成対象となるEnumClassの型となるClass
   * @param description テーブルや定数として指定している説明
   * @return descriptionに一致するEnumクラス
   */
  public static <E extends Enum<E> & DbCode> E descriptionOf(Class<E> enumType,
      @NonNull Object description) {
    return Arrays.stream(enumType.getEnumConstants())
        .filter(type -> Objects.equals(type.getDescription(), description)).findFirst()
        .orElseThrow((() -> new IllegalArgumentException(
            "enum class has not description : " + description)));
  }
}
