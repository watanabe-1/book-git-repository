package org.book.app.study.service.api;

import org.book.app.study.dto.ui.common.CommonUi;
import org.springframework.stereotype.Service;

/**
 * 画面共通情報取得用サービス
 *
 */
@Service
public class CommonApiService {

  /**
   * 画面共通情報取得
   * 
   * @return 画面情報
   */
  public CommonUi getCommonInfo() {
    CommonUi ui = new CommonUi();

    return ui;
  }
}
