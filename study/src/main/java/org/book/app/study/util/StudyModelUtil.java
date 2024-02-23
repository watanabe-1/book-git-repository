package org.book.app.study.util;

import java.util.Map;

import org.springframework.lang.NonNull;
import org.springframework.ui.ModelMap;
import org.springframework.web.servlet.ModelAndView;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

/**
 * モデルのUtilクラスを作成
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class StudyModelUtil {

  /**
   * モデルのキー：modelMap クラス
   */
  public static final String MODEL_KEY_MODEL_MAP = "modelMap";

  /**
   * モデルのキー：ModelAndView クラス
   */
  public static final String MODEL_KEY_MODEL_AND_VIEW = "modelAndView";

  /**
   * モデルのキー：ファイルネーム
   */
  public static final String MODEL_KEY_FILE_NAME = "fileNmme";

  /**
   * モデルのキー：ファイルデータ
   */
  public static final String MODEL_KEY_FILE_DATA = "fileData";

  /**
   * モデルのキー：ファイルデータクラス
   */
  public static final String MODEL_KEY_FILE_DATA_CLASS = "fileDataClass";

  /**
   * コントローラークラスでセットしたモデルマップを取得<br/>
   * 主にviewクラスでの使用を想定
   * 
   * @param model Model object
   * @return モデルマップ
   */
  public static ModelMap getModelMap(Map<String, Object> model) {
    return model.containsKey(MODEL_KEY_MODEL_AND_VIEW)
        ? ((ModelAndView) model.get(MODEL_KEY_MODEL_AND_VIEW)).getModelMap()
        : new ModelMap().addAllAttributes(model);
  }

  /**
   * コントローラークラスでセットしたアトリビュートを取得
   * 
   * @param model         Model object
   * @param attributeName アトリビュート名
   * @return アトリビュート
   */
  public static Object getAttribute(Map<String, Object> model, @NonNull String attributeName) {
    return getModelMap(model).getAttribute(attributeName);
  }

}
