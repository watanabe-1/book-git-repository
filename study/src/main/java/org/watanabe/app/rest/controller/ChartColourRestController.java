package org.watanabe.app.rest.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import org.watanabe.app.common.logger.LogIdBasedLogger;
import org.watanabe.app.study.column.BooksChartData;
import org.watanabe.app.study.form.TemplatechartcolourForm;
import org.watanabe.app.study.helper.ChartColourHelper;

/**
 * 図色確認画面で使用するajax応答クラス
 * 
 */
@RestController
public class ChartColourRestController {

  private static final LogIdBasedLogger logger =
      LogIdBasedLogger.getLogger(ChartColourRestController.class);

  /**
   * 図の色 Helper
   */
  @Autowired
  private ChartColourHelper chartColourHelper;

  /**
   * 色見本の図用
   * 
   * @param form 送信されたデータ
   * @param result エラーチェック判定結果
   * @param model モデル
   * @param qty 指定するデータの個数
   * @return json(カテゴリーごとの家計簿情報)
   */
  @RequestMapping(value = "/chartColour/rest/chart", method = RequestMethod.POST)
  public BooksChartData chartColourByActive(@ModelAttribute @Validated TemplatechartcolourForm form,
      BindingResult result, ModelAndView model) {
    return chartColourHelper.getActiveChartData(chartColourHelper.getQty(form.getQty()));
  }

  /**
   * 色見本の登録時の確認用
   * 
   * @param form 送信されたデータ
   * @param model モデル
   * @param qty 指定するデータの個数
   * @return json(カテゴリーごとの家計簿情報)
   */
  @RequestMapping(value = "/chartColour/rest/confirm", method = RequestMethod.POST)
  public BooksChartData chartColourBySeed(@ModelAttribute @Validated TemplatechartcolourForm form,
      ModelAndView model) {
    return chartColourHelper.getChartDataByCoeff(chartColourHelper.getQty(form.getQty()),
        form.getSeedCoeffR(), form.getSeedCoeffG(), form.getSeedCoeffB());
  }

}
