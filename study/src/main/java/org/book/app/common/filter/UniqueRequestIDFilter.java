package org.book.app.common.filter;

import java.io.IOException;
import java.util.UUID;

import org.slf4j.MDC;

import jakarta.servlet.Filter;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.ServletRequest;
import jakarta.servlet.ServletResponse;

/**
 * ログ出力追跡用にリクエストごとに一意のIDを振り
 * logback-sprig.xml内で%X{requestid}として参照できる
 */
public class UniqueRequestIDFilter implements Filter {
    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        final String REQUEST_ID = "requestid";
        try {
            // リクエストに一意のIDを割り当てる
            String uniqueID = UUID.randomUUID().toString();
            MDC.put(REQUEST_ID, uniqueID);

            chain.doFilter(request, response);
        } finally {
            // リクエスト処理が終了したらMDCからIDを削除
            MDC.remove(REQUEST_ID);
        }
    }
}
