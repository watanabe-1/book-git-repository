package org.watanabe.app.study.util;

import java.util.Map;
import java.util.Objects;
import org.terasoluna.gfw.common.exception.BusinessException;
import org.terasoluna.gfw.common.message.ResultMessages;
import org.watanabe.app.study.column.BooksColumn;
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
   * @param isHeadder ヘッダーをつけるか
   * @return String json文字列
   */
  public static String objectToCsvStr(Object target, boolean isHeadder) {
    CsvMapper mapper = new CsvMapper();
    // 文字列にダブルクオートをつける
    mapper.configure(CsvGenerator.Feature.ALWAYS_QUOTE_STRINGS, true);
    String csv = null;

    // ヘッダをつける
    CsvSchema schema = mapper.schemaFor(BooksColumn.class).withHeader();

    try {
      csv = isHeadder ? mapper.writer(schema).writeValueAsString(target)
          : mapper.writer().writeValueAsString(target);
    } catch (JsonProcessingException e) {
      throw new BusinessException(ResultMessages.error().add("1.01.01.1001", e.getMessage()));
    }

    return csv;

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
