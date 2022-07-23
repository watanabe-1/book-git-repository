package org.watanabe.app.rest.controller;

import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import org.watanabe.app.study.column.SyukujitsuColumn;
import org.watanabe.app.study.entity.Books;
import org.watanabe.app.study.enums.type.BooksType;
import org.watanabe.app.study.form.BooksForm;
import org.watanabe.app.study.helper.BooksHelper;
import org.watanabe.app.study.util.StudyDateUtil;
import org.watanabe.app.study.util.StudyFileUtil;

/**
 * カレンダー表示で使用するajax応答クラス
 * 
 */
@RestController
public class CalendarRestController {

  /**
   * 家計簿 Helper
   */
  @Autowired
  private BooksHelper booksHelper;

  /**
   * 祝日一覧の取得
   * 
   * @param form 送信されたデータ
   * @param model モデル
   * @param date 開いている画面の指定されている日付け
   * @return json(祝日一覧情報)
   */
  @RequestMapping(value = "/books/rest/calendar/syukujitsu", method = RequestMethod.POST)
  public List<SyukujitsuColumn> calendarBySyukujitsu(@ModelAttribute BooksForm form, ModelAndView model,
      Date date) {
    // 祝日定義ファイルの取得
    ClassPathResource syukujitsuFile = new ClassPathResource("csv/syukujitsu.csv");
    List<SyukujitsuColumn> syukujitsuList =
        StudyFileUtil.csvFileToList(syukujitsuFile, SyukujitsuColumn.class, true);

    return syukujitsuList.stream().filter(col -> StudyDateUtil.getStartDateByMonth(col.getDate())
        .compareTo(StudyDateUtil.getStartDateByMonth(date)) == 0).toList();
  }

  /**
   * カレンダーで使用する日付けごとの料金一覧の取得
   * 
   * @param form 送信されたデータ
   * @param model モデル
   * @param date 開いている画面の指定されている日付け
   * @return json(カレンダーで使用する日付けごとの料金一覧情報)
   */
  @RequestMapping(value = "/books/rest/calendar/AmountByDay", method = RequestMethod.POST)
  public List<Books> calendarByDay(@ModelAttribute BooksForm form, ModelAndView model, Date date) {
    return booksHelper.findByMonthAndType(date, BooksType.EXPENSES.getCode());
  }
}
