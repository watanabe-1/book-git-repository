package org.book.app.common.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.converter.json.MappingJackson2HttpMessageConverter;
import org.springframework.lang.NonNull;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.util.StdDateFormat;

/**
 * Jacksonの設定クラス
 *
 */
@Configuration
public class JacksonConfig {

  /**
  * ObjectMapperをカスタマイズしてBeanとして提供する。
  * 
  * @return カスタマイズされたObjectMapper
  */
  @Bean
  @NonNull
  public ObjectMapper objectMapper() {
    ObjectMapper objectMapper = new ObjectMapper();
    objectMapper.findAndRegisterModules();
    objectMapper.setDateFormat(new StdDateFormat());

    return objectMapper;
  }

  /**
   * カスタマイズされたObjectMapperを使用して、
   * MappingJackson2HttpMessageConverterをBeanとして提供する。
   * 
   * @return カスタマイズされたMappingJackson2HttpMessageConverter
   */
  @Bean
  public MappingJackson2HttpMessageConverter jsonMessageConverter() {
    MappingJackson2HttpMessageConverter converter = new MappingJackson2HttpMessageConverter();
    converter.setObjectMapper(objectMapper());

    return converter;
  }
}
