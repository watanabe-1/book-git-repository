package org.watanabe.app.rest.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import org.watanabe.app.common.logger.LogIdBasedLogger;
import org.watanabe.app.study.column.BooksChartData;
import org.watanabe.app.study.controller.TopController;
import org.watanabe.app.study.form.BooksForm;
import org.watanabe.app.study.helper.BooksHelper;

/**
 * 家計簿画面で使用するajax応答クラス
 * 
 */
@RestController
public class BooksRestController {

  private static final LogIdBasedLogger logger = LogIdBasedLogger.getLogger(TopController.class);

  /**
   * 家計簿 Helper
   */
  @Autowired
  private BooksHelper booksHelper;

  /**
   * 家計簿一覧画面内の1月ごとのカテゴリーごとの図用
   * 
   * @param form 送信されたデータ
   * @param model モデル
   * @param date 開いている画面の指定されている日付け
   * @return json(カテゴリーごとの家計簿情報)
   */
  @RequestMapping(value = "/books/rest/chart/byMonth/category", method = RequestMethod.POST)
  public BooksChartData chartByMonthCategory(@ModelAttribute BooksForm form, ModelAndView model) {
    return booksHelper.getChartDataByMonthCategory(form.getDate());
  }

  /**
   * 家計簿一覧画面内の1月ごとの支払いごとの図用
   * 
   * @param form 送信されたデータ
   * @param model モデル
   * @param date 開いている画面の指定されている日付け
   * @return json(支払いごとの家計簿情報)
   */
  @RequestMapping(value = "/books/rest/chart/byMonth/method", method = RequestMethod.POST)
  public BooksChartData chartByMonthMethod(@ModelAttribute BooksForm form, ModelAndView model) {
    return booksHelper.getChartDataByMonthMethod(form.getDate());
  }

  /**
   * 家計簿一覧画面内の1年ごとの図用
   * 
   * @param form 送信されたデータ
   * @param model モデル
   * @param date 開いている画面の指定されている日付け
   * @return json(カテゴリーごとの家計簿情報)
   */
  @RequestMapping(value = "/books/rest/chart/byYear/all", method = RequestMethod.POST)
  public BooksChartData chartByYearAll(@ModelAttribute BooksForm form, ModelAndView model) {
    return booksHelper.getChartDatatByYearAll(form.getDate());
  }



}
