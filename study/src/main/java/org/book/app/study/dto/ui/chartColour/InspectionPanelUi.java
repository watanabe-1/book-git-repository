package org.book.app.study.dto.ui.chartColour;

import java.util.Date;
import org.book.app.study.enums.flag.ActiveFlag;
import org.book.app.study.enums.flag.DeleteFlag;
import org.book.app.study.util.StudyDateUtil;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

/**
 * 家計簿確認画面表示用クラス
 */
@Data
public class InspectionPanelUi {

  /**
   * 日付フォーマットパターン
   */
  @JsonProperty("dateFormat")
  private final String DATE_FORMAT = StudyDateUtil.FMT_YEAR_MONTH_DAY_SLASH;

  /**
   * アクティブにするタブ
   */
  private String tab;

  /**
   * デリートフラグ
   */
  private DeleteFlag delete;

  /**
   * アクティブ
   */
  private ActiveFlag active;

  /**
   * 日付
   */
  @JsonFormat(pattern = DATE_FORMAT,
      timezone = StudyDateUtil.TIMEZONE_ASIA_TOKYO)
  private Date date;

}
