package org.book.app.study.dto.ui.books;

import org.book.app.study.dto.data.BooksChartData;
import lombok.Data;

/**
 * 家計簿確認画面図表示用クラス
 */
@Data
public class HouseholdChartUi {

  /**
   * 家計簿一覧画面内の1月ごとのカテゴリーごとの図用
   */
  private BooksChartData monthCategory;

  /**
   * 家計簿一覧画面内の1月ごとの支払いごとの図用
   */
  private BooksChartData monthMethod;

  /**
   * 家計簿一覧画面内の1年ごとの図用
   */
  private BooksChartData yearAll;

}
