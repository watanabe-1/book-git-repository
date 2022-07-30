package org.watanabe.app.study.dto.error;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import lombok.Data;

/**
 * エラー情報を１件保持するJavaBeanを複数件保持するためのJavaBean
 */
@Data
public class ErrorResults implements Serializable {

  private static final long serialVersionUID = 1L;

  /**
   * エラー結果
   */
  private List<ErrorResult> errorResults = new ArrayList<ErrorResult>();

  /**
   * エラー追加
   * 
   * @param code コード
   * @param message メッセージ
   */
  public ErrorResults add(String code, String message) {
    ErrorResult errorResult = new ErrorResult();
    errorResult.setCode(code);
    errorResult.setMessage(message);
    errorResults.add(errorResult);
    return this;
  }

  /**
   * エラー追加
   * 
   * @param code コード
   * @param message メッセージ
   * @param itemPath パス
   */
  public ErrorResults add(String code, String message, String itemPath) {
    ErrorResult errorResult = new ErrorResult();
    errorResult.setCode(code);
    errorResult.setMessage(message);
    errorResult.setItemPath(itemPath);
    errorResults.add(errorResult);
    return this;
  }
}
