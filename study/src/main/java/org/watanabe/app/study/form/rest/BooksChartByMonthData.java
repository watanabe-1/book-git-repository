package org.watanabe.app.study.form.rest;

import java.io.Serializable;
import java.util.List;
import lombok.Data;

/**
 * BOOKS:家計簿(家計簿データのドーナツ型チャート-データ)のjsonクラス
 */
@Data
public class BooksChartByMonthData implements Serializable {

  /**
   * ラベル
   */
  private List<String> labels;

  /**
   * データ定義
   */
  private List<BooksChartByMonthDatasets> datasets;

}
