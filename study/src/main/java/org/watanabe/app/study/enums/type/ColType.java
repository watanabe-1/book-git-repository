package org.watanabe.app.study.enums.type;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NonNull;
import lombok.ToString;

/**
 * 画像の種類
 */
@AllArgsConstructor
@Getter
@ToString(of = "code")
@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum ColType implements Type {

  STRING("STRING", "文字列"), IMAGE("IMAGE", "画像"), INPUT("INPUT", "入力ボックス"), CHECK("CHECK",
      "チェックボックス"), SELECT("SELECT", "セレクトボックス"), RADIO("RADIO", "ラジオボタン");

  /**
   * コード
   */
  private final String code;

  /**
   * 名称
   */
  private final String name;

  /**
   * タイプ用に拡張したEnumのcode値から取得した拡張Enumを生成する
   *
   * @param code テーブルや定数として指定しているcode値
   * @return codeに一致するEnumクラス
   */
  public static ColType codeOf(@NonNull String code) {
    return Type.codeOf(ColType.class, code);
  }

  /**
   * タイプ用に拡張したEnumのname値から取得した拡張Enumを生成する
   *
   * @param name テーブルや定数として指定しているname値
   * @return nameに一致するEnumクラス
   */
  public static ColType nameOf(@NonNull String name) {
    return Type.nameOf(ColType.class, name);
  }
}
