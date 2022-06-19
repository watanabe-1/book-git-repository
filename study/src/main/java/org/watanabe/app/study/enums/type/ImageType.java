package org.watanabe.app.study.enums.type;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.ToString;

/**
 * 画像の種類
 */
@AllArgsConstructor
@Getter
@ToString(of = "code")
public enum ImageType implements Type {

  CATEGORY_ICON("CATEGORY_ICON", "カテゴリーアイコン");

  /**
   * コード
   */
  private final String code;

  /**
   * 名称
   */
  private final String name;
}
