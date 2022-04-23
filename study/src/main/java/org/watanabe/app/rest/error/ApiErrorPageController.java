package org.watanabe.app.rest.error;

import java.util.HashMap;
import java.util.Map;
import javax.inject.Inject;
import javax.servlet.RequestDispatcher;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.RequestAttributes;
import org.springframework.web.context.request.WebRequest;

/*
 * エラー応答を行うためのControllerクラス これはとりあえずいらない？かも
 */
@RequestMapping("error")
@RestController
public class ApiErrorPageController {

  @Inject
  ApiErrorCreator apiErrorCreator;

  /*
   * HTTPステータスコードとエラーコードをマッピングするための Map
   */
  private final Map<HttpStatus, String> errorCodeMap = new HashMap<HttpStatus, String>();

  /*
   * HTTPステータスコードとエラーコードとのマッピングを登録
   */
  public ApiErrorPageController() {
    errorCodeMap.put(HttpStatus.NOT_FOUND, "e.ex.fw.5001");
  }

  /*
   * エラー応答を行うハンドラメソッドを作成
   */
  @RequestMapping
  public ResponseEntity<ApiError> handleErrorPage(WebRequest request) {
    // リクエストスコープに格納されているステータスコードを取得
    HttpStatus httpStatus = HttpStatus.valueOf((Integer) request
        .getAttribute(RequestDispatcher.ERROR_STATUS_CODE, RequestAttributes.SCOPE_REQUEST));
    // 取得したステータスコードに対応するエラーコードを取得
    String errorCode = errorCodeMap.get(httpStatus);
    // 取得したエラーコードに対応するエラー情報を生成
    ApiError apiError =
        apiErrorCreator.createApiError(request, errorCode, httpStatus.getReasonPhrase());

    // 生成したエラー情報を応答
    return ResponseEntity.status(httpStatus).body(apiError);
  }

}
