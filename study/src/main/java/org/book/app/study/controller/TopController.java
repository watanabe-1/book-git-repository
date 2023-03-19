package org.book.app.study.controller;

import javax.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import org.book.app.study.form.Form;
import org.book.app.study.util.StudyJsUtil;
import lombok.extern.slf4j.XSlf4j;

/**
 * トップコントローラー
 * 
 */
@Controller
@XSlf4j
public class TopController {

  @RequestMapping(value = "/", method = RequestMethod.GET)
  public ModelAndView top(HttpServletRequest request, ModelAndView model,
      @ModelAttribute Form form) {
    // model.addObject("message", "Hello World!!");
    // log.debug("debug log");
    log.info("i.ab.cd.1001", "study -- トップです！！！ --");
    // log.warn("w.ab.cd.2001", "replace_value_2");
    // log.error("e.ab.cd.3001", "replace_value_3");
    // log.trace("t.ab.cd.4001", "replace_value_4");
    // log.info("i.ab.cd.1002", "replace_value_5");

    StudyJsUtil.setJsTemplate(model, "study top", request,
        "/static/js/pages/top.bundle.js", null, form);

    return model;
  }
}
