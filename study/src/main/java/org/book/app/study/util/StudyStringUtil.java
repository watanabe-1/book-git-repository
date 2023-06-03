package org.book.app.study.util;

import java.util.List;
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
    return value == null || value.isEmpty();
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

    // 「/」が文字列の先頭にあった場合そのまま結合、なければ「/」をはさんで結合
    return addPath.indexOf(SLASH) == 0 || addPath.indexOf(ENMARK) == 0
        ? sb.append(basePath).append(addPath).toString()
        : sb.append(basePath).append(SLASH).append(addPath).toString();
  }

  /**
   * ベースのパスと追加のパス(複数可)を結合し返却する
   * 
   * @param basePath ベースとなるパス
   * @param addPaths 追加したいパス
   * @return String 結合したパス
   */
  public static String pathJoin(String basePath, String... addPaths) {
    String result = basePath;
    for (String addaPath : addPaths) {
      result = pathJoin(result, addaPath);
    }

    return result;
  }

  /**
   * 置換対象が文字列の先頭にあった場合のみ置換、それ以外は置換せずに返却
   * 
   * @param str 置換対象
   * @param target 置換文字列
   * @param replaceMent 置換語文字列
   * @return String 置換結果
   */
  public static String replaceFirstOneLeft(String str, String target, String replaceMent) {
    // 置換対象が文字列の先頭ににあった場合のみ置換、それ以外は置換せずに返却
    return Objects.equals(target.indexOf(replaceMent), 0) ? str.replaceFirst(target, replaceMent)
        : str;
  }

  /**
   * 置換対象が文字列の最後尾にあった場合のみ置換、それ以外は置換せずに返却
   * 
   * @param str 置換対象
   * @param target 置換文字列
   * @param replaceMent 置換語文字列
   * @return String 置換結果
   */
  public static String replaceFirstOneRight(String str, String target, String replaceMent) {
    // 置換対象が文字列の最後尾ににあった場合のみ置換、それ以外は置換せずに返却
    return Objects.equals(target.lastIndexOf(replaceMent), target.length())
        ? replaceLast(str, target, replaceMent)
        : str;

  }

  /**
   * 最後尾からマッチしたものを一つだけ置換
   * 
   * @param str 置換対象
   * @param regex 置換文字列(正規表現可)
   * @param replacement 置換語文字列
   * @return 置換結果
   */
  public static String replaceLast(String str, String regex, String replacement) {
    if (str == null || str.isEmpty()) {
      return str;
    }

    return str.replaceFirst(
        new StringBuffer().append(regex).append("(?!.*?").append(regex).append(")").toString(),
        replacement);
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
      throw new BusinessException(ResultMessages.error().add("1.01.01.1001", e.getMessage()));
    }

    return json;

  }

  /**
   * オブジェクトをcsv形式の文字列に変換
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
   * オブジェクトをtsv形式の文字列に変換
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
   * オブジェクトを区切り文字で区切った文字列に変換
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

    if (isHeadder) {
      // ヘッダーをつける
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
   * 文字列の最初の文字を大文字にする
   * 
   * @param val 変換対象
   * @return 変換後文字列
   */
  public static String upperCaseFirst(String val) {
    char[] arr = val.toCharArray();
    arr[0] = Character.toUpperCase(arr[0]);

    return new String(arr);
  }

  /**
   * 文字列の最初の文字を小文字にする
   * 
   * @param val 変換対象
   * @return 変換後文字列
   */
  public static String lowerCaseFirst(String val) {
    char[] arr = val.toCharArray();
    arr[0] = Character.toLowerCase(arr[0]);

    return new String(arr);
  }

  /**
   * 最初の文字を小文字にしたクラス名を取得する
   * 
   * @param Clazz クラス名取得対象クラス
   * @return 最初の文字が小文字のクラス名
   */
  public static String getlowerCaseFirstClassName(Class<?> Clazz) {
    return lowerCaseFirst(Clazz.getSimpleName());
  }

  /**
   * 文字列の最初の文字が引数2と同じか判定
   * 
   * @param target 判定対象
   * @param first 判定文字
   * @return 判定結果
   */
  public static boolean isFirstChar(String target, char first) {
    return Objects.equals(target.toCharArray()[0], first);
  }

  /**
   * 文字列前後のダブルクォーテーションを削除する
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
   * 文字列から指定の文字列を削除
   * 
   * @param str 置換対象
   * @param targets 削除対象文字列のリスト
   * @return 削除後文字列
   */
  public static String delete(String str, List<String> targets) {
    return delete(str, targets.toArray(new String[targets.size()]));
  }

  /**
   * 文字列から指定の文字列を削除
   * 
   * @param str 置換対象
   * @param targets 削除対象文字列
   * @return 削除後文字列
   */
  public static String delete(String str, String... targets) {
    String replaced = str;
    for (String target : targets) {
      replaced = replaced.replace(target, "");
    }

    return replaced;
  }

}
