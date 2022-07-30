package org.watanabe.app.study.dto.data;

import java.io.Serializable;
import java.util.List;
import lombok.Data;

/**
 * BOOKS:家計簿(家計簿データのチャート-データセット)用クラス
 */
@Data
public class BooksChartDatasets implements Serializable {

  /**
   * ラベル
   */
  private String label;

  /**
   * タイプ
   */
  private String type;

  /**
   * データ
   */
  private List<Long> data;

  /**
   * 背景色
   */
  private List<String> backgroundColor;

  /**
   * ボーダー色
   */
  private List<String> borderColor;

  /**
   * hidden
   */
  private boolean hidden;

}
