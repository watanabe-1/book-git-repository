package org.book.app.study.util;

import java.io.IOException;
import java.io.InputStream;
import java.io.Reader;
import java.util.ArrayList;
import java.util.List;
import org.terasoluna.gfw.common.exception.BusinessException;
import org.terasoluna.gfw.common.message.ResultMessages;
import com.fasterxml.jackson.databind.MappingIterator;
import com.fasterxml.jackson.databind.ObjectReader;
import com.fasterxml.jackson.dataformat.csv.CsvGenerator;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;

/**
 * jacksonを扱うutilクラス
 * 
 */
public class StudyJacksonUtil {

  /**
   * csvmapperの作成
   * 
   * @param isQuote 文字列にダブルクオートをつけるか
   * @return CsvMapper
   */
  public static <T> CsvMapper createCsvMapper(boolean isQuote) {
    CsvMapper mapper = new CsvMapper();

    // ダブルクオートあり
    if (isQuote) {
      mapper.configure(CsvGenerator.Feature.ALWAYS_QUOTE_STRINGS, true);
    }

    return mapper;
  }

  /**
   * csvmapperの作成
   * 
   * @param mapper CsvMapper
   * @param pojoType カラム情報が記載されているクラス
   * @param sep 区切り文字
   * @param isHeader ヘッダーをつけるか
   * @return CsvSchema
   */
  public static <T> CsvSchema createCsvSchema(CsvMapper mapper, Class<T> pojoType, char sep,
      boolean isHeader) {
    CsvSchema schema = mapper.schemaFor(pojoType).withColumnSeparator(sep);

    // ヘッダーあり
    if (isHeader) {
      schema = schema.withHeader();
    }

    return schema;
  }

  /**
   * 
   * @param mapper CsvMapper
   * @param schema createCsvSchema
   * @param pojoType カラム情報が記載されているクラス
   * @param obj 変換対象
   * @return
   */
  public static <T> List<T> readValues(Object obj, CsvMapper mapper, CsvSchema schema,
      Class<T> pojoType) {
    List<T> result = new ArrayList<>();

    try {
      ObjectReader objectReader = mapper.readerFor(pojoType).with(schema);
      MappingIterator<T> objectMappingIterator;

      if (obj instanceof InputStream) {
        objectMappingIterator = objectReader.readValues((InputStream) obj);
      } else if (obj instanceof Reader) {
        objectMappingIterator = objectReader.readValues((Reader) obj);
      } else if (obj instanceof String) {
        objectMappingIterator = objectReader.readValues((String) obj);
      } else {
        throw new BusinessException(
            ResultMessages.error().add("1.01.01.1001", "readValuesで指定できる型ではありません"));
      }

      result = objectMappingIterator.readAll();
    } catch (IOException e) {
      throw new BusinessException(ResultMessages.error().add("1.01.01.1001", e.getMessage()));
    }

    return result;
  }

  /**
   * objctからList形式に変換
   * 
   * @param obj 変換対象(InputStream、Reader、String型のみ)
   * @param charsetName 文字コード
   * @param pojoType カラム情報が記載されているクラス
   * @param sep 区切り文字
   * @param isHeader ヘッダーをつけるか
   * @param isQuote 文字列にダブルクオートをつけるか
   * @return List
   */

  public static <T> List<T> objectToListByCsvMapper(Object obj, String charsetName,
      Class<T> pojoType, char sep, boolean isHeader, boolean isQuote) {
    CsvMapper mapper = StudyJacksonUtil.createCsvMapper(isQuote);
    CsvSchema schema = StudyJacksonUtil.createCsvSchema(mapper, pojoType, sep, isHeader);

    return StudyJacksonUtil.readValues(obj, mapper, schema, pojoType);
  }

}
