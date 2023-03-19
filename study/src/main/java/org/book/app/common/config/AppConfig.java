package org.book.app.common.config;

import java.nio.charset.StandardCharsets;
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
import org.terasoluna.gfw.web.logging.TraceLoggingInterceptor;

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
   * org.terasoluna.gfw.web.logging.TraceLoggingInterceptorは、<br/>
   * Controllerの処理開始、終了をログ出力するHandlerInterceptorである。<br/>
   * 終了時にはControllerが返却したView名とModelに追加された属性、<br/>
   * およびControllerの処理に要した時間も出力する。<br/>
   * spring-mvc.xmlの<mvc:interceptors>内に以下のようにTraceLoggingInterceptorを追加する。<br/>
   * デフォルトでは、Controllerの処理に3秒以上かかった場合にWARNログを出力する。<br/>
   * この閾値を変える場合は、warnHandlingNanosプロパティにナノ秒単位で指定する<br/>
   * 閾値を10秒(10 * 1000 * 1000 * 1000 ナノ秒)に変更したい場合は以下のように設定すればよい。<br/>
   * このとき、10秒（10000000000ナノ秒）のようにint型の範囲を超える閾値を設定する場合は、<br/>
   * long型で値を設定する点に留意されたい。 <property name="warnHandlingNanos"<br/>
   * value="#{10L * 1000L 1000L * 1000L}"
   * 
   * @return TraceLoggingInterceptor
   */
  @Bean
  TraceLoggingInterceptor TraceLoggingInterceptor() {
    return new TraceLoggingInterceptor();
  }

  /**
   * addInterceptorsを追加<br/>
   * 複数可
   */
  @Override
  public void addInterceptors(InterceptorRegistry registry) {
    registry.addInterceptor(TraceLoggingInterceptor()).addPathPatterns("/**")
        .excludePathPatterns("/resources/**");
  }

}
