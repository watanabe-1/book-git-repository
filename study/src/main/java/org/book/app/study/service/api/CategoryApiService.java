package org.book.app.study.service.api;

import org.springframework.stereotype.Service;
import org.book.app.study.dto.ui.category.CategoryUi;
import org.book.app.study.enums.flag.ActiveFlag;
import org.book.app.study.enums.flag.DeleteFlag;
import org.book.app.study.enums.type.CategoryType;
import org.book.app.study.enums.type.ImageType;
import org.book.app.study.form.CategoryForm;

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
