package org.book.app.study.controller;

import org.book.app.common.exception.BusinessException;
import org.springframework.beans.TypeMismatchException;
import org.springframework.boot.json.JsonParseException;
import org.springframework.dao.DataAccessException;
import org.springframework.dao.OptimisticLockingFailureException;
import org.springframework.dao.PessimisticLockingFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.lang.NonNull;
import org.springframework.validation.BindException;
import org.springframework.web.HttpMediaTypeNotSupportedException;
import org.springframework.web.HttpRequestMethodNotSupportedException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.servlet.ModelAndView;

import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.exc.UnrecognizedPropertyException;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.XSlf4j;

/**
 * アプリケーション全体の例外をハンドルするためのグローバルな例外ハンドラー
 * このクラスは、発生した例外に基づいて適切なレスポンスをクライアントに返す
 */
@ControllerAdvice
@RequiredArgsConstructor
@XSlf4j
public class GlobalExceptionController {

    /**
     * ビジネスエラー VIEW
     */
    private static final String BUSINESS_ERROR_VIEW_NAME = "errors/businessError";

    /**
     * JSONエラー VIEW
     */
    private static final String JSON_ERROR_VIEW_NAME = "errors/jsonError";

    /**
     * バリデーションエラー VIEW
     */
    private static final String VALIDATION_ERROR_VIEW_NAME = "errors/validationError";

    /**
     * タイプ不整合エラー VIEW
     */
    private static final String TYPE_MISMATCH_ERROR_VIEW_NAME = "errors/typeMismatchError";

    /**
    * ロックエラー VIEW
    */
    private static final String LOCKING_ERROR_VIEW_NAME = "errors/lockingError";

    /**
    * データアクセスエラー VIEW
    */
    private static final String DATA_ACCESS_ERROR_VIEW_NAME = "errors/dataAccessError";

    /**
    * システムエラー VIEW
    */
    private static final String SYSTEM_ERROR_VIEW_NAME = "errors/systemError";

    /**
     * エラー ATTRIBUTE
     */
    private static final String ERROR_ATTRIBUTE_NAME = "exception";

    /**
     * BusinessExceptionが発生した場合のハンドリングを行う
     *
     * @param ex 発生した例外
     * @param request リクエスト情報
     * @return エラー表示用のModelAndView
     */
    @ExceptionHandler(BusinessException.class)
    public ModelAndView handleBusinessException(BusinessException ex, HttpServletRequest request) {
        log.error("e.ex.fw.8001", ex, () -> new Object[] { request.getRequestURL().toString() });
        ModelAndView modelAndView = new ModelAndView(BUSINESS_ERROR_VIEW_NAME);
        modelAndView.addObject(ERROR_ATTRIBUTE_NAME, ex);
        modelAndView.setStatus(HttpStatus.CONFLICT);

        return modelAndView;
    }

    // 他の例外ハンドラーを以下に追加

    /**
     * HttpRequestMethodNotSupportedExceptionが発生した場合のハンドリングを行う
     *
     * @param ex 発生した例外
     * @param request リクエスト情報
     * @return エラー表示用のModelAndView
     */
    @ExceptionHandler(HttpRequestMethodNotSupportedException.class)
    public ModelAndView handleHttpRequestMethodNotSupportedException(HttpRequestMethodNotSupportedException ex,
            HttpServletRequest request) {
        log.error("e.ex.fw.6001", ex, () -> new Object[] { request.getRequestURL().toString() });
        ModelAndView modelAndView = new ModelAndView(BUSINESS_ERROR_VIEW_NAME);
        modelAndView.addObject(ERROR_ATTRIBUTE_NAME, ex);
        modelAndView.setStatus(HttpStatus.METHOD_NOT_ALLOWED);

        return modelAndView;
    }

    /**
     * HttpMediaTypeNotSupportedExceptionが発生した場合のハンドリングを行う
     *
     * @param ex 発生した例外
     * @param request リクエスト情報
     * @return エラー表示用のModelAndView
     */
    @ExceptionHandler(HttpMediaTypeNotSupportedException.class)
    public ModelAndView handleHttpMediaTypeNotSupportedException(HttpMediaTypeNotSupportedException ex,
            HttpServletRequest request) {
        log.error("e.ex.fw.6003", ex, () -> new Object[] { request.getRequestURL().toString() });
        ModelAndView modelAndView = new ModelAndView(BUSINESS_ERROR_VIEW_NAME);
        modelAndView.addObject(ERROR_ATTRIBUTE_NAME, ex);
        modelAndView.setStatus(HttpStatus.UNSUPPORTED_MEDIA_TYPE);

        return modelAndView;
    }

    /**
     * MethodArgumentNotValidExceptionを処理する
     * 主にバリデーションエラー時に発生する例外
     *
     * @param ex 発生した例外
     * @param request リクエスト情報
     * @return 適切なエラービュー
     */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ModelAndView handleMethodArgumentNotValidException(@NonNull MethodArgumentNotValidException ex,
            HttpServletRequest request) {
        log.error("e.ex.fw.7001", ex, () -> new Object[] { request.getRequestURL().toString() });

        return new ModelAndView(VALIDATION_ERROR_VIEW_NAME, ERROR_ATTRIBUTE_NAME, ex);
    }

    /**
     * BindExceptionを処理する
     * フォームオブジェクトへのバインド失敗時に発生する例外
     *
     * @param ex 発生した例外
     * @param request リクエスト情報
     * @return 適切なエラービュー
     */
    @ExceptionHandler(BindException.class)
    public ModelAndView handleBindException(@NonNull BindException ex, HttpServletRequest request) {
        log.error("e.ex.fw.7002", ex, () -> new Object[] { request.getRequestURL().toString() });

        return new ModelAndView(VALIDATION_ERROR_VIEW_NAME, ERROR_ATTRIBUTE_NAME, ex);
    }

    /**
     * JsonParseExceptionを処理する
     * JSONの解析に失敗した際に発生する例外
     *
     * @param ex 発生した例外
     * @param request リクエスト情報
     * @return 適切なエラービュー
     */
    @ExceptionHandler(JsonParseException.class)
    public ModelAndView handleJsonParseException(@NonNull JsonParseException ex, HttpServletRequest request) {
        log.error("e.ex.fw.7003", ex, () -> new Object[] { request.getRequestURL().toString() });

        return new ModelAndView(JSON_ERROR_VIEW_NAME, ERROR_ATTRIBUTE_NAME, ex);
    }

    /**
     * UnrecognizedPropertyExceptionを処理する
     * JSON内に認識されないプロパティが存在する場合に発生する例外
     *
     * @param ex 発生した例外
     * @param request リクエスト情報
     * @return 適切なエラービュー
     */
    @ExceptionHandler(UnrecognizedPropertyException.class)
    public ModelAndView handleUnrecognizedPropertyException(@NonNull UnrecognizedPropertyException ex,
            HttpServletRequest request) {
        log.error("e.ex.fw.7004", ex, () -> new Object[] { request.getRequestURL().toString() });

        return new ModelAndView(JSON_ERROR_VIEW_NAME, ERROR_ATTRIBUTE_NAME, ex);
    }

    /**
     * JsonMappingExceptionを処理する
     * JSONのオブジェクトマッピングに失敗した際に発生する例外
     *
     * @param ex 発生した例外
     * @param request リクエスト情報
     * @return 適切なエラービュー
     */
    @ExceptionHandler(JsonMappingException.class)
    public ModelAndView handleJsonMappingException(@NonNull JsonMappingException ex, HttpServletRequest request) {
        log.error("e.ex.fw.7005", ex, () -> new Object[] { request.getRequestURL().toString() });

        return new ModelAndView(JSON_ERROR_VIEW_NAME, ERROR_ATTRIBUTE_NAME, ex);
    }

    /**
     * TypeMismatchExceptionを処理する
     * リクエストパラメータの型が期待される型と異なる場合に発生する例外
     *
     * @param ex 発生した例外
     * @param request リクエスト情報
     * @return 適切なエラービュー
     */
    @ExceptionHandler(TypeMismatchException.class)
    public ModelAndView handleTypeMismatchException(@NonNull TypeMismatchException ex, HttpServletRequest request) {
        log.error("e.ex.fw.7006", ex, () -> new Object[] { request.getRequestURL().toString() });

        return new ModelAndView(TYPE_MISMATCH_ERROR_VIEW_NAME, ERROR_ATTRIBUTE_NAME, ex);
    }

    /**
     * OptimisticLockingFailureExceptionを処理する
     * 楽観的ロックによるデータアクセス処理の失敗を示す例外
     *
     * @param ex 発生した例外
     * @param request リクエスト情報
     * @return 適切なエラービュー
     */
    @ExceptionHandler(OptimisticLockingFailureException.class)
    public ModelAndView handleOptimisticLockingFailureException(@NonNull OptimisticLockingFailureException ex,
            HttpServletRequest request) {
        log.error("e.ex.fw.8002", ex, () -> new Object[] { request.getRequestURL().toString() });

        return new ModelAndView(LOCKING_ERROR_VIEW_NAME, ERROR_ATTRIBUTE_NAME, ex);
    }

    /**
     * PessimisticLockingFailureExceptionを処理する
     * 悲観的ロックによるデータアクセス処理の失敗を示す例外
     *
     * @param ex 発生した例外
     * @param request リクエスト情報
     * @return 適切なエラービュー
     */
    @ExceptionHandler(PessimisticLockingFailureException.class)
    public ModelAndView handlePessimisticLockingFailureException(@NonNull PessimisticLockingFailureException ex,
            HttpServletRequest request) {
        log.error("e.ex.fw.8002", ex, () -> new Object[] { request.getRequestURL().toString() });

        return new ModelAndView(LOCKING_ERROR_VIEW_NAME, ERROR_ATTRIBUTE_NAME, ex);
    }

    /**
     * DataAccessExceptionを処理する
     * データアクセス層で発生した一般的な例外
     *
     * @param ex 発生した例外
     * @param request リクエスト情報
     * @return 適切なエラービュー
     */
    @ExceptionHandler(DataAccessException.class)
    public ModelAndView handleDataAccessException(@NonNull DataAccessException ex, HttpServletRequest request) {
        log.error("e.ex.fw.9002", ex, () -> new Object[] { request.getRequestURL().toString() });

        return new ModelAndView(DATA_ACCESS_ERROR_VIEW_NAME, ERROR_ATTRIBUTE_NAME, ex);
    }

    /**
     * 一般的なExceptionが発生した場合のハンドリングを行う
     * 特にマッピングされていない例外タイプに対応する
     *
     * @param ex 発生した例外
     * @param request リクエスト情報
     * @return エラー表示用のModelAndView
     */
    @ExceptionHandler(Exception.class)
    public ModelAndView handleGeneralException(Exception ex, HttpServletRequest request) {
        log.error("e.xx.fw.9001", ex, () -> new Object[] { request.getRequestURL().toString() });
        ModelAndView modelAndView = new ModelAndView(SYSTEM_ERROR_VIEW_NAME);
        modelAndView.addObject(ERROR_ATTRIBUTE_NAME, ex);
        modelAndView.setStatus(HttpStatus.INTERNAL_SERVER_ERROR);

        return modelAndView;
    }
}
