package org.book.app.study.service.api;

import org.book.app.study.dto.ui.chartColour.InspectionPanelUi;
import org.book.app.study.enums.flag.ActiveFlag;
import org.book.app.study.enums.flag.DeleteFlag;
import org.book.app.study.helper.ChartColourHelper;
import org.book.app.study.util.StudyUtil;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

/**
 * 色確認画面情報取得用サービス
 *
 */
@Service
@RequiredArgsConstructor
public class ChartColourApiService {

  /**
   * 色確認 Helper
   */
  private final ChartColourHelper chartColourHelper;

  /**
   * 画面情報取得
   * 
   * @return 画面情報
   */
  public InspectionPanelUi getInfo() {
    String tab = chartColourHelper.getDefaltTab();

    InspectionPanelUi ui = new InspectionPanelUi();
    ui.setTab(tab);
    ui.setActive(ActiveFlag.ACTIVE);
    ui.setDelete(DeleteFlag.DELETE);
    ui.setDate(StudyUtil.getNowDate().toLocalDate());

    return ui;
  }
}
