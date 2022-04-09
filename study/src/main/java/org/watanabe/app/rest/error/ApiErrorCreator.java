package org.watanabe.app.rest.error;

import javax.inject.Inject;
import org.springframework.context.MessageSource;
import org.springframework.context.support.DefaultMessageSourceResolvable;
import org.springframework.stereotype.Component;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.ObjectError;
import org.springframework.web.context.request.WebRequest;
import org.terasoluna.gfw.common.message.ResultMessage;
import org.terasoluna.gfw.common.message.ResultMessages;

/*
 * 必要に応じて、エラー情報を生成するためのメソッドを提供するクラス
 */
@Component
public class ApiErrorCreator {

  @Inject
  MessageSource messageSource;

  public ApiError createApiError(WebRequest request, String errorCode, String defaultErrorMessage,
      Object... arguments) {
    // エラーメッセージは、MessageSourceより取得する
    String localizedMessage =
        messageSource.getMessage(errorCode, arguments, defaultErrorMessage, request.getLocale());
    return new ApiError(errorCode, localizedMessage);
  }

  /*
   * 入力チェック用のエラー情報を生成するためのメソッド
   */
  public ApiError createBindingResultApiError(WebRequest request, String errorCode,
      BindingResult bindingResult, String defaultErrorMessage) {
    ApiError apiError = createApiError(request, errorCode, defaultErrorMessage);
    for (FieldError fieldError : bindingResult.getFieldErrors()) {
      apiError.addDetail(createApiError(request, fieldError, fieldError.getField()));
    }
    for (ObjectError objectError : bindingResult.getGlobalErrors()) {
      apiError.addDetail(createApiError(request, objectError, objectError.getObjectName()));
    }
    return apiError;
  }

  /*
   * 単項目チェックエラー(FieldError)と相関項目チェックエラー(ObjectError)で同じ処理を実装する事になるので、共通メソッドとして本メソッドを作成
   */
  private ApiError createApiError(WebRequest request,
      DefaultMessageSourceResolvable messageResolvable, String target) {
    String localizedMessage = messageSource.getMessage(messageResolvable, request.getLocale());
    return new ApiError(messageResolvable.getCode(), localizedMessage, target);
  }

  /*
   * 処理結果からエラー情報を生成するためのメソッドを作成
   */
  public ApiError createResultMessagesApiError(WebRequest request, String rootErrorCode,
      ResultMessages resultMessages, String defaultErrorMessage) {
    ApiError apiError;
    if (resultMessages.getList().size() == 1) {
      ResultMessage resultMessage = resultMessages.iterator().next();
      String errorCode = resultMessage.getCode();
      String errorText = resultMessage.getText();
      if (errorCode == null && errorText == null) {
        errorCode = rootErrorCode;
      }
      apiError = createApiError(request, errorCode, errorText, resultMessage.getArgs());
    } else {
      apiError = createApiError(request, rootErrorCode, defaultErrorMessage);
      for (ResultMessage resultMessage : resultMessages.getList()) {
        apiError.addDetail(createApiError(request, resultMessage.getCode(), resultMessage.getText(),
            resultMessage.getArgs()));
      }
    }
    return apiError;
  }

}
