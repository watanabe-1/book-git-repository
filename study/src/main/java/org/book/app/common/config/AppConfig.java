package org.book.app.common.config;

import java.nio.charset.StandardCharsets;

import org.book.app.common.logging.HttpSessionEventLoggingListener;
import org.book.app.common.logging.ReauestLoggingListener;
import org.springframework.boot.web.server.WebServerFactoryCustomizer;
import org.springframework.boot.web.servlet.server.ConfigurableServletWebServerFactory;
import org.springframework.context.MessageSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.support.ReloadableResourceBundleMessageSource;
import org.springframework.validation.Validator;
import org.springframework.validation.beanvalidation.LocalValidatorFactoryBean;
import org.springframework.web.servlet.config.annotation.DefaultServletHandlerConfigurer;
import org.springframework.web.servlet.config.annotation.InterceptorRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class AppConfig implements WebMvcConfigurer {

  /**
   * メッセージソースを定義
   * 
   * @return メッセージソース
   */
  @Bean
  MessageSource messageSource() {
    ReloadableResourceBundleMessageSource messageSource = new ReloadableResourceBundleMessageSource();
    // ValidationMessage.propertiesを使用
    messageSource.setBasenames("classpath:config/properties/i18n/ValidationMessages",
        "classpath:config/properties/i18n/LogMessages",
        "classpath:config/properties/i18n/SpringSecurityMessages");
    // メッセージプロパティの文字コードを指定
    messageSource.setDefaultEncoding(StandardCharsets.UTF_8.name());
    return messageSource;
  }

  /**
   * バリデータ
   * 
   * @return バリデータ
   */
  @Bean
  LocalValidatorFactoryBean validator() {
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
   * リクエストのトレースログ用
   * 
   * @return
   */
  @Bean
  ReauestLoggingListener TraceReauestInterceptor() {
    return new ReauestLoggingListener();
  }

  /**
   * セッションのトレースログ用
   * @return
   */
  @Bean
  public HttpSessionEventLoggingListener httpSessionEventLoggingListener() {
    return new HttpSessionEventLoggingListener();
  }

  /**
   * addInterceptorsを追加<br/>
   * 複数可
   */
  @Override
  public void addInterceptors(InterceptorRegistry registry) {
    registry.addInterceptor(TraceReauestInterceptor()).addPathPatterns("/**")
        .excludePathPatterns("/resources/**");
  }

}
