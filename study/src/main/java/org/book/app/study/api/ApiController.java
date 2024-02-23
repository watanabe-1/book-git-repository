package org.book.app.study.api;

import java.util.Locale;

import org.book.app.common.exception.BusinessException;
import org.book.app.study.dto.error.ErrorResults;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.lang.NonNull;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.XSlf4j;

/**
 * api用コントローラー親クラス
 *
 */
@RestController
@XSlf4j
public class ApiController {

  /**
   * メッセージソース 親クラスのためAutowired使用
   */
  @Autowired
  @java.lang.SuppressWarnings({ "squid:S6813" })
  protected MessageSource messageSource;

  /**
   * 連携パラメータにエラーがあった場合BindException
   * 
   * @param result バインド結果
   * @throws BindException
   */
  public void throwBindExceptionIfHasErrors(BindingResult result) throws BindException {
    // エラーがあった場合
    if (result.hasErrors()) {
      throw new BindException(result);
    }
  }

  /**
   * BindException エラーハンドリング<br/>
   * リクエストパラメータとして送信したデータをJavaBeanにバインドする際に、<br/>
   * 入力値に不正な値が指定された場合に発生する例外クラス
   * 
   * @param e BindException
   * @param locale ロケール
   */
  @ExceptionHandler(BindException.class)
  @ResponseStatus(value = HttpStatus.BAD_REQUEST)
  public ErrorResults handleBindException(BindException e, HttpServletRequest request, @NonNull Locale locale) {
    log.error("e.ex.fw.7002", e, () -> new Object[] { request.getRequestURL().toString() });

    return createErrResult(e, locale);
  }

  /**
   * BusinessException エラーハンドリング<br/>
   * 
   * 業務エラーの例外クラス
   * 
   * @param e BusinessException
   */
  @ExceptionHandler(BusinessException.class)
  @ResponseStatus(value = HttpStatus.BAD_REQUEST)
  public ErrorResults handleBusinessException(BusinessException e, HttpServletRequest request, Locale locale) {
    log.error("e.ex.fw.8001", e, () -> new Object[] { request.getRequestURL().toString() });

    return createErrResult(e, locale);
  }

  /**
   * MethodArgumentNotValidException エラーハンドリング<br/>
   * 
   * [@RequestBody] アノテーションを使用してリクエストBodyに格納されているデータを<br/>
   * JavaBeanにバインドする際に、入力値に不正な値が指定された場合に発生する例外クラス
   * 
   * @param e MethodArgumentNotValidException
   * @param locale ロケール
   */
  @ExceptionHandler(MethodArgumentNotValidException.class)
  @ResponseStatus(value = HttpStatus.BAD_REQUEST)
  public ErrorResults handleMethodArgumentNotValidException(MethodArgumentNotValidException e,
      HttpServletRequest request,
      @NonNull Locale locale) {
    log.error("e.ex.fw.7001", e, () -> new Object[] { request.getRequestURL().toString() });

    return createErrResult(e, locale);
  }

  /**
   * HttpMessageNotReadableException エラーハンドリング<br/>
   * 
   * [@RequestBody]アノテーションを使用してリクエストBodyに格納されているデータを<br/>
   * JavaBeanにバインドする際に、Bodyに格納されているデータからJavaBeanを生成できなかった場合に<br/>
   * する例外クラス
   * 
   * @param e HttpMessageNotReadableException
   * @param locale ロケール
   */
  @ExceptionHandler(HttpMessageNotReadableException.class)
  @ResponseStatus(value = HttpStatus.BAD_REQUEST)
  public ErrorResults handleHttpMessageNotReadableException(HttpMessageNotReadableException e,
      HttpServletRequest request,
      @NonNull Locale locale) {
    final String code = "e.ex.fw.7001";
    final Object[] args = new Object[] { request.getRequestURL().toString() };
    log.error(code, e, args);

    return createErrResult(code, args, locale);
  }

  /**
   * BindExceptionのエラー結果をエラー保持用javabeenにセットを行う
   * 
   * @param e BindException
   * @param locale ロケール
   * @param errorResults セット対象
   */
  private ErrorResults createErrResult(BindException e, @NonNull Locale locale) {
    ErrorResults errorResults = new ErrorResults();

    e.getBindingResult().getFieldErrors().forEach(fieldError -> {
      if (fieldError == null) {
        return;
      }
      String code = fieldError.getCode();
      if (code == null) {
        return;
      }
      String msg = messageSource.getMessage(fieldError, locale);

      errorResults.add(true, code, msg, fieldError.getField());
      log.trace(code, fieldError.getField());
    });

    e.getBindingResult().getGlobalErrors().forEach(objectError -> {
      if (objectError == null) {
        return;
      }
      String code = objectError.getCode();
      if (code == null) {
        return;
      }
      String msg = messageSource.getMessage(objectError, locale);

      errorResults.add(true, code, msg, objectError.getObjectName());
      log.trace(code, objectError.getObjectName());
    });

    return errorResults;
  }

  /**
   * BindExceptionのエラー結果をエラー保持用javabeenにセットを行う
   * 
   * @param e BindException
   * @param locale ロケール
   */
  private ErrorResults createErrResult(BusinessException e, Locale locale) {
    ErrorResults errorResults = new ErrorResults();
    String code = e.getMessageKey();
    if (code == null || locale == null) {
      return errorResults;
    }
    String msg = messageSource.getMessage(code, e.getArgs(), locale);
    errorResults.add(true, code, msg, code);
    log.trace(code, e.getArgs());

    return errorResults;
  }

  /**
   * RuntimeExceptionのエラー結果をエラー保持用javabeenにセットを行う
   * 
   * @param e RuntimeException
   * @param code メッセージコード
   * @param args メッセージ埋め込み値
   * @param locale ロケール
   * @return
   */
  private ErrorResults createErrResult(@NonNull String code, Object[] args,
      @NonNull Locale locale) {
    ErrorResults errorResults = new ErrorResults();
    String msg = messageSource.getMessage(code, args, locale);
    errorResults.add(true, code, msg, code);
    log.trace(code, args);

    return errorResults;
  }

}
