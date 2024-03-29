package org.book.app.study.controller;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Objects;

import org.book.app.common.exception.BusinessException;
import org.book.app.study.form.HogeForm;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.servlet.ModelAndView;

@Controller
public class HogeController {

  private static final String ISJAERR = "エラー";
  private static final String ISEAERR = "ERR";

  @GetMapping(value = "/hoge/input")
  public ModelAndView input(@ModelAttribute HogeForm form, ModelAndView model) {
    model.setViewName("hoge/input");
    // 画面にセット
    setSelectRadioCheckItems(model);

    return model;
  }

  @PostMapping(value = "/hoge/confirm")
  public ModelAndView confirm(@ModelAttribute @Validated HogeForm form, BindingResult result,
      ModelAndView model) {
    model.setViewName("hoge/confirm");
    // 画面にセット
    setSelectRadioCheckItems(model);

    if (result.hasErrors()) {
      return input(form, model);
    }

    return model;
  }

  @PostMapping(value = "/hoge/result")
  public ModelAndView result(@ModelAttribute @Validated HogeForm form, BindingResult result,
      ModelAndView model, @RequestParam("hogeName") String name) {
    model.setViewName("/hoge/result");
    model.addObject("message", "登録が完了しました");

    // エラー画面遷移確認用
    if (Objects.equals(name, ISJAERR) || Objects.equals(name.toUpperCase(), ISEAERR)) {
      throw new BusinessException("1.01.01.1001", "エラーです");
    }

    return model;

  }

  // パラメーターのセット
  private ModelAndView setSelectRadioCheckItems(ModelAndView model) {
    // select box
    model.addObject("selectHogeItems", getSelectedHogeItems());

    // radio botan
    model.addObject("selectHogeRadioItems", getSelectedHogeRadioItems());

    // check box
    model.addObject("selectHogeCheckBoxItems", getSelectedHogeCheckBoxItems());

    return model;
  }

  private Map<String, String> getSelectedHogeItems() {
    Map<String, String> selectMap = new LinkedHashMap<>();
    selectMap.put("key_A", "選択肢Ａは、これですよ");
    selectMap.put("key_B", "選択肢Ｂは、これですよ");
    selectMap.put("key_C", "選択肢Ｃは、これですよ");
    selectMap.put("key_D", "選択肢Ｄは、これですよ");
    selectMap.put("key_E", "選択肢Ｅは、これですよ");

    return selectMap;
  }

  private Map<String, String> getSelectedHogeRadioItems() {
    Map<String, String> selectMap = new LinkedHashMap<>();
    selectMap.put("required", "必須");
    selectMap.put("notRequired", "必須ではない");

    return selectMap;
  }

  private Map<String, String> getSelectedHogeCheckBoxItems() {
    Map<String, String> selectMap = new LinkedHashMap<>();
    selectMap.put("blue", "青");
    selectMap.put("red", "赤");
    selectMap.put("yellow", "黄色");

    return selectMap;
  }
}
