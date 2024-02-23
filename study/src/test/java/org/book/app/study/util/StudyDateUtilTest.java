package org.book.app.study.util;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.junit.jupiter.api.Test;

class StudyDateUtilTest {

    @Test
    void testGetNextMonthWithLocalDate() {
        LocalDate date = LocalDate.of(2023, 3, 15); // 2023年3月15日
        LocalDateTime expected = LocalDateTime.of(2023, 4, 1, 0, 0); // 期待される結果は2023年4月1日
        LocalDateTime actual = StudyDateUtil.getNextMonth(date);
        assertEquals(expected, actual, "1ヶ月後の日付が正しく計算されていません");
    }

    @Test
    void testGetNextMonthWithLocalDateTime() {
        LocalDateTime date = LocalDateTime.of(2023, 3, 15, 1, 0, 0); // 2023年3月15日 01:00
        LocalDateTime expected = LocalDateTime.of(2023, 4, 1, 1, 0); // 期待される結果は2023年4月1日 01:00
        LocalDateTime actual = StudyDateUtil.getNextMonth(date);
        assertEquals(expected, actual, "1ヶ月後の日付が正しく計算されていません");
    }

    @Test
    void testGetPreviousMonthWithLocalDate() {
        LocalDate date = LocalDate.of(2023, 3, 15); // 2023年3月15日
        LocalDateTime expected = LocalDateTime.of(2023, 2, 1, 0, 0); // 期待される結果は2023年2月1日
        LocalDateTime actual = StudyDateUtil.getPreviousMonth(date);
        assertEquals(expected, actual, "1ヶ月前の日付が正しく計算されていません");
    }

    @Test
    void testGetPreviousMonthWithLocalDateTime() {
        LocalDateTime date = LocalDateTime.of(2023, 3, 15, 10, 30); // 2023年3月15日 10:30
        LocalDateTime expected = LocalDateTime.of(2023, 2, 1, 10, 30); // 期待される結果は2023年2月1日 10:30
        LocalDateTime actual = StudyDateUtil.getPreviousMonth(date);
        assertEquals(expected, actual, "1ヶ月前の日付が正しく計算されていません");
    }

    @Test
    void testGetFirstDayOfMonth() {
        LocalDateTime date = LocalDateTime.of(2023, 3, 15, 10, 30); // 2023年3月15日 10:30
        LocalDateTime expected = LocalDateTime.of(2023, 3, 1, 10, 30); // 期待される結果は2023年3月1日 10:30
        LocalDateTime actual = StudyDateUtil.getFirstDayOfMonth(date);
        assertEquals(expected, actual, "月の最初の日が正しく取得されていません");
    }

    @Test
    void testGetFirstDayOfYear() {
        LocalDateTime date = LocalDateTime.of(2023, 3, 15, 0, 0);
        LocalDateTime expected = LocalDateTime.of(2023, 1, 1, 0, 0);
        LocalDateTime actual = StudyDateUtil.getFirstDayOfYear(date);
        assertEquals(expected, actual, "年の最初の日が正しく取得されていません");
    }

    @Test
    void testGetLastDayOfYear() {
        LocalDateTime date = LocalDateTime.of(2023, 3, 15, 0, 0);
        LocalDateTime expected = LocalDateTime.of(2023, 12, 31, 0, 0);
        LocalDateTime actual = StudyDateUtil.getLastDayOfYear(date);
        assertEquals(expected, actual, "年の最後の日が正しく取得されていません");
    }

    @Test
    void testGetOneYearAgoMonth() {
        LocalDateTime date = LocalDateTime.of(2023, 3, 15, 0, 0);
        LocalDateTime expected = LocalDateTime.of(2022, 3, 1, 0, 0);
        LocalDateTime actual = StudyDateUtil.getOneYearAgoMonth(date);
        assertEquals(expected, actual, "1年前の月の最初の日が正しく取得されていません");
    }

    @Test
    void testGetbetweenYears() {
        LocalDateTime min = LocalDateTime.of(2020, 1, 1, 0, 0);
        LocalDateTime max = LocalDateTime.of(2023, 1, 1, 0, 0);
        List<String> expected = List.of("2020", "2021", "2022", "2023");
        List<String> actual = StudyDateUtil.getbetweenYears(min, max);
        assertEquals(expected, actual, "期間内の年リストが正しく取得されていません");
    }

    @Test
    void testGetYearOfMonthInPreviousWeeks() {
        LocalDate baseDate = LocalDate.of(2023, 4, 15); // 2023年4月15日
        int weeksToGoBack = 10; // 10週間前
        int targetMonth = 2; // 2月を対象
        Optional<Integer> actual = StudyDateUtil.getYearOfMonthInPreviousWeeks(baseDate, weeksToGoBack, targetMonth);
        assertTrue(actual.isPresent(), "対象の月が見つかるべきです");
        assertEquals(2023, actual.get(), "対象の月の年が正しく取得されていません");
    }

    @Test
    void testGetYearOfStr() {
        LocalDateTime date = LocalDateTime.of(2023, 1, 1, 0, 0);
        String expected = "2023";
        String actual = StudyDateUtil.getYearOfStr(date);
        assertEquals(expected, actual, "日付から年を正しく取得できていません");
    }

    @Test
    void testGetMonthOfStr() {
        LocalDateTime date = LocalDateTime.of(2023, 1, 1, 0, 0);
        String expected = "1";
        String actual = StudyDateUtil.getMonthOfStr(date);
        assertEquals(expected, actual, "日付から月を正しく取得できていません");
    }

    @Test
    void testGetDayOfStr() {
        LocalDateTime date = LocalDateTime.of(2023, 1, 1, 0, 0);
        String expected = "1";
        String actual = StudyDateUtil.getDayOfStr(date);
        assertEquals(expected, actual, "日付から日を正しく取得できていません");
    }

    @Test
    void testGetYearMonth() {
        LocalDateTime date = LocalDateTime.of(2023, 1, 1, 0, 0);
        String expected = "2023/01";
        String actual = StudyDateUtil.getYearMonth(date);
        assertEquals(expected, actual, "日付から年/月を正しくフォーマットできていません");
    }

    @Test
    void testGetYearMonthDay() {
        LocalDateTime date = LocalDateTime.of(2023, 1, 1, 0, 0);
        String expected = "2023/01/01";
        String actual = StudyDateUtil.getYearMonthDay(date);
        assertEquals(expected, actual, "日付から年/月/日を正しくフォーマットできていません");
    }

    @Test
    void testStrToLocalDate() {
        String dateStr = "2023/01/01";
        LocalDate expected = LocalDate.of(2023, 1, 1);
        LocalDate actual = StudyDateUtil.strToLocalDate(dateStr, "yyyy/MM/dd");
        assertEquals(expected, actual, "文字列からLocalDateへの変換が正しく行われていません");
    }

    @Test
    void testStrToLocalDateTime() {
        String dateTimeStr = "2023/01/01 00:00";
        LocalDateTime expected = LocalDateTime.of(2023, 1, 1, 0, 0);
        LocalDateTime actual = StudyDateUtil.strToLocalDateTime(dateTimeStr, "yyyy/MM/dd HH:mm");
        assertEquals(expected, actual, "文字列からLocalDateTimeへの変換が正しく行われていません");
    }

    @Test
    void testLocalDateTimeToStr() {
        LocalDateTime date = LocalDateTime.of(2023, 1, 1, 0, 0);
        String expected = "2023/01/01";
        String actual = StudyDateUtil.localDateTimeToStr(date, "yyyy/MM/dd");
        assertEquals(expected, actual, "LocalDateTimeから文字列への変換が正しく行われていません");
    }
}
