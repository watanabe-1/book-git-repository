package org.book.app.study.util;

import org.book.app.study.service.CodelkupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

/**
 * コードのUtilクラスを作成
 */
@Component
public class StudyCodeUtil {

  /**
   * コード情報 Service
   */
  private static CodelkupService codelkupService;

  /**
   * コード情報 Serviceのセッター<br>
   * 右記@AutowiredはeclipsだとUnnecesaryの注意が出るが必要
   * 
   * @param codelkupService コード情報 Service
   */
  @Autowired
  public void setCodelkupService(CodelkupService codelkupService) {
    StudyCodeUtil.codelkupService = codelkupService;
  }

  /**
   * コードルックアップテーブルを検索し、ショートを取得
   * 
   * @param listName リストネーム
   * @param code コード
   * @return ショート
   */
  public static String getShort(String listName, String code) {
    return codelkupService.findOne(listName, code).getShortValue();
  }
}
