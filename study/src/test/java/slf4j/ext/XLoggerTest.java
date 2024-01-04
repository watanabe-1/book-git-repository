package slf4j.ext;

import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.function.Supplier;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.slf4j.Logger;
import org.slf4j.ext.XLogger;
import org.springframework.boot.test.context.SpringBootTest;

import common.BaseTest;

@SpringBootTest(classes = XLoggerTest.class)
public class XLoggerTest extends BaseTest {

    private Logger mockLogger;

    private XLogger xLogger;

    @BeforeEach
    protected void setUp() {
        // 親クラス(共通処理)setUpの呼び出し
        super.setUp();
        mockLogger = mock(Logger.class);
        xLogger = new XLogger(mockLogger);
    }

    @Test
    public void testInfo() {
        when(mockLogger.isInfoEnabled()).thenReturn(true);
        xLogger.info("testId", "arg1", "arg2");

        verifyLogMessage(mockLogger, "info");
    }

    @Test
    public void testWarn() {
        when(mockLogger.isWarnEnabled()).thenReturn(true);
        xLogger.warn("testId", "arg1", "arg2");

        verifyLogMessage(mockLogger, "warn");
    }

    @Test
    public void testError() {
        when(mockLogger.isErrorEnabled()).thenReturn(true);
        xLogger.error("testId", "arg1", "arg2");

        verifyLogMessage(mockLogger, "error");
    }

    @Test
    public void testTrace() {
        when(mockLogger.isTraceEnabled()).thenReturn(true);
        xLogger.trace("testId", "arg1", "arg2");

        verifyLogMessage(mockLogger, "trace");
    }

    // Supplier<Object[]> 引数を使用するテスト
    @Test
    public void testInfoWithSupplier() {
        when(mockLogger.isInfoEnabled()).thenReturn(true);
        Supplier<Object[]> supplier = () -> new Object[] { "arg1", "arg2" };
        xLogger.info("testId", supplier);

        verifyLogMessage(mockLogger, "info");
    }

    @Test
    public void testWarnWithSupplier() {
        when(mockLogger.isWarnEnabled()).thenReturn(true);
        Supplier<Object[]> supplier = () -> new Object[] { "arg1", "arg2" };
        xLogger.warn("testId", supplier);

        verifyLogMessage(mockLogger, "warn");
    }

    @Test
    public void testErrorWithSupplier() {
        when(mockLogger.isErrorEnabled()).thenReturn(true);
        Supplier<Object[]> supplier = () -> new Object[] { "arg1", "arg2" };
        xLogger.error("testId", supplier);

        verifyLogMessage(mockLogger, "error");
    }

    @Test
    public void testTraceWithSupplier() {
        when(mockLogger.isTraceEnabled()).thenReturn(true);
        Supplier<Object[]> supplier = () -> new Object[] { "arg1", "arg2" };
        xLogger.trace("testId", supplier);

        verifyLogMessage(mockLogger, "trace");
    }

    // 例外を扱うメソッドのテスト
    @Test
    public void testWarnWithException() {
        when(mockLogger.isWarnEnabled()).thenReturn(true);
        Exception testException = new Exception("Test Exception");
        xLogger.warn("testId", testException, "arg1", "arg2");

        verify(mockLogger).warn(anyString(), eq(testException));
    }

    @Test
    public void testErrorWithException() {
        when(mockLogger.isErrorEnabled()).thenReturn(true);
        Exception testException = new Exception("Test Exception");
        xLogger.error("testId", testException, "arg1", "arg2");

        verify(mockLogger).error(anyString(), eq(testException));
    }

    private void verifyLogMessage(Logger logger, String logLevel) {
        ArgumentCaptor<String> messageCaptor = ArgumentCaptor.forClass(String.class);
        switch (logLevel) {
        case "info":
            verify(logger).info(messageCaptor.capture());
            break;
        case "warn":
            verify(logger).warn(messageCaptor.capture());
            break;
        case "error":
            verify(logger).error(messageCaptor.capture());
            break;
        case "trace":
            verify(logger).trace(messageCaptor.capture());
            break;
        }
        String loggedMessage = messageCaptor.getValue();
        assert loggedMessage.matches("\\[testId\\] .*");
        // メッセージIDが期待通りにログに含まれているか確認
        assert loggedMessage.contains("arg1") || loggedMessage.contains("arg2");
        // 引数が適切にログメッセージに含まれているか確認
    }

}
