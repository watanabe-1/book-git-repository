package org.watanabe.app.study.form;

import java.io.Serializable;
import java.util.Date;
import org.springframework.web.multipart.MultipartFile;
import org.watanabe.app.common.validation.UploadFileMaxSize;
import org.watanabe.app.common.validation.UploadFileMediaType;
import org.watanabe.app.common.validation.UploadFileNotEmpty;
import org.watanabe.app.common.validation.UploadFileRequired;
import lombok.Data;

/**
 * BOOKS:家計簿(家計簿データ保存テーブル)のformクラス
 */
@Data
public class BooksForm implements Serializable {

  /**
   * アップロードされたファイル
   */
  @UploadFileRequired
  @UploadFileNotEmpty
  @UploadFileMaxSize
  @UploadFileMediaType(exts = "csv", mediaTypes = "text/csv")
  private MultipartFile booksFile;

  /**
   * シリアルキー
   */
  private String serialKey;

  /**
   * 家計簿ID
   */
  private String booksId;

  /**
   * 帳簿の種類(収入、支出を選ぶ)
   */
  private String booksType;

  /**
   * 日付(収入日、購入日)
   */
  private Date booksDate;

  /**
   * 場所(収入元、購入先)
   */
  private String booksPlace;

  /**
   * カテゴリーコード
   */
  private String catCode;

  /**
   * 方法(受け取り方、支払い方)
   */
  private String booksMethod;

  /**
   * 金額
   */
  private Integer booksAmmount;

  /**
   * 登録日時
   */
  private Date insDate;

  /**
   * 登録ユーザー
   */
  private String insUser;

  /**
   * 更新日時
   */
  private Date updDate;

  /**
   * 更新ユーザー
   */
  private String updUser;

}
