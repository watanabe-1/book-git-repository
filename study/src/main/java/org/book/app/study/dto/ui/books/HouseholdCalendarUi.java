package org.book.app.study.dto.ui.books;

import java.util.List;
import org.book.app.study.dto.file.SyukujitsuColumn;
import lombok.Data;

/**
 * 家計簿確認画面カレンダー表示用クラス
 */
@Data
public class HouseholdCalendarUi {

  /**
   * 祝日一覧
   */
  private List<SyukujitsuColumn> syukujitsuList;
}
