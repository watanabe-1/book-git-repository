package org.book.app.study.util;

import java.util.List;

import org.book.app.study.entity.CodeLookup;
import org.book.app.study.service.CodeLookupService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

/**
 * コードのUtilクラスを作成
 */
@Component
@NoArgsConstructor(access = AccessLevel.PRIVATE)
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
  @java.lang.SuppressWarnings({ "squid:S2696" })
  private void setCodeLookupService(CodeLookupService codeLookupService) {
    StudyCodeUtil.codeLookupService = codeLookupService;
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

  /**
   * コードルックアップテーブルを検索し、ショートを取得(複数)
   * 
   * @param listName リストネーム
   * @return ショート
   */
  public static List<String> getShorts(String listName) {
    return codeLookupService.findByListName(listName).stream()
        .map(CodeLookup::getShortValue).toList();
  }
}
