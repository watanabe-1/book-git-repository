package org.book.app.study.form;

import java.io.Serializable;
import java.util.Date;
import org.book.app.study.util.StudyDateUtil;
import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

/**
 * BOOKS:家計簿(家計簿データ保存テーブル)のformクラス
 */
@Data
public class BooksForm implements Serializable, Form {

  /**
   * 日付(収入日、購入日)フォーマットパターン
   */
  @JsonProperty("booksDateFormat")
  private final String BOOKS_DATE_FORMAT = StudyDateUtil.FMT_YEAR_MONTH_DAY_SLASH;

  /**
   * 家計簿ID
   */
  @NotBlank
  private String booksId;

  /**
   * 帳簿の種類(収入、支出を選ぶ)
   */
  @NotBlank
  private String booksType;

  /**
   * 日付(収入日、購入日)
   */
  @JsonFormat(pattern = BOOKS_DATE_FORMAT,
      timezone = StudyDateUtil.TIMEZONE_ASIA_TOKYO)
  @NotNull
  private Date booksDate;

  /**
   * 場所(収入元、購入先)
   */
  @NotBlank
  private String booksPlace;

  /**
   * カテゴリーコード
   */
  @NotBlank
  private String catCode;

  /**
   * 方法(受け取り方、支払い方)
   */
  @NotBlank
  private String booksMethod;

  /**
   * 金額
   */
  @NotNull
  private Integer booksAmmount;

  /**
   * 年
   */
  private String booksYear;

  /**
   * カテゴリークラスの要素(親1対子1).
   */
  private CategoryForm catCodes;

  /**
   * 画面：日付け
   */
  private Date date;

  /**
   * 画面：タブ
   */
  private String tab;

  /**
   * 削除フラグ
   */
  private String delete;

  /**
   * ssr判定
   */
  private String ssr;
}
