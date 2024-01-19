package org.book.app.study.api;

import org.book.app.study.dto.error.ErrorDetails;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import lombok.AllArgsConstructor;
import lombok.extern.slf4j.XSlf4j;

/**
 * クライアント側エラー情報ログ出力API
 *
 */
@Controller
@AllArgsConstructor
@XSlf4j
public class LogApiController extends ApiController {

  /**
   * クライアントエラーログ
   * 
   * @return json(画面共通情報)
   */
  @RequestMapping(value = "/log/error", method = RequestMethod.POST)
  @ResponseBody
  public void logError(@ModelAttribute ErrorDetails errorDetails) {
    log.error("1.03.01.1006", errorDetails.getError());
    log.error("1.03.01.1007", errorDetails.getStackTrace());
  }
}
