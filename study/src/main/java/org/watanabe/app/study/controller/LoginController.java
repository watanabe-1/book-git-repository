package org.watanabe.app.study.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
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
  @RequestMapping(value = "/login", method = RequestMethod.GET)
  public ModelAndView login(ModelAndView model) {
    model.setViewName("login");

    return model;
  }
}
