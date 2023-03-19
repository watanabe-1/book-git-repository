package org.book.app.common.config;

import java.io.IOException;
import org.apache.commons.dbcp2.BasicDataSource;
import org.aspectj.lang.annotation.Aspect;
import org.mybatis.spring.SqlSessionFactoryBean;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.PropertySource;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.core.io.DefaultResourceLoader;
import org.springframework.core.io.support.ResourcePatternResolver;
import org.springframework.core.io.support.ResourcePatternUtils;
import org.springframework.jdbc.datasource.DataSourceTransactionManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.TransactionManager;
import org.springframework.transaction.interceptor.BeanFactoryTransactionAttributeSourceAdvisor;
import org.springframework.transaction.interceptor.NameMatchTransactionAttributeSource;
import org.springframework.transaction.interceptor.RuleBasedTransactionAttribute;
import org.springframework.transaction.interceptor.TransactionInterceptor;

/**
 * DB関連設定クラス<br/>
 * プロパティファイルの読み込み<br/>
 * このjava以外でも読み込んだファイルの値は使用可能
 */
@Configuration
@PropertySource("classpath:config/properties/database.properties")
@MapperScan("org.book.app.study.mapper")
@Aspect
public class DbConfig {

  /**
   * DB接続設定<br/>
   * プロパティファイルの中身を設定
   * 
   * @return dataSource
   */
  @Bean
  @ConfigurationProperties(prefix = "jdbc")
  BasicDataSource dataSource() {
    return new BasicDataSource();
  }

  /**
   * MyBatis マッピング設定<br/>
   * 
   * @return dataSource
   * @throws IOException
   */
  @Bean
  SqlSessionFactoryBean sqlSessionFactory() throws IOException {
    SqlSessionFactoryBean sqlSessionFactoryBean = new SqlSessionFactoryBean();
    ResourcePatternResolver resolver = ResourcePatternUtils.getResourcePatternResolver(new DefaultResourceLoader());
    org.apache.ibatis.session.Configuration conf = new org.apache.ibatis.session.Configuration();
    conf.setMapUnderscoreToCamelCase(true);

    sqlSessionFactoryBean.setDataSource(dataSource());
    sqlSessionFactoryBean
        .setMapperLocations(
            resolver.getResources("classpath:config/mappers/**/*.xml"));
    sqlSessionFactoryBean.setConfiguration(conf);

    return sqlSessionFactoryBean;
  }

  /**
   * アノテーションでトランザクションを制御 <br/>
   * 
   * @return DataSourceTransactionManager
   */
  @Bean
  DataSourceTransactionManager transactionManager() {
    DataSourceTransactionManager transactionManager = new DataSourceTransactionManager();
    transactionManager.setDataSource(dataSource());

    return transactionManager;
  }

  /**
   * aopでトランザクションを制御
   * 
   * @param transactionManager
   * @return
   */
  @Bean
  BeanFactoryTransactionAttributeSourceAdvisor transactionAdvisor(
      TransactionManager transactionManager) {

    NameMatchTransactionAttributeSource source = new NameMatchTransactionAttributeSource();
    source.addTransactionalMethod("save*", new RuleBasedTransactionAttribute());
    source.addTransactionalMethod("update*", new RuleBasedTransactionAttribute());
    source.addTransactionalMethod("delete*", new RuleBasedTransactionAttribute());

    BeanFactoryTransactionAttributeSourceAdvisor advisor = new BeanFactoryTransactionAttributeSourceAdvisor();
    advisor.setTransactionAttributeSource(source);
    advisor.setAdvice(new TransactionInterceptor(transactionManager, source));
    // @Service が付与されているクラスを対象に
    // フィルタ条件を実装し、`setClassFilter`を呼び出す
    advisor.setClassFilter(clazz -> AnnotationUtils.findAnnotation(clazz, Service.class) != null);

    return advisor;
  }
}
