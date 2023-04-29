package org.book.app.study.service.api;

import org.book.app.study.dto.ui.BooksUi;
import org.book.app.study.enums.type.BooksType;
import org.book.app.study.form.BooksForm;
import org.springframework.stereotype.Service;

/**
 * 家計簿画面情報取得用サービス
 *
 */
@Service
public class BooksApiService {

  /**
   * 画面情報取得
   * 
   * @return 画面情報
   */
  public BooksUi getInfo() {
    BooksUi ui = new BooksUi();
    ui.setForm(new BooksForm());
    ui.setBooksTypes(BooksType.values());

    return ui;
  }
}
