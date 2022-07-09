package org.watanabe.app.study.entity;

import java.io.Serializable;
import java.util.Date;
import org.springframework.web.multipart.MultipartFile;
import lombok.Data;

/**
 * CATEGORY:カテゴリー(カテゴリー定義テーブル)のentityクラス
 */
@Data
public class Category implements Serializable, Entity {

  /**
   * シリアルキー
   */
  private String serialKey;

  /**
   * カテゴリーコード
   */
  private String catCode;

  /**
   * カテゴリー名
   */
  private String catName;

  /**
   * タイプ(ラジオボタン用ー 用途はとりあえず決まってないけど何か別のカテゴリーを設定したくなった時用)
   */
  private String catType;

  /**
   * メモ
   */
  private String note;

  /**
   * 画像タイプ(画像テーブル内のタイプと連動)
   */
  private String imgType;

  /**
   * 画像ID
   */
  private String imgId;

  /**
   * 有効化フラグ(有効化フラグ 1 = 有効 それ以外 = 無効)
   */
  private String active;

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
   * ICON
   */
  private MultipartFile catIcon;

  /**
   * 画像クラスの要素(親1対子1)
   */
  private Image imgIds;
}

