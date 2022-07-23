package org.watanabe.app.study.controller;

import java.util.Date;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.servlet.ModelAndView;
import org.terasoluna.gfw.common.exception.BusinessException;
import org.watanabe.app.study.column.BooksChartData;
import org.watanabe.app.study.column.ErrorResults;
import org.watanabe.app.study.column.SyukujitsuColumn;
import org.watanabe.app.study.entity.Books;
import org.watanabe.app.study.enums.type.BooksType;
import org.watanabe.app.study.form.BooksForm;
import org.watanabe.app.study.form.TemplatechartcolourForm;
import org.watanabe.app.study.helper.BooksHelper;
import org.watanabe.app.study.helper.ChartColourHelper;
import org.watanabe.app.study.util.StudyDateUtil;
import org.watanabe.app.study.util.StudyFileUtil;

/**
 * 図色確認画面で使用するajax応答クラス
 * 
 */
@Controller
@RequestMapping(value = "/ajax")
public class AjaxController {

  /**
   * メッセージソース
   */
  @Autowired
  MessageSource messageSource;

  /**
   * 家計簿 Helper
   */
  @Autowired
  private BooksHelper booksHelper;

  /**
   * 図の色 Helper
   */
  @Autowired
  private ChartColourHelper chartColourHelper;

  /**
   * 家計簿一覧画面内の1月ごとのカテゴリーごとの図用
   * 
   * @param form 送信されたデータ
   * @param model モデル
   * @param date 開いている画面の指定されている日付け
   * @return json(カテゴリーごとの家計簿情報)
   */
  @RequestMapping(value = "/books/chart/byMonth/category", method = RequestMethod.POST)
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
  @RequestMapping(value = "/books/chart/byMonth/method", method = RequestMethod.POST)
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
  @RequestMapping(value = "/books/chart/byYear/all", method = RequestMethod.POST)
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
  @RequestMapping(value = "/books/calendar/syukujitsu", method = RequestMethod.POST)
  @ResponseBody
  public List<SyukujitsuColumn> calendarBySyukujitsu(@ModelAttribute BooksForm form,
      ModelAndView model, Date date) {
    // 祝日定義ファイルの取得
    ClassPathResource syukujitsuFile = new ClassPathResource("csv/syukujitsu.csv");
    List<SyukujitsuColumn> syukujitsuList =
        StudyFileUtil.csvFileToList(syukujitsuFile, SyukujitsuColumn.class, true);

    return syukujitsuList.stream().filter(col -> Objects
        .equals(StudyDateUtil.getYearMonth(col.getDate()), StudyDateUtil.getYearMonth(date)))
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
  @RequestMapping(value = "/books/calendar/AmountByDay", method = RequestMethod.POST)
  @ResponseBody
  public List<Books> calendarByDay(@ModelAttribute BooksForm form, ModelAndView model, Date date) {
    return booksHelper.findByMonthAndType(date, BooksType.EXPENSES.getCode());
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

  /**
   * BindException エラーハンドリング<br/>
   * リクエストパラメータとして送信したデータをJavaBeanにバインドする際に、<br/>
   * 入力値に不正な値が指定された場合に発生する例外クラス
   * 
   * @param e BindException
   * @param locale ロケール
   */
  @ExceptionHandler(BindException.class)
  @ResponseStatus(value = HttpStatus.BAD_REQUEST)
  @ResponseBody
  public ErrorResults handleBindException(BindException e, Locale locale) {
    // エラー情報を返却するためのJavaBeanを生成し、返却
    ErrorResults errorResults = new ErrorResults();
    addErrResult(e, locale, errorResults);

    return errorResults;
  }

  /**
   * BusinessException エラーハンドリング<br/>
   * 
   * 業務エラーの例外クラス
   * 
   * @param e MethodArgumentNotValidException
   * @param locale ロケール
   */
  @ExceptionHandler(BusinessException.class)
  @ResponseStatus(value = HttpStatus.CONFLICT)
  @ResponseBody
  public ErrorResults handleHttpBusinessException(BusinessException e, Locale locale) {
    ErrorResults errorResults = new ErrorResults();

    // implement error handling.
    // omitted

    // addErrResult(e, locale, errorResults);

    return errorResults;
  }

  /**
   * MethodArgumentNotValidException エラーハンドリング<br/>
   * 
   * [@RequestBody] アノテーションを使用してリクエストBodyに格納されているデータを<br/>
   * JavaBeanにバインドする際に、入力値に不正な値が指定された場合に発生する例外クラス
   * 
   * @param e MethodArgumentNotValidException
   * @param locale ロケール
   */
  @ExceptionHandler(MethodArgumentNotValidException.class)
  @ResponseStatus(value = HttpStatus.BAD_REQUEST)
  @ResponseBody
  public ErrorResults handleMethodArgumentNotValidException(MethodArgumentNotValidException e,
      Locale locale) {
    ErrorResults errorResults = new ErrorResults();
    addErrResult(e, locale, errorResults);

    return errorResults;
  }


  /**
   * HttpMessageNotReadableException エラーハンドリング<br/>
   * 
   * [@RequestBody]アノテーションを使用してリクエストBodyに格納されているデータを<br/>
   * JavaBeanにバインドする際に、Bodyに格納されているデータからJavaBeanを生成できなかった場合に<br/>
   * する例外クラス
   * 
   * @param e MethodArgumentNotValidException
   * @param locale ロケール
   */
  @ExceptionHandler(HttpMessageNotReadableException.class)
  @ResponseStatus(value = HttpStatus.BAD_REQUEST)
  @ResponseBody
  public ErrorResults handleHttpMessageNotReadableException(HttpMessageNotReadableException e,
      Locale locale) {
    ErrorResults errorResults = new ErrorResults();

    // addErrResult(e, locale, errorResults);

    return errorResults;
  }

  /**
   * BindExceptionのエラー結果をエラー保持用javabeenにセットを行う
   * 
   * @param e BindException
   * @param locale ロケール
   * @param errorResults セット対象
   */
  private void addErrResult(BindException e, Locale locale, ErrorResults errorResults) {
    for (FieldError fieldError : e.getBindingResult().getFieldErrors()) {
      errorResults.add(fieldError.getCode(), messageSource.getMessage(fieldError, locale),
          fieldError.getField());
    }
    for (ObjectError objectError : e.getBindingResult().getGlobalErrors()) {
      errorResults.add(objectError.getCode(), messageSource.getMessage(objectError, locale),
          objectError.getObjectName());
    }
  }

}
