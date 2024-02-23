package org.book.app.study.controller;

import org.book.app.study.form.Form;
import org.book.app.study.util.StudyJsUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.servlet.ModelAndView;

import jakarta.servlet.http.HttpServletRequest;
import lombok.extern.slf4j.XSlf4j;

/**
 * トップコントローラー
 * 
 */
@Controller
@XSlf4j
public class TopController {

  @GetMapping(value = "/")
  public ModelAndView top(HttpServletRequest request, ModelAndView model,
      @ModelAttribute Form form) {
    log.info("i.ab.cd.1001", "study -- トップです！！！ --");

    StudyJsUtil.setJsTemplate(model, "study top", request,
        "/static/js/pages/common/top/top.bundle.js", null, form);
    return model;
  }
}
