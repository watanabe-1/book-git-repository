package org.watanabe.app.study.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import org.watanabe.app.common.logger.LogIdBasedLogger;

@Controller
public class TopController {

  private static final LogIdBasedLogger logger = LogIdBasedLogger.getLogger(TopController.class);

  @RequestMapping(value = "/", method = RequestMethod.GET)
  public ModelAndView top(ModelAndView model) {
    model.setViewName("top");
    // model.addObject("message", "Hello World!!");

    // logger.debug("debug log");
    // logger.info("i.ab.cd.1001", System.getProperty("user.home"));
    // logger.warn("w.ab.cd.2001", "replace_value_2");
    // logger.error("e.ab.cd.3001", "replace_value_3");
    // logger.trace("t.ab.cd.4001", "replace_value_4");
    // logger.info("i.ab.cd.1002", "replace_value_5");

    return model;
  }
}
