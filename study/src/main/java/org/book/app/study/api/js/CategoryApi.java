package org.book.app.study.api.js;

import org.book.app.study.api.CategoryApiController;
import org.book.app.study.util.StudyStringUtil;
import org.springframework.stereotype.Component;
import lombok.AllArgsConstructor;

/**
 * カテゴリー画面情報js用取得クラス
 *
 */
@Component
@AllArgsConstructor
public class CategoryApi extends CommonApi {

  /**
   * カテゴリー画面api
   */
  private final CategoryApiController categoryApiController;

  /**
   * 画面情報取得
   * 
   * @return 画面情報
   */
  public String getInfo() {
    return StudyStringUtil.objectToJsonStr(categoryApiController.getInfo());
  }

  /**
   * 画面リスト情報取得
   * 
   * @return 画面リスト情報
   */
  public String getListData() {
    return StudyStringUtil.objectToJsonStr(categoryApiController.getListData());
  }

  /**
   * 画像情報一覧取得
   * 
   * @return 画像情報一覧
   */
  public String getImageList() {
    return StudyStringUtil.objectToJsonStr(categoryApiController.getImageList());
  }
}
