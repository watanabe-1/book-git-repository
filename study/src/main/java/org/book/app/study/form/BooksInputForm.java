package org.book.app.study.form;

import java.io.Serializable;
import org.book.app.common.validation.UploadFileMaxSize;
import org.book.app.common.validation.UploadFileMediaType;
import org.book.app.common.validation.UploadFileNotEmpty;
import org.book.app.common.validation.UploadFileRequired;
import org.book.app.study.util.StudyFileUtil;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * BOOKS:家計簿変換データ保存画面のformクラス
 */
@Data
public class BooksInputForm implements Serializable, Form {

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
   * 帳簿の種類(収入、支出を選ぶ)
   */
  @NotBlank
  private String booksType;

  /**
   * ssr判定
   */
  private String ssr;
}
