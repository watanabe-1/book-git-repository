package org.book.app.study.dto.ui.common;

import org.book.app.study.util.StudyDateUtil;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

/**
 * 画面共通情報クラス
 */
@Data
public class CommonUi {

  /**
   * 日付フォーマットパターン
   */
  @JsonProperty("dateFormat")
  private final String DATE_FORMAT = StudyDateUtil.FMT_YEAR_MONTH_DAY_SLASH;

}
