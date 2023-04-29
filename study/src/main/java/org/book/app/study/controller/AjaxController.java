package org.book.app.study.controller;

import java.util.List;
import java.util.Objects;
import org.book.app.study.api.ApiController;
import org.book.app.study.dto.data.BooksChartData;
import org.book.app.study.dto.file.SyukujitsuColumn;
import org.book.app.study.entity.Books;
import org.book.app.study.enums.type.BooksType;
import org.book.app.study.form.BooksForm;
import org.book.app.study.form.TemplatechartcolourForm;
import org.book.app.study.helper.BooksHelper;
import org.book.app.study.helper.ChartColourHelper;
import org.book.app.study.util.StudyDateUtil;
import org.book.app.study.util.StudyFileUtil;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import lombok.AllArgsConstructor;

/**
 * 図色確認画面で使用するajax応答クラス
 * 
 */
@Controller
@RequestMapping(value = "/ajax")
@AllArgsConstructor
public class AjaxController extends ApiController {

  /**
   * 家計簿 Helper
   */
  private final BooksHelper booksHelper;

  /**
   * 図の色 Helper
   */
  private final ChartColourHelper chartColourHelper;

  /**
   * 家計簿一覧画面内の1月ごとのカテゴリーごとの図用
   * 
   * @param form 送信されたデータ
   * @param model モデル
   * @param date 開いている画面の指定されている日付け
   * @return json(カテゴリーごとの家計簿情報)
   */
  @RequestMapping(value = "/thymeleaf/books/chart/byMonth/category", method = RequestMethod.POST)
  @ResponseBody
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
  @RequestMapping(value = "/thymeleaf/books/chart/byMonth/method", method = RequestMethod.POST)
  @ResponseBody
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
  @RequestMapping(value = "/thymeleaf/books/chart/byYear/all", method = RequestMethod.POST)
  @ResponseBody
  public BooksChartData chartByYearAll(@ModelAttribute BooksForm form, ModelAndView model) {
    return booksHelper.getChartDatatByYearAll(form.getDate());
  }

  /**
   * 祝日一覧の取得
   * 
   * @param form 送信されたデータ
   * @param model モデル
   * @param date 開いている画面の指定されている日付け
   * @return json(祝日一覧情報)
   */
  @RequestMapping(value = "/thymeleaf/books/calendar/syukujitsu", method = RequestMethod.POST)
  @ResponseBody
  public List<SyukujitsuColumn> calendarBySyukujitsu(@ModelAttribute BooksForm form,
      ModelAndView model) {
    // 祝日定義ファイルの取得
    ClassPathResource syukujitsuFile = new ClassPathResource("csv/syukujitsu.csv");
    List<SyukujitsuColumn> syukujitsuList =
        StudyFileUtil.csvFileToList(syukujitsuFile, SyukujitsuColumn.class, true);

    return syukujitsuList.stream()
        .filter(col -> Objects.equals(StudyDateUtil.getYearMonth(col.getDate()),
            StudyDateUtil.getYearMonth(form.getDate())))
        .toList();
  }

  /**
   * カレンダーで使用する日付けごとの料金一覧の取得
   * 
   * @pa.compareTo(ram form 送信されたデータ
   * @param model モデル
   * @param date 開いている画面の指定されている日付け
   * @return json(カレンダーで使用する日付けごとの料金一覧情報)
   */
  @RequestMapping(value = "/thymeleaf/books/calendar/AmountByDay", method = RequestMethod.POST)
  @ResponseBody
  public List<Books> calendarByDay(@ModelAttribute BooksForm form, ModelAndView model) {
    return booksHelper.findByMonthAndType(form.getDate(), BooksType.EXPENSES.getCode());
  }

  /**
   * 色見本の図用
   * 
   * @param form 送信されたデータ
   * @param result エラーチェック判定結果
   * @param model モデル
   * @param qty 指定するデータの個数
   * @return json(カテゴリーごとの家計簿情報)
   */
  @RequestMapping(value = "/chartColour/chart", method = RequestMethod.POST)
  @ResponseBody
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
  @RequestMapping(value = "/chartColour/confirm", method = RequestMethod.POST)
  @ResponseBody
  public BooksChartData chartColourBySeed(@ModelAttribute @Validated TemplatechartcolourForm form,
      ModelAndView model) {
    return chartColourHelper.getChartDataByCoeff(chartColourHelper.getQty(form.getQty()),
        form.getSeedCoeffR(), form.getSeedCoeffG(), form.getSeedCoeffB());
  }

}
