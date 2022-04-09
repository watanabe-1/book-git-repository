package org.watanabe.app.rest.controller;

import java.util.ArrayList;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import org.watanabe.app.common.logger.LogIdBasedLogger;
import org.watanabe.app.study.form.TemplatechartcolourForm;
import org.watanabe.app.study.form.rest.BooksChartByMonthData;
import org.watanabe.app.study.form.rest.BooksChartByMonthDatasets;
import org.watanabe.app.study.helper.ChartColourHelper;
import org.watanabe.app.study.service.TemplatechartcolourService;

@RestController
public class ChartColourRestController {

  private static final LogIdBasedLogger logger =
      LogIdBasedLogger.getLogger(ChartColourRestController.class);

  /**
   * チャート色テンプレート Service
   */
  @Autowired
  private TemplatechartcolourService TemplatechartcolourService;

  /**
   * チャート色テンプレート Helper
   */
  @Autowired
  private ChartColourHelper chartColourHelper;

  /**
   * 図に表紙する色確認用データの個数
   */
  private final int DEFALT_DATA_CNT = 20;


  /**
   * 色見本の図用
   * 
   * @param qty 指定するデータの個数
   * @return json(カテゴリーごとの家計簿情報)
   */
  @RequestMapping(value = "/chartColour/rest/chart", method = RequestMethod.POST)
  public BooksChartByMonthData chartColourByActive(
      @ModelAttribute @Validated TemplatechartcolourForm form, BindingResult result,
      ModelAndView model, Integer qty) {

    if (qty == null || qty == 0 || qty > 1000) {
      qty = DEFALT_DATA_CNT;
    }

    BooksChartByMonthDatasets bddd = new BooksChartByMonthDatasets();
    bddd.setBackgroundColor(chartColourHelper.getActiveRgbaList(qty, (float) 0.5));
    bddd.setBorderColor(chartColourHelper.getActiveRgbaList(qty, (float) 1));
    bddd.setData(chartColourHelper.getDummyChartData(qty));

    List<BooksChartByMonthDatasets> dataSets = new ArrayList<>();
    dataSets.add(bddd);

    BooksChartByMonthData bdd = new BooksChartByMonthData();
    bdd.setLabels(chartColourHelper.getDummyChartDataLable(qty));
    bdd.setDatasets(dataSets);
    return bdd;
  }

  /**
   * 色見本の登録時の確認用
   * 
   * @param qty 指定するデータの個数
   * @return json(カテゴリーごとの家計簿情報)
   */
  @RequestMapping(value = "/chartColour/rest/confirm", method = RequestMethod.POST)
  public BooksChartByMonthData chartColourBySeed(
      @ModelAttribute @Validated TemplatechartcolourForm form, ModelAndView model, Integer qty) {

    if (qty == null || qty == 0 || qty > 1000) {
      qty = DEFALT_DATA_CNT;
    }

    BooksChartByMonthDatasets bddd = new BooksChartByMonthDatasets();
    bddd.setBackgroundColor(chartColourHelper.getRgbaList(qty, (float) 0.5, form.getSeedCoeffR(),
        form.getSeedCoeffG(), form.getSeedCoeffB()));
    bddd.setBorderColor(chartColourHelper.getRgbaList(qty, (float) 1, form.getSeedCoeffR(),
        form.getSeedCoeffG(), form.getSeedCoeffB()));
    bddd.setData(chartColourHelper.getDummyChartData(qty));

    List<BooksChartByMonthDatasets> dataSets = new ArrayList<>();
    dataSets.add(bddd);

    BooksChartByMonthData bdd = new BooksChartByMonthData();
    bdd.setLabels(chartColourHelper.getDummyChartDataLable(qty));
    bdd.setDatasets(dataSets);
    return bdd;
  }

}
