package org.book.app.study.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.servlet.ModelAndView;

/**
 * ログインコントローラー
 * 
 */
@Controller
public class LoginController {

  /**
   * ログイン
   * 
   * @param model モデル
   * @return 画面表示用モデル
   */
  @GetMapping(value = "/login")
  public ModelAndView login(ModelAndView model) {
    model.setViewName("login");

    return model;
  }
}
