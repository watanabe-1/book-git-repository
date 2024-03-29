package org.book.app.study.controller;

import org.book.app.study.api.js.BooksApi;
import org.book.app.study.form.BooksConvertForm;
import org.book.app.study.form.BooksForm;
import org.book.app.study.util.StudyJsUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.servlet.ModelAndView;

import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

/**
 * 家計簿コントローラ.
 *
 */
@Controller
@RequiredArgsConstructor
public class BooksController {

  /**
   * 家計簿js用api
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
  @GetMapping(value = "/books/input")
  public ModelAndView input(HttpServletRequest request, @ModelAttribute BooksForm form,
      ModelAndView model) {
    StudyJsUtil.setJsTemplate(model, "家計簿情報登録", request,
        "/static/js/pages/books/input/input.bundle.js", booksApi, form);

    return model;
  }

  /**
   * 家計簿出力画面
   * 
   * @param request リクエスト
   * @param form 送信されたデータ
   * @param model モデル
   * @return 画面表示用モデル
   */
  @GetMapping(value = "/books/export")
  public ModelAndView export(HttpServletRequest request, @ModelAttribute BooksForm form,
      ModelAndView model) {
    StudyJsUtil.setJsTemplate(model, "家計簿情報出力", request,
        "/static/js/pages/books/export/export.bundle.js", booksApi, form);

    return model;
  }

  /**
   * 家計簿確認画面
   * 
   * @param request リクエスト
   * @param form 送信されたデータ
   * @param model モデル
   * @return 画面表示用モデル
   */
  @GetMapping(value = "/books/household")
  public ModelAndView household(HttpServletRequest request, @ModelAttribute BooksForm form,
      ModelAndView model) {
    StudyJsUtil.setJsTemplate(model, "家計簿確認画面", request,
        "/static/js/pages/books/household/household.bundle.js", booksApi, form);

    return model;
  }

  /**
   * 家計簿データ変換画面
   * 
   * @param request リクエスト
   * @param form 送信されたデータ
   * @param model モデル
   * @return 画面表示用モデル
   */
  @GetMapping(value = "/books/convert")
  public ModelAndView convert(HttpServletRequest request, @ModelAttribute BooksConvertForm form,
      ModelAndView model) {
    StudyJsUtil.setJsTemplate(model, "家計簿変換画面", request,
        "/static/js/pages/books/convert/convert.bundle.js", booksApi, form);

    return model;
  }
}
