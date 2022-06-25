package org.watanabe.app.study.helper;

import java.io.UnsupportedEncodingException;
import java.nio.charset.StandardCharsets;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.springframework.web.util.UriUtils;

/**
 * ファイルダウンロードのHelperクラスを作成
 */
@Component
public class DownloadHelper {

  /**
   * 日本語対応フォーマット
   */
  private static final String CONTENT_DISPOSITION_FORMAT =
      "attachment; filename=\"%s\"; filename*=UTF-8''%s";

  /**
   * 日本語対応フォーマットでファイル名を指定
   * 
   * @param headers ヘッダー
   * @param fileName ファイル名
   */
  public void addContentDisposition(HttpHeaders headers, String fileName)
      throws UnsupportedEncodingException {
    String headerValue = String.format(CONTENT_DISPOSITION_FORMAT, fileName,
        UriUtils.encode(fileName, StandardCharsets.UTF_8.name()));
    headers.add(HttpHeaders.CONTENT_DISPOSITION, headerValue);
  }

}
