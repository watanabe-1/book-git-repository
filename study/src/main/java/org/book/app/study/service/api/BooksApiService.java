package org.book.app.study.service.api;

import java.util.Date;
import java.util.List;
import java.util.Objects;
import org.book.app.study.dto.file.SyukujitsuColumn;
import org.book.app.study.dto.ui.books.BooksUi;
import org.book.app.study.dto.ui.books.HouseholdCalendarUi;
import org.book.app.study.dto.ui.books.HouseholdChartUi;
import org.book.app.study.dto.ui.books.HouseholdUi;
import org.book.app.study.entity.Books;
import org.book.app.study.enums.type.BooksType;
import org.book.app.study.form.BooksForm;
import org.book.app.study.helper.BooksHelper;
import org.book.app.study.service.BooksService;
import org.book.app.study.util.StudyDateUtil;
import org.book.app.study.util.StudyFileUtil;
import org.book.app.study.util.StudyStringUtil;
import org.book.app.study.util.StudyUtil;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

/**
 * 家計簿画面情報取得用サービス
 *
 */
@Service
@RequiredArgsConstructor
public class BooksApiService {

  /**
   * 家計簿 Service
   */
  private final BooksService booksService;

  /**
   * 家計簿 Helper
   */
  private final BooksHelper booksHelper;

  /**
   * アップロード画面情報取得
   * 
   * @return 画面情報
   */
  public BooksUi getUploadInfo() {
    BooksUi ui = new BooksUi();
    ui.setForm(new BooksForm());
    ui.setBooksTypes(BooksType.values());

    return ui;
  }

  /**
   * ダウンロード画面情報取得
   * 
   * @return 画面情報
   */
  public BooksUi getDownloadInfo() {
    BooksUi ui = getUploadInfo();
    List<Books> booksList = booksService.findByUserId(StudyUtil.getLoginUser());

    ui.setBooksYears(StudyDateUtil.getbetweenYears(
        booksHelper.getMinBooksDate(booksList),
        booksHelper.getMaxBooksDate(booksList)));

    return ui;
  }

  /**
   * 家計簿確認画面情報取得
   * 
   * @param form booksForm
   * @return 画面情報
   */
  public HouseholdUi getHouseholdInfo(BooksForm form) {
    HouseholdUi ui = new HouseholdUi();
    Date date = form.getDate() == null ? StudyUtil.getNowDate() : form.getDate();
    String tab =
        StudyStringUtil.isNullOrEmpty(form.getTab()) ? booksHelper.getDefaltTab() : form.getTab();
    List<Books> booksByExpenses =
        booksHelper.findByMonthAndType(date, BooksType.EXPENSES.getCode());
    List<Books> booksByIncome = booksHelper.findByMonthAndType(date, BooksType.INCOME.getCode());
    ui.setYear(StudyDateUtil.getYearOfStr(date));
    ui.setMonth(StudyDateUtil.getMonthOfStr(date));
    ui.setDay(StudyDateUtil.getDayOfStr(date));
    ui.setExpensesList(booksByExpenses);
    ui.setIncomeList(booksByIncome);
    ui.setTab(tab);

    return ui;
  }

  /**
   * 家計簿確認画面図情報取得
   * 
   * @param form booksForm
   * @return 画面情報
   */
  public HouseholdChartUi getHouseholdChartInfo(BooksForm form) {
    HouseholdChartUi ui = new HouseholdChartUi();
    Date date = form.getDate() == null ? StudyUtil.getNowDate() : form.getDate();
    ui.setMonthCategory(booksHelper
        .getChartDataByMonthCategory(date));
    ui.setMonthMethod(booksHelper
        .getChartDataByMonthMethod(date));
    ui.setYearAll(booksHelper
        .getChartDatatByYearAll(date));

    return ui;
  }

  /**
   * 家計簿確認画面カレンダー情報取得
   * 
   * @param form booksForm
   * @return 画面情報
   */
  public HouseholdCalendarUi getHouseholdCalendarInfo(BooksForm form) {
    HouseholdCalendarUi ui = new HouseholdCalendarUi();
    Date date = form.getDate() == null ? StudyUtil.getNowDate() : form.getDate();
    // 祝日定義ファイルの取得
    ClassPathResource syukujitsuFile = new ClassPathResource("csv/syukujitsu.csv");
    List<SyukujitsuColumn> syukujitsuList =
        StudyFileUtil.csvFileToList(syukujitsuFile, SyukujitsuColumn.class, true);

    ui.setSyukujitsuList(syukujitsuList.stream()
        .filter(col -> Objects.equals(StudyDateUtil.getYearMonth(col.getDate()),
            StudyDateUtil.getYearMonth(date)))
        .toList());
    ui.setAmountList(booksHelper.findByMonthAndType(date, BooksType.EXPENSES.getCode()));

    return ui;
  }
}
