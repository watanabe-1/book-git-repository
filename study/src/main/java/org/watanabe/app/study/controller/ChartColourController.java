package org.watanabe.app.study.controller;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.ModelMap;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.watanabe.app.study.entity.Templatechartcolour;
import org.watanabe.app.study.form.TemplatechartcolourForm;
import org.watanabe.app.study.helper.ChartColourHelper;
import org.watanabe.app.study.service.TemplatechartcolourService;
import org.watanabe.app.study.util.StudyModelUtil;
import org.watanabe.app.study.util.StudyStringUtil;
import org.watanabe.app.study.util.StudyUtil;

/**
 * 図の色確認コントローラ.
 *
 */
@Controller
public class ChartColourController {

  /**
   * チャート色テンプレート Service
   */
  @Autowired
  private TemplatechartcolourService TemplatechartcolourService;

  /**
   * 図の色 Helper
   */
  @Autowired
  private ChartColourHelper chartColourHelper;

  /**
   * 図の色登録
   * 
   * @param form 送信されたデータ
   * @param result エラーチェック結果
   * @param model モデル
   * @param redirectAttributes リダイレクト先に引き継ぐパラメータ
   * @return リダイレクト先
   */
  @RequestMapping(value = "/chartColour/input", method = RequestMethod.POST)
  public String result(@ModelAttribute @Validated TemplatechartcolourForm form,
      BindingResult result, ModelAndView model, RedirectAttributes redirectAttributes) {
    Templatechartcolour newColorTemp = chartColourHelper.getTemplatechartcolourByForm(form);
    // 保存
    TemplatechartcolourService.saveOne(newColorTemp);

    // redirect時に値を渡すための処理
    ModelMap modelMap = new ModelMap();
    modelMap.addAttribute("inputResultMessage", "保存が完了しました!");
    modelMap.addAttribute("tab", chartColourHelper.getResultTab());
    redirectAttributes.addFlashAttribute(StudyModelUtil.MODEL_KEY_MODELMAP_NAME, modelMap);

    return "redirect:/chartColour/index";
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
  @RequestMapping(value = "/chartColour/delete", method = RequestMethod.POST)
  public String delete(@ModelAttribute @Validated TemplatechartcolourForm form,
      BindingResult result, ModelAndView model, RedirectAttributes redirectAttributes) {
    // redirect時に値を渡すための処理
    ModelMap modelMap = new ModelMap();

    if (StudyUtil.getCommonUser().equals(form.getUserId())) {
      modelMap.addAttribute("inputResultMessage", "デフォルトのテンプレートは削除できません!");
    } else {
      // 削除
      TemplatechartcolourService.deleteOne(form.getTemplateId());
      modelMap.addAttribute("inputResultMessage", "削除が完了しました!");
    }

    modelMap.addAttribute("tab", chartColourHelper.getResultTab());
    redirectAttributes.addFlashAttribute(StudyModelUtil.MODEL_KEY_MODELMAP_NAME, modelMap);

    return "redirect:/chartColour/index";
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
  @RequestMapping(value = "/chartColour/changeActive", method = RequestMethod.POST)
  public String changeActive(@ModelAttribute @Validated TemplatechartcolourForm form,
      BindingResult result, ModelAndView model, RedirectAttributes redirectAttributes) {
    // 設定されている色テンプレートを変更
    chartColourHelper.changeActive(form.getTemplateId(), form.getTemplateName());

    // redirect時に値を渡すための処理
    ModelMap modelMap = new ModelMap();
    modelMap.addAttribute("chartColourResultMessage", "保存が完了しました!");
    modelMap.addAttribute("tab", chartColourHelper.getDefaltTab());
    redirectAttributes.addFlashAttribute(StudyModelUtil.MODEL_KEY_MODELMAP_NAME, modelMap);

    return "redirect:/chartColour/index";
  }

  /**
   * 初期画面
   * 
   * @param form 送信されたデータ
   * @param model モデル
   * @param modelMap リダイレクト時の元画面セットパラメータ
   * @return 画面表示情報
   */
  @RequestMapping(value = "/chartColour/index", method = RequestMethod.GET)
  public ModelAndView index(@ModelAttribute TemplatechartcolourForm form, ModelAndView model,
      @ModelAttribute(StudyModelUtil.MODEL_KEY_MODELMAP_NAME) ModelMap modelMap) {
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
    Templatechartcolour activeColour = chartColourHelper.getActiveChartColorTemp();
    // ログインユーザーが作成したテンプレート(共通ユーザー分も含む)を取得
    List<Templatechartcolour> allTempColours =
        chartColourHelper.getLoginUsersAllTempColours(activeColour);

    model.addObject("activeColour", activeColour);
    model.addObject("tempColourList", allTempColours);
    model.addObject("randomColourList",
        chartColourHelper.getRandomColourSeedCoef(chartColourHelper.getRandomCnt()));
    model.addObject("tab", tab);
    model.addObject(tab, "active");

    // リダイレクトされたとき、リダイレクトもとでセットしたパラメータをセット(keyが同じ場合は上書きする)
    model.addAllObjects(modelMap);

    return model;
  }

}
