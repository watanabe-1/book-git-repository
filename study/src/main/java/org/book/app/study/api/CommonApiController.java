package org.book.app.study.api;

import org.book.app.study.dto.ui.common.CommonUi;
import org.book.app.study.service.api.CommonApiService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import lombok.AllArgsConstructor;

/**
 * 画面共通API
 *
 */
@RestController
@AllArgsConstructor
public class CommonApiController extends ApiController {

  /**
   * 画面共通APIサービス
   */
  private final CommonApiService commonApiService;

  /**
   * 画面共通情報取得
   * 
   * @return json(画面共通情報)
   */
  @GetMapping(value = "/common/info")
  public CommonUi getCommonInfo() {
    return commonApiService.getCommonInfo();
  }
}
