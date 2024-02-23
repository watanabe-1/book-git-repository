package org.book.app.study.api;

import org.book.app.study.dto.error.ErrorDetails;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.XSlf4j;

/**
 * クライアント側エラー情報ログ出力API
 *
 */
@RestController
@AllArgsConstructor
@XSlf4j
public class LogApiController extends ApiController {

  /**
   * クライアントエラーログ
   * 
   * @return json(画面共通情報)
   */
  @PostMapping(value = "/log/error")
  public void logError(@ModelAttribute ErrorDetails errorDetails, HttpServletRequest request) {
    log.error("1.03.01.1006", errorDetails.getError());
    log.error("1.03.01.1007", errorDetails.getStackTrace());
  }
}
