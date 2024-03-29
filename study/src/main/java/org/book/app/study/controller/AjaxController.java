package org.book.app.study.controller;

import java.util.List;
import java.util.Objects;

import org.book.app.study.api.ApiController;
import org.book.app.study.dto.data.BooksChartData;
import org.book.app.study.dto.file.SyukujitsuColumn;
import org.book.app.study.entity.Books;
import org.book.app.study.enums.type.BooksType;
import org.book.app.study.form.BooksForm;
import org.book.app.study.form.TemplateChartcolourForm;
import org.book.app.study.helper.BooksHelper;
import org.book.app.study.helper.ChartColourHelper;
import org.book.app.study.util.StudyDateUtil;
import org.book.app.study.util.StudyFileUtil;
import org.springframework.core.io.ClassPathResource;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lombok.RequiredArgsConstructor;

/**
 * 図色確認画面で使用するajax応答クラス
 * 
 */
@RestController
@RequestMapping(value = "/ajax")
@RequiredArgsConstructor
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
  @PostMapping(value = "/thymeleaf/books/chart/byMonth/category")
  public BooksChartData chartByMonthCategory(@ModelAttribute BooksForm form, ModelAndView model) {
    return booksHelper.getChartDataByMonthCategory(StudyDateUtil.localDatetoLocalDateTime(form.getDate()));
  }

  /**
   * 家計簿一覧画面内の1月ごとの支払いごとの図用
   * 
   * @param form 送信されたデータ
   * @param model モデル
   * @param date 開いている画面の指定されている日付け
   * @return json(支払いごとの家計簿情報)
   */
  @PostMapping(value = "/thymeleaf/books/chart/byMonth/method")
  public BooksChartData chartByMonthMethod(@ModelAttribute BooksForm form, ModelAndView model) {
    return booksHelper.getChartDataByMonthMethod(StudyDateUtil.localDatetoLocalDateTime(form.getDate()));
  }

  /**
   * 家計簿一覧画面内の1年ごとの図用
   * 
   * @param form 送信されたデータ
   * @param model モデル
   * @param date 開いている画面の指定されている日付け
   * @return json(カテゴリーごとの家計簿情報)
   */
  @PostMapping(value = "/thymeleaf/books/chart/byYear/all")
  public BooksChartData chartByYearAll(@ModelAttribute BooksForm form, ModelAndView model) {
    return booksHelper.getChartDatatByYearAll(StudyDateUtil.localDatetoLocalDateTime(form.getDate()));
  }

  /**
   * 祝日一覧の取得
   * 
   * @param form 送信されたデータ
   * @param model モデル
   * @param date 開いている画面の指定されている日付け
   * @return json(祝日一覧情報)
   */
  @PostMapping(value = "/thymeleaf/books/calendar/syukujitsu")
  public List<SyukujitsuColumn> calendarBySyukujitsu(@ModelAttribute BooksForm form,
      ModelAndView model) {
    // 祝日定義ファイルの取得
    ClassPathResource syukujitsuFile = new ClassPathResource("csv/syukujitsu.csv");
    List<SyukujitsuColumn> syukujitsuList = StudyFileUtil.csvFileToList(syukujitsuFile, SyukujitsuColumn.class, true);

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
  @PostMapping(value = "/thymeleaf/books/calendar/AmountByDay")
  public List<Books> calendarByDay(@ModelAttribute BooksForm form, ModelAndView model) {
    return booksHelper.findByMonthAndType(
        StudyDateUtil.localDatetoLocalDateTime(form.getDate()), BooksType.EXPENSES.getCode());
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
  @PostMapping(value = "/thymeleaf/chartColour/chart")
  public BooksChartData chartColourByActive(@ModelAttribute @Validated TemplateChartcolourForm form,
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
  @PostMapping(value = "/thymeleaf/chartColour/confirm")
  public BooksChartData chartColourBySeed(@ModelAttribute @Validated TemplateChartcolourForm form,
      ModelAndView model) {
    return chartColourHelper.getChartDataByCoeff(chartColourHelper.getQty(form.getQty()),
        form.getSeedCoeffR(), form.getSeedCoeffG(), form.getSeedCoeffB());
  }

}
