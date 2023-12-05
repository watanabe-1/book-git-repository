package org.book.app.study.dto.list;

import java.io.Serializable;
import java.util.List;
import org.book.app.study.entity.TemplateChartcolour;
import jakarta.validation.Valid;
import lombok.Data;

/**
 * 色確認覧画面用 データクラス
 */
@Data
public class ChartColourFormList implements Serializable {

  /**
   * 色テンプレートリスト
   */
  @Valid
  private List<TemplateChartcolour> chartColourDataList;
}
