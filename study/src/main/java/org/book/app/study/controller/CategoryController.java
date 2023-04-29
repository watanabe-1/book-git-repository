package org.book.app.study.controller;

import javax.servlet.http.HttpServletRequest;
import org.book.app.study.api.js.CategoryApi;
import org.book.app.study.form.CategoryForm;
import org.book.app.study.util.StudyJsUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import lombok.AllArgsConstructor;

/**
 * カテゴリーコントローラー(react用)
 * 
 */
@Controller
@AllArgsConstructor
public class CategoryController {

  /**
   * カテゴリーjs用api
   */
  private final CategoryApi categoryApi;

  /**
   * カテゴリー登録画面
   * 
   * @param request リクエスト
   * @param form 送信されたデータ
   * @param model モデル
   * @return 入力画面HTML名
   */
  @RequestMapping(value = "/category/input", method = RequestMethod.GET)
  public ModelAndView input(HttpServletRequest request, @ModelAttribute CategoryForm form,
      ModelAndView model) {
    StudyJsUtil.setJsTemplate(model, "カテゴリー情報登録", request,
        "/static/js/pages/category/input/input.bundle.js", categoryApi, form);

    return model;
  }

  /**
   * カテゴリー登録画面
   * 
   * @param request リクエスト
   * @param form 送信されたデータ
   * @param model モデル
   * @return 入力画面HTML名
   */
  @RequestMapping(value = "/category/list", method = RequestMethod.GET)
  public ModelAndView list(HttpServletRequest request, @ModelAttribute CategoryForm form,
      ModelAndView model) {
    StudyJsUtil.setJsTemplate(model, "登録済みカテゴリー情報一覧", request,
        "/static/js/pages/category/list/list.bundle.js", categoryApi, form);

    return model;
  }

}
