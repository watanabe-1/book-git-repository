package org.book.app.study.util;

import java.util.Objects;
import org.book.app.study.enums.type.ColType;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;

/**
 * メッセージ用utilクラス
 *
 */
public class StudyMessageUtil {

  private static final String SEPARATOR_BY_BINDERROR_FIELD = ".";

  /**
   * 確認画面用のメッセージを返却
   * 
   * @param value チェックボックス選択結果
   * @return 確認画面メッセージ
   */
  public static String getConfirmMessage(String value) {
    return getConfirmMessage(value, ColType.STRING);
  }

  /**
   * 確認画面用のメッセージを返却
   * 
   * @param value 入力内容
   * @param type 入力タイプ
   * @return 確認画面メッセージ
   */
  public static String getConfirmMessage(String value, ColType type) {
    if ((Objects.equals(type, ColType.SELECT) || Objects.equals(type, ColType.RADIO))
        && Objects.equals(value, null)) {
      return "選択してません";
    } else if (Objects.equals(type, ColType.CHECK) && Objects.equals(value, "1")) {
      return "チェックしました";
    } else if (Objects.equals(type, ColType.CHECK) && Objects.equals(value, "0")) {
      return "チェックしてません";
    } else if (Objects.equals(value, null)) {
      return "未入力";
    } else {
      return value;
    }
  }

  /**
   * バインドエラー時の配列用フィールド名作成
   * 
   * @param arrayFieldName 配列フィールド名
   * @param index インデックス
   * @param fieldNames fieldNames 対象フィールド名
   * @return
   */
  public static String getArrayFieldName(String arrayFieldName, int index, String... fieldNames) {
    return new StringBuffer().append(arrayFieldName)
        .append("[")
        .append(index)
        .append("]")
        .append(SEPARATOR_BY_BINDERROR_FIELD)
        .append(getFieldName(fieldNames))
        .toString();
  }

  /**
   * バインドエラー時のフィールド名作成
   * 
   * @param fieldNames 対象フィールド名
   * @return フィールド名
   */
  public static String getFieldName(String... fieldNames) {
    StringBuffer sb = new StringBuffer();
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
  public static void addError(BindingResult result, String field, String code) {
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
  public static void addError(BindingResult result, String field, String code,
      Object... arguments) {
    addErrorOndefMsg(result, field, code, arguments, code);
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
  public static void addErrorOndefMsg(BindingResult result, String field,
      String code, Object[] arguments, String defaultMessage) {
    result.addError(
        new FieldError(result.getObjectName(), field, null, false, new String[] {code}, arguments,
            defaultMessage));
  }
}
