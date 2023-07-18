package org.book.app.study.dto.ui.books;

import java.util.List;
import org.book.app.study.entity.Books;
import org.book.app.study.util.StudyDateUtil;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

/**
 * 家計簿確認画面表示用クラス
 */
@Data
public class HouseholdUi {

  /**
   * 日付フォーマットパターン
   */
  @JsonProperty("dateFormat")
  private final String DATE_FORMAT = StudyDateUtil.FMT_YEAR_MONTH_DAY_SLASH;

  /**
   * 支出データ
   */
  private List<Books> expensesList;

  /**
   * 収入データ
   */
  private List<Books> incomeList;

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
