package org.book.app.study.controller;

import javax.servlet.http.HttpServletRequest;
import org.book.app.study.api.js.BooksApi;
import org.book.app.study.form.BooksForm;
import org.book.app.study.util.StudyJsUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import lombok.AllArgsConstructor;

/**
 * 家計簿コントローラ.
 *
 */
@Controller
@AllArgsConstructor
public class BooksController {

  /**
   * カテゴリーjs用api
   */
  private final BooksApi booksApi;

  /**
   * 家計簿登録画面
   * 
   * @param request リクエスト
   * @param form 送信されたデータ
   * @param model モデル
   * @return 画面表示用モデル
   */
  @RequestMapping(value = "/books/input", method = RequestMethod.GET)
  public ModelAndView input(HttpServletRequest request, @ModelAttribute BooksForm form,
      ModelAndView model) {
    StudyJsUtil.setJsTemplate(model, "家計簿情報登録", request,
        "/static/js/pages/books/input/input.bundle.js", booksApi, form);

    return model;
  }

}
