package org.book.app.study.dto.file;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * BOOKS:Suicaの利用履歴PDF内テーブルデータの定義クラス
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({"年", "月", "日", "種別", "利用駅", "種別2", "利用駅2", "残高", "入金・利用額"})
public class SuicaColumn {

  /**
   * 年
   */
  @JsonProperty("年")
  private int year;

  /**
   * 月
   */
  @JsonProperty("月")
  private int month;

  /**
   * 日
   */
  @JsonProperty("日")
  private int day;

  /**
   * 種別
   */
  @JsonProperty("種別")
  private String type;

  /**
   * 利用駅
   */
  @JsonProperty("利用駅")
  private String station;

  /**
   * 種別2
   */
  @JsonProperty("種別2")
  private String type2;

  /**
   * 利用駅2
   */
  @JsonProperty("利用駅2")
  private String station2;

  /**
   * 残高
   */
  @JsonProperty("残高")
  private String balance;

  /**
   * 入金・利用額
   */
  @JsonProperty("入金・利用額")
  private String amount;
}
