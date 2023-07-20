package org.book.app.study.api;

import org.book.app.study.dto.ui.common.CommonUi;
import org.book.app.study.service.api.CommonApiService;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import lombok.AllArgsConstructor;

/**
 * 画面共通API
 *
 */
@Controller
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
  @RequestMapping(value = "/common/info", method = RequestMethod.GET)
  @ResponseBody
  public CommonUi getCommonInfo() {
    return commonApiService.getCommonInfo();
  }
}
