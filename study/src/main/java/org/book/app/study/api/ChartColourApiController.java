package org.book.app.study.api;

import java.util.List;

import org.book.app.study.dto.data.BooksChartData;
import org.book.app.study.dto.list.ChartColourFormList;
import org.book.app.study.dto.ui.chartColour.InspectionPanelUi;
import org.book.app.study.entity.TemplateChartcolour;
import org.book.app.study.form.TemplateChartcolourForm;
import org.book.app.study.helper.ChartColourHelper;
import org.book.app.study.service.api.ChartColourApiService;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lombok.AllArgsConstructor;

/**
 * 画像確認画面API
 *
 */
@RestController
@AllArgsConstructor
public class ChartColourApiController extends ApiController {

  /**
   * カテゴリー画面apiサービス
   */
  private final ChartColourApiService chartColourApiService;

  /**
   * 色確認画面用 Helper
   */
  private final ChartColourHelper chartColourHelper;

  /**
   * 画面情報取得
   * 
   * @return json(カテゴリーごとの家計簿情報)
   */
  @GetMapping(value = "/chartColour/info")
  public InspectionPanelUi getInfo() {
    return chartColourApiService.getInfo();
  }

  /**
   * リスト画面情報取得
   * 
   * @return
   * 
   * @return json(カテゴリーの一覧)
   */
  @GetMapping(value = "/chartColour/listData")
  public ChartColourFormList getListData() {
    // ユーザーごとに設定しているテンプレートを取得
    TemplateChartcolour activeColour = chartColourHelper.getActiveChartColorTemp();
    // ログインユーザーが作成したテンプレート(共通ユーザー分も含む)を取得
    List<TemplateChartcolour> allTempColours = chartColourHelper.getLoginUsersAllTempColours(activeColour);

    ChartColourFormList formList = new ChartColourFormList();
    formList.setChartColourDataList(allTempColours);

    return formList;
  }

  /**
   * 色見本の図用
   * 
   * @param qty 指定するデータの個数
   * @return json(カテゴリーごとの家計簿情報)
   */
  @GetMapping(value = "/chartColour/activeChart")
  public BooksChartData getChartColourByActive(
      @RequestParam(name = "qty", required = false) Integer qty) {
    return chartColourHelper.getActiveChartData(chartColourHelper.getQty(qty));
  }

  /**
   * 色見本の登録時の確認用
   * 
   * @param form 送信されたデータ
   * @param model モデル
   * @param qty 指定するデータの個数
   * @return json(カテゴリーごとの家計簿情報)
   */
  @PostMapping(value = "/chartColour/confirm")
  public BooksChartData chartColourBySeed(@ModelAttribute @Validated TemplateChartcolourForm form,
      ModelAndView model) {
    return chartColourHelper.getChartDataByCoeff(chartColourHelper.getQty(form.getQty()),
        form.getSeedCoeffR(), form.getSeedCoeffG(), form.getSeedCoeffB());
  }

}
