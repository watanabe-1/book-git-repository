package org.watanabe.app.study.dto.data;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * confirm:form入力確認画面表示リスト用データ保持クラス
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class FormConfirmData {

  /**
   * ID
   */
  private int id;

  /**
   * 名前
   */
  private String name;

  /**
   * 値
   */
  private String value;

  /**
   * タイプ
   */
  private String type;

}
