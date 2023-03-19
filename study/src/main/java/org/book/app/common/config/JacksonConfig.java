package org.book.app.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.http.converter.json.Jackson2ObjectMapperFactoryBean;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.util.StdDateFormat;

/**
 * Jacksonの設定クラス
 *
 */
public class JacksonConfig {

  /**
   * jsonMessageConverter<br/>
   * 
   * @return MappingJackson2HttpMessageConverter
   */
  @Bean
  ObjectMapper objectMapper() {
    Jackson2ObjectMapperFactoryBean Jackson2ObjectMapperFactoryBean = new Jackson2ObjectMapperFactoryBean();
    Jackson2ObjectMapperFactoryBean.setDateFormat(new StdDateFormat());

    return Jackson2ObjectMapperFactoryBean.getObject();
  }

  /**
   * jsonMessageConverter<br/>
   * 
   * @return MappingJackson2HttpMessageConverter
   */
  @Bean
  MappingJackson2HttpMessageConverter jsonMessageConverter() {
    MappingJackson2HttpMessageConverter mapJaksonMstConver = new MappingJackson2HttpMessageConverter();
    mapJaksonMstConver.setObjectMapper(objectMapper());

    return mapJaksonMstConver;
  }
}
