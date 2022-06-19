package org.watanabe.app.study.controller;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
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
import org.watanabe.app.common.logger.LogIdBasedLogger;
import org.watanabe.app.study.entity.Templatechartcolour;
import org.watanabe.app.study.form.TemplatechartcolourForm;
import org.watanabe.app.study.helper.ChartColourHelper;
import org.watanabe.app.study.service.TemplatechartcolourService;
import org.watanabe.app.study.util.StudyUtil;

@Controller
public class ChartColourController {

  private static final LogIdBasedLogger logger =
      LogIdBasedLogger.getLogger(ChartColourController.class);

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
   * /chartColour/indexのデフォルトのタブ
   */
  private final String DEFALT_TAB = "tab1";

  /**
   * /chartColour/inputの保存後のタブ
   */
  private final String RESULT_TAB = "tab2";

  @RequestMapping(value = "/chartColour/input", method = RequestMethod.POST)
  public String result(@ModelAttribute @Validated TemplatechartcolourForm form,
      BindingResult result, ModelAndView model, RedirectAttributes redirectAttributes) {
    Templatechartcolour newColorTemp = chartColourHelper.getTemplatechartcolourByForm(form);
    // 保存
    TemplatechartcolourService.saveOne(newColorTemp);
    model.addObject("inputResultMessage", "保存が完了しました!");

    // redirect時に値を渡すための処理
    Map<String, String> map = new HashMap<>();
    map.put("inputResultMessage", "保存が完了しました!");
    ModelMap modelMap = new ModelMap();
    modelMap.addAttribute("map", map);
    modelMap.addAttribute("tab", RESULT_TAB);
    redirectAttributes.addFlashAttribute("model", modelMap);

    return "redirect:/chartColour/index";
    // return index(form, model, RESULT_TAB);
  }

  @RequestMapping(value = "/chartColour/delete", method = RequestMethod.POST)
  public String delete(@ModelAttribute @Validated TemplatechartcolourForm form,
      BindingResult result, ModelAndView model, RedirectAttributes redirectAttributes) {
    // 共通ユーザーの取得
    String commonuser = StudyUtil.getCommonUser();
    // redirect時に値を渡すための処理
    Map<String, String> map = new HashMap<>();

    if (commonuser.equals(form.getUserId())) {
      map.put("inputResultMessage", "デフォルトのテンプレートは削除できません!");
    } else {
      // 削除
      TemplatechartcolourService.deleteOne(form.getTemplateId());
      map.put("inputResultMessage", "削除が完了しました!");
    }

    ModelMap modelMap = new ModelMap();
    modelMap.addAttribute("map", map);
    modelMap.addAttribute("tab", RESULT_TAB);
    redirectAttributes.addFlashAttribute("model", modelMap);

    return "redirect:/chartColour/index";
    // return index(form, model, RESULT_TAB);
  }

  @RequestMapping(value = "/chartColour/changeActive", method = RequestMethod.POST)
  public String changeActive(@ModelAttribute @Validated TemplatechartcolourForm form,
      BindingResult result, ModelAndView model, RedirectAttributes redirectAttributes) {
    String user = StudyUtil.getLoginUser();
    Date date = StudyUtil.getNowDate();

    // ユーザーごとに作成し設定しているテンプレートを取得
    Templatechartcolour activeTempColour = chartColourHelper.getActiveChartColorTemp();

    // デフォルトのテンプレートを設定していなかった場合
    if (!activeTempColour.getUserId().equals(StudyUtil.getCommonUser())) {
      // 現在設定しているテンプレートを設定していない状態に変更
      TemplatechartcolourService.updateActiveAndNameById("0", activeTempColour.getTemplateName(),
          date, user, activeTempColour.getTemplateId());
    }
    // 画面で選択したテンプレートを設定
    TemplatechartcolourService.updateActiveAndNameById("1", form.getTemplateName(), date, user,
        form.getTemplateId());

    // redirect時に値を渡すための処理
    Map<String, String> map = new HashMap<>();
    map.put("chartColourResultMessage", "保存が完了しました!");
    ModelMap modelMap = new ModelMap();
    modelMap.addAttribute("map", map);
    modelMap.addAttribute("tab", DEFALT_TAB);
    redirectAttributes.addFlashAttribute("model", modelMap);

    return "redirect:/chartColour/index";
    // return index(form, model, DEFALT_TAB);
  }

  @RequestMapping(value = "/chartColour/index", method = RequestMethod.GET)
  public ModelAndView index(@ModelAttribute TemplatechartcolourForm form, ModelAndView model,
      String tab, @ModelAttribute("model") ModelMap modelMap) {
    model.setViewName("chartColour/index");
    // リダイレクトで呼ばれたときのパラメータ-
    String redirectTab = (String) modelMap.get("tab");

    if (redirectTab != null) {
      tab = redirectTab;
    } else if (StudyUtil.isNullOrEmpty(tab)) {
      tab = DEFALT_TAB;
    }

    // ユーザーごとに作成し設定しているテンプレートを取得
    List<Templatechartcolour> activeTempColour =
        TemplatechartcolourService.findByUserIdAndActive(StudyUtil.getLoginUser(), "1");
    // デフォルトユーザーのテンプレートを取得
    List<Templatechartcolour> allTempColours =
        TemplatechartcolourService.findByUserIdAndActive(StudyUtil.getCommonUser(), "1");
    // デフォルト以外のテンプレートを設定していなかったらデフォルトを設定してることになる
    // そこで
    if (activeTempColour.isEmpty()) {
      // デフォルトのテンプレートを設定しているテンプレートとしてセット
      activeTempColour = allTempColours;
    } else {
      // デフォルトのテンプレートをアクティブではない値に変更(表示用)
      Templatechartcolour newActiveTemp = allTempColours.get(0);
      newActiveTemp.setActive("0");
      allTempColours.set(0, newActiveTemp);
    }
    // ユーザーごとに作成したテンプレートを取得しデフォルトのテンプレートのリストと結合
    allTempColours.addAll(TemplatechartcolourService.findByUserId(StudyUtil.getLoginUser()));

    model.addObject("activeColour", activeTempColour.get(0));
    model.addObject("tempColourList", allTempColours);
    model.addObject("randomColourList", chartColourHelper.getRandomColourSeedCoef(4));
    model.addObject("tab", tab);
    model.addObject(tab, "active");
    // リダイレクトされたとき
    model = setModelMap(model, modelMap);

    return model;
  }

  /**
   * リダイレクトで渡されたModelMap modelMapの中身を取得しmodelにセット
   * 
   * @param model セット先
   * @param modelMap セット対象
   */
  @SuppressWarnings("unchecked")
  private ModelAndView setModelMap(ModelAndView model, ModelMap modelMap) {
    Map<String, String> map = (Map<String, String>) modelMap.get("map");
    if (map != null) {
      map.forEach((k, v) -> {
        model.addObject(k, v);
      });
    }

    return model;
  }

}
