package org.watanabe.app.study.dto.data;

import java.io.Serializable;
import java.util.List;
import lombok.Data;

/**
 * BOOKS:家計簿(家計簿データのチャート-データ)用クラス
 */
@Data
public class BooksChartData implements Serializable {

  /**
   * ラベル
   */
  private List<String> labels;

  /**
   * データ定義
   */
  private List<BooksChartDatasets> datasets;

}
