package org.book.app.study.util;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.io.ByteArrayInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.StringReader;
import java.io.StringWriter;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.List;

import org.book.app.common.exception.BusinessException;
import org.junit.jupiter.api.Test;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonPropertyOrder;
import com.fasterxml.jackson.dataformat.csv.CsvMapper;
import com.fasterxml.jackson.dataformat.csv.CsvSchema;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

// POJOクラスを定義 (FileRowはサンプルPOJOクラス)
@Data
@AllArgsConstructor
@NoArgsConstructor
@JsonPropertyOrder({ "column1", "column2", "column3" })
class TestPojo {
    @JsonProperty("column1")
    private String column1;
    @JsonProperty("column2")
    private String column2;
    @JsonProperty("column3")
    private String column3;
}

public class StudyJacksonUtilTest {
    @Test
    public void testCreateCsvMapper() throws Exception {
        // テストデータの準備
        String[] testData = { "test1", "test2" };

        // ケース1: isQuote が true の場合
        CsvMapper mapperWithQuote = StudyJacksonUtil.createCsvMapper(true);
        String resultWithQuote = writeCsvData(mapperWithQuote, testData);
        assertTrue(resultWithQuote.contains("\"test1\""));

        // ケース2: isQuote が false の場合
        CsvMapper mapperWithoutQuote = StudyJacksonUtil.createCsvMapper(false);
        String resultWithoutQuote = writeCsvData(mapperWithoutQuote, testData);
        assertFalse(resultWithoutQuote.contains("\"test1\""));
    }

    private String writeCsvData(CsvMapper mapper, String[] data) throws IOException {
        // CSVスキーマの設定
        CsvSchema schema = CsvSchema.builder().addColumn("column").build();

        // CSVデータの書き込み
        StringWriter writer = new StringWriter();
        mapper.writer(schema).writeValues(writer).writeAll(Arrays.asList(data));
        return writer.toString();
    }

    @Test
    public void testCreateCsvSchema() {
        CsvMapper mapper = new CsvMapper();
        Class<TestPojo> pojoType = TestPojo.class;

        // 区切り文字とヘッダーありの場合
        CsvSchema schemaWithHeader = StudyJacksonUtil.createCsvSchema(mapper, pojoType, ',', true);
        assertTrue(schemaWithHeader.usesHeader());

        // 区切り文字とヘッダーなしの場合
        CsvSchema schemaWithoutHeader = StudyJacksonUtil.createCsvSchema(mapper, pojoType, ',', false);
        assertFalse(schemaWithoutHeader.usesHeader());

        // 区切り文字の確認
        assertEquals(',', schemaWithHeader.getColumnSeparator());
    }

    @Test
    public void testReadValues() throws Exception {
        CsvMapper mapper = new CsvMapper();
        CsvSchema schema = CsvSchema.emptySchema().withHeader();
        Class<TestPojo> pojoType = TestPojo.class;
        String csvData = "column1,column2\nvalue1,value2";

        // StringReaderを使用
        testReadValuesWithReader(csvData, mapper, schema, pojoType);

        // InputStreamを使用
        testReadValuesWithInputStream(csvData, mapper, schema, pojoType);

        // Stringを使用
        testReadValuesWithString(csvData, mapper, schema, pojoType);
    }

    private void testReadValuesWithReader(String csvData, CsvMapper mapper, CsvSchema schema, Class<TestPojo> pojoType)
            throws Exception {
        StringReader reader = new StringReader(csvData);
        List<TestPojo> result = StudyJacksonUtil.readValues(reader, mapper, schema, pojoType);
        validateResult(result);
    }

    private void testReadValuesWithInputStream(String csvData, CsvMapper mapper, CsvSchema schema,
            Class<TestPojo> pojoType) throws Exception {
        try (InputStream inputStream = new ByteArrayInputStream(csvData.getBytes(StandardCharsets.UTF_8));) {
            List<TestPojo> result = StudyJacksonUtil.readValues(inputStream, mapper, schema, pojoType);
            validateResult(result);
        }
    }

    private void testReadValuesWithString(String csvData, CsvMapper mapper, CsvSchema schema, Class<TestPojo> pojoType)
            throws Exception {
        List<TestPojo> result = StudyJacksonUtil.readValues(csvData, mapper, schema, pojoType);
        validateResult(result);
    }

    private void validateResult(List<TestPojo> result) {
        assertNotNull(result);
        assertEquals(1, result.size());
        TestPojo pojo = result.get(0);
        assertEquals("value1", pojo.getColumn1());
        assertEquals("value2", pojo.getColumn2());
    }

    @Test
    public void testReadValuesWithInvalidInput() {
        CsvMapper mapper = new CsvMapper();
        CsvSchema schema = CsvSchema.emptySchema().withHeader();
        Class<TestPojo> pojoType = TestPojo.class;

        // 不正な入力（サポートされていないオブジェクトタイプ）
        Object unsupportedObject = new Object();
        assertThrows(BusinessException.class,
                () -> StudyJacksonUtil.readValues(unsupportedObject, mapper, schema, pojoType));
    }
}
