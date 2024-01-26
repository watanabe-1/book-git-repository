package org.book.app.study.controller.thymeleaf;

import java.util.Date;
import java.util.List;

import org.book.app.study.dto.file.BooksColumn;
import org.book.app.study.entity.Books;
import org.book.app.study.enums.type.BooksType;
import org.book.app.study.form.BooksForm;
import org.book.app.study.form.BooksInputForm;
import org.book.app.study.helper.BooksHelper;
import org.book.app.study.service.BooksService;
import org.book.app.study.util.StudyDateUtil;
import org.book.app.study.util.StudyModelUtil;
import org.book.app.study.util.StudyStringUtil;
import org.book.app.study.util.StudyUtil;
import org.book.app.study.view.DownloadCsvView;
import org.springframework.beans.BeanUtils;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;

import lombok.RequiredArgsConstructor;

/**
 * 家計簿コントローラ.
 *
 */
@Controller
@RequiredArgsConstructor
public class BooksThymeleafController {

  /**
   * 家計簿 Service
   */
  private final BooksService booksService;

  /**
   * 家計簿 Helper
   */
  private final BooksHelper booksHelper;

  /**
   * 家計簿登録画面
   * 
   * @param form 送信されたデータ
   * @param model モデル
   * @return 画面表示用モデル
   */
  @RequestMapping(value = "/thymeleaf/books/input", method = RequestMethod.GET)
  public ModelAndView input(@ModelAttribute BooksForm form, ModelAndView model) {
    model.setViewName("books/input");
    model.addObject("booksTypes", BooksType.values());

    return model;
  }

  /**
   * 家計簿登録結果画面
   * 
   * @param form 送信されたデータ
   * @param result エラーチェック結果
   * @param model モデル
   * @return 画面表示用モデル
   */
  @RequestMapping(value = "/thymeleaf/books/result", method = RequestMethod.POST)
  public ModelAndView result(@ModelAttribute @Validated @NonNull BooksInputForm form, BindingResult result,
      ModelAndView model) {
    BooksForm booksForm = new BooksForm();
    BeanUtils.copyProperties(form, booksForm);

    // エラーがあったら画面に返す
    if (result.hasErrors()) {
      return input(booksForm, model);
    }

    model.setViewName("books/result");
    List<Books> booksList = booksHelper.csvToBooksList(form.getBooksFile(), form.getBooksType());
    // 取得したファイル内の日付の最小値、最大値、帳票タイプ(支出)に合わせて今登録済みの内容を削除
    booksService.deleteByBooksDateAndBooksTypeAndUserId(
        booksHelper.getMinBooksDate(booksList),
        booksHelper.getMaxBooksDate(booksList),
        form.getBooksType(), StudyUtil.getLoginUser());
    booksService.saveBulk(booksList);

    return model;
  }

  /**
   * 家計簿出力画面
   * 
   * @param form 送信されたデータ
   * @param model モデル
   * @return 画面表示用モデル
   */
  @RequestMapping(value = "/thymeleaf/books/export", method = RequestMethod.GET)
  public ModelAndView export(@ModelAttribute BooksForm form, ModelAndView model) {
    model.setViewName("books/export");

    List<Books> booksList = booksService.findByUserId(StudyUtil.getLoginUser());

    model.addObject("booksYears", StudyDateUtil.getbetweenYears(
        booksHelper.getMinBooksDate(booksList),
        booksHelper.getMaxBooksDate(booksList)));
    model.addObject("booksTypes", BooksType.values());

    return model;
  }

  /**
   * 家計簿ダウンロード
   * 
   * @param form 送信されたデータ
   * @param model モデル
   * @return beenView名(viewパッケージ配下に定義)
   */
  @RequestMapping(value = "/thymeleaf/books/download", method = RequestMethod.POST)
  public ModelAndView download(@ModelAttribute BooksForm form, ModelAndView model) {
    model.setViewName(StudyStringUtil.getlowerCaseFirstClassName(DownloadCsvView.class));

    String fileNameType = StudyStringUtil.isNullOrEmpty(form.getBooksYear()) ? "ALL" : form.getBooksYear();
    List<BooksColumn> columnList = booksHelper.booksListToBooksColumnList(
        booksHelper.finByYearAndType(form.getBooksYear(), form.getBooksType()));

    model.addObject(StudyModelUtil.MODEL_KEY_FILE_NAME, String.format("家計簿_%s_%s",
        BooksType.codeOf(form.getBooksType()).getName(), fileNameType));
    model.addObject(StudyModelUtil.MODEL_KEY_FILE_DATA, columnList);
    model.addObject(StudyModelUtil.MODEL_KEY_FILE_DATA_CLASS, BooksColumn.class);

    return model;
  }

  /**
   * 家計簿一覧画面
   * 
   * @param form 送信されたデータ
   * @param model モデル
   * @param date 日付け
   * @return 画面表示用モデル
   */
  @RequestMapping(value = "/thymeleaf/books/index", method = RequestMethod.GET)
  public ModelAndView list(@ModelAttribute BooksForm form, ModelAndView model) {
    model.setViewName("books/index");
    Date date = form.getDate() == null ? StudyDateUtil.getStartDateByMonth(StudyUtil.getNowDate())
        : form.getDate();
    String tab = StudyStringUtil.isNullOrEmpty(form.getTab()) ? booksHelper.getDefaltTab() : form.getTab();

    List<Books> booksByExpenses = booksHelper.findByMonthAndType(date, BooksType.EXPENSES.getCode());
    List<Books> booksByIncome = booksHelper.findByMonthAndType(date, BooksType.INCOME.getCode());
    int sumAmountByExpenses = booksHelper.sumAmount(booksByExpenses);
    int sumAmountByIncome = booksHelper.sumAmount(booksByIncome);

    model.addObject("bookslistByExpenses", booksByExpenses);
    model.addObject("bookslistByIncome", booksByIncome);
    model.addObject("sumAmountByExpenses", sumAmountByExpenses);
    model.addObject("sumAmountByIncome", sumAmountByIncome);
    model.addObject("differenceSumAmount", sumAmountByIncome - sumAmountByExpenses);
    model.addObject("date", date);
    model.addObject("nextDate", StudyDateUtil.getNextMonth(date));
    model.addObject("backDate", StudyDateUtil.getBackMonth(date));
    model.addObject("tab", tab);
    model.addObject(tab == null ? "" : tab, "active");

    return model;
  }

}
