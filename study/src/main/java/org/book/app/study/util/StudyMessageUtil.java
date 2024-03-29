package org.book.app.study.util;

import org.springframework.lang.NonNull;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

import lombok.AccessLevel;
import lombok.NoArgsConstructor;

/**
 * メッセージ用utilクラス
 *
 */
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class StudyMessageUtil {

  private static final String SEPARATOR_BY_BINDERROR_FIELD = ".";

  /**
   * バインドエラー時の配列用フィールド名作成
   * 
   * @param arrayFieldName 配列フィールド名
   * @param index インデックス
   * @param fieldNames fieldNames 対象フィールド名
   * @return
   */
  @NonNull
  public static String getArrayFieldName(String arrayFieldName, int index, String... fieldNames) {
    String ret = new StringBuffer().append(arrayFieldName)
        .append("[")
        .append(index)
        .append("]")
        .append(SEPARATOR_BY_BINDERROR_FIELD)
        .append(getFieldName(fieldNames))
        .toString();

    return ret == null ? "" : ret;
  }

  /**
   * バインドエラー時のフィールド名作成
   * 
   * @param fieldNames 対象フィールド名
   * @return フィールド名
   */
  public static String getFieldName(String... fieldNames) {
    StringBuilder sb = new StringBuilder();
    for (String fieldName : fieldNames) {
      sb.append(fieldName).append(SEPARATOR_BY_BINDERROR_FIELD);
    }
    return StudyStringUtil.replaceFirstOneRight(sb.toString(), SEPARATOR_BY_BINDERROR_FIELD, "");
  }

  /**
   * エラーを結果に追加
   * 
   * @param result エラー結果
   * @param field 対象フィールド名
   * @param code エラーコード
   */
  public static void addError(BindingResult result, @NonNull String field, String code) {
    addError(result, field, code, "");
  }

  /**
   * エラーを結果に追加
   * 
   * @param result エラー結果
   * @param field 対象フィールド名
   * @param code エラーコード
   * @param arguments エラー文字列内で参照する値
   */
  public static void addError(BindingResult result, @NonNull String field, String code,
      Object... arguments) {
    addErrorOnDefMsg(result, field, code, arguments, code);
  }

  /**
   * エラーを結果に追加(デフォルトメッセージ有)
   * 
   * @param result エラー結果
   * @param field 対象フィールド名
   * @param code エラーコード
   * @param arguments エラー文字列内で参照する値
   * @param defaultMessage デフォルトメッセージ
   */
  public static void addErrorOnDefMsg(BindingResult result, @NonNull String field,
      String code, Object[] arguments, String defaultMessage) {
    result.addError(
        new FieldError(result.getObjectName(), field, null, false, new String[] { code }, arguments,
            defaultMessage));
  }
}
