package org.book.app.study.enums.type;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NonNull;
import lombok.ToString;

/**
 * ファイルの種類
 */
@AllArgsConstructor
@Getter
@ToString(of = "code")
@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum FileType implements Type {

  SUICA("01", "Suica(PDF)");

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
  public static FileType codeOf(@NonNull String code) {
    return Type.codeOf(FileType.class, code);
  }

  /**
   * タイプ用に拡張したEnumのname値から取得した拡張Enumを生成する
   *
   * @param name テーブルや定数として指定しているname値
   * @return nameに一致するEnumクラス
   */
  public static FileType nameOf(@NonNull String name) {
    return Type.nameOf(FileType.class, name);
  }
}
