package org.slf4j.ext;

import java.nio.charset.StandardCharsets;
import java.text.MessageFormat;
import java.util.Arrays;
import java.util.Locale;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.NoSuchMessageException;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;

/**
 * slf4jが用意している拡張方法<br/>
 * lombockの@XSlf4j を使用するために作成<br/>
 * メッセージをプロパティファイル参照にする拡張クラス
 *
 */
public class XLogger {

  /**
   * ログID未定義時のログメッセージ
   */
  private static final String UNDEFINED_MESSAGE_FORMAT = "UNDEFINED-MESSAGE id:{0} arg:{1}";

  private static final String LOG_MESSAGE_FORMAT = "[{0}] {1}";

  /**
   * MessageSourceでログメッセージを取得する
   */
  private static ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();

  // staticイニシャライザにてMessageSourceを生成する
  static {
    // プロパティファイルをパースする際に使用する文字コードを指定
    messageSource.setDefaultEncoding(StandardCharsets.UTF_8.name());
    // i18nに配置したLogMessages.propertiesを読み込む
    messageSource.setBasenames("classpath:config/properties/i18n/LogMessages");
  }

  /**
   * ロガー
   */
  private final Logger logger;

  /**
   * コンストラクター<br/>
   * SLF4Jを使用
   * 
   * @param clazz クラス
   */
  public XLogger(Class<?> clazz) {
    logger = LoggerFactory.getLogger(clazz);
  }

  /**
   * DEBUGレベルのログ出力を許可しているか、判定する。
   * 
   * @return 判定結果
   */
  public boolean isDebugEnabled() {
    return logger.isDebugEnabled();
  }

  /**
  * TRACEレベルのログ出力を許可しているか、判定する。
  * 
  * @return 判定結果
  */
  public boolean isTraceEnabled() {
    return logger.isTraceEnabled();
  }

  /**
   * DEBUGレベルのログはそのままメッセージを出力
   * 
   * @param format フォーマット
   * @param args 埋め込み文字
   */
  public void debug(String format, Object... args) {
    logger.debug(format, args);
  }

  /**
   * INFOレベルのログ<br/>
   * 外部ファイルからのメッセージを読み込む
   * 
   * @param id メッセージID
   * @param args 埋め込み文字
   */
  public void info(String id, Object... args) {
    if (logger.isInfoEnabled()) {
      logger.info(createLogMessage(id, args));
    }
  }

  /**
   * WARNレベルのログ<br/>
   * 外部ファイルからのメッセージを読み込む
   * 
   * @param id メッセージID
   * @param args 埋め込み文字
   */
  public void warn(String id, Object... args) {
    if (logger.isWarnEnabled()) {
      logger.warn(createLogMessage(id, args));
    }
  }

  /**
   * ERRORレベルのログ<br/>
   * 外部ファイルからのメッセージを読み込む
   * 
   * @param id メッセージID
   * @param args 埋め込み文字
   */
  public void error(String id, Object... args) {
    if (logger.isErrorEnabled()) {
      logger.error(createLogMessage(id, args));
    }
  }

  /**
   * TRACEレベルのログ<br/>
   * 外部ファイルからのメッセージを読み込む
   * 
   * @param id メッセージID
   * @param args 埋め込み文字
   */
  public void trace(String id, Object... args) {
    if (logger.isTraceEnabled()) {
      logger.trace(createLogMessage(id, args));
    }
  }

  /**
   * TRACEレベルのログ<br/>
   * 外部ファイルからのメッセージを読み込む
   * 
   * @param id メッセージID
   * @param t the exception (throwable) to log
   * @param args 埋め込み文字
   */
  public void warn(String id, Throwable t, Object... args) {
    if (logger.isWarnEnabled()) {
      logger.warn(createLogMessage(id, args), t);
    }
  }

  /**
   * ERRORレベルのログ<br/>
   * 外部ファイルからのメッセージを読み込む
   * 
   * @param id メッセージID
   * @param t the exception (throwable) to log
   * @param args 埋め込み文字
   */
  public void error(String id, Throwable t, Object... args) {
    if (logger.isErrorEnabled()) {
      logger.error(createLogMessage(id, args), t);
    }
  }

  /**
   * ログメッセージの作成
   * 
   * @param id メッセージID
   * @param args 埋め込み文字
   * @return ログメッセージ
   */
  private String createLogMessage(String id, Object... args) {
    return MessageFormat.format(LOG_MESSAGE_FORMAT, id, getMessage(id, args));
  }

  /**
   * ログメッセージの取得
   * 
   * @param id メッセージID
   * @param args 埋め込み文字
   * @return ログメッセージ
   */
  private String getMessage(String id, Object... args) {
    String message;
    try {
      message = messageSource.getMessage(id, args, Locale.getDefault());
    } catch (NoSuchMessageException e) {
      message = MessageFormat.format(UNDEFINED_MESSAGE_FORMAT, id, Arrays.toString(args));
    }

    return message;
  }
}
