package org.book.app.study.util;

import java.io.IOException;
import java.io.InputStream;
import java.io.Reader;
import java.util.ArrayList;
import java.util.List;

import org.book.app.common.exception.BusinessException;

import com.fasterxml.jackson.databind.MappingIterator;
import com.fasterxml.jackson.databind.ObjectReader;
import com.fasterxml.jackson.databind.util.StdDateFormat;
import com.fasterxml.jackson.dataformat.csv.CsvGenerator;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

/**
 * jacksonを扱うutilクラス
 * 
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class StudyJacksonUtil {

  /**
   * csvmapperの作成
   * 
   * @param isQuote 文字列にダブルクオートをつけるか
   * @return CsvMapper
   */
  public static CsvMapper createCsvMapper(boolean isQuote) {
    CsvMapper mapper = new CsvMapper();
    mapper.findAndRegisterModules();
    mapper.setDateFormat(new StdDateFormat());

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
   * 対象の読み取り
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

      if (obj instanceof InputStream src) {
        objectMappingIterator = objectReader.readValues(src);
      } else if (obj instanceof Reader src) {
        objectMappingIterator = objectReader.readValues(src);
      } else if (obj instanceof String json) {
        objectMappingIterator = objectReader.readValues(json);
      } else {
        throw new BusinessException("1.01.01.1009", "readValuesで指定できる型ではないため");
      }

      result = objectMappingIterator.readAll();
    } catch (IOException e) {
      throw new BusinessException("1.01.01.1009", e.getMessage());
    }

    return result;
  }

  /**
   * objctからList形式に変換
   * 
   * @param obj 変換対象(InputStream、Reader、String型のみ)
   * @param pojoType カラム情報が記載されているクラス
   * @param sep 区切り文字
   * @param isHeader ヘッダーをつけるか
   * @param isQuote 文字列にダブルクオートをつけるか
   * @return List
   */
  public static <T> List<T> objectToListByCsvMapper(Object obj,
      Class<T> pojoType, char sep, boolean isHeader, boolean isQuote) {
    CsvMapper mapper = createCsvMapper(isQuote);
    CsvSchema schema = createCsvSchema(mapper, pojoType, sep, isHeader);

    return readValues(obj, mapper, schema, pojoType);
  }
}
