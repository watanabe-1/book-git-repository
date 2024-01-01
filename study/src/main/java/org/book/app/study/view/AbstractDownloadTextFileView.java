package org.book.app.study.view;

import java.io.BufferedOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Map;

import org.book.app.common.exception.BusinessException;
import org.book.app.study.helper.DownloadHelper;
import org.book.app.study.util.StudyFileUtil;
import org.book.app.study.util.StudyModelUtil;
import org.springframework.ui.ModelMap;
import org.springframework.web.servlet.view.AbstractView;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

/**
 * テキストファイルダウンロード用抽象クラス
 */
@RequiredArgsConstructor
public abstract class AbstractDownloadTextFileView extends AbstractView {

  /**
   * ファイルダウンロード Helper
   */
  private final DownloadHelper downloadHelper;

  /**
   * レスポンスをレンダーする
   * 
   * @param model Model object
   * @param request current HTTP request
   * @param response current HTTP response
   */
  @Override
  protected void renderMergedOutputModel(Map<String, Object> model, HttpServletRequest request,
      HttpServletResponse response) {
    try (OutputStream outputStream = new BufferedOutputStream(response.getOutputStream())) {
      downloadHelper.addContentDisposition(response,
          getFileName(StudyModelUtil.getModelMap(model)), StudyFileUtil.MEDIATYPE_BY_TEXT);
      downloadHelper.setFileData(outputStream, getFileData(StudyModelUtil.getModelMap(model)));

      // ファイルに書き込む
      outputStream.flush();
    } catch (IOException e) {
      throw new BusinessException("1.01.01.1003", e.getMessage());
    }
  }

  /**
   * ファイルネームを取得するように実装する
   * 
   * @param model ModelMap
   * @return fileName
   */
  protected abstract String getFileName(ModelMap model);

  /**
   * ファイルデータを取得するように実装する
   * 
   * @param model ModelMap
   * @return 出力ファイルデータ
   */
  protected abstract byte[] getFileData(ModelMap model);

}
