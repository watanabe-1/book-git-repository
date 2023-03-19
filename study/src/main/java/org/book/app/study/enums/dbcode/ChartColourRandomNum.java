package org.book.app.study.enums.dbcode;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NonNull;

/**
 * chart_colour_random_num:図の色確認画面ランダム表示数のenumクラス
 */
@AllArgsConstructor
@Getter
@JsonFormat(shape = JsonFormat.Shape.OBJECT)
public enum ChartColourRandomNum implements DbCode {

  RANDOM_DATA_CNT("chart_colour_random_num", "random_data_cnt", "表示数");

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
  public static ChartColourRandomNum listNameOf(@NonNull String listName) {
    return DbCode.listNameOf(ChartColourRandomNum.class, listName);
  }

  /**
   * code値から適応するEnumを生成する
   * 
   * @param code テーブルや定数として指定しているcode
   * @return codeに一致するEnumクラス
   */
  public static ChartColourRandomNum codeOf(@NonNull String code) {
    return DbCode.codeOf(ChartColourRandomNum.class, code);
  }

  /**
   * description値から適応するEnumを生成する
   * 
   * @param description テーブルや定数として指定しているdescription
   * @return descriptionに一致するEnumクラス
   */
  public static ChartColourRandomNum descriptionOf(@NonNull String description) {
    return DbCode.descriptionOf(ChartColourRandomNum.class, description);
  }
}
