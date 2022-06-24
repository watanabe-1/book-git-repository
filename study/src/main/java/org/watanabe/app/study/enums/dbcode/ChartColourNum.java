package org.watanabe.app.study.enums.dbcode;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * chart_colour_num::図の色確認画面図色数のenumクラス
 */
@AllArgsConstructor
@Getter
public enum ChartColourNum implements DbCode {

  DEFALT_DATA_CNT("chart_colour_num", "defalt_data_cnt", "初期数"), MAX_DATA_CNT("chart_colour_num",
      "max_data_cnt", "最大数");

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
}
