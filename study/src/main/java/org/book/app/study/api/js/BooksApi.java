package org.book.app.study.api.js;

import java.time.LocalDate;

import org.book.app.study.api.BooksApiController;
import org.book.app.study.util.StudyStringUtil;
import org.springframework.stereotype.Component;

import lombok.AllArgsConstructor;

/**
 * 家計簿画面情報js用取得クラス
 *
 */
@Component
@AllArgsConstructor
public class BooksApi extends CommonApi {

  /**
   * カテゴリー画面api
   */
  private final BooksApiController booksApiController;

  /**
   * アップロード画面情報取得
   * 
   * @return 画面情報
   */
  public String getUploadInfo() {
    return StudyStringUtil.objectToJsonStr(booksApiController.getUploadInfo());
  }

  /**
   * ダウンロード画面情報取得
   * 
   * @return 画面情報
   */
  public String getDownloadInfo() {
    return StudyStringUtil.objectToJsonStr(booksApiController.getDownloadInfo());
  }

  /**
   * 変換画面情報取得
   * 
   * @return 画面情報
   */
  public String getConvertInfo() {
    return StudyStringUtil.objectToJsonStr(booksApiController.getConvertInfo());
  }

  /**
   * 家計簿確認画面情報取得
   * 
   * @param date 日付
   * @return 画面情報
   */
  public String getHouseholdInfo(LocalDate date) {
    return StudyStringUtil.objectToJsonStr(booksApiController.getHouseholdInfo(date));
  }

  /**
   * 家計簿確認画面情報取得
   * 
   * @param date 日付
   * @param booksType 家計簿タイプ
   * @return 画面情報
   */
  public String getHouseholdListData(LocalDate date, String booksType) {
    return StudyStringUtil
        .objectToJsonStr(booksApiController.getHouseholdListData(date, booksType));
  }

  /**
   * 家計簿確認画面図情報取得
   * 
   * @param date 日付
   * @return 画面情報
   */
  public String getHouseholdChartInfo(LocalDate date) {
    return StudyStringUtil.objectToJsonStr(booksApiController.getHouseholdChartInfo(date));
  }

  /**
   * 家計簿確認画面カレンダー情報取得
   * 
   * @param date 日付
   * @return 画面情報
   */
  public String getHouseholdCalendarInfo(LocalDate date) {
    return StudyStringUtil.objectToJsonStr(booksApiController.getHouseholdCalendarInfo(date));
  }

}
