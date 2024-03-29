package org.book.app.common.config;

import java.nio.charset.StandardCharsets;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.ViewResolver;
import org.springframework.web.servlet.view.BeanNameViewResolver;
import org.thymeleaf.extras.springsecurity6.dialect.SpringSecurityDialect;
import org.thymeleaf.spring6.SpringTemplateEngine;
import org.thymeleaf.spring6.templateresolver.SpringResourceTemplateResolver;
import org.thymeleaf.spring6.view.ThymeleafViewResolver;
import org.thymeleaf.templateresolver.ITemplateResolver;

@Configuration
public class ViewConfig {

  @Bean
  ITemplateResolver templateResolver() {
    SpringResourceTemplateResolver resolver = new SpringResourceTemplateResolver();
    resolver.setPrefix("classpath:view/");
    resolver.setSuffix(".html");
    resolver.setTemplateMode("HTML");
    resolver.setCharacterEncoding(StandardCharsets.UTF_8.name());
    return resolver;
  }

  @Bean
  SpringTemplateEngine templateEngine() {
    SpringTemplateEngine templateEngine = new SpringTemplateEngine();
    templateEngine.setTemplateResolver(templateResolver());
    templateEngine.addDialect(new SpringSecurityDialect());

    return templateEngine;
  }

  @Bean
  ViewResolver thymeleafViewResolver() {
    ThymeleafViewResolver thymeleafViewResolver = new ThymeleafViewResolver();
    thymeleafViewResolver.setTemplateEngine(templateEngine());
    thymeleafViewResolver.setCharacterEncoding(StandardCharsets.UTF_8.name());
    thymeleafViewResolver.setOrder(1);
    return thymeleafViewResolver;
  }

  @Bean
  BeanNameViewResolver beanNameViewResolver() {
    BeanNameViewResolver beanNameViewResolver = new BeanNameViewResolver();
    beanNameViewResolver.setOrder(0);
    return beanNameViewResolver;
  }

}
