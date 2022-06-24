package org.watanabe.app.study.helper;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Collections;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.terasoluna.gfw.common.exception.BusinessException;
import org.terasoluna.gfw.common.message.ResultMessages;
import org.watanabe.app.common.logger.LogIdBasedLogger;
import org.watanabe.app.study.entity.Templatechartcolour;
import org.watanabe.app.study.enums.dbcode.ChartColourNum;
import org.watanabe.app.study.enums.dbcode.ChartColourTab;
import org.watanabe.app.study.form.TemplatechartcolourForm;
import org.watanabe.app.study.service.TemplatechartcolourService;
import org.watanabe.app.study.util.CodeUtil;
import org.watanabe.app.study.util.StudyUtil;

/**
 * 色テンプレート確認を行うためのHelperクラスを作成
 */
@Component
public class ChartColourHelper {

  private static final LogIdBasedLogger logger =
      LogIdBasedLogger.getLogger(ChartColourHelper.class);

  /**
   * チャート色テンプレート Service
   */
  @Autowired
  private TemplatechartcolourService TemplatechartcolourService;

  /**
   * ダミーデータ作成用基準値
   */
  private static final int STANDARD_DATA = 10000;

  /**
   * ダミーデータラベル作成用基準値
   */
  private static final String STANDARD_DATA_LABEL = "項目";

  /**
   * 設定されている色テンプレートを取得
   * 
   * @return Templatechartcolour 設定されている色テンプレート
   */
  public Templatechartcolour getActiveChartColorTemp() {
    // ユーザーごとに作成し設定しているテンプレートを取得
    List<Templatechartcolour> activeTempColour =
        TemplatechartcolourService.findByUserIdAndActive(StudyUtil.getLoginUser(), "1");

    // デフォルト以外のテンプレートを設定していなかったらデフォルトを設定してることになる
    return activeTempColour.isEmpty()
        // デフォルトのテンプレートを設定しているテンプレートとしてセット
        ? TemplatechartcolourService.findByUserIdAndActive(StudyUtil.getCommonUser(), "1").get(0)
        : activeTempColour.get(0);
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
    Templatechartcolour activeTempColour = getActiveChartColorTemp();

    return getRgbaList(standard, transparency, activeTempColour.getSeedCoeffR(),
        activeTempColour.getSeedCoeffG(), activeTempColour.getSeedCoeffB());
  }

  /**
   * rgb形式で色を作成し返却
   * 
   * @param standard 作成する色の個数
   * @param transparency 透明度 (0～1の間)
   * @param coeffR シード値作成のための係数R
   * @param coeffG シード値作成のための係数G
   * @param coeffB シード値作成のための係数B
   * @return List<String> 作成した色のリスト
   */
  public List<String> getRgbaList(int standard, float transparency, int coeffR, int coeffG,
      int coeffB) {
    List<String> result = new ArrayList<>();

    for (int i = 1; i < standard + 1; i++) {
      // シード値を固定にすることによりこのメソッドの返す結果を固定にしている
      Random rand = new Random(i * coeffR);
      int r = rand.nextInt(255);
      Random rand2 = new Random(i * coeffG);
      int g = rand2.nextInt(255);
      Random rand3 = new Random(i * coeffB);
      int b = rand3.nextInt(255);
      result.add(String.format("rgba(%s,%s,%s,%s)", r, g, b, transparency));
    }

    return result;
  }

  /**
   * ランダムにシード値係数を発番
   * 
   * @param maxCnt 発番する組み合わせの個数
   * @return List<Templatechartcolour> 発番した色の組み合わせ
   */
  public List<Templatechartcolour> getRandomColourSeedCoef(int maxCnt) {
    List<Templatechartcolour> ret = new ArrayList<>();

    for (int i = 0; i < maxCnt; i++) {
      Templatechartcolour tc = new Templatechartcolour();
      Random rand = new Random();
      tc.setSeedCoeffR(rand.nextInt(999999999));
      tc.setSeedCoeffG(rand.nextInt(999999999));
      tc.setSeedCoeffB(rand.nextInt(999999999));
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
  public Templatechartcolour getTemplatechartcolourByForm(TemplatechartcolourForm form) {
    // 現在日時取得
    Date now = StudyUtil.getNowDate();
    // ログインユーザー取得
    String user = StudyUtil.getLoginUser();
    Templatechartcolour newColorTemp = new Templatechartcolour();
    newColorTemp.setTemplateId(UUID.randomUUID().toString());
    newColorTemp.setTemplateName(form.getTemplateName());
    newColorTemp.setUserId(user);
    newColorTemp.setActive("0");
    newColorTemp.setSeedCoeffR(form.getSeedCoeffR());
    newColorTemp.setSeedCoeffG(form.getSeedCoeffG());
    newColorTemp.setSeedCoeffB(form.getSeedCoeffB());
    newColorTemp.setNote(form.getNote());
    newColorTemp.setInsUser(user);
    newColorTemp.setInsDate(now);
    newColorTemp.setUpdUser(user);
    newColorTemp.setUpdDate(now);

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
    SimpleDateFormat dateFormat = new SimpleDateFormat("yyyy/MM");
    Date newDate = new Date();
    String cureentMonth = dateFormat.format(minMonth);

    for (int i = 0; i <= 12; i++) {
      Long value = map.get(cureentMonth);
      if (value == null) {
        value = (long) 0;
      }
      newMap.put(cureentMonth, value);

      try {
        newDate = dateFormat.parse(cureentMonth);
      } catch (ParseException e) {
        throw new BusinessException(ResultMessages.error().add("1.01.01.1001"));
      }
      cureentMonth = dateFormat.format(BooksHelper.getNextMonth(newDate));
    }

    return newMap;
  }

  /**
   * 図に表紙する色確認用データの個数を取得
   * 
   * @return 図に表紙する色確認用データの個数
   */
  public int getDefaltDataCnt() {
    return Integer.parseInt(CodeUtil.getCodeShort(ChartColourNum.DEFALT_DATA_CNT.getListName(),
        ChartColourNum.DEFALT_DATA_CNT.getCode()));
  }

  /**
   * 図に表紙する色確認用データの最大数を取得
   * 
   * @return 図に表紙する色確認用データの最大数
   */
  public int getMaxDataCnt() {
    return Integer.parseInt(CodeUtil.getCodeShort(ChartColourNum.MAX_DATA_CNT.getListName(),
        ChartColourNum.MAX_DATA_CNT.getCode()));
  }

  /**
   * 家計簿画面の初期表示のタブを取得
   * 
   * @return 家計簿画面の初期表示のタブ
   */
  public String getDefaltTab() {
    return CodeUtil.getCodeShort(ChartColourTab.DEFALT_TAB.getListName(),
        ChartColourTab.DEFALT_TAB.getCode());
  }

  /**
   * 家計簿画面の更新後のタブを取得
   * 
   * @return 家計簿画面の更新後のタブ
   */
  public String getResultTab() {
    return CodeUtil.getCodeShort(ChartColourTab.RESULT_TAB.getListName(),
        ChartColourTab.RESULT_TAB.getCode());
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
