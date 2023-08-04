package org.book.app.study.form;

import java.io.Serializable;
import org.book.app.common.validation.UploadFileMaxSize;
import org.book.app.common.validation.UploadFileMediaType;
import org.book.app.common.validation.UploadFileNotEmpty;
import org.book.app.study.util.StudyStringUtil;
import org.springframework.web.multipart.MultipartFile;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;
import lombok.Getter;
import lombok.Setter;

/**
 * カテゴリーフォームクラス
 *
 */
@Data
public class CategoryForm implements Serializable, Form {

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

  /**
   * ssr判定
   */
  private String ssr;

  /* ICON. */
  @UploadFileNotEmpty
  @UploadFileMaxSize
  @UploadFileMediaType(exts = "jpg,jpeg,png,gif", mediaTypes = "image/jpeg,image/png,image/gif")
  private MultipartFile catIcon;

  /* 画像クラスの要素(親1対子1). */
  @Getter
  @Setter
  private ImageForm imgIds;

  /* 削除フラグ. */
  @Getter
  @Setter
  private String delete;

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
    if (StudyStringUtil.isNullOrEmpty(active)) {
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
