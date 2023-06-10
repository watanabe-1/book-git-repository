package org.book.app.study.form;

import java.io.Serializable;
import java.util.Date;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

/**
 * TEMPLATECHARTCOLOUR:チャートカラーマスタ(図の表示に使用するrgbaの組み合わせを管理するマスタ)のformクラス
 */
@Data
public class TemplatechartcolourForm implements Serializable {

  /**
   * シリアルキー
   */
  private String serialKey;

  /**
   * 色の組み合わせID
   */
  private String templateId;

  /**
   * 色の組み合わせ名
   */
  private String templateName;

  /**
   * ユーザーID
   */
  private String userId;

  /**
   * 有効化フラグ(現在設定されている 1 = 有効 それ以外 = 無効)
   */
  private String active;

  /**
   * シード値算出に使用する係数(R)(この係数を用いてシード値を算出しRGBAのRの値を算出する)
   */
  @Min(-999999999)
  @Max(999999999)
  private Integer seedCoeffR;

  /**
   * シード値算出に使用する係数(G)(この係数を用いてシード値を算出しRGBAのGの値を算出する)
   */
  @Min(-999999999)
  @Max(999999999)
  private Integer seedCoeffG;

  /**
   * シード値算出に使用する係数(B)(この係数を用いてシード値を算出しRGBAのBの値を算出する)
   */
  @Min(-999999999)
  @Max(999999999)
  private Integer seedCoeffB;

  /**
   * メモ
   */
  private String note;

  /**
   * 登録日時
   */
  private Date insDate;

  /**
   * 登録ユーザー
   */
  private String insUser;

  /**
   * 更新日時
   */
  private Date updDate;

  /**
   * 更新ユーザー
   */
  private String updUser;

  /**
   * 画面：タブ
   */
  private String tab;

  /**
   * 画面：個数
   */
  private Integer qty;

  /**
   * シード値算出に使用する係数(R)を設定します.
   * 
   * @param seedCoeffR シード値算出に使用する係数(R)
   */
  public void setSeedCoeffR(Integer seedCoeffR) {
    if (seedCoeffR == null) {
      this.seedCoeffR = 0;
    } else {
      this.seedCoeffR = seedCoeffR;
    }
  }

  /**
   * シード値算出に使用する係数(G)を設定します.
   * 
   * @param seedCoeffG シード値算出に使用する係数(G)
   */
  public void setSeedCoeffG(Integer seedCoeffG) {
    if (seedCoeffG == null) {
      this.seedCoeffG = 0;
    } else {
      this.seedCoeffG = seedCoeffG;
    }
  }

  /**
   * シード値算出に使用する係数(B)を設定します.
   * 
   * @param seedCoeffB シード値算出に使用する係数(B)
   */
  public void setSeedCoeffB(Integer seedCoeffB) {
    if (seedCoeffB == null) {
      this.seedCoeffB = 0;
    } else {
      this.seedCoeffB = seedCoeffB;
    }
  }

}
