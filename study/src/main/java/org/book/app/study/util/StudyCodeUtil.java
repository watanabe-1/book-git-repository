package org.book.app.study.util;

import org.book.app.study.service.CodeLookupService;
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
  private static CodeLookupService codeLookupService;

  /**
   * コード情報 Serviceのセッター<br>
   * 
   * @param CodeLookupService コード情報 Service
   */
  @Autowired
  private void setCodeLookupService(CodeLookupService CodeLookupService) {
    StudyCodeUtil.codeLookupService = CodeLookupService;
  }

  /**
   * コードルックアップテーブルを検索し、ショートを取得
   * 
   * @param listName リストネーム
   * @param code コード
   * @return ショート
   */
  public static String getShort(String listName, String code) {
    return codeLookupService.findOne(listName, code).getShortValue();
  }
}
