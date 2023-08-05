package org.book.app.study.dto.list;

import java.io.Serializable;
import java.util.List;
import org.book.app.study.form.CategoryForm;
import jakarta.validation.Valid;
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
