package org.watanabe.app.study.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * エラーコントローラー
 * 
 */
@Controller
public class ErrorController {

  @RequestMapping(value = "errors", method = RequestMethod.GET)
  public String renderErrorPage() {
    return "errors/error";
  }
}
