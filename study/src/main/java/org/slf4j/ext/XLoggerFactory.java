package org.slf4j.ext;

public class XLoggerFactory {

  /**
   * XLogger instance 返却クラス
   * 
   * @param clazz
   * @return XLogger instance
   */
  public static XLogger getXLogger(Class<?> clazz) {
    return new XLogger(clazz);
  }
}
