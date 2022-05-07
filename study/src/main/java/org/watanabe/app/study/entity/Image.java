package org.watanabe.app.study.entity;

import java.io.Serializable;
import java.util.Date;

public class Image implements Serializable {

  /* シリアルキー. */
  private String serialKey;

  /* 画像ID. */
  private String imgId;

  /* 画像タイプ. */
  private String imgType;

  /* 画像パス. */
  private String imgPath;

  /* 画像名. */
  private String imgName;

  /* メモ. */
  private String note;

  /* 挿入日時. */
  private Date insDate;

  /* 挿入ユーザー. */
  private String insUser;

  /* 更新日時. */
  private Date updDate;

  /* 更新ユーザー. */
  private String updUser;

  /**
   * シリアルキーを取得します.
   * 
   * @return シリアルキー
   */
  public String getSerialKey() {
    return serialKey;
  }

  /**
   * シリアルキーを設定します.
   * 
   * @param serialKey シリアルキー
   */
  public void setSerialKey(String serialKey) {
    this.serialKey = serialKey;
  }

  /**
   * 画像IDを取得します.
   * 
   * @return 画像ID
   */
  public String getImgId() {
    return imgId;
  }

  /**
   * 画像IDを設定します.
   * 
   * @param imgId 画像ID
   */
  public void setImgId(String imgId) {
    this.imgId = imgId;
  }

  /**
   * 画像タイプを取得します.
   * 
   * @return 画像タイプ
   */
  public String getImgType() {
    return imgType;
  }

  /**
   * 画像タイプを設定します.
   * 
   * @param imgType 画像タイプ
   */
  public void setImgType(String imgType) {
    this.imgType = imgType;
  }

  /**
   * 画像パスを取得します.
   * 
   * @return 画像パス
   */
  public String getImgPath() {
    return imgPath;
  }

  /**
   * 画像パスを設定します.
   * 
   * @param imgPath 画像パス
   */
  public void setImgPath(String imgPath) {
    this.imgPath = imgPath;
  }

  /**
   * 画像名を取得します.
   * 
   * @return 画像名
   */
  public String getImgName() {
    return imgName;
  }

  /**
   * 画像名を設定します.
   * 
   * @param imgName 画像名
   */
  public void setImgName(String imgName) {
    this.imgName = imgName;
  }

  /**
   * メモを取得します.
   * 
   * @return メモ
   */
  public String getNote() {
    return note;
  }

  /**
   * メモを設定します.
   * 
   * @param note メモ
   */
  public void setNote(String note) {
    this.note = note;
  }

  /**
   * 挿入日時を取得します.
   * 
   * @return 挿入日時
   */
  public Date getInsDate() {
    return insDate;
  }

  /**
   * 挿入日時を設定します.
   * 
   * @param insDate 挿入日時
   */
  public void setInsDate(Date insDate) {
    this.insDate = insDate;
  }

  /**
   * 挿入ユーザーを取得します.
   * 
   * @return 挿入ユーザー
   */
  public String getInsUser() {
    return insUser;
  }

  /**
   * 挿入ユーザーを設定します.
   * 
   * @param insUser 挿入ユーザー
   */
  public void setInsUser(String insUser) {
    this.insUser = insUser;
  }

  /**
   * 更新日時を取得します.
   * 
   * @return 更新日時
   */
  public Date getUpdDate() {
    return updDate;
  }

  /**
   * 更新日時を設定します.
   * 
   * @param updDate 更新日時
   */
  public void setUpdDate(Date updDate) {
    this.updDate = updDate;
  }

  /**
   * 更新ユーザーを取得します.
   * 
   * @return 更新ユーザー
   */
  public String getUpdUser() {
    return updUser;
  }

  /**
   * 更新ユーザーを設定します.
   * 
   * @param updUser 更新ユーザー
   */
  public void setUpdUser(String updUser) {
    this.updUser = updUser;
  }

}

