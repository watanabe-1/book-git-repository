package org.watanabe.app.study.util;

import java.util.Objects;
import org.watanabe.app.study.enums.type.ColType;

/**
 * メッセージ用utilクラス
 *
 */
public class StudyMessageUtil {

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
}
