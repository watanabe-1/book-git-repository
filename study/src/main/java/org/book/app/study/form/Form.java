package org.book.app.study.form;

/**
 * study用の定義
 */
public interface Form {

  /**
   * ssr判定を取得します.
   * 
   * @return ssr判定
   */
  public String getSsr();

  /**
   * ssr判定を設定します.
   * 
   * @param isSSR ssr判定
   */
  public void setSsr(String ssr);

}
