package org.book.app.study.dto.ui.books;

import org.book.app.study.enums.type.FileType;
import lombok.Data;

/**
 * 家計簿変換画面表示用クラス
 */
@Data
public class BooksConvertUi {

  /**
   * ファイルタイプ
   */
  private FileType[] fileTypes;

}
