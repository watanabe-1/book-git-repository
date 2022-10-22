package org.watanabe.app.study.dto.ui;

import org.watanabe.app.study.enums.flag.ActiveFlag;
import org.watanabe.app.study.enums.flag.DeleteFlag;
import org.watanabe.app.study.enums.type.CategoryType;
import org.watanabe.app.study.enums.type.ImageType;
import org.watanabe.app.study.form.CategoryForm;
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
