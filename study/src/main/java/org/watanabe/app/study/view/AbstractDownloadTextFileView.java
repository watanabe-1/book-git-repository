package org.watanabe.app.study.view;



import java.io.BufferedOutputStream;
import java.io.IOException;
import java.io.OutputStream;
import java.util.Map;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ui.ModelMap;
import org.springframework.web.servlet.view.AbstractView;
import org.terasoluna.gfw.common.exception.BusinessException;
import org.terasoluna.gfw.common.message.ResultMessages;
import org.watanabe.app.study.helper.DownloadHelper;
import org.watanabe.app.study.util.StudyModelUtil;

/**
 * テキストファイルダウンロード用抽象クラス
 */
public abstract class AbstractDownloadTextFileView extends AbstractView {

  /**
   * ファイルダウンロード Helper
   */
  @Autowired
  private DownloadHelper downloadHelper;

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
          getFileName(StudyModelUtil.getModelMap(model)));
      downloadHelper.setFileData(outputStream, getFileData(StudyModelUtil.getModelMap(model)));

      // ファイルに書き込む
      outputStream.flush();
    } catch (IOException e) {
      throw new BusinessException(ResultMessages.error().add("1.01.01.1001", e.getMessage()));
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
