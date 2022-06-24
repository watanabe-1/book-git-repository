package org.watanabe.app.study.enums.dbcode;

/**
 * コードの定義
 */
interface DbCode {

  /**
   * リストネームを取得します.
   * 
   * @return リストネーム
   */
  public String getListName();

  /**
   * コードを取得します.
   * 
   * @return コード
   */
  public String getCode();

  /**
   * 説明を取得します.
   * 
   * @return 説明
   */
  public String getDescription();
}
