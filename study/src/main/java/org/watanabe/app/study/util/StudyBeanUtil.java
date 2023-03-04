package org.watanabe.app.study.util;

import java.util.Date;
import java.util.List;
import org.springframework.beans.BeanUtils;
import org.watanabe.app.study.entity.Entity;

/**
 * java beanのUtilクラスを作成
 */
public class StudyBeanUtil {

  /**
   * 引数1から引数2に同名のフィールドがあった場合、そのフィールドに同じ値をセット またstudyで固定使用しているカラムの値をセットする
   * 
   * @param source コピー元
   * @param target コピー＆セット先
   */
  public static void copyAndSetStudyEntityProperties(Object source, Entity target) {
    // 同名のフィールドにセット 引数1から2へ
    BeanUtils.copyProperties(source, target);
    setStudyEntityProperties(target);
  }

  /**
   * studyで固定使用しているカラムの値をセットする
   * 
   * @param target セット対象
   */
  public static void setStudyEntityProperties(Entity target) {
    // 現在日時取得
    Date now = StudyUtil.getNowDate();
    // ログインユーザー取得
    String user = StudyUtil.getLoginUser();

    if (target.getInsUser() == null) {
      target.setInsUser(user);
      target.setInsDate(now);
    }
    target.setUpdUser(user);
    target.setUpdDate(now);
  }

  /**
   * studyで固定使用しているカラムの値にnullをセットする
   * 
   * @param target セット対象
   */
  public static void setStudyEntityPropertiesNull(Entity target) {
    target.setInsUser(null);
    target.setInsDate(null);
    target.setUpdUser(null);
    target.setUpdDate(null);
  }

  /**
   * studyで固定使用しているカラムの値にnullをセットする
   * 
   * @param target セット対象
   */
  public static void setStudyEntityListPropertiesNull(List<? extends Entity> targetList) {
    targetList.forEach((form) -> {
      StudyBeanUtil.setStudyEntityPropertiesNull(form);
    });
  }

}
