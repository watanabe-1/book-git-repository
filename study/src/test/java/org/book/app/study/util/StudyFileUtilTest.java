package org.book.app.study.util;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.List;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.io.TempDir;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.CsvSource;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.core.io.ClassPathResource;
import org.springframework.core.io.InputStreamSource;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// POJOクラスを定義 (FileRowはサンプルPOJOクラス)
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({ "column1", "column2", "column3" })
class FileRow {
    @JsonProperty("column1")
    private String column1;
    @JsonProperty("column2")
    private String column2;
    @JsonProperty("column3")
    private String column3;
}

class StudyFileUtilTest {

    private final String RESOURCE_DIR = "org/book/app/study/util/studyFileUtilTest/";

    @TempDir
    Path tempDir;

    @Mock
    private InputStreamSource mockInputStreamSource;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @ParameterizedTest
    @CsvSource({
            "testfile,txt,testfile.txt",
            "testfile.txt,txt,testfile.txt",
            "'',txt,.txt",
            ",txt,"
    })
    void testAddExtension(String fileName, String extension, String expected) {
        String result = fileName == null ? StudyFileUtil.addExtension(null, extension)
                : StudyFileUtil.addExtension(fileName, extension);
        assertEquals(expected, result);
    }

    @Test
    void testCsvFileToList_WithHeader() throws Exception {
        // CSVファイルの読み込み
        ClassPathResource resource = new ClassPathResource(
                RESOURCE_DIR + "csvRowWithHeader.csv");
        // メソッドを実行
        List<FileRow> resultList = StudyFileUtil.csvFileToList(
                resource, FileRow.class, true);

        // 結果を検証
        assertNotNull(resultList);
        assertFalse(resultList.isEmpty());
        assertEquals(1, resultList.size());
        FileRow row = resultList.get(0);
        assertEquals("value1", row.getColumn1());
        assertEquals("value2", row.getColumn2());
        assertEquals("value3", row.getColumn3());
    }

    @Test
    void testCsvFileToList_WithNoHeader() throws Exception {
        // CSVファイルの読み込み
        ClassPathResource resource = new ClassPathResource(
                RESOURCE_DIR + "csvRow.csv");
        // メソッドを実行
        List<FileRow> resultList = StudyFileUtil.csvFileToList(
                resource, FileRow.class, false);

        // 結果を検証
        assertNotNull(resultList);
        assertFalse(resultList.isEmpty());
        assertEquals(1, resultList.size());
        FileRow row = resultList.get(0);
        assertEquals("value1", row.getColumn1());
        assertEquals("value2", row.getColumn2());
        assertEquals("value3", row.getColumn3());
    }

    @Test
    void testTsvFileToList_WithHeader() throws Exception {
        // TSVファイルの読み込み
        ClassPathResource resource = new ClassPathResource(
                RESOURCE_DIR + "tsvRowWithHeader.tsv");
        // メソッドを実行
        List<FileRow> resultList = StudyFileUtil.tsvFileToList(
                resource, FileRow.class, true);

        // 結果を検証
        assertNotNull(resultList);
        assertFalse(resultList.isEmpty());
        assertEquals(1, resultList.size());
        FileRow row = resultList.get(0);
        assertEquals("value1", row.getColumn1());
        assertEquals("value2", row.getColumn2());
        assertEquals("value3", row.getColumn3());
    }

    @Test
    void testTsvFileToList_WithNoHeader() throws Exception {
        // TSVファイルの読み込み
        ClassPathResource resource = new ClassPathResource(
                RESOURCE_DIR + "tsvRow.tsv");
        // メソッドを実行
        List<FileRow> resultList = StudyFileUtil.tsvFileToList(
                resource, FileRow.class, false);

        // 結果を検証
        assertNotNull(resultList);
        assertFalse(resultList.isEmpty());
        assertEquals(1, resultList.size());
        FileRow row = resultList.get(0);
        assertEquals("value1", row.getColumn1());
        assertEquals("value2", row.getColumn2());
        assertEquals("value3", row.getColumn3());
    }

    @Test
    void testTsvFileToList_WithHeader_isQuote() throws Exception {
        // CSVファイルの読み込み
        ClassPathResource resource = new ClassPathResource(
                RESOURCE_DIR + "csvRowWithHeader.csv");
        // メソッドを実行
        List<FileRow> resultList = StudyFileUtil.fileToListByCsvMapper(
                resource, "UTF-8", FileRow.class, ',', true, true);

        // 結果を検証
        assertNotNull(resultList);
        assertFalse(resultList.isEmpty());
        assertEquals(1, resultList.size());
        FileRow row = resultList.get(0);
        assertEquals("value1", row.getColumn1());
        assertEquals("value2", row.getColumn2());
        assertEquals("value3", row.getColumn3());
    }

    @Test
    void testTsvFileToList_WithNoHeader_isNoQuote() throws Exception {
        // TSVファイルの読み込み
        ClassPathResource resource = new ClassPathResource(
                RESOURCE_DIR + "tsvRow.tsv");
        // メソッドを実行
        List<FileRow> resultList = StudyFileUtil.fileToListByCsvMapper(
                resource, "UTF-8", FileRow.class, '\t', false, false);

        // 結果を検証
        assertNotNull(resultList);
        assertFalse(resultList.isEmpty());
        assertEquals(1, resultList.size());
        FileRow row = resultList.get(0);
        assertEquals("value1", row.getColumn1());
        assertEquals("value2", row.getColumn2());
        assertEquals("value3", row.getColumn3());
    }

    @Test
    void testDetectFileEncoding_InputStreamSource() throws IOException {
        // UTF-8 エンコード
        ClassPathResource utf8File = new ClassPathResource(
                RESOURCE_DIR + "charset_test_utf8.txt");

        //  shift_jisンコード
        ClassPathResource sjisFile = new ClassPathResource(
                RESOURCE_DIR + "charset_test_shiftjis.txt");

        // メソッドを実行して文字コードを検出
        String utf8Encoding = StudyFileUtil.detectFileEncoding(utf8File);
        String sjisEncoding = StudyFileUtil.detectFileEncoding(sjisFile);

        // 検証
        assertEquals("UTF-8", utf8Encoding);
        assertEquals("SHIFT_JIS", sjisEncoding);
    }

    @Test
    void testDetectFileEncoding_File() throws IOException {
        // UTF-8 エンコード
        File utf8File = new ClassPathResource(
                RESOURCE_DIR + "charset_test_utf8.txt").getFile();

        //  shift_jisンコード
        File sjisFile = new ClassPathResource(
                RESOURCE_DIR + "charset_test_shiftjis.txt").getFile();

        // メソッドを実行して文字コードを検出
        String utf8Encoding = StudyFileUtil.detectFileEncoding(utf8File);
        String sjisEncoding = StudyFileUtil.detectFileEncoding(sjisFile);

        // 検証
        assertEquals("UTF-8", utf8Encoding);
        assertEquals("SHIFT_JIS", sjisEncoding);
    }

    @Test
    void testDetectFileEncoding_InputStream() throws IOException {
        // UTF-8 エンコード
        ClassPathResource utf8File = new ClassPathResource(
                RESOURCE_DIR + "charset_test_utf8.txt");

        //  shift_jisンコード
        ClassPathResource sjisFile = new ClassPathResource(
                RESOURCE_DIR + "charset_test_shiftjis.txt");

        // メソッドを実行して文字コードを検出
        String utf8Encoding;
        try (InputStream in = utf8File.getInputStream();) {
            utf8Encoding = StudyFileUtil.detectFileEncoding(utf8File);
        }

        String sjisEncoding;
        try (InputStream in = sjisFile.getInputStream();) {
            sjisEncoding = StudyFileUtil.detectFileEncoding(sjisFile);
        }

        // 検証
        assertEquals("UTF-8", utf8Encoding);
        assertEquals("SHIFT_JIS", sjisEncoding);
    }

    @Test
    void testReadClassPathFile() throws Exception {
        // テストファイルのパス
        String testFilePath = RESOURCE_DIR + "charset_test_utf8.txt";
        // 期待されるファイルの内容
        String expectedContent = "こんにちは";

        // メソッドを実行してファイルの内容を取得
        String fileContent = StudyFileUtil.readClassPathFile(testFilePath, "UTF-8");

        // 結果を検証
        assertEquals(expectedContent, fileContent);
    }

    @Test
    void testDeleteFile() throws IOException {
        // 一時ファイルの作成
        File tempFile = Files.createFile(tempDir.resolve("tempFile.txt")).toFile();

        // 確認: ファイルが存在する
        assertTrue(tempFile.exists());

        // メソッドを実行してファイルを削除
        StudyFileUtil.deleteFile(tempFile);

        // 確認: ファイルが削除された
        assertFalse(tempFile.exists());
    }
}
