package org.watanabe.app.study.enums.dbcode;

import lombok.AllArgsConstructor;
import lombok.Getter;

/**
 * chart_colour_tab:図の色確認画タブのenumクラス
 */
@AllArgsConstructor
@Getter
public enum ChartColourTab implements DbCode {

  DEFALT_TAB("chart_colour_tab", "defalt_tab", "初期表示"), RESULT_TAB("chart_colour_tab", "result_tab",
      "保存後表示");

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
