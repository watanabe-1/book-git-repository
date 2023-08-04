package org.book.app.study.form;

import java.io.Serializable;

public class ImageForm implements Serializable {

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

}
