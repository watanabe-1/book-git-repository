package org.book.app.study.view;

import java.nio.charset.StandardCharsets;
import org.springframework.stereotype.Component;
import org.springframework.ui.ModelMap;
import org.book.app.study.util.StudyFileUtil;
import org.book.app.study.util.StudyModelUtil;
import org.book.app.study.util.StudyStringUtil;

@Component
public class DownloadTsvView extends AbstractDownloadTextFileView {

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
        StudyFileUtil.EXTENSION_BY_TSV);
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
        .objectToTsvStr(model.getAttribute(StudyModelUtil.MODEL_KEY_FILE_DATA),
            (Class<?>) model.getAttribute(StudyModelUtil.MODEL_KEY_FILE_DATA_CLASS), true)
        .getBytes(StandardCharsets.UTF_8);
  }
}
