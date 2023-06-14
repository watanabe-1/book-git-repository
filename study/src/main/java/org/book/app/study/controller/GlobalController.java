package org.book.app.study.controller;

import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ModelAttribute;
import jakarta.servlet.http.HttpServletRequest;

/**
 * すべてのコントローラーで共通の処理を実行する
 *
 */
@ControllerAdvice
public class GlobalController {

  /**
   * Thymeleaf 3.1以降、テンプレートのセキュリティを向上させるために<br/>
   * 既存のコードに影響を与える可能性のある変数式<br/>
   * (${...}および*{...}) に対する一連の制限が加えられた<br/>
   * そのため<br/>
   * ${#httpServletRequest.getContextPath()}<br/>
   * が使用できなくなった<br/>
   * そこでThymeleaf公式が紹介していた方法である<br/>
   * コントローラー レベルで必要な情報をモデルに追加<br/>
   * を行い、コンテキストパスをThymeleafから参照できるようにする
   * 
   * @see https://www.thymeleaf.org/doc/articles/thymeleaf31whatsnew.html
   * @param request
   * @return コンテキストパス
   */
  @ModelAttribute("contextPath")
  public String contextPath(final HttpServletRequest request) {
    return request.getContextPath();
  }

}
