package org.book.app.study.controller;

import org.book.app.study.api.js.ChartColourApi;
import org.book.app.study.form.TemplateChartcolourForm;
import org.book.app.study.util.StudyJsUtil;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;

/**
 * 図の色確認コントローラ.
 *
 */
@Controller
@RequiredArgsConstructor
public class ChartColourController {

  /**
   * カテゴリーjs用api
   */
  private final ChartColourApi chartColourApi;

  /**
   * 図の色確認画面
   * 
   * @param request リクエスト
   * @param form 送信されたデータ
   * @param model モデル
   * @return 入力画面HTML名
   */
  @RequestMapping(value = "/chartColour/inspectionpanel", method = RequestMethod.GET)
  public ModelAndView inspectionpanel(HttpServletRequest request,
      @ModelAttribute TemplateChartcolourForm form,
      ModelAndView model) {
    StudyJsUtil.setJsTemplate(model, "図色設定画面", request,
        "/static/js/pages/chartColour/inspectionpanel/inspectionpanel.bundle.js", chartColourApi,
        form);

    return model;
  }

}
