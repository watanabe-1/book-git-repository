package org.book.app.study.entity;

import java.util.Date;

/**
 * study用の定義
 */
public interface Entity {

  /**
   * シリアルキーを取得します.
   * 
   * @return シリアルキー
   */
  public String getSerialKey();

  /**
   * シリアルキーを設定します.
   * 
   * @param serialKey シリアルキー
   */
  public void setSerialKey(String serialKey);

  /**
   * 挿入日時を取得します.
   * 
   * @return 挿入日時
   */
  public Date getInsDate();

  /**
   * 挿入日時を設定します.
   * 
   * @param insDate 挿入日時
   */
  public void setInsDate(Date insDate);

  /**
   * 挿入ユーザーを取得します.
   * 
   * @return 挿入ユーザー
   */
  public String getInsUser();

  /**
   * 挿入ユーザーを設定します.
   * 
   * @param insUser 挿入ユーザー
   */
  public void setInsUser(String insUser);

  /**
   * 更新日時を取得します.
   * 
   * @return 更新日時
   */
  public Date getUpdDate();

  /**
   * 更新日時を設定します.
   * 
   * @param updDate 更新日時
   */
  public void setUpdDate(Date updDate);

  /**
   * 更新ユーザーを取得します.
   * 
   * @return 更新ユーザー
   */
  public String getUpdUser();

  /**
   * 更新ユーザーを設定します.
   * 
   * @param updUser 更新ユーザー
   */
  public void setUpdUser(String updUser);
}
