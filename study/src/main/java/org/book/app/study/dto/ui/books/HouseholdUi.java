package org.book.app.study.dto.ui.books;

import java.util.List;
import org.book.app.study.dto.data.TypeData;
import org.book.app.study.enums.flag.DeleteFlag;
import org.book.app.study.form.BooksForm;
import lombok.Data;

/**
 * 家計簿確認画面表示用クラス
 */
@Data
public class HouseholdUi {
  /**
   * デリートフラグ
   */
  private DeleteFlag delete;

  /**
   * カテゴリー
   */
  private List<TypeData> categories;

  /**
   * 支出データ
   */
  private List<BooksForm> expensesList;

  /**
   * 収入データ
   */
  private List<BooksForm> incomeList;

  /**
   * 対象年
   */
  private String year;

  /**
   * 対象月
   */
  private String month;

  /**
   * 対象日
   */
  private String day;

  /**
   * アクティブにするタブ
   */
  private String tab;

}
