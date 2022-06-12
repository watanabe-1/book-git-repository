package org.watanabe.app.rest.controller;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import org.terasoluna.gfw.common.exception.BusinessException;
import org.terasoluna.gfw.common.message.ResultMessages;
import org.watanabe.app.study.entity.Books;
import org.watanabe.app.study.form.BooksForm;
import org.watanabe.app.study.form.rest.Syukujitsu;
import org.watanabe.app.study.helper.BooksHelper;
import org.watanabe.app.study.service.BooksService;
import org.watanabe.app.study.util.StudyUtil;

@RestController
public class CalendarRestController {

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
   * 祝日一覧の取得
   * 
   * @param date 開いている画面の指定されている日付け
   * @return json(祝日一覧情報)
   */
  @RequestMapping(value = "/books/rest/calendar/syukujitsu", method = RequestMethod.POST)
  public List<Syukujitsu> calendarBySyukujitsu(@ModelAttribute BooksForm form, ModelAndView model,
      Date date) {
    // 祝日定義ファイルの取得
    ClassPathResource syukujitsuFile = new ClassPathResource("csv/syukujitsu.csv");
    // 文字コードの判定
    String charset = StudyUtil.detectFileEncoding(syukujitsuFile);
    SimpleDateFormat sdFormat = new SimpleDateFormat("yyyy/MM/dd");
    List<Syukujitsu> syukujitsuList = new ArrayList<Syukujitsu>();
    int cnt = 0;

    try (BufferedReader br =
        new BufferedReader(new InputStreamReader(syukujitsuFile.getInputStream(), charset))) {
      String line = null;
      while ((line = br.readLine()) != null) {
        // ヘッダーはとばす
        if (0 < cnt) {
          final String[] split = line.split(",");
          Date syukujitsuDate = sdFormat.parse(StudyUtil.trimDoubleQuot(split[0]));
          // 対象範囲の日付けだけ設定
          if (booksHelper.getStartDate(syukujitsuDate)
              .compareTo(booksHelper.getStartDate(date)) == 0) {
            Syukujitsu syukujitsu = new Syukujitsu();
            syukujitsu.setDate(syukujitsuDate);
            syukujitsu.setName(StudyUtil.trimDoubleQuot(split[1]));
            syukujitsuList.add(syukujitsu);
          }
        }
        cnt++;
      }
    } catch (ParseException e) {
      throw new BusinessException(ResultMessages.error().add("1.01.01.1002", "日付(祝日)"));
    } catch (IOException e) {
      throw new BusinessException(ResultMessages.error().add("1.01.01.1001"));
    }

    return syukujitsuList;
  }

  /**
   * カレンダーで使用する日付けごとの料金一覧の取得
   * 
   * @param date 開いている画面の指定されている日付け
   * @return json(カレンダーで使用する日付けごとの料金一覧情報)
   */
  @RequestMapping(value = "/books/rest/calendar/AmountByDay", method = RequestMethod.POST)
  public List<Books> calendarByDay(@ModelAttribute BooksForm form, ModelAndView model, Date date) {
    // 対象を取得
    List<Books> books = booksService.findByBooksDateAndBooksTypeAndUserIdJoinCategory(
        booksHelper.getStartDate(date), booksHelper.getEndDate(date),
        BooksHelper.BOOKS_TYPE_EXPENSES, StudyUtil.getLoginUser());

    return books;
  }
}
