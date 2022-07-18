package org.watanabe.app.study.util;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import org.mozilla.universalchardet.UniversalDetector;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.multipart.MultipartFile;
import org.terasoluna.gfw.common.exception.BusinessException;
import org.terasoluna.gfw.common.message.ResultMessages;

/**
 * ファイルを扱うutilクラス
 */
public class StudyFileUtil {

  /**
   * モデルのキー：ファイルネーム
   */
  public static final String MODEL_KEY_FILE_NAME = "fileNmme";

  /**
   * モデルのキー：ファイルデータ
   */
  public static final String MODEL_KEY_FILE_DATA = "fileData";

  /**
   * ファイルの文字コードを判定
   * 
   * @param file アップロードされたMultipartFilefileデータ
   * @return result 文字コード
   */
  public static String detectFileEncoding(MultipartFile file) {
    String result = null;

    try (InputStream fis = file.getInputStream()) {
      result = detectFileEncoding(fis);
    } catch (IOException e) {
      throw new BusinessException(ResultMessages.error().add("1.01.01.1001"));
    }

    return result;
  }

  /**
   * ファイルの文字コードを判定
   * 
   * @param file アップロードされたfileデータ
   * @return result 文字コード
   */
  public static String detectFileEncoding(File file) {
    String result = null;

    try (InputStream fis = new FileInputStream(file)) {
      result = detectFileEncoding(fis);
    } catch (IOException e) {
      throw new BusinessException(ResultMessages.error().add("1.01.01.1001"));
    }

    return result;
  }

  /**
   * ファイルの文字コードを判定
   * 
   * @param file ClassPathResourcefileデータ
   * @return result 文字コード
   */
  public static String detectFileEncoding(ClassPathResource file) {
    String result = null;

    try (InputStream fis = file.getInputStream()) {
      result = detectFileEncoding(fis);
    } catch (IOException e) {
      throw new BusinessException(ResultMessages.error().add("1.01.01.1001"));
    }

    return result;
  }

  /**
   * ファイルの文字コードを判定
   * 
   * @param fis fileのInputStream
   * @return result 文字コード
   */
  public static String detectFileEncoding(InputStream fis) {
    String result = null;
    byte[] buf = new byte[4096];

    try {
      UniversalDetector detector = new UniversalDetector(null);
      int nread;
      while ((nread = fis.read(buf)) > 0 && !detector.isDone()) {
        detector.handleData(buf, 0, nread);
      }
      detector.dataEnd();
      result = detector.getDetectedCharset();
      detector.reset();
    } catch (IOException e) {
      throw new BusinessException(ResultMessages.error().add("1.01.01.1001"));
    }

    return result;
  }

  /**
   * MultipartFileからfileに変換
   * 
   * @param multipart MultipartFile
   * @return convFile file
   */
  public static File multipartToFile(MultipartFile multipart)
      throws IllegalStateException, IOException {
    File convFile = new File(multipart.getOriginalFilename());
    multipart.transferTo(convFile);

    return convFile;
  }
}
