package org.book.app.study.dto.list;

import java.io.Serializable;
import java.util.List;
import org.book.app.study.form.DefaultCategoryForm;
import jakarta.validation.Valid;
import lombok.Data;

/**
 * デフォルトカテゴリー一覧画面用 データクラス
 */
@Data
public class DefaultCategoryFormList implements Serializable {

  /**
   * カテゴリーリスト
   */
  @Valid
  private List<DefaultCategoryForm> defCatDataList;
}
