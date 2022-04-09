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
import org.watanabe.app.study.form.BooksForm;
import org.watanabe.app.study.helper.BooksHelper;
import org.watanabe.app.study.service.BooksService;
import org.watanabe.app.study.util.StudyUtil;

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
   * /books/listのデフォルトのタブ
   */
  private final String DEFALT_TAB = "tab1";

  @RequestMapping(value = "/books/input", method = RequestMethod.GET)
  public ModelAndView input(@ModelAttribute BooksForm form, ModelAndView model) {
    model.setViewName("books/input");

    return model;
  }

  @RequestMapping(value = "/books/result", method = RequestMethod.POST)
  public ModelAndView result(@ModelAttribute @Validated BooksForm form, BindingResult result,
      ModelAndView model) {

    // エラーがあったら画面に返す
    if (result.hasErrors()) {
      return input(form, model);
    }

    model.setViewName("/books/result");
    List<Books> booksList = new ArrayList<Books>();
    booksList = booksHelper.getBooksByRakutenCsv(form.getBooksFile());
    // 取得したファイル内の日付の最小値、最大値、帳票タイプ(支出)に合わせて今登録済みの内容を削除
    booksService.deleteByBooksDateAndBooksType(
        booksList.stream().min(Comparator.comparing(Books::getBooksDate)).get().getBooksDate(),
        booksList.stream().max(Comparator.comparing(Books::getBooksDate)).get().getBooksDate(),
        BooksHelper.BOOKS_TYPE_EXPENSES);
    booksService.saveBulk(booksList);

    return model;

  }


  @RequestMapping(value = "/books/list", method = RequestMethod.GET)
  public ModelAndView list(@ModelAttribute BooksForm form, ModelAndView model, Date date,
      String tab) {
    model.setViewName("books/list");

    // 日付がパラメーターで指定されていないとき
    if (date == null) {
      // 現在の日付を取得
      date = StudyUtil.getNowDate();
    }
    if (StudyUtil.isNullOrEmpty(tab)) {
      tab = DEFALT_TAB;
    }
    List<Books> books =
        booksService.findByBooksDateAndBooksTypeJoinCategory(booksHelper.getStartDate(date),
            booksHelper.getEndDate(date), BooksHelper.BOOKS_TYPE_EXPENSES);
    model.addObject("bookslist", books);
    model.addObject("sumAmount", books.stream().mapToInt(book -> book.getBooksAmmount()).sum());
    model.addObject("date", date);
    model.addObject("nextDate", booksHelper.getNextMonth(date));
    model.addObject("backDate", booksHelper.getBackMonth(date));
    model.addObject("tab", tab);
    model.addObject(tab, "active");
    /*
     * Map<String, String> nextParm = new HashMap<>(); nextParm.put("date",
     * booksHelper.getNextMonth(date)); nextParm.put("tab", tab); model.addObject("nextParm",
     * StudyUtil.CreateUrlParam(nextParm)); Map<String, String> backParm = new HashMap<>();
     * backParm.put("date", booksHelper.getBackMonth(date)); backParm.put("tab", tab);
     * model.addObject("backParm", StudyUtil.CreateUrlParam(backParm)); model.addObject(tab,
     * "active");
     */
    return model;
  }

}