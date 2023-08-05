package org.book.app.study.dto.list;

import java.io.Serializable;
import java.time.LocalDate;
import java.util.List;
import org.book.app.study.form.BooksForm;
import jakarta.validation.Valid;
import lombok.Data;

/**
 * 家計簿一覧画面用 データクラス
 */
@Data
public class BooksFormList implements Serializable {

  /**
   * 家計簿リスト
   */
  @Valid
  private List<BooksForm> booksDataList;

  /**
   * 日付
   */
  private LocalDate date;

  /**
   * 家計簿タイプ
   */
  private String booksType;
}
