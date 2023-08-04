package org.book.app.study.service.api;

import org.book.app.study.dto.ui.defaultCategory.DefaultCategoryUi;
import org.book.app.study.enums.flag.DeleteFlag;
import org.book.app.study.enums.type.BooksType;
import org.book.app.study.helper.CategoryHelper;
import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;

/**
 * デフォルトカテゴリー画面情報取得用サービス
 *
 */
@Service
@RequiredArgsConstructor
public class DefaultCategoryApiService {

  /**
   * カテゴリー Helper
   */
  private final CategoryHelper categoryHelper;

  /**
   * 画面情報取得
   * 
   * @return 画面情報
   */
  public DefaultCategoryUi getInfo() {
    DefaultCategoryUi ui = new DefaultCategoryUi();
    ui.setDelete(DeleteFlag.DELETE);
    ui.setBooksTypes(BooksType.values());
    ui.setCategories(categoryHelper.getCategoryTypeDataList());

    return ui;
  }
}
