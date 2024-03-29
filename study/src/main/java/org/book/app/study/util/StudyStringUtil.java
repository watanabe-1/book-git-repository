package org.book.app.study.util;

import java.util.List;
import java.util.Objects;

import org.book.app.common.exception.BusinessException;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

/**
 * 文字列を扱うutilクラス
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
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
  * パスの区切り文字
  */
  public static final String SEPARATOR_BY_PATH = System.getProperty("file.separator");

  /**
  * キーの区切り文字
  */
  public static final String SEPARATOR_BY_KEY = ".";

  /**
  * スネークケースの区切り文字
  */
  public static final String SEPARATOR_BY_SNAKE = "_";

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
  * 区切り文字で結合
  *
  * @param separator 区切り文字1文字
  * @param base ベース
  * @param add 追加す対象
  * @return 結合したもの
   */
  public static String joinBase(String separator, String base, String add) {
    // 'add'がnullまたは空かどうかをチェック
    if (isNullOrEmpty(add)) {
      return base;
    }

    // 'base'がnullまたは空かどうかをチェック
    if (isNullOrEmpty(base)) {
      return add;
    }

    // セパレータの長さを取得
    int separatorLength = separator.length();

    // 'add'の先頭からセパレータの長さまでの部分を抽出
    String addHead = add.substring(0, Math.min(separatorLength, add.length()));

    // 'base'の末尾からセパレータの長さまでの部分を抽出
    String baseFoot = base.substring(Math.max(0, base.length() - separatorLength));

    // 文字列連結用
    StringBuilder sb = new StringBuilder(base);

    // 'base'の末尾と'add'の先頭がセパレータと一致する場合、一方のセパレータを削除
    if (baseFoot.equals(separator) && addHead.startsWith(separator)) {
      sb.setLength(sb.length() - separatorLength); // 'base'の末尾からセパレータを削除
      sb.append(add);
    }
    // 'base'がセパレータで終わるか、'add'がセパレータで始まる場合、そのまま連結
    else if (baseFoot.equals(separator) || addHead.startsWith(separator)) {
      sb.append(add);
    }
    // それ以外の場合、'base'と'add'の間にセパレータを追加
    else {
      sb.append(separator);
      sb.append(add);
    }

    return sb.toString();
  }

  /**
  * 区切り文字で結合
  
  * @param separator 区切り文字1文字
  * @param base ベース
  * @param adds 追加する対象のリスト
  * @return 結合したもの
  */
  public static String joinBases(String separator, String base, String... adds) {
    String result = base;
    for (String add : adds) {
      result = joinBase(separator, result, add);
    }

    return result;
  }

  /**
   * ベースのパスと追加のパス(複数可)を結合し返却する
   * 
   * @param basePath ベースとなるパス
   * @param addPaths 追加したいパス
   * @return String 結合したパス
   */
  public static String pathJoin(String basePath, String... addPaths) {
    return joinBases(SEPARATOR_BY_PATH, basePath, addPaths);
  }

  /**
  * ベースのキーと追加のキー(複数可)を結合し返却する
  * 
  * @param baseKey ベースとなるキー
  * @param addkeys 追加したいキー
  * @return String 結合したキー
  */
  public static String keyJoin(String baseKey, String... addkeys) {
    return joinBases(SEPARATOR_BY_KEY, baseKey, addkeys);
  }

  /**
  * ベースの文字列と追加の文字列(複数可)を結合し返却する
  * 
  * @param baseStr ベースとなる文字列
  * @param addStrs 追加したい文字列
  * @return String 結合した文字列
  */
  public static String snakeJoin(String baseStr, String... addStrs) {
    return joinBases(SEPARATOR_BY_SNAKE, baseStr, addStrs);
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
    return str.indexOf(target) == 0 ? str.replaceFirst(target, replaceMent) : str;
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
    int lastIndex = str.lastIndexOf(target);
    if (lastIndex != -1 && lastIndex + target.length() == str.length()) {
      return replaceLast(str, target, replaceMent);
    }

    return str;
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
    if (isNullOrEmpty(str)) {
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
      throw new BusinessException("1.01.01.1011", e.getMessage());
    }

    return json;
  }

  /**
   * オブジェクトをcsv形式の文字列に変換
   * 
   * @param target 変換対象
   * @param pojoType カラム情報が記載されているクラス
   * @param isHeader ヘッダーをつけるか
   * @return String csv文字列
   */
  public static String objectToCsvStr(Object target, Class<?> pojoType, boolean isHeader) {
    return objectToStrByCsvMapper(target, pojoType, SEPARATOR_BY_CSV, isHeader, true);
  }

  /**
   * オブジェクトをtsv形式の文字列に変換
   * 
   * @param target 変換対象
   * @param pojoType カラム情報が記載されているクラス
   * @param isHeader ヘッダーをつけるか
   * @return String tsv文字列
   */
  public static String objectToTsvStr(Object target, Class<?> pojoType, boolean isHeader) {
    return objectToStrByCsvMapper(target, pojoType, SEPARATOR_BY_TSV, isHeader, false);
  }

  /**
   * オブジェクトを区切り文字で区切った文字列に変換
   * 
   * @param target 変換対象
   * @param pojoType カラム情報が記載されているクラス
   * @param sep 区切り文字
   * @param isHeader ヘッダーをつけるか
   * @param isQuote 文字列にダブルクオートをつけるか
   * @return String 文字列
   */
  public static String objectToStrByCsvMapper(Object target, Class<?> pojoType, char sep,
      boolean isHeader, boolean isQuote) {
    String result = null;
    CsvMapper mapper = StudyJacksonUtil.createCsvMapper(isQuote);
    CsvSchema schema = StudyJacksonUtil.createCsvSchema(mapper, pojoType, sep, isHeader);

    try {
      result = mapper.writer(schema).writeValueAsString(target);
    } catch (JsonProcessingException e) {
      throw new BusinessException("1.01.01.1011", e.getMessage());
    }

    return result;
  }

  /**
   * 文字列からList形式に変換
   * 
   * @param str 文字列
   * @param pojoType カラム情報が記載されているクラス
   * @param isHeader ヘッダーをつけるか
   * @return List
   */
  public static <T> List<T> csvStrToList(String str, Class<T> pojoType,
      boolean isHeader) {
    return strToListByCsvMapper(str, pojoType,
        SEPARATOR_BY_CSV, isHeader, true);
  }

  /**
   * tsvファイル文字列からList形式に変換
   * 
   * @param str 文字列
   * @param pojoType カラム情報が記載されているクラス
   * @param isHeader ヘッダーをつけるか
   * @return List
   */
  public static <T> List<T> tsvStrToList(String str, Class<T> pojoType,
      boolean isHeader) {
    return strToListByCsvMapper(str, pojoType,
        SEPARATOR_BY_TSV, isHeader, false);
  }

  /**
   * 文字列からList形式に変換
   * 
   * @param str 文字列
   * @param pojoType カラム情報が記載されているクラス
   * @param sep 区切り文字
   * @param isHeader ヘッダーをつけるか
   * @param isQuote 文字列にダブルクオートをつけるか
   * @return List
   */

  public static <T> List<T> strToListByCsvMapper(String str,
      Class<T> pojoType, char sep, boolean isHeader, boolean isQuote) {
    return StudyJacksonUtil.objectToListByCsvMapper(str, pojoType, sep, isHeader,
        isQuote);
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
   * @param clazz クラス名取得対象クラス
   * @return 最初の文字が小文字のクラス名
   */
  public static String getlowerCaseFirstClassName(Class<?> clazz) {
    return lowerCaseFirst(clazz.getSimpleName());
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
