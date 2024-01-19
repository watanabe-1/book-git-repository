package org.book.app.study.dto.error;

import lombok.Data;

/**
 * js側から送信されるエラー情報
 */
@Data
public class ErrorDetails {
    /**
     * エラー情報
     */
    private String error;

    /**
     * スタックトレース
     */
    private Object stackTrace;
}
