package org.book.app.study.enums.dbcode;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NonNull;

/**
 * chart_colour_tab:図の色確認画面タブのenumクラス
 */
@AllArgsConstructor
@Getter
@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum ChartColourTab implements DbCode {

  DEFALT_TAB("chart_colour_tab", "defalt_tab", "初期表示"), RESULT_TAB("chart_colour_tab", "result_tab", "保存後表示");

  /**
   * リストネーム
   */
  private final String listName;

  /**
   * コード
   */
  private final String code;

  /**
   * 説明
   */
  private final String description;

  /**
   * listName値から適応するEnumを生成する
   * 
   * @param listName テーブルや定数として指定しているlistName
   * @return listNameに一致するEnumクラス
   */
  public static ChartColourTab listNameOf(@NonNull String listName) {
    return DbCode.listNameOf(ChartColourTab.class, listName);
  }

  /**
   * code値から適応するEnumを生成する
   * 
   * @param code テーブルや定数として指定しているcode
   * @return codeに一致するEnumクラス
   */
  public static ChartColourTab codeOf(@NonNull String code) {
    return DbCode.codeOf(ChartColourTab.class, code);
  }

  /**
   * description値から適応するEnumを生成する
   * 
   * @param description テーブルや定数として指定しているdescription
   * @return descriptionに一致するEnumクラス
   */
  public static ChartColourTab descriptionOf(@NonNull String description) {
    return DbCode.descriptionOf(ChartColourTab.class, description);
  }
}
