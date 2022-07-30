package org.watanabe.app.study.dto;

import java.io.Serializable;
import java.util.Date;
import org.watanabe.app.study.util.StudyDateUtil;
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
   * 祝日
   */
  @JsonFormat(pattern = StudyDateUtil.FMT_YEAR_MONTH_DAY_SLASH)
  @JsonProperty("date")
  private Date date;

  /**
   * 祝日名
   */
  @JsonProperty("name")
  private String name;

}
