package org.slf4j.ext;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class XLoggerFactory {

  /**
   * XLogger instance 返却クラス
   * 
   * @param clazz 対象のクラス
   * @return XLogger instance
   */
  public static XLogger getXLogger(Class<?> clazz) {
    return new XLogger(clazz);
  }
}
