package org.watanabe.app.study.form;

import java.io.Serializable;
import java.util.Date;
import javax.validation.constraints.Size;
import org.hibernate.validator.constraints.NotBlank;
import org.springframework.web.multipart.MultipartFile;
import org.watanabe.app.common.validation.UploadFileMaxSize;
import org.watanabe.app.common.validation.UploadFileMediaType;
import org.watanabe.app.common.validation.UploadFileNotEmpty;
import org.watanabe.app.common.validation.UploadFileRequired;
import org.watanabe.app.study.util.StudyUtil;

public class CategoryForm implements Serializable {

  /* シリアルキー. */
  private String serialKey;

  /* カテゴリーコード. */
  @NotBlank
  private String catCode;

  /* カテゴリー名. */
  @NotBlank
  @Size(min = 1, max = 256)
  private String catName;

  /* カテゴリータイプ. */
  private String catType;

  /* メモ. */
  private String note;

  /* 画像タイプ. */
  @NotBlank
  private String imgType;

  /* 画像ID. */
  private String imgId;

  /* 画像拡張子. */
  private String imgExt;

  /* アクティブフラグ. */
  private String active;

  /* 挿入日時. */
  private Date insDate;

  /* 挿入ユーザー. */
  private String insUser;

  /* 更新日時. */
  private Date updDate;

  /* 更新ユーザー. */
  private String updUser;

  /* ICON. */
  @UploadFileRequired
  @UploadFileNotEmpty
  @UploadFileMaxSize
  @UploadFileMediaType(exts = "jpg,jpeg,png,gif", mediaTypes = "image/jpeg,image/png,image/gif")
  private MultipartFile catIcon;


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
   * カテゴリーコードを取得します.
   * 
   * @return カテゴリーコード
   */
  public String getCatCode() {
    return catCode;
  }

  /**
   * カテゴリーコードを設定します.
   * 
   * @param catCode カテゴリーコード
   */
  public void setCatCode(String catCode) {
    this.catCode = catCode;
  }

  /**
   * カテゴリー名を取得します.
   * 
   * @return カテゴリー名
   */
  public String getCatName() {
    return catName;
  }

  /**
   * カテゴリー名を設定します.
   * 
   * @param catName カテゴリー名
   */
  public void setCatName(String catName) {
    this.catName = catName;
  }

  /**
   * カテゴリータイプを取得します.
   * 
   * @return カテゴリータイプ
   */
  public String getCatType() {
    return catType;
  }

  /**
   * カテゴリータイプを設定します.
   * 
   * @param catType カテゴリータイプ
   */
  public void setCatType(String catType) {
    this.catType = catType;
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
   * 画像の拡張子を取得します.
   * 
   * @return 画像の拡張子
   */
  public String getImgExt() {
    return imgExt;
  }

  /**
   * 画像の拡張子を設定します.
   * 
   * @param imgExt 画像の拡張子
   */
  public void setImgExt(String imgExt) {
    this.imgExt = imgExt;
  }

  /**
   * アクティブフラグを取得します.
   * 
   * @return アクティブフラグ
   */
  public String getActive() {
    // nullもしくは空文字の場合0を代入
    if (StudyUtil.isNullOrEmpty(active)) {
      active = "0";
    }
    return active;
  }

  /**
   * アクティブフラグを設定します.
   * 
   * @param active アクティブフラグ
   */
  public void setActive(String active) {
    this.active = active;
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

  /**
   * Iconを取得します.
   * 
   * @return Icon
   */
  public MultipartFile getCatIcon() {
    return catIcon;
  }

  /**
   * Iconを設定します.
   * 
   * @param catIcon Icon
   */
  public void setCatIcon(MultipartFile catIcon) {
    this.catIcon = catIcon;
  }

}
