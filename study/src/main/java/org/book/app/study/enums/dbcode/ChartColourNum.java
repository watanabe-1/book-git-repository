package org.book.app.study.enums.dbcode;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NonNull;

/**
 * chart_colour_num:図の色確認画面図色数のenumクラス
 */
@AllArgsConstructor
@Getter
@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum ChartColourNum implements DbCode {

  DEFALT_DATA_CNT("chart_colour_num", "defalt_data_cnt", "初期数"),
  MAX_DATA_CNT("chart_colour_num", "max_data_cnt", "最大数");

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
  public static ChartColourNum listNameOf(@NonNull String listName) {
    return DbCode.listNameOf(ChartColourNum.class, listName);
  }

  /**
   * code値から適応するEnumを生成する
   * 
   * @param code テーブルや定数として指定しているcode
   * @return codeに一致するEnumクラス
   */
  public static ChartColourNum codeOf(@NonNull String code) {
    return DbCode.codeOf(ChartColourNum.class, code);
  }

  /**
   * description値から適応するEnumを生成する
   * 
   * @param description テーブルや定数として指定しているdescription
   * @return descriptionに一致するEnumクラス
   */
  public static ChartColourNum descriptionOf(@NonNull String description) {
    return DbCode.descriptionOf(ChartColourNum.class, description);
  }
}
