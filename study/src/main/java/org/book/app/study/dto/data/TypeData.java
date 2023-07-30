package org.book.app.study.dto.data;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * enumのtypeの動的変更項目保持クラス
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class TypeData {

  /**
   * コード
   */
  private String code;

  /**
   * 名前
   */
  private String name;

}
