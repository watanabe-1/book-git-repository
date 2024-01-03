package org.book.app.common.logging;

import java.util.Arrays;

import org.springframework.context.annotation.PropertySource;
import org.springframework.core.MethodParameter;
import org.springframework.lang.Nullable;
import org.springframework.stereotype.Component;
import org.springframework.web.method.HandlerMethod;
import org.springframework.web.servlet.HandlerInterceptor;
import org.springframework.web.servlet.ModelAndView;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.XSlf4j;

@Component
@XSlf4j
@PropertySource("classpath:config/properties/logger.properties")
public class ReauestLoggingListener implements HandlerInterceptor {

    private String START_TIME = "startTime";

    @Override
    public boolean preHandle(HttpServletRequest request,
            HttpServletResponse response, Object handler) {
        if (!log.isTraceEnabled()) {
            return true;
        }
        if (handler instanceof HandlerMethod handlerMethod) {
            long startTime = System.nanoTime();
            request.setAttribute(START_TIME, startTime);

            String methodParams = getMethodParams(handlerMethod);
            String simpleName = handlerMethod.getBean().getClass().getSimpleName();
            String methodName = handlerMethod.getMethod().getName();

            log.trace("1.02.01.1001", simpleName, methodName, methodParams);
        }

        return true;
    }

    @Override
    public void postHandle(HttpServletRequest request, HttpServletResponse response, Object handler,
            @Nullable ModelAndView modelAndView) throws Exception {
        if (!log.isTraceEnabled()) {
            return;
        }
        if (handler instanceof HandlerMethod handlerMethod) {
            long startTime = request.getAttribute(START_TIME) != null ? (Long) request.getAttribute(START_TIME) : 0;
            long endTime = System.nanoTime();
            long duration = endTime - startTime;
            request.removeAttribute(START_TIME);

            String methodParams = getMethodParams(handlerMethod);
            String viewName = modelAndView != null ? modelAndView.getViewName() : "null";
            String model = modelAndView != null ? modelAndView.getModel().toString() : "{}";
            String simpleName = handlerMethod.getBean().getClass().getSimpleName();
            String methodName = handlerMethod.getMethod().getName();

            log.trace("1.02.01.1002", simpleName, methodName, methodParams, duration, viewName, model);
        }
    }

    private String getMethodParams(HandlerMethod handlerMethod) {
        return Arrays.toString(Arrays.asList(handlerMethod.getMethodParameters()).stream()
                .map(MethodParameter::getParameterType).toArray(Class[]::new));
    }
}
