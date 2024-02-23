package org.book.app.study.helper;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;

import org.book.app.common.exception.BusinessException;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;

import jakarta.servlet.http.HttpServletResponse;

/**
 * ファイルダウンロードのHelperクラスを作成
 */
@Component
public class DownloadHelper {

  /**
   * 日本語対応フォーマットでファイル名を指定
   * 
   * @param headers ヘッダー
   * @param fileName ファイル名
   */
  public void addContentDisposition(HttpHeaders headers, String fileName) {
    String headerValue = buildContentDisposition(fileName, StandardCharsets.UTF_8);
    headers.add(HttpHeaders.CONTENT_DISPOSITION, headerValue);
  }

  /**
   * 日本語対応フォーマットでファイル名を指定
   * 
   * @param response レスポンス
   * @param fileName ファイル名
   * @param contentType コンテンツタイプ
   */
  public void addContentDisposition(HttpServletResponse response, String fileName,
      String contentType) {
    String headerValue = buildContentDisposition(fileName, StandardCharsets.UTF_8);
    response.setHeader(HttpHeaders.CONTENT_DISPOSITION, headerValue);
    response.setContentType(contentType);
  }

  /**
   * CONTENT_DISPOSITIONの作成
   * 
   * @param fileName ファイル名
   * @param charset 文字コード
   * @return
   */
  public String buildContentDisposition(String fileName, Charset charset) {
    return ContentDisposition.attachment()
        .filename(fileName, charset)
        .build().toString();
  }

  /**
   * outputStreamにファイルデータをセット
   * 
   * @param outputStream OutputStream
   * @param sbyte ファイルデータ
   */
  public void setFileData(OutputStream outputStream, byte[] sbyte) {
    for (int i = 0; i < sbyte.length; i++) {
      try {
        outputStream.write(sbyte[i]);
      } catch (IOException e) {
        throw new BusinessException("1.01.01.1003", e.getMessage());
      }
    }
  }

  /**
   * 
   * ファイルダウンロード用レスポンスを作成
   * 
   * @param fileName ファイル名
   * @param charset 文字コード
   * @param body ファイル元データ
   * @param pojoType カラム情報が記載されているクラス
   * @return
   */
  public ResponseEntity<StreamingResponseBody> buildStreamingResponse(String fileName,
      Charset charset, String data) {
    MediaType mediaType = MediaType.APPLICATION_OCTET_STREAM;
    if (mediaType == null) {
      throw new BusinessException("1.01.01.1003");
    }

    return ResponseEntity.ok()
        .contentType(mediaType)
        .header(
            HttpHeaders.CONTENT_DISPOSITION,
            buildContentDisposition(fileName, charset))
        .body(os -> setFileData(os,
            data.getBytes()));
  }

}
