package org.watanabe.app.study.entity;

import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 * TEMPLATECHARTCOLOUR:チャートカラーマスタ(図の表示に使用するrgbaの組み合わせを管理するマスタ)のentityクラス
 */
@Data
public class Templatechartcolour implements Serializable {

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
  private Integer seedCoeffR;

  /**
   * シード値算出に使用する係数(G)(この係数を用いてシード値を算出しRGBAのGの値を算出する)
   */
  private Integer seedCoeffG;

  /**
   * シード値算出に使用する係数(B)(この係数を用いてシード値を算出しRGBAのBの値を算出する)
   */
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

}
