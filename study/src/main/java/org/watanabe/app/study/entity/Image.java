package org.watanabe.app.study.entity;

import java.io.Serializable;
import java.util.Date;
import lombok.Data;

/**
 * IMAGE:画像パス(画像パス保存テーブル)のentityクラス
 */
@Data
public class Image implements Serializable {

  /**
   * シリアルキー
   */
  private String serialKey;

  /**
   * 画像ID
   */
  private String imgId;

  /**
   * 画像のタイプ
   */
  private String imgType;

  /**
   * 画像名
   */
  private String imgPath;

  /**
   * パス(相対/基本的にimagesフォルダ配下想定)
   */
  private String imgName;

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

