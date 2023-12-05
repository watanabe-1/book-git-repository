package org.book.app.study.api.js;

import org.book.app.study.api.ChartColourApiController;
import org.book.app.study.util.StudyStringUtil;
import org.springframework.stereotype.Component;
import lombok.AllArgsConstructor;

/**
 * 色確認画面情報js用取得クラス
 *
 */
@Component
@AllArgsConstructor
public class ChartColourApi extends CommonApi {

  /**
   * カテゴリー画面api
   */
  private final ChartColourApiController chartColourApiController;

  /**
   * 画面情報取得
   * 
   * @return 画面情報
   */
  public String getInfo() {
    return StudyStringUtil.objectToJsonStr(chartColourApiController.getInfo());
  }

  /**
   * 画面リスト情報取得
   * 
   * @return 画面リスト情報
   */
  public String getListData() {
    return StudyStringUtil.objectToJsonStr(chartColourApiController.getListData());
  }

  /**
   * 画面リスト情報取得
   * 
   * @param qty 個数
   * @return 画面リスト情報
   */
  public String getChartColourByActive(Integer qty) {
    return StudyStringUtil.objectToJsonStr(chartColourApiController.getChartColourByActive(qty));
  }

}
