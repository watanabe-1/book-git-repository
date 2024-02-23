package org.book.app.study.util;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Arrays;
import java.util.List;

import org.junit.jupiter.api.Test;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// POJOクラスを定義 (FileRowはサンプルPOJOクラス)
@Data
@AllArgsConstructor
@NoArgsConstructor
class TestStringPojo {
    private String property;
}

class StudyStringUtilTest {
    @Test
    void testIsNullOrEmpty() {
        assertTrue(StudyStringUtil.isNullOrEmpty(null));
        assertTrue(StudyStringUtil.isNullOrEmpty(""));
        assertFalse(StudyStringUtil.isNullOrEmpty("test"));
    }

    @Test
    void testPathJoinWithTwoParameters() {
        assertEquals(String.format("base%spath", StudyStringUtil.SEPARATOR_BY_PATH),
                StudyStringUtil.pathJoin("base", "path"));
        assertEquals(String.format("base%spath", StudyStringUtil.SEPARATOR_BY_PATH),
                StudyStringUtil.pathJoin("base" + StudyStringUtil.SEPARATOR_BY_PATH, "path"));
        assertEquals(String.format("base%spath", StudyStringUtil.SEPARATOR_BY_PATH),
                StudyStringUtil.pathJoin("base", StudyStringUtil.SEPARATOR_BY_PATH + "path"));
    }

    @Test
    void testPathJoinWithMultipleParameters() {
        assertEquals(
                String.format("base%spath%sto%sresource", StudyStringUtil.SEPARATOR_BY_PATH,
                        StudyStringUtil.SEPARATOR_BY_PATH, StudyStringUtil.SEPARATOR_BY_PATH),
                StudyStringUtil.pathJoin("base", "path", "to", "resource"));
    }

    @Test
    void testReplaceFirstOneLeft() {
        assertEquals("replacementString", StudyStringUtil.replaceFirstOneLeft("targetString", "target", "replacement"));
        assertEquals("targetString", StudyStringUtil.replaceFirstOneLeft("targetString", "nonexistent", "replacement"));
    }

    @Test
    void testReplaceFirstOneRight() {
        assertEquals("Stringreplacement",
                StudyStringUtil.replaceFirstOneRight("Stringtarget", "target", "replacement"));
        assertEquals("Stringtarget",
                StudyStringUtil.replaceFirstOneRight("Stringtarget", "nonexistent", "replacement"));
    }

    @Test
    void testReplaceLast() {
        assertEquals("firstTargetSecondReplacement",
                StudyStringUtil.replaceLast("firstTargetSecondTarget", "Target", "Replacement"));
    }

    @Test
    void testSplitByCsv() {
        assertArrayEquals(new String[] { "a", "b", "c" }, StudyStringUtil.splitByCsv("a,b,c"));
    }

    @Test
    void testSplitByTsv() {
        assertArrayEquals(new String[] { "a", "b", "c" }, StudyStringUtil.splitByTsv("a\tb\tc"));
    }

    @Test
    void testObjectToJsonStr() {
        String json = StudyStringUtil.objectToJsonStr(new TestStringPojo("value"));
        assertEquals("{\"property\":\"value\"}", json);
        // Add a case for exception handling if required.
    }

    @Test
    void testUpperCaseFirst() {
        assertEquals("Test", StudyStringUtil.upperCaseFirst("test"));
    }

    @Test
    void testLowerCaseFirst() {
        assertEquals("test", StudyStringUtil.lowerCaseFirst("Test"));
    }

    @Test
    void testGetLowerCaseFirstClassName() {
        assertEquals("testStringPojo", StudyStringUtil.getlowerCaseFirstClassName(TestStringPojo.class));
    }

    @Test
    void testIsFirstChar() {
        assertTrue(StudyStringUtil.isFirstChar("apple", 'a'));
        assertFalse(StudyStringUtil.isFirstChar("banana", 'a'));
    }

    @Test
    void testTrimDoubleQuot() {
        assertEquals("text", StudyStringUtil.trimDoubleQuot("\"text\""));
        assertEquals("text", StudyStringUtil.trimDoubleQuot("text"));
    }

    @Test
    void testDelete() {
        assertEquals("HelloWorld", StudyStringUtil.delete("Hello World", " "));
        assertEquals("HelloWorld", StudyStringUtil.delete("Hello World", Arrays.asList(" ")));
    }

    @Test
    void testObjectToCsvStr() {
        TestStringPojo pojo = new TestStringPojo("value");
        String csv = StudyStringUtil.objectToCsvStr(pojo, TestStringPojo.class, true);
        assertNotNull(csv);
    }

    @Test
    void testObjectToTsvStr() {
        TestStringPojo pojo = new TestStringPojo("value");
        String tsv = StudyStringUtil.objectToTsvStr(pojo, TestStringPojo.class, true);
        assertNotNull(tsv);
    }

    @Test
    void testObjectToStrByCsvMapper() {
        TestStringPojo pojo = new TestStringPojo("value");
        String str = StudyStringUtil.objectToStrByCsvMapper(pojo, TestStringPojo.class, ',', true, true);
        assertNotNull(str);
    }

    @Test
    void testCsvStrToList() {
        String csv = "field\nvalue";
        List<TestPojo> result = StudyStringUtil.csvStrToList(csv, TestPojo.class, true);
        assertNotNull(result);
    }

    @Test
    void testTsvStrToList() {
        String tsv = "field\tvalue";
        List<TestPojo> result = StudyStringUtil.tsvStrToList(tsv, TestPojo.class, true);
        assertNotNull(result);
    }

    @Test
    void testStrToListByCsvMapper() {
        String str = "field,value";
        List<TestPojo> result = StudyStringUtil.strToListByCsvMapper(str, TestPojo.class, ',', true, true);
        assertNotNull(result);
    }
}
