package org.watanabe.app.common.logger;

import java.text.MessageFormat;
import java.util.Arrays;
import java.util.Locale;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.NoSuchMessageException;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;

/*
 * (1) ログID未定義時のログメッセージ。ここでは例として org.terasoluna.gfw.common.exception.ExceptionLoggerと同じメッセージを使用する。
 * (2) MessageSourceでログメッセージを取得する実装例。 メッセージデータを管理する MessageSourceは、汎用性を高めるためstatic領域に格納している。
 * このような実装をすることでDIコンテナへのアクセス可否に依存しなくなるため、Loggerラッパークラスをいつでも使用することができるようになる。 (3)
 * staticイニシャライザにてMessageSourceを生成する。 本実装ではi18nに配置したlog-messages.propertiesを読み込む。 (4)
 * プロパティファイルをパースする際に使用する文字コードを設定する。 本実装ではプロパティファイルはUTF-8エンコードとしたのでUTF-8を指定する。
 * 詳細は、メッセージ管理のプロパティに設定したメッセージの表示を参照されたい。 (5) 国際化を考慮しsetBasenamesメソッドを使用してプロパティファイルを指定する。
 * setBasenamesの詳細はResourceBundleMessageSourceが継承するAbstractResourceBasedMessageSourceクラスのJavaDocを参照されたい。
 * (6) Loggerラッパークラスにおいても、SLF4Jを使用する。ロギングライブラリの実装を直接使用しない。 (7) DEBUGレベルのログ出力を許可しているか、判定する。
 * 使用時の注意点については、ログ出力の記述の注意点を参照されたい。 (8) 本実装例ではDEBUGレベルのログにはログIDを使わない。引数のログメッセージをそのまま、ログ出力する。 (9)
 * TRACE/INFO/WARN/ERRORレベルのログはログIDに該当するログメッセージをプロパティファイルから取得して、ログ出力する。 (10)
 * getMessageを呼び出す際にプロパティファイルにログIDが記載されていないと例外:NoSuchMessageExceptionが発生する。
 * そのためNoSuchMessageExceptionをcatchし、ログIDがプロパティファイルに定義されていない旨のログメッセージを出力する。
 */
public class LogIdBasedLogger {

  private static final String UNDEFINED_MESSAGE_FORMAT = "UNDEFINED-MESSAGE id:{0} arg:{1}"; // (1)
  private static final String LOG_MESSAGE_FORMAT = "[{0}] {1}";
  // クラスパスからの参照に書き方を統一のためReloadableResourceBundleMessageSourceに変更
  // private static ResourceBundleMessageSource messageSource = new ResourceBundleMessageSource();
  private static ReloadableResourceBundleMessageSource messageSource =
      new ReloadableResourceBundleMessageSource();// (2)

  static { // (3)
    messageSource.setDefaultEncoding("UTF-8"); // (4)
    // messageSource.setBasenames("i18n/log-messages"); // (5)
    messageSource.setBasenames("classpath:config/properties/i18n/log-messages"); // (5)
  }

  private final Logger logger;

  private LogIdBasedLogger(Class<?> clazz) {
    logger = LoggerFactory.getLogger(clazz); // (6)
  }

  public static LogIdBasedLogger getLogger(Class<?> clazz) {
    return new LogIdBasedLogger(clazz);
  }

  public boolean isDebugEnabled() { // (7)
    return logger.isDebugEnabled();
  }

  public void debug(String format, Object... args) {
    logger.debug(format, args); // (8)
  }

  public void info(String id, Object... args) {
    if (logger.isInfoEnabled()) {
      logger.info(createLogMessage(id, args)); // (9)
    }
  }

  public void warn(String id, Object... args) {
    if (logger.isWarnEnabled()) {
      logger.warn(createLogMessage(id, args)); // (9)
    }
  }

  public void error(String id, Object... args) {
    if (logger.isErrorEnabled()) {
      logger.error(createLogMessage(id, args)); // (9)
    }
  }

  public void trace(String id, Object... args) {
    if (logger.isTraceEnabled()) {
      logger.trace(createLogMessage(id, args)); // (9)
    }
  }

  public void warn(String id, Throwable t, Object... args) {
    if (logger.isWarnEnabled()) {
      logger.warn(createLogMessage(id, args), t); // (9)
    }
  }

  public void error(String id, Throwable t, Object... args) {
    if (logger.isErrorEnabled()) {
      logger.error(createLogMessage(id, args), t); // (9)
    }
  }

  private String createLogMessage(String id, Object... args) {
    return MessageFormat.format(LOG_MESSAGE_FORMAT, id, getMessage(id, args));
  }

  private String getMessage(String id, Object... args) {
    String message;
    try {
      message = messageSource.getMessage(id, args, Locale.getDefault());
    } catch (NoSuchMessageException e) { // (10)
      message = MessageFormat.format(UNDEFINED_MESSAGE_FORMAT, id, Arrays.toString(args));
    }
    return message;
  }
}
