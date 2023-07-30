package org.book.app.study.api.js;

import org.book.app.study.api.DefaultCategoryApiController;
import org.book.app.study.util.StudyStringUtil;
import org.springframework.stereotype.Component;
import lombok.AllArgsConstructor;

/**
 * デフォルトカテゴリー画面情報js用取得クラス
 *
 */
@Component
@AllArgsConstructor
public class DefaultCategoryApi extends CommonApi {

  /**
   * カテゴリー画面api
   */
  private final DefaultCategoryApiController defaultCategoryApiController;

  /**
   * 画面情報取得
   * 
   * @return 画面情報
   */
  public String getInfo() {
    return StudyStringUtil.objectToJsonStr(defaultCategoryApiController.getInfo());
  }

  /**
   * 画面リスト情報取得
   * 
   * @return 画面リスト情報
   */
  public String getListData() {
    return StudyStringUtil.objectToJsonStr(defaultCategoryApiController.getListData());
  }
}
