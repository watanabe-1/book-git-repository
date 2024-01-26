package org.book.app.study.helper;

import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.Random;
import java.util.UUID;

import org.book.app.common.exception.BusinessException;
import org.book.app.study.dto.data.BooksChartData;
import org.book.app.study.dto.data.BooksChartDatasets;
import org.book.app.study.entity.TemplateChartcolour;
import org.book.app.study.enums.dbcode.ChartColourNum;
import org.book.app.study.enums.dbcode.ChartColourRandomNum;
import org.book.app.study.enums.dbcode.ChartColourTab;
import org.book.app.study.enums.flag.ActiveFlag;
import org.book.app.study.form.TemplateChartcolourForm;
import org.book.app.study.service.TemplateChartcolourService;
import org.book.app.study.util.StudyBeanUtil;
import org.book.app.study.util.StudyCodeUtil;
import org.book.app.study.util.StudyDateUtil;
import org.book.app.study.util.StudyUtil;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

/**
 * 色テンプレート確認を行うためのHelperクラスを作成
 */
@Component
@RequiredArgsConstructor
public class ChartColourHelper {

  /**
   * チャート色テンプレート Service
   */
  private final TemplateChartcolourService templateChartcolourService;

  /**
   * ダミーデータ作成用基準値
   */
  private static final int STANDARD_DATA = 10000;

  /**
   * ダミーデータラベル作成用基準値
   */
  private static final String STANDARD_DATA_LABEL = "項目";

  /**
   * 設定されている色テンプレートを変更
   * 
   * @param templateId テンプレートid
   * @param templateName テンプレート名
   * @return 更新数
   */
  public int changeActive(String templateId, String templateName) {
    String user = StudyUtil.getLoginUser();
    Date date = StudyUtil.getNowDate();
    int cnt = 0;

    // ユーザーごとに作成し設定しているテンプレートを取得
    TemplateChartcolour activeTempColour = getActiveChartColorTemp();
    // デフォルトのテンプレートを設定していなかった場合
    if (!Objects.equals(activeTempColour.getUserId(), StudyUtil.getCommonUser())) {
      // 現在設定しているテンプレートを設定していない状態に変更
      cnt += templateChartcolourService.updateActiveAndNameById(ActiveFlag.NON_ACTIVE.getValue(),
          activeTempColour.getTemplateName(), date, user, activeTempColour.getTemplateId());
    }
    // 画面で選択したテンプレートを設定
    cnt += templateChartcolourService.updateActiveAndNameById(ActiveFlag.ACTIVE.getValue(),
        templateName, date, user, templateId);

    return cnt;
  }

  /**
   * 図用データをシード値指定で取得
   * 
   * @param qty 個数
   * @param coeffR シード値作成のための係数R
   * @param coeffG シード値作成のための係数G
   * @param coeffB シード値作成のための係数B
   * @return カテゴリーごとの図用データ
   */
  public BooksChartData getChartDataByCoeff(Integer qty, int coeffR, int coeffG, int coeffB) {
    BooksChartData bdd = new BooksChartData();
    setDummyChartDatat(bdd, qty,
        getRgbaListWithTransparency(qty, (float) 0.5, coeffR, coeffG, coeffB),
        getRgbaListWithTransparency(qty, (float) 1, coeffR, coeffG, coeffB));

    return bdd;
  }

  /**
   * アクティブな図用データ取得
   * 
   * @param qty 個数
   * @return カテゴリーごとの図用データ
   */
  public BooksChartData getActiveChartData(Integer qty) {
    BooksChartData bdd = new BooksChartData();
    setDummyChartDatat(bdd, qty, getActiveRgbaList(qty, (float) 0.5),
        getActiveRgbaList(qty, (float) 1));

    return bdd;
  }

  /**
   * ダミー図用データをセット
   * 
   * @param bdd セット対象
   * @param qty 個数
   * @param coeffR シード値作成のための係数R
   * @param coeffG シード値作成のための係数G
   * @param coeffB シード値作成のための係数B
   * @return カテゴリーごとの図用データ
   */
  public void setDummyChartDatat(BooksChartData bdd, Integer qty, List<String> backgroundColor,
      List<String> borderColor) {

    BooksChartDatasets bddd = new BooksChartDatasets();
    bddd.setBackgroundColor(backgroundColor);
    bddd.setBorderColor(borderColor);
    bddd.setData(getDummyChartData(qty));

    List<BooksChartDatasets> dataSets = new ArrayList<>();
    dataSets.add(bddd);

    bdd.setLabels(getDummyChartDataLable(qty));
    bdd.setDatasets(dataSets);
  }

  /**
   * 設定されている色テンプレートを取得
   * 
   * @return TemplateChartcolour 設定されている色テンプレート
   */
  public TemplateChartcolour getActiveChartColorTemp() {
    // ユーザーごとに作成し設定しているテンプレートを取得
    List<TemplateChartcolour> activeTempColour = templateChartcolourService
        .findByUserIdAndActive(StudyUtil.getLoginUser(), ActiveFlag.ACTIVE.getValue());

    // デフォルト以外のテンプレートを設定していなかったらデフォルトを設定してることになる
    return activeTempColour.isEmpty()
        // デフォルトのテンプレートを設定しているテンプレートとしてセット
        ? getActiveCommonCharttColorTemp()
        : activeTempColour.get(0);
  }

  /**
   * 共通色テンプレートを取得
   * 
   * @return TemplateChartcolour 共通色テンプレート
   */
  public TemplateChartcolour getActiveCommonCharttColorTemp() {
    return templateChartcolourService
        .findByUserIdAndActive(StudyUtil.getCommonUser(), ActiveFlag.ACTIVE.getValue()).get(0);
  }

  /**
   * ログインユーザーが作成したテンプレート一覧(共通ユーザー分も含む)
   * 
   * @param activeColour 現在設定している色テンプレート
   * @return ログインユーザーが作成したテンプレート一覧
   */
  public List<TemplateChartcolour> getLoginUsersAllTempColours(TemplateChartcolour activeColour) {
    String commonUserId = StudyUtil.getCommonUser();
    // ログインユーザーが作成したテンプレートを取得
    List<TemplateChartcolour> allTempColours = templateChartcolourService.findByUserId(StudyUtil.getLoginUser());

    // 現在設定しているテンプレートが共通かどうか
    if (Objects.equals(activeColour.getUserId(), commonUserId)) {
      // 共通のテンプレートを一覧の最初に追加
      allTempColours.add(0, activeColour);
    } else {
      // 現在設定しているテンプレートが共通でない場合は、共通のテンプレートを取得
      // 取得後にノンアクティブに変更(一覧の中のアクティブなテンプレートは現在設定しているものだけにしたいため)
      TemplateChartcolour commonColour = templateChartcolourService
          .findByUserIdAndActive(commonUserId, ActiveFlag.ACTIVE.getValue()).get(0);
      commonColour.setActive(ActiveFlag.NON_ACTIVE.getValue());
      allTempColours.add(0, commonColour);
    }

    return allTempColours;
  }

  /**
   * 図表示用のダミーデータの作成
   * 
   * @param qty 指定するデータの個数
   * @return List<Long> 設定されている色テンプレート
   */
  public List<Long> getDummyChartData(int qty) {
    List<Long> dummyDataList = new ArrayList<Long>();

    for (int i = 0; i < qty; i++) {
      long data = STANDARD_DATA * (i + 1);
      dummyDataList.add(data);
    }
    // 降順に並び替え
    Collections.sort(dummyDataList, Collections.reverseOrder());

    return dummyDataList;
  }

  /**
   * 図表示用のダミーラベルの作成
   * 
   * @param qty 指定するデータの個数
   * @return List<String> 設定されている色テンプレート
   */
  public List<String> getDummyChartDataLable(int qty) {
    List<String> dummyDataLabelList = new ArrayList<String>();

    for (int i = 0; i < qty; i++) {
      StringBuffer sb = new StringBuffer();
      sb.append(STANDARD_DATA_LABEL).append(i + 1);
      dummyDataLabelList.add(sb.toString());
    }

    return dummyDataLabelList;
  }

  /**
   * rgb形式で色を作成し返却
   * 
   * @param standard 作成する色の個数
   * @param transparency 透明度 (0～1の間)
   * @return List<String> 作成した色のリスト
   */
  public List<String> getActiveRgbaList(int standard, float transparency) {
    // ユーザーごとに作成し設定しているテンプレートを取得
    TemplateChartcolour activeTempColour = getActiveChartColorTemp();

    return getRgbaListWithTransparency(standard, transparency, activeTempColour.getSeedCoeffR(),
        activeTempColour.getSeedCoeffG(), activeTempColour.getSeedCoeffB());
  }

  /**
   * RGBA形式の色を作成し、指定された透明度を持つ色のリストを返します。
   * 
   * @param count 作成する色の個数
   * @param transparency 透明度 (0～1の範囲内)
   * @param seedCoeffR シード値作成のための係数R
   * @param seedCoeffG シード値作成のための係数G
   * @param seedCoeffB シード値作成のための係数B
   * @return RGBA形式の色のリスト
   */
  public List<String> getRgbaListWithTransparency(int count, float transparency, int seedCoeffR,
      int seedCoeffG, int seedCoeffB) {
    List<String> result = new ArrayList<>();
    Random rand = new Random();

    if (transparency < 0 || transparency > 1) {
      throw new BusinessException("1.01.01.1002",
          "透明度は0から1の範囲内で指定してください。");
    }

    // シード値を固定にすることによりこのメソッドの返す結果を固定にしている
    for (int i = 1; i < count + 1; i++) {
      int r = generateRandomWithSeed(i * seedCoeffR, rand);
      int g = generateRandomWithSeed(i * seedCoeffG, rand);
      int b = generateRandomWithSeed(i * seedCoeffB, rand);
      result.add(String.format("rgba(%s,%s,%s,%s)", r, g, b, transparency));
    }

    return result;
  }

  /**
   * 指定されたシード値を使用してランダムな値を生成する
   * 
   * @param seed シード値
   * @param rand ランダム生成用
   * @return 生成値
   */
  private int generateRandomWithSeed(long seed, Random rand) {
    rand.setSeed(seed);
    return rand.nextInt(255);
  }

  /**
   * ランダムにシード値係数を発番
   * 
   * @param maxCnt 発番する組み合わせの個数
   * @return List<TemplateChartcolour> 発番した色の組み合わせ
   */
  public List<TemplateChartcolour> getRandomColourSeedCoef(int maxCnt) {
    List<TemplateChartcolour> ret = new ArrayList<>();
    Random rand = new Random();
    final int MAX_BOUND = 999999999;

    for (int i = 0; i < maxCnt; i++) {
      TemplateChartcolour tc = new TemplateChartcolour();
      tc.setSeedCoeffR(rand.nextInt(MAX_BOUND));
      tc.setSeedCoeffG(rand.nextInt(MAX_BOUND));
      tc.setSeedCoeffB(rand.nextInt(MAX_BOUND));
      ret.add(tc);
    }

    return ret;
  }

  /**
   * 画面から取得したデータをentytiにセット
   * 
   * @param form 画面から取得した値
   * @return Books セットされたentity
   */
  public TemplateChartcolour getTemplateChartcolourByForm(@NonNull TemplateChartcolourForm form) {
    // ログインユーザー取得
    String user = StudyUtil.getLoginUser();

    // フォームの値をエンティティにコピーし、共通項目をセット
    TemplateChartcolour newColorTemp = new TemplateChartcolour();
    StudyBeanUtil.copyAndSetStudyEntityProperties(form, newColorTemp);

    newColorTemp.setTemplateId(UUID.randomUUID().toString());
    newColorTemp.setUserId(user);
    newColorTemp.setActive(ActiveFlag.NON_ACTIVE.getValue());

    return newColorTemp;
  }

  /**
   * データがない月があった場合、空のデータをセット
   * 
   * @param map セット対象のmap
   * @return minMonth 基準となる最小月
   */
  public Map<String, Long> setEntityMapByYear(Map<String, Long> map, Date minMonth) {
    Map<String, Long> newMap = new LinkedHashMap<>();
    Date newDate = new Date();
    String cureentMonth = StudyDateUtil.getYearMonth(minMonth);

    for (int i = 0; i <= 12; i++) {
      Long value = map.get(cureentMonth);
      if (value == null) {
        value = (long) 0;
      }

      newMap.put(cureentMonth, value);
      newDate = StudyDateUtil.strToDate(cureentMonth, StudyDateUtil.FMT_YEAR_MONTH_SLASH);
      cureentMonth = StudyDateUtil.getYearMonth(StudyDateUtil.getNextMonth(newDate));
    }

    return newMap;
  }

  /**
   * 図に表紙する色確認用データの個数を取得
   * 
   * @return 図に表紙する色確認用データの個数
   */
  public int getDefaltDataCnt() {
    return Integer.parseInt(StudyCodeUtil.getShort(ChartColourNum.DEFALT_DATA_CNT.getListName(),
        ChartColourNum.DEFALT_DATA_CNT.getCode()));
  }

  /**
   * 図に表紙する色確認用データの最大数を取得
   * 
   * @return 図に表紙する色確認用データの最大数
   */
  public int getMaxDataCnt() {
    return Integer.parseInt(StudyCodeUtil.getShort(ChartColourNum.MAX_DATA_CNT.getListName(),
        ChartColourNum.MAX_DATA_CNT.getCode()));
  }

  /**
   * 家計簿画面の初期表示のタブを取得
   * 
   * @return 家計簿画面の初期表示のタブ
   */
  public String getDefaltTab() {
    return StudyCodeUtil.getShort(ChartColourTab.DEFALT_TAB.getListName(),
        ChartColourTab.DEFALT_TAB.getCode());
  }

  /**
   * 家計簿画面の更新後のタブを取得
   * 
   * @return 家計簿画面の更新後のタブ
   */
  public String getResultTab() {
    return StudyCodeUtil.getShort(ChartColourTab.RESULT_TAB.getListName(),
        ChartColourTab.RESULT_TAB.getCode());
  }

  /**
   * 家計簿画面のランダムタブ表示数を取得
   * 
   * @return ランダムタブ表示数を取得
   */
  public int getRandomCnt() {
    return Integer
        .parseInt(StudyCodeUtil.getShort(ChartColourRandomNum.RANDOM_DATA_CNT.getListName(),
            ChartColourRandomNum.RANDOM_DATA_CNT.getCode()));
  }

  /**
   * 個数を取得
   * 
   * @param qty 個数
   * @return 図に表紙する色確認用データの最大数
   */
  public int getQty(Integer qty) {
    if (qty == null || qty == 0 || qty > getMaxDataCnt()) {
      qty = getDefaltDataCnt();
    }

    return qty;
  }

}
