package org.book.app.study.util;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.util.Arrays;
import java.util.List;

import org.book.app.study.entity.CodeLookup;
import org.book.app.study.service.CodeLookupService;
import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;

@SpringBootTest
class StudyCodeUtilTest {
    @MockBean
    private CodeLookupService codeLookupService;

    @Test
    void testGetShort() {
        String listName = "testList";
        String code = "testCode";
        String expectedShortValue = "expectedShort";

        CodeLookup mockCodeLookup = mock(CodeLookup.class);
        when(mockCodeLookup.getShortValue()).thenReturn(expectedShortValue);
        when(codeLookupService.findOne(listName, code)).thenReturn(mockCodeLookup);

        String actualShortValue = StudyCodeUtil.getShort(listName, code);

        assertEquals(expectedShortValue, actualShortValue);
        verify(codeLookupService, times(1)).findOne(listName, code);
    }

    @Test
    void testGetShorts() {
        String listName = "testList";
        List<CodeLookup> mockCodeLookups = Arrays.asList(
                createMockCodeLookup("short1"),
                createMockCodeLookup("short2"));

        when(codeLookupService.findByListName(listName)).thenReturn(mockCodeLookups);

        List<String> actualShortValues = StudyCodeUtil.getShorts(listName);

        assertEquals(Arrays.asList("short1", "short2"), actualShortValues);
        verify(codeLookupService, times(1)).findByListName(listName);
    }

    private CodeLookup createMockCodeLookup(String shortValue) {
        CodeLookup mockCodeLookup = mock(CodeLookup.class);
        when(mockCodeLookup.getShortValue()).thenReturn(shortValue);
        return mockCodeLookup;
    }
}
