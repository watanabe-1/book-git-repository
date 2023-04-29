package org.book.app.study.api.js;

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
public class BooksApi implements ServerApi {

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

}
