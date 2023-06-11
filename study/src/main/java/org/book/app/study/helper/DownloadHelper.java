package org.book.app.study.helper;

import java.io.IOException;
import java.io.OutputStream;
import java.io.UnsupportedEncodingException;
import java.nio.charset.Charset;
import java.nio.charset.StandardCharsets;
import org.springframework.http.ContentDisposition;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Component;
import org.terasoluna.gfw.common.exception.BusinessException;
import org.terasoluna.gfw.common.message.ResultMessages;
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
  public void addContentDisposition(HttpHeaders headers, String fileName)
      throws UnsupportedEncodingException {
    String headerValue = buildContentDisposition(fileName, StandardCharsets.UTF_8);
    headers.add(HttpHeaders.CONTENT_DISPOSITION, headerValue);
  }

  /**
   * 日本語対応フォーマットでファイル名を指定
   * 
   * @param response レスポンス
   * @param fileName ファイル名
   * @param ContentType コンテンツタイプ
   */
  public void addContentDisposition(HttpServletResponse response, String fileName,
      String ContentType)
      throws UnsupportedEncodingException {
    String headerValue = buildContentDisposition(fileName, StandardCharsets.UTF_8);
    response.setHeader(HttpHeaders.CONTENT_DISPOSITION, headerValue);
    response.setContentType(ContentType);
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
  public void setFileData(OutputStream outputStream, byte sbyte[]) {
    for (int i = 0; i < sbyte.length; i++) {
      try {
        outputStream.write(sbyte[i]);
      } catch (IOException e) {
        throw new BusinessException(
            ResultMessages
                .error()
                .add("1.01.01.1001",
                    new StringBuffer()
                        .append("FileDownload Failed with writeResponseStream(). cause message is ")
                        .append(e.getMessage())
                        .toString()));
      }
    }
  }

}
