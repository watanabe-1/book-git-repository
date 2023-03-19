package org.book.app.common.config;

import java.io.File;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.web.multipart.support.StandardServletMultipartResolver;
import org.book.app.study.dto.dir.Dir;

/**
 * ファイル関連設定クラス<br/>
 */
@Configuration
@PropertySource("classpath:config/properties/upload.properties")
public class FileConfig {

  /**
   * 静的ファイルのパスを設定
   * 
   * @return ファイルパス格納been
   */
  @Bean
  Dir fileDir() {
    // 静的ファイル配置用ディレクトリを保持しておく
    File fileDir = new File("src/main/resources/static");
    fileDir = fileDir.getAbsoluteFile();

    Dir dir = new Dir();
    dir.setStaticFileDir(fileDir);

    return dir;
  }

  /**
   * multipart-config(ファイルアップロード用)
   * 
   * @return StandardServletMultipartResolver
   */
  @Bean
  StandardServletMultipartResolver multipartResolver() {
    return new StandardServletMultipartResolver();
  }
}
