package org.book.app.study.service.api;

import java.util.List;
import org.book.app.study.dto.ui.BooksUi;
import org.book.app.study.entity.Books;
import org.book.app.study.enums.type.BooksType;
import org.book.app.study.form.BooksForm;
import org.book.app.study.helper.BooksHelper;
import org.book.app.study.service.BooksService;
import org.book.app.study.util.StudyDateUtil;
import org.book.app.study.util.StudyUtil;
import org.springframework.stereotype.Service;
import lombok.AllArgsConstructor;

/**
 * 家計簿画面情報取得用サービス
 *
 */
@Service
@AllArgsConstructor
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
}
