package org.watanabe.app.common.config;

import java.io.File;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.boot.web.servlet.server.ConfigurableServletWebServerFactory;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.validation.Validator;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.servlet.config.annotation.DefaultServletHandlerConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.watanabe.app.study.dto.dir.Dir;

@Configuration
public class AppConfig implements WebMvcConfigurer {

  /**
   * メッセージソースを定義
   * 
   * @return メッセージソース
   */
  @Bean
  public MessageSource messageSource() {
    ReloadableResourceBundleMessageSource messageSource =
        new ReloadableResourceBundleMessageSource();
    // ValidationMessage.propertiesを使用
    messageSource.setBasenames("classpath:config/properties/i18n/ValidationMessages",
        "classpath:config/properties/i18n/LogMessages",
        "classpath:config/properties/i18n/SpringSecurityMessages");
    // メッセージプロパティの文字コードを指定
    messageSource.setDefaultEncoding("UTF-8");
    return messageSource;
  }

  /**
   * バリデータ
   * 
   * @return バリデータ
   */
  @Bean
  public LocalValidatorFactoryBean validator() {
    LocalValidatorFactoryBean localValidatorFactoryBean = new LocalValidatorFactoryBean();
    localValidatorFactoryBean.setValidationMessageSource(messageSource());
    return localValidatorFactoryBean;
  }

  /**
   * バリデータを取得
   * 
   * @return バリデータ
   */
  @Override
  public Validator getValidator() {
    return validator();
  }

  /**
   * デフォルトサーブレットも使用
   * 
   * @return
   */
  @Bean
  WebServerFactoryCustomizer<ConfigurableServletWebServerFactory> enableDefaultServlet() {
    return (factory) -> factory.setRegisterDefaultServlet(true);
  }

  /**
   * デフォルトサーブレットの転送機能を許可
   * 
   * @return
   */
  @Override
  public void configureDefaultServletHandling(DefaultServletHandlerConfigurer configurer) {
    // デフォルトサーブレットへの転送機能を有効化
    // これを許可することによって静的コンテンツ(cssやjsなど)へのアクセスを許可
    configurer.enable();
  }

  /**
   * 静的ファイルのパスを設定
   * 
   * @return ファイルパス格納been
   */
  @Bean
  public Dir fileDir() {

    // 起動時のディレクトリをAppConfigのimageDirフィールドに保持しておく
    File fileDir = new File("src/main/webapp");
    fileDir = fileDir.getAbsoluteFile();

    // imagesフォルダがなかったら作成する
    // if (!fileDir.exists()) {
    // fileDir.mkdir();
    // }
    Dir dir = new Dir();
    dir.setStaticFileDir(fileDir);

    return dir;
  }


}
