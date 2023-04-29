package org.book.app.study.dto.ui;

import org.book.app.study.enums.type.BooksType;
import org.book.app.study.form.BooksForm;
import lombok.Data;

/**
 * 家計簿画面表示用クラス
 */
@Data
public class BooksUi {

  /**
   * 家計簿ーフォーム
   */
  private BooksForm form;

  /**
   * 家計簿タイプ
   */
  private BooksType[] booksTypes;

}
