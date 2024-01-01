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

public class StudyStringUtilTest {
    @Test
    public void testIsNullOrEmpty() {
        assertTrue(StudyStringUtil.isNullOrEmpty(null));
        assertTrue(StudyStringUtil.isNullOrEmpty(""));
        assertFalse(StudyStringUtil.isNullOrEmpty("test"));
    }

    @Test
    public void testPathJoinWithTwoParameters() {
        assertEquals(String.format("base%spath", StudyStringUtil.SEPARATOR_BY_PATH),
                StudyStringUtil.pathJoin("base", "path"));
        assertEquals(String.format("base%spath", StudyStringUtil.SEPARATOR_BY_PATH),
                StudyStringUtil.pathJoin("base" + StudyStringUtil.SEPARATOR_BY_PATH, "path"));
        assertEquals(String.format("base%spath", StudyStringUtil.SEPARATOR_BY_PATH),
                StudyStringUtil.pathJoin("base", StudyStringUtil.SEPARATOR_BY_PATH + "path"));
    }

    @Test
    public void testPathJoinWithMultipleParameters() {
        assertEquals(
                String.format("base%spath%sto%sresource", StudyStringUtil.SEPARATOR_BY_PATH,
                        StudyStringUtil.SEPARATOR_BY_PATH, StudyStringUtil.SEPARATOR_BY_PATH),
                StudyStringUtil.pathJoin("base", "path", "to", "resource"));
    }

    @Test
    public void testReplaceFirstOneLeft() {
        assertEquals("replacementString", StudyStringUtil.replaceFirstOneLeft("targetString", "target", "replacement"));
        assertEquals("targetString", StudyStringUtil.replaceFirstOneLeft("targetString", "nonexistent", "replacement"));
    }

    @Test
    public void testReplaceFirstOneRight() {
        assertEquals("Stringreplacement",
                StudyStringUtil.replaceFirstOneRight("Stringtarget", "target", "replacement"));
        assertEquals("Stringtarget",
                StudyStringUtil.replaceFirstOneRight("Stringtarget", "nonexistent", "replacement"));
    }

    @Test
    public void testReplaceLast() {
        assertEquals("firstTargetSecondReplacement",
                StudyStringUtil.replaceLast("firstTargetSecondTarget", "Target", "Replacement"));
    }

    @Test
    public void testSplitByCsv() {
        assertArrayEquals(new String[] { "a", "b", "c" }, StudyStringUtil.splitByCsv("a,b,c"));
    }

    @Test
    public void testSplitByTsv() {
        assertArrayEquals(new String[] { "a", "b", "c" }, StudyStringUtil.splitByTsv("a\tb\tc"));
    }

    @Test
    public void testObjectToJsonStr() {
        String json = StudyStringUtil.objectToJsonStr(new TestStringPojo("value"));
        assertEquals("{\"property\":\"value\"}", json);
        // Add a case for exception handling if required.
    }

    @Test
    public void testUpperCaseFirst() {
        assertEquals("Test", StudyStringUtil.upperCaseFirst("test"));
    }

    @Test
    public void testLowerCaseFirst() {
        assertEquals("test", StudyStringUtil.lowerCaseFirst("Test"));
    }

    @Test
    public void testGetLowerCaseFirstClassName() {
        assertEquals("testStringPojo", StudyStringUtil.getlowerCaseFirstClassName(TestStringPojo.class));
    }

    @Test
    public void testIsFirstChar() {
        assertTrue(StudyStringUtil.isFirstChar("apple", 'a'));
        assertFalse(StudyStringUtil.isFirstChar("banana", 'a'));
    }

    @Test
    public void testTrimDoubleQuot() {
        assertEquals("text", StudyStringUtil.trimDoubleQuot("\"text\""));
        assertEquals("text", StudyStringUtil.trimDoubleQuot("text"));
    }

    @Test
    public void testDelete() {
        assertEquals("HelloWorld", StudyStringUtil.delete("Hello World", " "));
        assertEquals("HelloWorld", StudyStringUtil.delete("Hello World", Arrays.asList(" ")));
    }

    @Test
    public void testObjectToCsvStr() {
        TestStringPojo pojo = new TestStringPojo("value");
        String csv = StudyStringUtil.objectToCsvStr(pojo, TestStringPojo.class, true);
        assertNotNull(csv);
    }

    @Test
    public void testObjectToTsvStr() {
        TestStringPojo pojo = new TestStringPojo("value");
        String tsv = StudyStringUtil.objectToTsvStr(pojo, TestStringPojo.class, true);
        assertNotNull(tsv);
    }

    @Test
    public void testObjectToStrByCsvMapper() {
        TestStringPojo pojo = new TestStringPojo("value");
        String str = StudyStringUtil.objectToStrByCsvMapper(pojo, TestStringPojo.class, ',', true, true);
        assertNotNull(str);
    }

    @Test
    public void testCsvStrToList() {
        String csv = "field\nvalue";
        List<TestPojo> result = StudyStringUtil.csvStrToList(csv, TestPojo.class, true);
        assertNotNull(result);
    }

    @Test
    public void testTsvStrToList() {
        String tsv = "field\tvalue";
        List<TestPojo> result = StudyStringUtil.tsvStrToList(tsv, TestPojo.class, true);
        assertNotNull(result);
    }

    @Test
    public void testStrToListByCsvMapper() {
        String str = "field,value";
        List<TestPojo> result = StudyStringUtil.strToListByCsvMapper(str, TestPojo.class, ',', true, true);
        assertNotNull(result);
    }
}
