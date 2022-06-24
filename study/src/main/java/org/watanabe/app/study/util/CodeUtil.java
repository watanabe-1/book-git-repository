package org.watanabe.app.study.util;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.watanabe.app.study.service.CodelkupService;

/**
 * コードのHelperクラスを作成
 */
@Component
public class CodeUtil {

  /**
   * カテゴリー情報 Service
   */
  private static CodelkupService codelkupService;

  /**
   * カテゴリー情報 Serviceのセッター
   * 
   * @param codelkupService カテゴリー情報 Service
   */
  @Autowired
  public void setCodelkupService(CodelkupService codelkupService) {
    CodeUtil.codelkupService = codelkupService;
  }

  /**
   * コードルックアップテーブルを検索し、ショートを取得
   * 
   * @param listName リストネーム
   * @param code コード
   * @return ショート
   */
  public static String getCodeShort(String listName, String code) {
    return codelkupService.findOne(listName, code).getShortValue();
  }
}
