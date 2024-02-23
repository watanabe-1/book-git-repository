package org.book.app.study.controller.thymeleaf;

import java.util.List;
import java.util.Objects;

import org.book.app.study.entity.TemplateChartcolour;
import org.book.app.study.form.TemplateChartcolourForm;
import org.book.app.study.helper.ChartColourHelper;
import org.book.app.study.service.TemplateChartcolourService;
import org.book.app.study.util.StudyModelUtil;
import org.book.app.study.util.StudyStringUtil;
import org.book.app.study.util.StudyUtil;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import lombok.RequiredArgsConstructor;

/**
 * 図の色確認コントローラ.
 *
 */
@Controller
@RequiredArgsConstructor
public class ChartColourThymeleafController {

  /**
   * チャート色テンプレート Service
   */
  private final TemplateChartcolourService templateChartcolourService;

  /**
   * 図の色 Helper
   */
  private final ChartColourHelper chartColourHelper;

  private static final String VIEW_NAME_REDIRECT_CHART_COLOUR_INDEX = "redirect:/thymeleaf/chartColour/index";

  private static final String ATTRIBUTE_NAME_INPUT_RESULT_MESSAGE = "inputResultMessage";

  /**
   * 図の色登録
   * 
   * @param form 送信されたデータ
   * @param result エラーチェック結果
   * @param model モデル
   * @param redirectAttributes リダイレクト先に引き継ぐパラメータ
   * @return リダイレクト先
   */
  @PostMapping(value = "/thymeleaf/chartColour/input")
  public ModelAndView result(@ModelAttribute @Validated @NonNull TemplateChartcolourForm form,
      BindingResult result, ModelAndView model, RedirectAttributes redirectAttributes) {
    model.setViewName(VIEW_NAME_REDIRECT_CHART_COLOUR_INDEX);
    TemplateChartcolour newColorTemp = chartColourHelper.getTemplateChartcolourByForm(form);
    // 保存
    templateChartcolourService.saveOne(newColorTemp);

    // redirect時に値を渡すための処理
    ModelMap modelMap = new ModelMap();
    modelMap.addAttribute(ATTRIBUTE_NAME_INPUT_RESULT_MESSAGE, "保存が完了しました!");
    modelMap.addAttribute("tab", chartColourHelper.getResultTab());
    redirectAttributes.addFlashAttribute(StudyModelUtil.MODEL_KEY_MODEL_MAP, modelMap);

    return model;
  }

  /**
   * 削除
   * 
   * @param form 送信されたデータ
   * @param result エラーチェック結果
   * @param model モデル
   * @param redirectAttributes リダイレクト先に引き継ぐパラメータ
   * @return リダイレクト先
   */
  @PostMapping(value = "/thymeleaf/chartColour/delete")
  public ModelAndView delete(@ModelAttribute @Validated TemplateChartcolourForm form,
      BindingResult result, ModelAndView model, RedirectAttributes redirectAttributes) {
    model.setViewName(VIEW_NAME_REDIRECT_CHART_COLOUR_INDEX);
    // redirect時に値を渡すための処理
    ModelMap modelMap = new ModelMap();

    if (Objects.equals(StudyUtil.getCommonUser(), form.getUserId())) {
      modelMap.addAttribute(ATTRIBUTE_NAME_INPUT_RESULT_MESSAGE, "デフォルトのテンプレートは削除できません!");
    } else {
      // 削除
      templateChartcolourService.deleteOne(form.getTemplateId());
      modelMap.addAttribute(ATTRIBUTE_NAME_INPUT_RESULT_MESSAGE, "削除が完了しました!");
    }

    modelMap.addAttribute("tab", chartColourHelper.getResultTab());
    redirectAttributes.addFlashAttribute(StudyModelUtil.MODEL_KEY_MODEL_MAP, modelMap);

    return model;
  }

  /**
   * 図の色使用テンプレート更新
   * 
   * @param form 送信されたデータ
   * @param result エラーチェック結果
   * @param model モデル
   * @param redirectAttributes リダイレクト先に引き継ぐパラメータ
   * @return リダイレクト先
   */
  @PostMapping(value = "/thymeleaf/chartColour/changeActive")
  public ModelAndView changeActive(@ModelAttribute @Validated TemplateChartcolourForm form,
      BindingResult result, ModelAndView model, RedirectAttributes redirectAttributes) {
    model.setViewName(VIEW_NAME_REDIRECT_CHART_COLOUR_INDEX);
    // 設定されている色テンプレートを変更
    chartColourHelper.changeActive(form.getTemplateId(), form.getTemplateName());

    // redirect時に値を渡すための処理
    ModelMap modelMap = new ModelMap();
    modelMap.addAttribute("chartColourResultMessage", "保存が完了しました!");
    modelMap.addAttribute("tab", chartColourHelper.getDefaltTab());
    redirectAttributes.addFlashAttribute(StudyModelUtil.MODEL_KEY_MODEL_MAP, modelMap);

    return model;
  }

  /**
   * 初期画面
   * 
   * @param form 送信されたデータ
   * @param model モデル
   * @param modelMap リダイレクト時の元画面セットパラメータ
   * @return 画面表示情報
   */
  @GetMapping(value = "/thymeleaf/chartColour/index")
  public ModelAndView index(@ModelAttribute TemplateChartcolourForm form, ModelAndView model,
      @ModelAttribute(StudyModelUtil.MODEL_KEY_MODEL_MAP) ModelMap modelMap) {
    model.setViewName("chartColour/index");

    String tab = form.getTab();
    // リダイレクトで呼ばれたときのパラメータ-
    String redirectTab = (String) modelMap.get("tab");

    if (redirectTab != null) {
      tab = redirectTab;
    } else if (StudyStringUtil.isNullOrEmpty(tab)) {
      tab = chartColourHelper.getDefaltTab();
    }

    // ユーザーごとに設定しているテンプレートを取得
    TemplateChartcolour activeColour = chartColourHelper.getActiveChartColorTemp();
    // ログインユーザーが作成したテンプレート(共通ユーザー分も含む)を取得
    List<TemplateChartcolour> allTempColours = chartColourHelper.getLoginUsersAllTempColours(activeColour);

    model.addObject("activeColour", activeColour);
    model.addObject("tempColourList", allTempColours);
    model.addObject("randomColourList",
        chartColourHelper.getRandomColourSeedCoef(chartColourHelper.getRandomCnt()));
    model.addObject("tab", tab);
    model.addObject(tab == null ? "" : tab, "active");

    // リダイレクトされたとき、リダイレクトもとでセットしたパラメータをセット(keyが同じ場合は上書きする)
    model.addAllObjects(modelMap);

    return model;
  }

}
