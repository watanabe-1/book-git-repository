package org.book.app.study.api;

import java.util.Locale;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.MessageSource;
import org.springframework.http.HttpStatus;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.terasoluna.gfw.common.exception.BusinessException;
import org.book.app.study.dto.error.ErrorResults;

/**
 * api用コントローラー親クラス
 *
 */
@Controller
public class ApiController {

  /**
   * メッセージソース
   */
  @Autowired
  protected MessageSource messageSource;

  /**
   * 連携パラメータにエラーがあった場合BindException
   * 
   * @param result バインド結果
   * @throws BindException
   */
  public void throwBindExceptionIfNeeded(BindingResult result) throws BindException {
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
   * @param e      BindException
   * @param locale ロケール
   */
  @ExceptionHandler(BindException.class)
  @ResponseStatus(value = HttpStatus.BAD_REQUEST)
  @ResponseBody
  public ErrorResults handleBindException(BindException e, Locale locale) {
    // エラー情報を返却するためのJavaBeanを生成し、返却
    ErrorResults errorResults = new ErrorResults();
    addErrResult(e, locale, errorResults);

    return errorResults;
  }

  /**
   * BusinessException エラーハンドリング<br/>
   * 
   * 業務エラーの例外クラス
   * 
   * @param e      MethodArgumentNotValidException
   * @param locale ロケール
   */
  @ExceptionHandler(BusinessException.class)
  @ResponseStatus(value = HttpStatus.CONFLICT)
  @ResponseBody
  public ErrorResults handleHttpBusinessException(BusinessException e, Locale locale) {
    ErrorResults errorResults = new ErrorResults();

    // implement error handling.
    // omitted

    // addErrResult(e, locale, errorResults);

    return errorResults;
  }

  /**
   * MethodArgumentNotValidException エラーハンドリング<br/>
   * 
   * [@RequestBody] アノテーションを使用してリクエストBodyに格納されているデータを<br/>
   * JavaBeanにバインドする際に、入力値に不正な値が指定された場合に発生する例外クラス
   * 
   * @param e      MethodArgumentNotValidException
   * @param locale ロケール
   */
  @ExceptionHandler(MethodArgumentNotValidException.class)
  @ResponseStatus(value = HttpStatus.BAD_REQUEST)
  @ResponseBody
  public ErrorResults handleMethodArgumentNotValidException(MethodArgumentNotValidException e,
      Locale locale) {
    ErrorResults errorResults = new ErrorResults();
    addErrResult(e, locale, errorResults);

    return errorResults;
  }

  /**
   * HttpMessageNotReadableException エラーハンドリング<br/>
   * 
   * [@RequestBody]アノテーションを使用してリクエストBodyに格納されているデータを<br/>
   * JavaBeanにバインドする際に、Bodyに格納されているデータからJavaBeanを生成できなかった場合に<br/>
   * する例外クラス
   * 
   * @param e      MethodArgumentNotValidException
   * @param locale ロケール
   */
  @ExceptionHandler(HttpMessageNotReadableException.class)
  @ResponseStatus(value = HttpStatus.BAD_REQUEST)
  @ResponseBody
  public ErrorResults handleHttpMessageNotReadableException(HttpMessageNotReadableException e,
      Locale locale) {
    ErrorResults errorResults = new ErrorResults();

    // addErrResult(e, locale, errorResults);

    return errorResults;
  }

  /**
   * BindExceptionのエラー結果をエラー保持用javabeenにセットを行う
   * 
   * @param e            BindException
   * @param locale       ロケール
   * @param errorResults セット対象
   */
  private void addErrResult(BindException e, Locale locale, ErrorResults errorResults) {
    e.getBindingResult().getFieldErrors().forEach(fieldError -> {
      errorResults.add(true, fieldError.getCode(), messageSource.getMessage(fieldError, locale),
          fieldError.getField());
    });
    e.getBindingResult().getGlobalErrors().forEach(objectError -> {
      errorResults.add(true, objectError.getCode(), messageSource.getMessage(objectError, locale),
          objectError.getObjectName());
    });
  }
}
