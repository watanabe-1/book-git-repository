package org.book.app.study.form;

import java.io.Serializable;
import org.book.app.common.validation.UploadFileMaxSize;
import org.book.app.common.validation.UploadFileNotEmpty;
import org.book.app.common.validation.UploadFileRequired;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * BOOKS:家計簿変換データ保存画面のformクラス
 */
@Data
public class BooksConvertForm implements Serializable, Form {

  /**
   * アップロードされたファイル
   */
  @UploadFileRequired
  @UploadFileNotEmpty
  @UploadFileMaxSize
  private MultipartFile file;

  /**
   * ファイルの種類(Suica用ファイルかなど)
   */
  @NotBlank
  private String fileType;

  /**
   * ssr判定
   */
  private String ssr;
}
