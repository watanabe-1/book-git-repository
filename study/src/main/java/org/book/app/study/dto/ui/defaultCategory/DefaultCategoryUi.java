package org.book.app.study.dto.ui.defaultCategory;

import java.util.List;
import org.book.app.study.dto.data.TypeData;
import org.book.app.study.enums.flag.DeleteFlag;
import org.book.app.study.enums.flag.RegexEnabledFlag;
import org.book.app.study.enums.type.BooksType;
import lombok.Data;

/**
 * デフォルトカテゴリー画面表示用クラス
 */
@Data
public class DefaultCategoryUi {

  /**
   * デリートフラグ
   */
  private DeleteFlag delete;

  /**
   * 家計簿タイプ
   */
  private BooksType[] booksTypes;

  /**
   * 正規表現使用可否
   */
  private RegexEnabledFlag regexEnabled;

  /**
   * カテゴリー
   */
  private List<TypeData> categories;

}
