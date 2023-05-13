package org.book.app.study.dto.ui.category;

import org.book.app.study.enums.flag.ActiveFlag;
import org.book.app.study.enums.flag.DeleteFlag;
import org.book.app.study.enums.type.CategoryType;
import org.book.app.study.enums.type.ImageType;
import org.book.app.study.form.CategoryForm;
import lombok.Data;

/**
 * カテゴリー画面表示用クラス
 */
@Data
public class CategoryUi {

  /**
   * カテゴリーフォーム
   */
  private CategoryForm form;

  /**
   * イメージタイプ
   */
  private ImageType[] imgTypes;

  /**
   * カテゴリータイプ
   */
  private CategoryType[] catTypes;

  /**
   * アクティブ
   */
  private ActiveFlag active;

  /**
   * デリートフラグ
   */
  private DeleteFlag delete;

}
