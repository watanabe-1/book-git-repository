package org.book.app.study.util;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.HashMap;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.springframework.ui.ModelMap;
import org.springframework.web.servlet.ModelAndView;

class StudyModelUtilTest {
    @Test
    void testGetModelMapWithModelAndView() {
        Map<String, Object> model = new HashMap<>();
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("key", "value");
        model.put(StudyModelUtil.MODEL_KEY_MODEL_AND_VIEW, modelAndView);

        ModelMap result = StudyModelUtil.getModelMap(model);
        assertEquals("value", result.get("key"));
    }

    @Test
    void testGetModelMapWithoutModelAndView() {
        Map<String, Object> model = new HashMap<>();
        model.put("key", "value");

        ModelMap result = StudyModelUtil.getModelMap(model);
        assertEquals("value", result.get("key"));
    }

    @Test
    void testGetAttribute() {
        Map<String, Object> model = new HashMap<>();
        model.put("attribute", "value");

        Object result = StudyModelUtil.getAttribute(model, "attribute");
        assertEquals("value", result);

        Object nullResult = StudyModelUtil.getAttribute(model, "nonexistent");
        assertNull(nullResult);
    }

    @Test
    void testGetModelMapWithEmptyModelAndView() {
        Map<String, Object> model = new HashMap<>();
        model.put(StudyModelUtil.MODEL_KEY_MODEL_AND_VIEW, new ModelAndView());

        ModelMap result = StudyModelUtil.getModelMap(model);
        assertTrue(result.isEmpty());
    }

    @Test
    void testGetModelMapWithEmptyMap() {
        Map<String, Object> model = new HashMap<>();

        ModelMap result = StudyModelUtil.getModelMap(model);
        assertTrue(result.isEmpty());
    }

    @Test
    void testGetAttributeWithModelAndView() {
        Map<String, Object> model = new HashMap<>();
        ModelAndView modelAndView = new ModelAndView();
        modelAndView.addObject("attribute", "value");
        model.put(StudyModelUtil.MODEL_KEY_MODEL_AND_VIEW, modelAndView);

        Object result = StudyModelUtil.getAttribute(model, "attribute");
        assertEquals("value", result);
    }
}
