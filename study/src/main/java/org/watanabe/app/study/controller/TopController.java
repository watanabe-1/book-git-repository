package org.watanabe.app.study.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import lombok.extern.slf4j.XSlf4j;

/**
 * トップコントローラー
 * 
 */
@Controller
@XSlf4j
public class TopController {

  @RequestMapping(value = "/", method = RequestMethod.GET)
  public ModelAndView top(ModelAndView model) {
    model.setViewName("top");
    // model.addObject("message", "Hello World!!");

    // log.debug("debug log");
    log.info("i.ab.cd.1001", "study -- トップ --");
    // log.warn("w.ab.cd.2001", "replace_value_2");
    // log.error("e.ab.cd.3001", "replace_value_3");
    // log.trace("t.ab.cd.4001", "replace_value_4");
    // log.info("i.ab.cd.1002", "replace_value_5");

    return model;
  }
}
