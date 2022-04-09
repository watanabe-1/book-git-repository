package org.watanabe.app.rest.error;

import javax.inject.Inject;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.dao.PessimisticLockingFailureException;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.context.request.WebRequest;
import org.springframework.web.servlet.mvc.method.annotation.ResponseEntityExceptionHandler;
import org.terasoluna.gfw.common.exception.BusinessException;
import org.terasoluna.gfw.common.exception.ExceptionCodeResolver;
import org.terasoluna.gfw.common.exception.ResourceNotFoundException;
import org.terasoluna.gfw.common.exception.ResultMessagesNotificationException;

@RestControllerAdvice
public class ApiGlobalExceptionHandler extends ResponseEntityExceptionHandler {

  @Inject
  ApiErrorCreator apiErrorCreator;

  @Inject
  ExceptionCodeResolver exceptionCodeResolver;

  @Override
  protected ResponseEntity<Object> handleExceptionInternal(Exception ex, Object body,
      HttpHeaders headers, HttpStatus status, WebRequest request) {
    final Object apiError;
    if (body == null) {
      String errorCode = exceptionCodeResolver.resolveExceptionCode(ex);
      apiError = apiErrorCreator.createApiError(request, errorCode, ex.getLocalizedMessage());
    } else {
      apiError = body;
    }
    return ResponseEntity.status(status).headers(headers).body(apiError);
  }

  /*
   * ResponseEntityExceptionHandlerのhandleMethodArgumentNotValidメソッドをオーバライドし、
   * MethodArgumentNotValidExceptionのエラーハンドリングを拡張する
   * 
   * ステータスコードには400(Bad Request)が設定され、指定されたリソースの項目値に不備がある事を通知する。
   */
  @Override
  protected ResponseEntity<Object> handleMethodArgumentNotValid(MethodArgumentNotValidException ex,
      HttpHeaders headers, HttpStatus status, WebRequest request) {
    return handleBindingResult(ex, ex.getBindingResult(), headers, status, request);
  }

  /*
   * ResponseEntityExceptionHandlerのhandleBindExceptionメソッドをオーバライドし、
   * BindExceptionのエラーハンドリングを拡張BindExceptionのエラーハンドリングを拡張
   * 
   * ステータスコードには400(Bad Request)が設定され、指定されたリクエストパラメータに不備がある事を通知する。
   */
  @Override
  protected ResponseEntity<Object> handleBindException(BindException ex, HttpHeaders headers,
      HttpStatus status, WebRequest request) {
    return handleBindingResult(ex, ex.getBindingResult(), headers, status, request);
  }

  /*
   * ResponseEntityExceptionHandlerのhandleHttpMessageNotReadableメソッドをオーバライドし、
   * HttpMessageNotReadableExceptionのエラーハンドリングを拡張
   * 
   * ステータスコードには400(Bad Request)が設定され、指定されたリソースのフォーマットなどに不備がある事を通知する。
   */
  @Override
  protected ResponseEntity<Object> handleHttpMessageNotReadable(HttpMessageNotReadableException ex,
      HttpHeaders headers, HttpStatus status, WebRequest request) {
    if (ex.getCause() instanceof Exception) {
      return handleExceptionInternal((Exception) ex.getCause(), null, headers, status, request);
    } else {
      return handleExceptionInternal(ex, null, headers, status, request);
    }
  }

  /*
   * ResourceNotFoundExceptionをハンドリングするためのメソッド
   * メソッドアノテーションとして@ExceptionHandler(ResourceNotFoundException.class)を指定すると、
   * ResourceNotFoundExceptionの例外をハンドリングする事ができる。
   * 
   * ステータスコードには404(Not Found)を設定し、指定されたリソースがサーバに存在しない事を通知する。
   */
  @ExceptionHandler(ResourceNotFoundException.class)
  public ResponseEntity<Object> handleResourceNotFoundException(ResourceNotFoundException ex,
      WebRequest request) {
    return handleResultMessagesNotificationException(ex, new HttpHeaders(), HttpStatus.NOT_FOUND,
        request);
  }

  /*
   * BusinessExceptionをハンドリングするためのメソッド
   * 
   * ステータスコードには409(Conflict)を設定し、クライアントから指定されたリソース自体には不備はないが、
   * サーバで保持しているリソースを操作するための条件が全て整っていない事を通知する。
   * メソッドアノテーションとして@ExceptionHandler(BusinessException.class)を指定すると、
   * BusinessExceptionの例外をハンドリングする事ができる。
   * 
   * ステータスコードには409(Conflict)を設定し、クライアントから指定されたリソース自体には不備はないが、
   * サーバで保持しているリソースを操作するための条件が全て整っていない事を通知する。
   */
  @ExceptionHandler(BusinessException.class)
  public ResponseEntity<Object> handleBusinessException(BusinessException ex, WebRequest request) {
    return handleResultMessagesNotificationException(ex, new HttpHeaders(), HttpStatus.CONFLICT,
        request);
  }

  /*
   * 排他エラー(OptimisticLockingFailureExceptionとPessimisticLockingFailureException)をハンドリングするためのメソッドを追加
   * メソッドアノテーションとして@ExceptionHandler({ OptimisticLockingFailureException.class,
   * PessimisticLockingFailureException.class})
   * を指定すると、排他エラー(OptimisticLockingFailureExceptionとPessimisticLockingFailureException)
   * の例外をハンドリングする事ができる。
   * 
   * ステータスコードには409(Conflict)を設定し、クライアントから指定されたリソース自体には不備はないが、
   * 処理が競合したためリソースを操作するための条件を満たすことが出来なかった事を通知する。
   */
  @ExceptionHandler({OptimisticLockingFailureException.class,
      PessimisticLockingFailureException.class})
  public ResponseEntity<Object> handleLockingFailureException(Exception ex, WebRequest request) {
    return handleExceptionInternal(ex, null, new HttpHeaders(), HttpStatus.CONFLICT, request);
  }

  /*
   * Exceptionをハンドリングするためのメソッド
   * メソッドアノテーションとして@ExceptionHandler(Exception.class)を指定すると、Exceptionの例外をハンドリングする事ができる。
   * 
   * ステータスコードには500(Internal Server Error)を設定する。
   */
  @ExceptionHandler(Exception.class)
  public ResponseEntity<Object> handleSystemError(Exception ex, WebRequest request) {
    return handleExceptionInternal(ex, null, new HttpHeaders(), HttpStatus.INTERNAL_SERVER_ERROR,
        request);
  }

  // omitted

  /*
   * リソース未検出エラー及び業務エラーのエラー情報を保持するJavaBeanオブジェクトを生成する
   */
  private ResponseEntity<Object> handleResultMessagesNotificationException(
      ResultMessagesNotificationException ex, HttpHeaders headers, HttpStatus status,
      WebRequest request) {
    String errorCode = exceptionCodeResolver.resolveExceptionCode(ex);
    ApiError apiError = apiErrorCreator.createResultMessagesApiError(request, errorCode,
        ex.getResultMessages(), ex.getMessage());
    return handleExceptionInternal(ex, apiError, headers, status, request);
  }

  /*
   * 入力チェックエラーのエラー情報を保持するJavaBeanオブジェクトを生成
   */
  protected ResponseEntity<Object> handleBindingResult(Exception ex, BindingResult bindingResult,
      HttpHeaders headers, HttpStatus status, WebRequest request) {
    String code = exceptionCodeResolver.resolveExceptionCode(ex);
    String errorCode = exceptionCodeResolver.resolveExceptionCode(ex);
    ApiError apiError = apiErrorCreator.createBindingResultApiError(request, errorCode,
        bindingResult, ex.getMessage());
    return handleExceptionInternal(ex, apiError, headers, status, request);
  }

}
