package org.book.app.common.config;

import java.util.LinkedHashMap;
import java.util.Properties;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.terasoluna.gfw.common.exception.ExceptionLogger;
import org.terasoluna.gfw.common.exception.ResultMessagesLoggingInterceptor;
import org.terasoluna.gfw.common.exception.SimpleMappingExceptionCodeResolver;
import org.terasoluna.gfw.web.exception.ExceptionLoggingFilter;
import org.terasoluna.gfw.web.exception.HandlerExceptionResolverLoggingInterceptor;
import org.terasoluna.gfw.web.exception.SystemExceptionResolver;
import jakarta.servlet.ServletException;

/**
 * エラー関係設定クラス<br/>
 * 
 */
@Aspect
@Configuration
@PropertySource("classpath:config/properties/logger.properties")
public class ExceptionConfig {

  /**
   * 例外ハンドリング
   * 
   * @return SimpleMappingExceptionCodeResolver
   */
  @Bean
  SimpleMappingExceptionCodeResolver exceptionCodeResolver() {
    SimpleMappingExceptionCodeResolver ExResolver = new SimpleMappingExceptionCodeResolver();
    LinkedHashMap<String, String> map = new LinkedHashMap<>();

    // ハンドリング対象とする例外名と、適用する「例外コード(メッセージID)」のマッピングを指定する
    map.put("ResourceNotFoundException", "e.ex.fw.5001");
    map.put("HttpRequestMethodNotSupportedException", "e.ex.fw.6001");
    map.put("MediaTypeNotAcceptableException", "e.ex.fw.6002");
    map.put("HttpMediaTypeNotSupportedException", "e.ex.fw.6003");
    map.put("MethodArgumentNotValidException", "e.ex.fw.7001");
    map.put("BindException", "e.ex.fw.7002");
    map.put("JsonParseException", "e.ex.fw.7003");
    map.put("UnrecognizedPropertyException", "e.ex.fw.7004");
    map.put("JsonMappingException", "e.ex.fw.7005");
    map.put("TypeMismatchException", "e.ex.fw.7006");
    map.put("BusinessException", "e.ex.fw.8001");
    map.put("OptimisticLockingFailureException", "e.ex.fw.8002");
    map.put("PessimisticLockingFailureException", "e.ex.fw.8002");
    map.put("DataAccessException", "e.ex.fw.9002");

    ExResolver.setExceptionMappings(map);
    // デフォルトの「例外コード(メッセージID)」を指定する。
    // 上記の設定例では、例外クラス(または親クラス)のクラス名に”BusinessException”、
    // または”ResourceNotFoundException”が含まれない場合、”e.xx.fw.9001” が例外コード(メッセージID)」となる。 -
    ExResolver.setDefaultExceptionCode("e.xx.fw.9001");

    return ExResolver;
  }

  /**
   * ExceptionLogger
   * 
   * @return StandardServletMultipartResolver
   */
  @Bean
  ExceptionLogger exceptionLogger() {
    ExceptionLogger exLogger = new ExceptionLogger();
    exLogger.setExceptionCodeResolver(exceptionCodeResolver());
    // logMessageFormatにフォーマットを定義する。 {0}は例外コード(メッセージID)、{1}はメッセージがリプレースされる
    exLogger.setLogMessageFormat("[{0}], {1}");

    return exLogger;
  }

  /**
   * 致命的なエラー、Spring MVC管理外で発生する例外を、<br/>
   * ログに出力するためのFilterクラス（ExceptionLoggingFilter）
   * 
   * @return ExceptionLoggingFilter
   */
  @Bean
  ExceptionLoggingFilter exceptionLoggingFilter() {
    ExceptionLoggingFilter exLoggerFilter = new ExceptionLoggingFilter();
    exLoggerFilter.setExceptionLogger(exceptionLogger());

    return exLoggerFilter;
  }

  /**
   * <mvc:annotation-driven> を指定した際に、自動的に登録されるHandlerExceptionResolverによって、<br/>
   * ハンドリングされない例外をハンドリングするためのクラス（SystemExceptionResolver）を、 bean定義に追加する
   * 
   * @return SystemExceptionResolver
   */
  @Bean
  SystemExceptionResolver systemExceptionResolver() {
    SystemExceptionResolver systemExceptionResolver = new SystemExceptionResolver();
    // 例外コード(メッセージID)を解決するオブジェクト
    systemExceptionResolver.setExceptionCodeResolver(exceptionCodeResolver());
    // ハンドリングの優先順位を指定する。値は、基本的に「3」
    // <mvc:annotation-driven>を指定した 際に、自動的に、登録されるクラスの方が、優先順位が上となる
    systemExceptionResolver.setOrder(3);

    // ハンドリング対象とする例外名と、遷移先となるView名のマッピングを指定する。
    // 設定では、例外クラス(または親クラス)のクラス名に”.DataAccessException”が含まれている場合、
    // ”common/error/dataAccessError”が、遷移先のView名となる。
    // 例外クラスが”ResourceNotFoundException”の場合、”common/error/resourceNotFoundError”が、
    // 遷移先のView名となる。
    Properties exceptionMappings = new Properties();
    exceptionMappings.put("ResourceNotFoundException", "errors/resourceNotFoundError");
    exceptionMappings.put("BusinessException", "errors/businessError");
    exceptionMappings.put("InvalidTransactionTokenException", "errors/transactionTokenError");
    exceptionMappings.put(".DataAccessException", "errors/dataAccessError");
    systemExceptionResolver.setExceptionMappings(exceptionMappings);

    // 遷移先となるView名と、HTTPステータスコードのマッピングを指定する。
    // 設定では、View名が”common/error/resourceNotFoundError”の場合に、
    // ”404(Not Found)”がHTTPステータスコードとなる。
    Properties statusCodes = new Properties();
    exceptionMappings.put("errors/resourceNotFoundError", "404");
    exceptionMappings.put("errors/businessError", "409");
    exceptionMappings.put("errors/transactionTokenError", "409");
    exceptionMappings.put("errors/dataAccessError", "500");
    systemExceptionResolver.setStatusCodes(statusCodes);

    // ハンドリング対象外とする例外クラスを指定する。 SystemExceptionResolverで致命的なエラーをハンドリングせず、
    // サーブレットコンテナに通知するため、jakarta.servlet.ServletExceptionを
    // ハンドリング対象外とする。
    systemExceptionResolver.setExcludedExceptions(ServletException.class);

    // 遷移するデフォルトのView名を、指定する。
    // 設定では、例外クラスに”ResourceNotFoundException”、”BusinessException”、
    // ”InvalidTransactionTokenException”や例外クラス(または親クラス)のクラス名に、
    // ”.DataAccessException”が含まれない場合、”common/error/systemError”が、
    // 遷移先のView名となる。
    systemExceptionResolver.setDefaultErrorView("errors/systemError");

    // レスポンスヘッダに設定するHTTPステータスコードのデフォルト値を指定する。
    // “500”(Internal Server Error)を設定
    systemExceptionResolver.setDefaultStatusCode(500);

    return systemExceptionResolver;
  }

  /**
   * ResultMessagesを保持する例外(BisinessException,ResourceNotFoundException)が発生した際に、<br/>
   * ログを出力するためのインタセプタクラス（ResultMessagesLoggingInterceptor）と、 <br/>
   * AOPの設定を、bean定義に追加する<br/>
   * Serviceクラス(@Serviceアノテーションが付いているクラス) Controllerクラス<br/>
   * (@Controllerアノテーションが付いているクラス)のメソッドに対して、<br/>
   * ResultMessagesLoggingInterceptorを適用する
   * 
   * @return ResultMessagesLoggingInterceptor
   */
  @Bean
  @Pointcut("within(org.springframework.stereotype.Service) || within(org.springframework.stereotype.Controller)")
  ResultMessagesLoggingInterceptor resultMessagesLoggingInterceptor() {
    ResultMessagesLoggingInterceptor rsMstInter = new ResultMessagesLoggingInterceptor();
    rsMstInter.setExceptionLogger(exceptionLogger());

    return rsMstInter;
  }

  /**
   * HandlerExceptionResolverでハンドリングされた例外を、 <br/>
   * ログに出力するためのインタセプタクラス（HandlerExceptionResolverLoggingInterceptor）と、<br/>
   * AOPの設定を、bean定義に追加<br/>
   * HandlerExceptionResolverインタフェースのresolveExceptionメソッドに対して、<br/>
   * HandlerExceptionResolverLoggingInterceptorを適用
   * 
   * @return HandlerExceptionResolverLoggingInterceptor
   */
  @Bean
  @Pointcut("execution(* org.springframework.web.servlet.HandlerExceptionResolver.resolveException(..))")
  HandlerExceptionResolverLoggingInterceptor handlerExceptionResolverLoggingInterceptor() {
    HandlerExceptionResolverLoggingInterceptor hdExRoInter =
        new HandlerExceptionResolverLoggingInterceptor();
    hdExRoInter.setExceptionLogger(exceptionLogger());

    return hdExRoInter;
  }

}
