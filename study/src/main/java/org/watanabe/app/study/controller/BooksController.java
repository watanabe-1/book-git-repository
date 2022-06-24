package org.watanabe.app.study.controller;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import org.watanabe.app.common.logger.LogIdBasedLogger;
import org.watanabe.app.study.entity.Books;
import org.watanabe.app.study.enums.type.BooksType;
import org.watanabe.app.study.form.BooksForm;
import org.watanabe.app.study.helper.BooksHelper;
import org.watanabe.app.study.service.BooksService;
import org.watanabe.app.study.util.StudyUtil;

/**
 * 家計簿コントローラ.
 *
 */
@Controller
public class BooksController {

  private static final LogIdBasedLogger logger = LogIdBasedLogger.getLogger(TopController.class);

  /**
   * 家計簿 Service
   */
  @Autowired
  private BooksService booksService;

  /**
   * 家計簿 Helper
   */
  @Autowired
  private BooksHelper booksHelper;

  /**
   * 家計簿登録画面
   * 
   * @param form 送信されたデータ
   * @param model モデル
   * @return 画面表示用モデル
   */
  @RequestMapping(value = "/books/input", method = RequestMethod.GET)
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
  @RequestMapping(value = "/books/result", method = RequestMethod.POST)
  public ModelAndView result(@ModelAttribute @Validated BooksForm form, BindingResult result,
      ModelAndView model) {

    // エラーがあったら画面に返す
    if (result.hasErrors()) {
      return input(form, model);
    }

    model.setViewName("/books/result");
    List<Books> booksList = new ArrayList<Books>();
    booksList = booksHelper.getBooksByCsv(form.getBooksFile(), form.getBooksType());
    // 取得したファイル内の日付の最小値、最大値、帳票タイプ(支出)に合わせて今登録済みの内容を削除
    booksService.deleteByBooksDateAndBooksTypeAndUserId(
        booksList.stream().min(Comparator.comparing(Books::getBooksDate)).get().getBooksDate(),
        booksList.stream().max(Comparator.comparing(Books::getBooksDate)).get().getBooksDate(),
        form.getBooksType(), StudyUtil.getLoginUser());
    booksService.saveBulk(booksList);

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
  @RequestMapping(value = "/books/list", method = RequestMethod.GET)
  public ModelAndView list(@ModelAttribute BooksForm form, ModelAndView model, Date date,
      String tab) {
    model.setViewName("books/list");

    // 日付がパラメーターで指定されていないとき
    if (date == null) {
      // 現在の日付を取得
      date = booksHelper.getStartDate(StudyUtil.getNowDate());
    }
    if (StudyUtil.isNullOrEmpty(tab)) {
      tab = booksHelper.getDefaltTab();
    }

    List<Books> booksByExpenses = booksService.findByBooksDateAndBooksTypeAndUserIdJoinCategory(
        booksHelper.getStartDate(date), booksHelper.getEndDate(date), BooksType.EXPENSES.getCode(),
        StudyUtil.getLoginUser());
    int sumAmountByExpenses =
        booksByExpenses.stream().mapToInt(book -> book.getBooksAmmount()).sum();
    List<Books> booksByIncome = booksService.findByBooksDateAndBooksTypeAndUserIdJoinCategory(
        booksHelper.getStartDate(date), booksHelper.getEndDate(date), BooksType.INCOME.getCode(),
        StudyUtil.getLoginUser());
    int sumAmountByIncome = booksByIncome.stream().mapToInt(book -> book.getBooksAmmount()).sum();
    model.addObject("bookslistByExpenses", booksByExpenses);
    model.addObject("bookslistByIncome", booksByIncome);
    model.addObject("sumAmountByExpenses", sumAmountByExpenses);
    model.addObject("sumAmountByIncome", sumAmountByIncome);
    model.addObject("differenceSumAmount", sumAmountByIncome - sumAmountByExpenses);
    model.addObject("date", date);
    model.addObject("nextDate", BooksHelper.getNextMonth(date));
    model.addObject("backDate", BooksHelper.getBackMonth(date));
    model.addObject("tab", tab);
    model.addObject(tab, "active");

    return model;
  }

}
