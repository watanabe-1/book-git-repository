package org.book.app.study.util;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import org.apache.commons.io.FilenameUtils;
import org.mozilla.universalchardet.UniversalDetector;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.InputStreamSource;
import org.springframework.web.multipart.MultipartFile;
import org.terasoluna.gfw.common.exception.BusinessException;
import org.terasoluna.gfw.common.message.ResultMessages;
import com.fasterxml.jackson.databind.MappingIterator;
import com.fasterxml.jackson.dataformat.csv.CsvGenerator;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;
import lombok.extern.slf4j.XSlf4j;

/**
 * ファイルを扱うutilクラス
 */
@XSlf4j
public class StudyFileUtil {

  /**
   * csvの拡張子
   */
  public static final String EXTENSION_BY_CSV = "csv";

  /**
   * tsvの拡張子
   */
  public static final String EXTENSION_BY_TSV = "tsv";

  /**
   * txtのメディアタイプ
   */
  public static final String MEDIATYPE_BY_TEXT = "text/plain";

  /**
   * csvのメディアタイプ
   */
  public static final String MEDIATYPE_BY_CSV = "text/csv";

  /**
   * tsvのメディアタイプ
   */
  public static final String MEDIATYPE_BY_TSV = "text/tsv";

  /**
   * 拡張子を追加
   * 
   * @param fileName  追加対象
   * @param extension 追加する拡張子
   * @return 拡張子を追加したファイル名
   */
  public static String addExtension(String fileName, String extension) {
    return FilenameUtils.isExtension(fileName, extension)
        ? fileName
        : new StringBuffer().append(fileName).append(".").append(extension).toString();
  }

  /**
   * csvファイルを読み込む
   * 
   * @param inSoursc  InputStreamSource
   * @param pojoType  カラム情報が記載されているクラス
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
   * @param inSoursc  InputStreamSource
   * @param pojoType  カラム情報が記載されているクラス
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
   * @param inSoursc    InputStreamSource
   * @param charsetName 文字コード
   * @param pojoType    カラム情報が記載されているクラス
   * @param sep         区切り文字
   * @param isHeadder   ヘッダーをつけるか
   * @param isQuote     文字列にダブルクオートをつけるか
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
      MappingIterator<T> objectMappingIterator = mapper.readerFor(pojoType).with(schema).readValues(br);

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
      throw new BusinessException(ResultMessages.error().add("1.01.01.1001", e.getMessage()));
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
      throw new BusinessException(ResultMessages.error().add("1.01.01.1001", e.getMessage()));
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
      throw new BusinessException(ResultMessages.error().add("1.01.01.1001", e.getMessage()));
    }

    // 文字コード判定に失敗した場合はutf8を指定
    if (result == null) {
      log.warn("", "!!!!!!!!文字コード判定に失敗しました!!!!!!!!");
      result = StandardCharsets.UTF_8.name();
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

  /**
   * クラスパス配下のファイルの読み込み
   * 
   * @param path        パス
   * @param charsetName 文字コード
   * @return 読み込んだファイルの中身
   */
  public static String readClassPathFile(String path, String charsetName) {
    ClassPathResource file = new ClassPathResource(path);
    String ret = null;

    // キャラセットが指定されていない場合
    if (StudyStringUtil.isNullOrEmpty(charsetName)) {
      charsetName = detectFileEncoding(file);
    }

    try (InputStream in = file.getInputStream();
        BufferedReader br = new BufferedReader(new InputStreamReader(in, charsetName))) {
      ret = br.lines().collect(Collectors.joining());
      log.info("", new StringBuffer().append(path).append(" file loaded."));
    } catch (IOException e) {
      throw new BusinessException(ResultMessages.error().add("1.01.01.1001", e.getMessage()));
    }

    return ret;
  }

}
