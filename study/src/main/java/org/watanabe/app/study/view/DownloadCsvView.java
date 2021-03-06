package org.watanabe.app.study.view;

import java.nio.charset.StandardCharsets;
import org.springframework.stereotype.Component;
import org.springframework.ui.ModelMap;
import org.watanabe.app.study.util.StudyModelUtil;
import org.watanabe.app.study.util.StudyStringUtil;

@Component
public class DownloadCsvView extends AbstractDownloadTextFileView { // (2)

  /**
   * ファイルネームを取得する
   * 
   * @param model ModelMap
   * @return fileName
   */
  @Override
  protected String getFileName(ModelMap model) {
    return (String) model.getAttribute(StudyModelUtil.MODEL_KEY_FILE_NAME);
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
