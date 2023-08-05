package org.book.app.study.dto.ui.books;

import java.util.List;
import org.book.app.study.dto.data.TypeData;
import org.book.app.study.enums.flag.DeleteFlag;
import org.book.app.study.enums.type.BooksType;
import org.book.app.study.form.CategoryForm;
import org.book.app.study.form.ImageForm;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

/**
 * 家計簿確認画面表示用クラス
 */
@Data
public class HouseholdUi {
  /**
   * 家計簿タイプ 支出
   */
  @JsonProperty("booksTypeExpenses")
  private final String BOOKS_TYPE_EXPENSES = BooksType.EXPENSES.getCode();

  /**
   * 家計簿タイプ 収入
   */
  @JsonProperty("booksTypeIncome")
  private final String BOOKS_TYPE_INCOME = BooksType.INCOME.getCode();

  /**
   * デリートフラグ
   */
  private DeleteFlag delete;

  /**
   * カテゴリー
   */
  private List<TypeData> categoryTypes;

  /**
   * カテゴリー一覧
   */
  private List<CategoryForm> categoryList;

  /**
   * 画像ー一覧
   */
  private List<ImageForm> imageList;

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
