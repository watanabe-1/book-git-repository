package org.watanabe.app.study.api.js;

import org.springframework.stereotype.Component;
import org.watanabe.app.study.api.CategoryApiController;
import org.watanabe.app.study.util.StudyStringUtil;
import lombok.AllArgsConstructor;

/**
 * カテゴリー画面情報js用取得クラス
 *
 */
@Component
@AllArgsConstructor
public class CategoryApi implements ServerApi {

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
}
