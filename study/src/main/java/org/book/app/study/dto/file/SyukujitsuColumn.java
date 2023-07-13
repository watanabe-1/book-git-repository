package org.book.app.study.dto.file;

import java.io.Serializable;
import java.util.Date;
import org.book.app.study.util.StudyDateUtil;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.Data;

/**
 * 祝日一覧のentityクラス
 */
@Data
@JsonPropertyOrder({"date", "name"})
public class SyukujitsuColumn implements Serializable {

  /**
   * 祝日フォーマットパターン
   */
  @JsonProperty("dateFormat")
  private final String DATE_FORMAT = StudyDateUtil.FMT_YEAR_MONTH_DAY_SLASH;

  /**
   * 祝日<br/>
   * タイムゾーンには00時00分として扱いたいため、Asia/Tokyoを指定
   */
  @JsonFormat(pattern = DATE_FORMAT,
      timezone = StudyDateUtil.TIMEZONE_ASIA_TOKYO)
  @JsonProperty("date")
  private Date date;

  /**
   * 祝日名
   */
  @JsonProperty("name")
  private String name;

}
