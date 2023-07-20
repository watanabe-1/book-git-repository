package org.book.app.study.api.js;

import org.book.app.study.api.CommonApiController;
import org.book.app.study.util.StudyStringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * 画面共通情報js用取得クラス<br/>
 * 基本的に他のAPIクラスに継承させて使用する想定のため<br/>
 * 引数なしコンストラクタで作成
 *
 */
@Component
public class CommonApi implements ServerApi {

  /**
   * カテゴリー画面api
   */
  @Autowired
  private CommonApiController commonApiController;

  /**
   * 画面共通情報取得
   * 
   * @return 画面情報
   */
  public String getCommonInfo() {
    return StudyStringUtil.objectToJsonStr(commonApiController.getCommonInfo());
  }

}
