package org.slf4j.ext;

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

  private static final String UNDEFINED_MESSAGE_FORMAT = "UNDEFINED-MESSAGE id:{0} arg:{1}";
  private static final String LOG_MESSAGE_FORMAT = "[{0}] {1}";
  // クラスパスからの参照に書き方を統一のためReloadableResourceBundleMessageSourceに変更
  // private static ResourceBundleMessageSource messageSource = new ResourceBundleMessageSource();
  private static ReloadableResourceBundleMessageSource messageSource =
      new ReloadableResourceBundleMessageSource();

  static {
    messageSource.setDefaultEncoding("UTF-8");
    messageSource.setBasenames("classpath:config/properties/i18n/LogMessages");
  }

  private final Logger logger;

  public XLogger(Class<?> clazz) {
    logger = LoggerFactory.getLogger(clazz);
  }

  public boolean isDebugEnabled() {
    return logger.isDebugEnabled();
  }

  public void debug(String format, Object... args) {
    logger.debug(format, args);
  }

  public void info(String id, Object... args) {
    if (logger.isInfoEnabled()) {
      logger.info(createLogMessage(id, args));
    }
  }

  public void warn(String id, Object... args) {
    if (logger.isWarnEnabled()) {
      logger.warn(createLogMessage(id, args));
    }
  }

  public void error(String id, Object... args) {
    if (logger.isErrorEnabled()) {
      logger.error(createLogMessage(id, args));
    }
  }

  public void trace(String id, Object... args) {
    if (logger.isTraceEnabled()) {
      logger.trace(createLogMessage(id, args));
    }
  }

  public void warn(String id, Throwable t, Object... args) {
    if (logger.isWarnEnabled()) {
      logger.warn(createLogMessage(id, args), t);
    }
  }

  public void error(String id, Throwable t, Object... args) {
    if (logger.isErrorEnabled()) {
      logger.error(createLogMessage(id, args), t);
    }
  }

  private String createLogMessage(String id, Object... args) {
    return MessageFormat.format(LOG_MESSAGE_FORMAT, id, getMessage(id, args));
  }

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
