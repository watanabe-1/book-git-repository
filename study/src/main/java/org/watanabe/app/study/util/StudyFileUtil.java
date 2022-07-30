package org.watanabe.app.study.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;
import org.mozilla.universalchardet.UniversalDetector;
import org.springframework.core.io.InputStreamSource;
import org.springframework.web.multipart.MultipartFile;
import org.terasoluna.gfw.common.exception.BusinessException;
import org.terasoluna.gfw.common.message.ResultMessages;
import com.fasterxml.jackson.databind.MappingIterator;
import com.fasterxml.jackson.dataformat.csv.CsvGenerator;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;

/**
 * ファイルを扱うutilクラス
 */
public class StudyFileUtil {

  /**
   * csvファイルを読み込む
   * 
   * @param inSoursc InputStreamSource
   * @param pojoType カラム情報が記載されているクラス
   * @param isHeadder ヘッダーをつけるか
   * @return List
   */
  public static <T> List<T> csvFileToList(InputStreamSource inSoursc, Class<T> pojoType,
      boolean isHeadder) {
    return fileToListByCsvMapper(inSoursc, detectFileEncoding(inSoursc), pojoType,
        StudyStringUtil.SEPARATOR_BY_CSV, isHeadder, true);
  }

  /**
   * tsvファイルを読み込む
   * 
   * @param inSoursc InputStreamSource
   * @param pojoType カラム情報が記載されているクラス
   * @param isHeadder ヘッダーをつけるか
   * @return List
   */
  public static <T> List<T> tsvFileToList(InputStreamSource inSoursc, Class<T> pojoType,
      boolean isHeadder) {
    return fileToListByCsvMapper(inSoursc, detectFileEncoding(inSoursc), pojoType,
        StudyStringUtil.SEPARATOR_BY_TSV, isHeadder, false);
  }

  /**
   * テキストファイルを読み込む
   * 
   * @param inSoursc InputStreamSource
   * @param charsetName 文字コード
   * @param pojoType カラム情報が記載されているクラス
   * @param sep 区切り文字
   * @param isHeadder ヘッダーをつけるか
   * @param isQuote 文字列にダブルクオートをつけるか
   * @return List
   */
  public static <T> List<T> fileToListByCsvMapper(InputStreamSource inSoursc, String charsetName,
      Class<T> pojoType, char sep, boolean isHeadder, boolean isQuote) {
    CsvMapper mapper = new CsvMapper();
    CsvSchema schema = mapper.schemaFor(pojoType).withColumnSeparator(sep);
    List<T> result = new ArrayList<>();

    // ダブルクオートあり
    if (isQuote) {
      mapper.configure(CsvGenerator.Feature.ALWAYS_QUOTE_STRINGS, true);
    }

    // ヘッダーあり
    if (isHeadder) {
      schema = schema.withHeader();
    }

    try (InputStream in = inSoursc.getInputStream();
        BufferedReader br = new BufferedReader(new InputStreamReader(in, charsetName))) {
      MappingIterator<T> objectMappingIterator =
          mapper.readerFor(pojoType).with(schema).readValues(br);

      while (objectMappingIterator.hasNext()) {
        result.add(objectMappingIterator.next());
      }
    } catch (IOException e) {
      throw new BusinessException(ResultMessages.error().add("1.01.01.1001", e.getMessage()));
    }

    return result;
  }

  /**
   * ファイルの文字コードを判定
   * 
   * @param file アップロードされたInputStreamSource(MultipartFilefil、ClassPathResourceなど)データ
   * @return result 文字コード
   */
  public static String detectFileEncoding(InputStreamSource file) {
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
