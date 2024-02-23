package org.book.app.study.util;

import static org.junit.jupiter.api.Assertions.assertArrayEquals;
import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.junit.jupiter.api.Test;
import org.springframework.validation.BeanPropertyBindingResult;
import org.springframework.validation.FieldError;

class StudyMessageUtilTest {
    @Test
    void testAddError() {
        BeanPropertyBindingResult result = new BeanPropertyBindingResult(new Object(), "objectName");
        StudyMessageUtil.addError(result, "field", "error_code");

        assertFalse(result.getAllErrors().isEmpty());
        assertEquals("error_code", result.getAllErrors().get(0).getCode());
    }

    @Test
    void testGetArrayFieldName() {
        String result = StudyMessageUtil.getArrayFieldName("arrayField", 3, "subField1", "subField2");
        assertEquals("arrayField[3].subField1.subField2", result);
    }

    @Test
    void testGetFieldName() {
        String singleFieldResult = StudyMessageUtil.getFieldName("field1");
        assertEquals("field1", singleFieldResult);

        String multipleFieldsResult = StudyMessageUtil.getFieldName("field1", "field2");
        assertEquals("field1.field2", multipleFieldsResult);

        String emptyFieldsResult = StudyMessageUtil.getFieldName();
        assertEquals("", emptyFieldsResult);
    }

    @Test
    void testAddErrorWithTwoParameters() {
        BeanPropertyBindingResult result = new BeanPropertyBindingResult(new Object(), "objectName");
        StudyMessageUtil.addError(result, "field", "error_code");

        assertFalse(result.getAllErrors().isEmpty());
        assertEquals("error_code", result.getAllErrors().get(0).getCode());
    }

    @Test
    void testAddErrorWithArguments() {
        BeanPropertyBindingResult result = new BeanPropertyBindingResult(new Object(), "objectName");
        StudyMessageUtil.addError(result, "field", "error_code", "arg1", "arg2");

        assertFalse(result.getAllErrors().isEmpty());
        FieldError error = result.getFieldError("field");
        assertNotNull(error);
        assertEquals("error_code", error.getCode());
        assertArrayEquals(new Object[] { "arg1", "arg2" }, error.getArguments());
    }

    @Test
    void testAddErrorOndefMsg() {
        BeanPropertyBindingResult result = new BeanPropertyBindingResult(new Object(), "objectName");
        StudyMessageUtil.addErrorOnDefMsg(result, "field", "error_code", new Object[] { "arg1" }, "default message");

        assertFalse(result.getAllErrors().isEmpty());
        FieldError error = result.getFieldError("field");
        assertNotNull(error);
        assertEquals("default message", error.getDefaultMessage());
    }
}
