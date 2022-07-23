package org.watanabe.app.study.util;

import java.util.Map;
import java.util.Objects;
import org.terasoluna.gfw.common.exception.BusinessException;
import org.terasoluna.gfw.common.message.ResultMessages;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.csv.CsvGenerator;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;

/**
 * 文字列を扱うutilクラス
 */
public class StudyStringUtil {

  /**
   * csvの区切り文字
   */
  public static final char SEPARATOR_BY_CSV = ',';

  /**
   * tsvの区切り文字
   */
  public static final char SEPARATOR_BY_TSV = '\t';

  /**
   * null、もしくは空文字の判断を行う
   * 
   * @param value チェック対象
   * @return String nullもしくは空文字の時にtrue それ以外はfalse
   */
  public static boolean isNullOrEmpty(String value) {
    return value == null || value.isEmpty() ? true : false;
  }

  /**
   * ベースのパスと追加のパスを結合し返却する
   * 
   * @param basePath ベースとなるパス
   * @param addPath 追加したいパス
   * @return String 結合したパス
   */
  public static String pathJoin(String basePath, String addPath) {
    final String SLASH = "/";
    final String ENMARK = "\\";
    StringBuffer sb = new StringBuffer();

    // 「/」が文字列の先頭ににあった場合そのまま結合、なければ「/」をはさんで結合
    return addPath.indexOf(SLASH) == 0 || addPath.indexOf(ENMARK) == 0
        ? sb.append(basePath).append(addPath).toString()
        : sb.append(basePath).append(SLASH).append(addPath).toString();
  }

  /**
   * 置換対象が文字列の先頭にあった場合のみ置換、それ以外は置換せずに返却
   * 
   * @param str 置換対象
   * @param target 置換文字列
   * @param addPath 置換語文字列
   * @return String 置換結果
   */
  public static String replaceFirstOneLeft(String str, String target, String replaceMent) {
    // 置換対象が文字列の先頭ににあった場合のみ置換、それ以外は置換せずに返却
    return Objects.equals(target.indexOf(replaceMent), 0) ? str.replace(target, replaceMent) : str;
  }

  /**
   * 置換対象が文字列の最後尾にあった場合のみ置換、それ以外は置換せずに返却
   * 
   * @param str 置換対象
   * @param target 置換文字列
   * @param addPath 置換語文字列
   * @return String 置換結果
   */
  public static String replaceFirstOneRight(String str, String target, String replaceMent) {
    // 置換対象が文字列の最後尾ににあった場合のみ置換、それ以外は置換せずに返却
    return Objects.equals(target.lastIndexOf(replaceMent), replaceMent.length())
        ? str.replace(target, replaceMent)
        : str;

  }

  /**
   * csv形式の一行を分割
   * 
   * @param line 分割対象
   * @return 分割結果
   */
  public static String[] splitByCsv(String line) {
    return split(line, SEPARATOR_BY_CSV);
  }

  /**
   * tsv形式の一行を分割
   * 
   * @param line 分割対象
   * @return 分割結果
   */
  public static String[] splitByTsv(String line) {
    return split(line, SEPARATOR_BY_TSV);
  }

  /**
   * 文字列を区切り文字基準に分割
   * 
   * @param line 分割対象
   * @param sep 区切り文字
   * @return 分割結果
   */
  public static String[] split(String line, char sep) {
    return line.split(String.valueOf(sep));
  }

  /**
   * オブジェクトをjsonに変換
   * 
   * @param target 変換対象
   * @return String json文字列
   */
  public static String objectToJsonStr(Object target) {
    ObjectMapper mapper = new ObjectMapper();
    String json = null;

    try {
      json = mapper.writeValueAsString(target);
    } catch (JsonProcessingException e) {
      throw new BusinessException(ResultMessages.error().add("1.01.01.1001"));
    }

    return json;

  }

  /**
   * オブジェクトをcsvに変換
   * 
   * @param target 変換対象
   * @param pojoType カラム情報が記載されているクラス
   * @param isHeadder ヘッダーをつけるか
   * @return String csv文字列
   */
  public static String objectToCsvStr(Object target, Class<?> pojoType, boolean isHeadder) {
    return objectToStrByCsvMapper(target, pojoType, SEPARATOR_BY_CSV, isHeadder, true);
  }

  /**
   * オブジェクトをtsvに変換
   * 
   * @param target 変換対象
   * @param pojoType カラム情報が記載されているクラス
   * @param isHeadder ヘッダーをつけるか
   * @return String tsv文字列
   */
  public static String objectToTsvStr(Object target, Class<?> pojoType, boolean isHeadder) {
    return objectToStrByCsvMapper(target, pojoType, SEPARATOR_BY_TSV, isHeadder, false);
  }

  /**
   * オブジェクトを文字列に変換
   * 
   * @param target 変換対象
   * @param pojoType カラム情報が記載されているクラス
   * @param sep 区切り文字
   * @param isHeadder ヘッダーをつけるか
   * @param isQuote 文字列にダブルクオートをつけるか
   * @return String 文字列
   */
  public static String objectToStrByCsvMapper(Object target, Class<?> pojoType, char sep,
      boolean isHeadder, boolean isQuote) {
    String result = null;
    CsvMapper mapper = new CsvMapper();
    CsvSchema schema = mapper.schemaFor(pojoType).withColumnSeparator(sep);

    if (isQuote) {
      // 文字列にダブルクオートをつける
      mapper.configure(CsvGenerator.Feature.ALWAYS_QUOTE_STRINGS, true);
    }

    // ヘッダーをつける
    if (isHeadder) {
      schema = schema.withHeader();
    }

    try {
      result = mapper.writer(schema).writeValueAsString(target);
    } catch (JsonProcessingException e) {
      throw new BusinessException(ResultMessages.error().add("1.01.01.1001", e.getMessage()));
    }

    return result;
  }


  /**
   * 文字列前後のダブルクォーテーションを削除するFunction
   * 
   * @param str 文字列
   * @return 前後のダブルクォーテーションを削除した文字列
   */
  public static String trimDoubleQuot(String str) {
    char c = '"';

    return str.charAt(0) == c && str.charAt(str.length() - 1) == c
        ? str.substring(1, str.length() - 1)
        : str;
  }

  /**
   * urlにセットするパラムを作成
   * 
   * @param param keyにパラム名、itemにvalue
   * @return String urlにセットするパラム
   */
  public static String createUrlParam(Map<String, String> param) {
    int index = 0;
    StringBuffer sb = new StringBuffer();

    for (String key : param.keySet()) {
      if (index == 0) {
        sb.append("?");
      } else {
        sb.append("&");
      }
      sb.append(key).append("=").append(param.get(key));
      index++;
    }

    return sb.toString();
  }
}
