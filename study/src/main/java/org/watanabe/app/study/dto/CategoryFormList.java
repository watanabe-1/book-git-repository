package org.watanabe.app.study.dto;

import java.io.Serializable;
import java.util.List;
import javax.validation.Valid;
import org.watanabe.app.study.form.CategoryForm;
import lombok.Data;

/**
 * カテゴリー一覧画面用 データクラス
 */
@Data
public class CategoryFormList implements Serializable {

  /**
   * カテゴリーリスト
   */
  @Valid
  private List<CategoryForm> catDataList;
}
