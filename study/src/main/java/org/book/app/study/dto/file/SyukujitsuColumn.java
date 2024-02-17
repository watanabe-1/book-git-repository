package org.book.app.study.dto.file;

import java.io.Serializable;
import java.time.LocalDate;

import org.book.app.study.util.StudyDateUtil;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import lombok.Data;

/**
 * 祝日一覧のentityクラス
 */
@Data
@JsonPropertyOrder({ "date", "name" })
public class SyukujitsuColumn implements Serializable {

  /**
   * 祝日フォーマットパターン
   */
  @JsonProperty("dateFormat")
  private final String DATE_FORMAT = StudyDateUtil.FMT_ONEYEAR_ONEMONTH_DAY_SLASH;

  /**
   * 祝日<br/>
   * タイムゾーンには00時00分として扱いたいため、Asia/Tokyoを指定
   */
  @JsonFormat(pattern = DATE_FORMAT, timezone = StudyDateUtil.TIMEZONE_ASIA_TOKYO)
  @JsonProperty("date")
  private LocalDate date;

  /**
   * 祝日名
   */
  @JsonProperty("name")
  private String name;

}
