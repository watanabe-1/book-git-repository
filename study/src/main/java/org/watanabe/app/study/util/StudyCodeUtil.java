package org.watanabe.app.study.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.watanabe.app.study.service.CodelkupService;

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
   * コード情報 Serviceのセッター
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
