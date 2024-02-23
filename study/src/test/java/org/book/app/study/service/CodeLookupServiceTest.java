package org.book.app.study.service;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;

import org.book.app.study.entity.CodeLookup;
import org.book.app.study.mapper.CodeLookupMapper;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

class CodeLookupServiceTest {

    @Mock
    private CodeLookupMapper codeLookupMapper;

    @InjectMocks
    private CodeLookupService codeLookupService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testFindOne() {
        String listName = "testList";
        String code = "testCode";
        CodeLookup mockCodeLookup = new CodeLookup(); // 適切なプロパティを設定

        when(codeLookupMapper.findOne(listName, code)).thenReturn(mockCodeLookup);

        CodeLookup result = codeLookupService.findOne(listName, code);

        assertNotNull(result);
        verify(codeLookupMapper, times(1)).findOne(listName, code);
    }

    @Test
    void testFindAll() {
        // モックデータの準備
        CodeLookup codeLookup1 = new CodeLookup(); // 適切なプロパティを設定
        CodeLookup codeLookup2 = new CodeLookup(); // 適切なプロパティを設定
        List<CodeLookup> mockData = Arrays.asList(codeLookup1, codeLookup2);

        // モックの振る舞いを設定
        when(codeLookupMapper.findAll()).thenReturn(mockData);

        // テスト対象のメソッドを実行
        List<CodeLookup> result = codeLookupService.findAll();

        // 検証
        assertNotNull(result);
        assertEquals(2, result.size());
        verify(codeLookupMapper, times(1)).findAll();
    }

    @Test
    void testSaveBulk() {
        List<CodeLookup> codeLookups = Arrays.asList(new CodeLookup(), new CodeLookup());
        when(codeLookupMapper.saveBulk(codeLookups)).thenReturn(codeLookups.size());

        int result = codeLookupService.saveBulk(codeLookups);

        assertEquals(codeLookups.size(), result);
        verify(codeLookupMapper, times(1)).saveBulk(codeLookups);
    }

    @Test
    void testSaveOne() {
        CodeLookup codeLookup = new CodeLookup();
        when(codeLookupMapper.saveOne(codeLookup)).thenReturn(1);

        int result = codeLookupService.saveOne(codeLookup);

        assertEquals(1, result);
        verify(codeLookupMapper, times(1)).saveOne(codeLookup);
    }

    @Test
    void testUpdateAll() {
        CodeLookup codeLookup = new CodeLookup();
        when(codeLookupMapper.updateAll(codeLookup)).thenReturn(1);

        int result = codeLookupService.updateAll(codeLookup);

        assertEquals(1, result);
        verify(codeLookupMapper, times(1)).updateAll(codeLookup);
    }

    @Test
    void testUpdateOne() {
        CodeLookup codeLookup = new CodeLookup();
        String listName = "testList";
        String code = "testCode";
        when(codeLookupMapper.updateOne(codeLookup, listName, code)).thenReturn(1);

        int result = codeLookupService.updateOne(codeLookup, listName, code);

        assertEquals(1, result);
        verify(codeLookupMapper, times(1)).updateOne(codeLookup, listName, code);
    }

    @Test
    void testDeleteAll() {
        when(codeLookupMapper.deleteAll()).thenReturn(1);

        int result = codeLookupService.deleteAll();

        assertEquals(1, result);
        verify(codeLookupMapper, times(1)).deleteAll();
    }

    @Test
    void testDeleteOne() {
        String listName = "testList";
        String code = "testCode";
        when(codeLookupMapper.deleteOne(listName, code)).thenReturn(1);

        int result = codeLookupService.deleteOne(listName, code);

        assertEquals(1, result);
        verify(codeLookupMapper, times(1)).deleteOne(listName, code);
    }

    @Test
    void testFindByListName() {
        String listName = "testList";
        List<CodeLookup> mockCodeLookups = Arrays.asList(new CodeLookup(), new CodeLookup());
        when(codeLookupMapper.findByListName(listName)).thenReturn(mockCodeLookups);

        List<CodeLookup> result = codeLookupService.findByListName(listName);

        assertNotNull(result);
        assertEquals(mockCodeLookups.size(), result.size());
        verify(codeLookupMapper, times(1)).findByListName(listName);
    }
}
