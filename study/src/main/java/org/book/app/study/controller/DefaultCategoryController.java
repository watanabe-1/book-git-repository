package org.book.app.study.controller;

import org.book.app.study.api.js.DefaultCategoryApi;
import org.book.app.study.form.DefaultCategoryForm;
import org.book.app.study.util.StudyJsUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

/**
 * デフォルトカテゴリーコントローラー(react用)
 * 
 */
@Controller
@RequiredArgsConstructor
public class DefaultCategoryController {

  /**
   * カテゴリーjs用api
   */
  private final DefaultCategoryApi defaultCategoryApi;

  /**
   * カテゴリー登録画面
   * 
   * @param request リクエスト
   * @param form 送信されたデータ
   * @param model モデル
   * @return 入力画面HTML名
   */
  @RequestMapping(value = "/defaultCategory/list", method = RequestMethod.GET)
  public ModelAndView list(HttpServletRequest request, @ModelAttribute DefaultCategoryForm form,
      ModelAndView model) {
    StudyJsUtil.setJsTemplate(model, "デフォルトカテゴリー情報一覧", request,
        "/static/js/pages/defaultCategory/list/list.bundle.js", defaultCategoryApi, form);

    return model;
  }

}
