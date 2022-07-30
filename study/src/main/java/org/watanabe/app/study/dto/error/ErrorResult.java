package org.watanabe.app.study.dto.error;

import java.io.Serializable;
import lombok.Data;

/**
 * エラー情報を１件保持するためのJavaBean
 */
@Data
public class ErrorResult implements Serializable {

  private static final long serialVersionUID = 1L;

  /**
   * エラーコード
   */
  private String code;

  /**
   * メッセージ
   */
  private String message;

  /**
   * パス
   */
  private String itemPath;

}
