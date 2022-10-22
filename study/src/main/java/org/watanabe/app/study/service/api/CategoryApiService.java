package org.watanabe.app.study.service.api;

import org.springframework.stereotype.Service;
import org.watanabe.app.study.dto.ui.CategoryUi;
import org.watanabe.app.study.enums.flag.ActiveFlag;
import org.watanabe.app.study.enums.flag.DeleteFlag;
import org.watanabe.app.study.enums.type.CategoryType;
import org.watanabe.app.study.enums.type.ImageType;
import org.watanabe.app.study.form.CategoryForm;

/**
 * カテゴリー画面情報取得用サービス
 *
 */
@Service
public class CategoryApiService {

  /**
   * 画面情報取得
   * 
   * @return 画面情報
   */
  public CategoryUi getInfo() {
    CategoryUi ui = new CategoryUi();
    ui.setForm(new CategoryForm());
    ui.setImgTypes(ImageType.values());
    ui.setCatTypes(CategoryType.values());
    ui.setActive(ActiveFlag.ACTIVE);
    ui.setDelete(DeleteFlag.DELETE);

    return ui;
  }
}
