package org.book.app.common.logging;

import jakarta.servlet.http.HttpSessionActivationListener;
import jakarta.servlet.http.HttpSessionAttributeListener;
import jakarta.servlet.http.HttpSessionBindingEvent;
import jakarta.servlet.http.HttpSessionEvent;
import jakarta.servlet.http.HttpSessionListener;
import lombok.extern.slf4j.XSlf4j;

/**
 * セッション関連のイベントをログに記録するリスナー
 */
@XSlf4j
public class HttpSessionEventLoggingListener implements HttpSessionListener,
        HttpSessionAttributeListener,
        HttpSessionActivationListener {

    /**
     * セッションが非アクティブ化される直前に呼ばれる
     * 
     * @param se セッションイベント
     */
    @Override
    public void sessionWillPassivate(HttpSessionEvent se) {
        log.trace("1.02.01.1003", () -> new Object[] { se.getSession().getId(), se.getSource() });
    }

    /**
     * セッションがアクティブ化された後に呼ばれる
     * 
     * @param se セッションイベント
     */
    @Override
    public void sessionDidActivate(HttpSessionEvent se) {
        log.trace("1.02.01.1004", () -> new Object[] { se.getSession().getId(), se.getSource() });
    }

    /**
     * セッションに属性が追加されたときに呼ばれる
     * 
     * @param se セッションバインディングイベント
     */
    @Override
    public void attributeAdded(HttpSessionBindingEvent se) {
        log.trace("1.02.01.1005", () -> new Object[] { se.getSession().getId(), se.getName(), se.getValue() });
    }

    /**
     * セッションから属性が削除されたときに呼ばれる
     * 
     * @param se セッションバインディングイベント
     */
    @Override
    public void attributeRemoved(HttpSessionBindingEvent se) {
        log.trace("1.02.01.1006", () -> new Object[] { se.getSession().getId(), se.getName(), se.getValue() });
    }

    /**
     * セッションの属性が置き換えられたときに呼ばれる
     * 
     * @param se セッションバインディングイベント
     */
    @Override
    public void attributeReplaced(HttpSessionBindingEvent se) {
        log.trace("1.02.01.1007", () -> new Object[] { se.getSession().getId(), se.getName(), se.getValue() });
    }

    /**
     * セッションが作成されたときに呼ばれる
     * 
     * @param se セッションイベント
     */
    @Override
    public void sessionCreated(HttpSessionEvent se) {
        log.trace("1.02.01.1008", () -> new Object[] { se.getSession().getId(), se.getSource() });
    }

    /**
     * セッションが破棄されるときに呼ばれる
     * 
     * @param se セッションイベント
     */
    @Override
    public void sessionDestroyed(HttpSessionEvent se) {
        log.trace("1.02.01.1009", () -> new Object[] { se.getSession().getId(), se.getSource() });
    }
}
