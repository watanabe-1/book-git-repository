package org.book.app.common.exception;

/**
 * ビジネス例外用クラス
 */
public class BusinessException extends RuntimeException {
    private final String messageKey;
    private final transient Object[] args;

    public BusinessException(String messageKey, Object... args) {
        this.messageKey = messageKey;
        this.args = args;
    }

    public String getMessageKey() {
        return messageKey;
    }

    public Object[] getArgs() {
        return args;
    }
}
