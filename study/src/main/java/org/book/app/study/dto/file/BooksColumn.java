package org.book.app.study.dto.file;

import java.io.Serializable;
import java.time.LocalDate;

import org.book.app.study.util.StudyDateUtil;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * BOOKS:家計簿(家計簿データ保存テーブル)のファイル出力定義クラス
 */
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({ "日付(収入日、購入日)", "場所(収入元、購入先)", "カテゴリー名", "方法(受け取り方、支払い方)", "金額" })
public class BooksColumn implements Serializable {

  /**
   * 日付(収入日、購入日)<br/>
   * タイムゾーンには00時00分として扱いたいため、Asia/Tokyoを指定
   */
  @JsonProperty("日付(収入日、購入日)")
  @JsonFormat(pattern = StudyDateUtil.FMT_YEAR_MONTH_DAY_SLASH, timezone = StudyDateUtil.TIMEZONE_ASIA_TOKYO)
  private LocalDate booksDate;

  /**
   * 場所(収入元、購入先)
   */
  @JsonProperty("場所(収入元、購入先)")
  private String booksPlace;

  /**
   * カテゴリー名
   */
  @JsonProperty("カテゴリー名")
  private String catName;

  /**
   * 方法(受け取り方、支払い方)
   */
  @JsonProperty("方法(受け取り方、支払い方)")
  private String booksMethod;

  /**
   * 金額
   */
  @JsonProperty("金額")
  private Integer booksAmmount;

}
