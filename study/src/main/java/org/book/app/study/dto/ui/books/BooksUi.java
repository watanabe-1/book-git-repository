package org.book.app.study.dto.ui.books;

import java.util.List;
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

  /**
   * 家計簿日付け一覧
   */
  private List<String> booksYears;

}
