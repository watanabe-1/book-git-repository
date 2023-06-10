package org.book.app.study.form;

import java.io.Serializable;
import java.util.Date;
import jakarta.validation.constraints.NotBlank;
import org.book.app.common.validation.UploadFileMaxSize;
import org.book.app.common.validation.UploadFileMediaType;
import org.book.app.common.validation.UploadFileNotEmpty;
import org.book.app.common.validation.UploadFileRequired;
import org.book.app.study.util.StudyFileUtil;
import org.springframework.web.multipart.MultipartFile;
import lombok.Data;

/**
 * BOOKS:家計簿(家計簿データ保存テーブル)のformクラス
 */
@Data
public class BooksForm implements Serializable, Form {

  /**
   * アップロードされたファイル
   */
  @UploadFileRequired
  @UploadFileNotEmpty
  @UploadFileMaxSize
  @UploadFileMediaType(exts = StudyFileUtil.EXTENSION_BY_CSV,
      mediaTypes = StudyFileUtil.MEDIATYPE_BY_CSV)
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
   * ユーザーID
   */
  private String userId;

  /**
   * 帳簿の種類(収入、支出を選ぶ)
   */
  @NotBlank
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

  /**
   * 年
   */
  private String booksYear;

  /**
   * 画面：日付け
   */
  private Date date;

  /**
   * 画面：タブ
   */
  private String tab;

  /**
   * ssr判定
   */
  private String ssr;
}
