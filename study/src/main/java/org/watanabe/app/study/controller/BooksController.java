package org.watanabe.app.study.controller;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import org.watanabe.app.common.logger.LogIdBasedLogger;
import org.watanabe.app.study.column.BooksColumn;
import org.watanabe.app.study.entity.Books;
import org.watanabe.app.study.enums.type.BooksType;
import org.watanabe.app.study.form.BooksForm;
import org.watanabe.app.study.helper.BooksHelper;
import org.watanabe.app.study.helper.DownloadHelper;
import org.watanabe.app.study.service.BooksService;
import org.watanabe.app.study.util.StudyUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.dataformat.csv.CsvGenerator;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;

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
   * ファイルダウンロード Helper
   */
  @Autowired
  DownloadHelper downloadHelper;

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
   * 家計簿出力画面
   * 
   * @param form 送信されたデータ
   * @param model モデル
   * @return 画面表示用モデル
   */
  @RequestMapping(value = "/books/export", method = RequestMethod.GET)
  public ModelAndView export(@ModelAttribute BooksForm form, ModelAndView model) {
    model.setViewName("books/export");

    List<Books> booksList = booksService.findByUserId(StudyUtil.getLoginUser());

    model.addObject("booksYears", booksHelper.getbetweenYears(
        booksList.stream().min(Comparator.comparing(Books::getBooksDate)).get().getBooksDate(),
        booksList.stream().max(Comparator.comparing(Books::getBooksDate)).get().getBooksDate()));
    model.addObject("booksTypes", BooksType.values());

    return model;
  }

  /**
   * 家計簿ダウンロード
   * 
   * @param form 送信されたデータ
   * @param model モデル
   * @return ダウンロードデータ
   * @throws JsonProcessingException
   * @throws UnsupportedEncodingException
   */
  @RequestMapping(value = "/books/download", method = RequestMethod.POST)
  public ResponseEntity<byte[]> download(@ModelAttribute BooksForm form)
      throws JsonProcessingException, UnsupportedEncodingException {
    List<Books> booksList = new ArrayList<>();
    String baseFileName = "";

    if (StudyUtil.isNullOrEmpty(form.getBooksYear())) {
      booksList = booksService.findByBooksTypeAndUserIdJoinCategory(form.getBooksType(),
          StudyUtil.getLoginUser());
      baseFileName = "ALL";
    } else {
      SimpleDateFormat sdFormat = new SimpleDateFormat("yyyy");
      Date date = new Date();

      try {
        date = sdFormat.parse(form.getBooksYear());
      } catch (ParseException e) {
        e.printStackTrace();
      }

      booksList = booksService.findByBooksDateAndBooksTypeAndUserIdJoinCategory(date,
          booksHelper.getEndDateByYear(date), form.getBooksType(), StudyUtil.getLoginUser());
      baseFileName = form.getBooksYear();
    }

    SimpleDateFormat booksDateFormat = new SimpleDateFormat("yyyy/MM/dd");
    List<BooksColumn> columnList = booksList.stream()
        .map(e -> new BooksColumn(booksDateFormat.format(e.getBooksDate()), e.getBooksPlace(),
            e.getCatCodes().getCatName(), e.getBooksMethod(), String.valueOf(e.getBooksAmmount())))
        .collect(Collectors.toList());

    CsvMapper mapper = new CsvMapper();
    // 文字列にダブルクオートをつける
    mapper.configure(CsvGenerator.Feature.ALWAYS_QUOTE_STRINGS, true);
    // ヘッダをつける
    CsvSchema schema = mapper.schemaFor(BooksColumn.class).withHeader();

    StringBuffer sb = new StringBuffer();
    sb.append("家計簿_").append(BooksType.codeOf(form.getBooksType()).getName()).append("_")
        .append(baseFileName).append(".csv");

    HttpHeaders headers = new HttpHeaders();
    downloadHelper.addContentDisposition(headers, sb.toString());

    return new ResponseEntity<>(
        mapper.writer(schema).writeValueAsString(columnList).getBytes(StandardCharsets.UTF_8),
        headers, HttpStatus.OK);
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
      date = booksHelper.getStartDateByMonth(StudyUtil.getNowDate());
    }
    if (StudyUtil.isNullOrEmpty(tab)) {
      tab = booksHelper.getDefaltTab();
    }

    List<Books> booksByExpenses = booksService.findByBooksDateAndBooksTypeAndUserIdJoinCategory(
        booksHelper.getStartDateByMonth(date), booksHelper.getEndDateByMonth(date),
        BooksType.EXPENSES.getCode(), StudyUtil.getLoginUser());
    int sumAmountByExpenses =
        booksByExpenses.stream().mapToInt(book -> book.getBooksAmmount()).sum();
    List<Books> booksByIncome = booksService.findByBooksDateAndBooksTypeAndUserIdJoinCategory(
        booksHelper.getStartDateByMonth(date), booksHelper.getEndDateByMonth(date),
        BooksType.INCOME.getCode(), StudyUtil.getLoginUser());
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
