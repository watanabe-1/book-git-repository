package org.book.app.study.view;

import java.nio.charset.StandardCharsets;
import org.book.app.study.helper.DownloadHelper;
import org.book.app.study.util.StudyFileUtil;
import org.book.app.study.util.StudyModelUtil;
import org.book.app.study.util.StudyStringUtil;
import org.springframework.stereotype.Component;
import org.springframework.ui.ModelMap;

@Component
public class DownloadCsvView extends AbstractDownloadTextFileView {

  public DownloadCsvView(DownloadHelper downloadHelper) {
    super(downloadHelper);
  }

  /**
   * ファイルネームを取得する
   * 
   * @param model ModelMap
   * @return fileName
   */
  @Override
  protected String getFileName(ModelMap model) {
    return StudyFileUtil.addExtension(
        (String) model.getAttribute(StudyModelUtil.MODEL_KEY_FILE_NAME),
        StudyFileUtil.EXTENSION_BY_CSV);
  }

  /**
   * ファイルデータを取得するように実装する
   * 
   * @param model ModelMap
   * @return 出力ファイルデータ
   */
  @Override
  protected byte[] getFileData(ModelMap model) {
    return StudyStringUtil
        .objectToCsvStr(model.getAttribute(StudyModelUtil.MODEL_KEY_FILE_DATA),
            (Class<?>) model.getAttribute(StudyModelUtil.MODEL_KEY_FILE_DATA_CLASS), true)
        .getBytes(StandardCharsets.UTF_8);
  }
}
