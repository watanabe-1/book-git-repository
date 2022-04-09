package org.watanabe.app.rest.error;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonInclude;

/*
 * エラーコード、エラーメッセージ、エラー対象、エラーの詳細情報のリストを保持するクラス
 */
public class ApiError implements Serializable {

  private static final long serialVersionUID = 1L;

  private final String code;

  private final String message;

  /* エラーが発生した項目名 */
  @JsonInclude(JsonInclude.Include.NON_EMPTY)
  private final String target;

  /* エラーの詳細情報のリストを保持するためのフィールド */
  @JsonInclude(JsonInclude.Include.NON_EMPTY)
  private final List<ApiError> details = new ArrayList<>();

  public ApiError(String code, String message) {
    this(code, message, null);
  }

  public ApiError(String code, String message, String target) {
    this.code = code;
    this.message = message;
    this.target = target;
  }

  public String getCode() {
    return code;
  }

  public String getMessage() {
    return message;
  }

  public String getTarget() {
    return target;
  }

  public List<ApiError> getDetails() {
    return details;
  }

  public void addDetail(ApiError detail) {
    details.add(detail);
  }

}
