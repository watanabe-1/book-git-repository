package org.watanabe.app;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Application
 */
@SpringBootApplication
// @ImportResource({"classpath:config/applicationContext.xml"})
public class Application {
  public static void main(String[] args) throws Exception {
    SpringApplication.run(Application.class, args);
  }
}
