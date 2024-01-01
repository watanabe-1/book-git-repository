package org.book.app.study.util;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.List;

import org.book.app.common.exception.BusinessException;
import org.book.app.study.controller.BooksController;
import org.book.app.study.entity.Books;
import org.book.app.study.form.BooksForm;
import org.junit.jupiter.api.Test;
import org.mockito.MockedStatic;
import org.mockito.Mockito;

class StudyBeanUtilTest {

  @Test
  void copyAndSetStudyEntityProperties_CopiesAndSetsProperties() {
    BooksForm source = new BooksForm();
    source.setBooksId("value");
    Books target = new Books();

    try (MockedStatic<StudyUtil> mockedStatic = Mockito.mockStatic(StudyUtil.class)) {
      mockedStatic.when(StudyUtil::getNowDate).thenReturn(new Date());
      mockedStatic.when(StudyUtil::getLoginUser).thenReturn("testUser");

      StudyBeanUtil.copyAndSetStudyEntityProperties(source, target);

      assertEquals("value", target.getBooksId());
      assertNotNull(target.getInsDate());
      assertEquals("testUser", target.getInsUser());
    }
  }

  @Test
  void setStudyEntityProperties_SetsProperties() {
    Books source = new Books();
    source.setBooksId("value");
    Books target = new Books();

    try (MockedStatic<StudyUtil> mockedStatic = Mockito.mockStatic(StudyUtil.class)) {
      mockedStatic.when(StudyUtil::getNowDate).thenReturn(new Date());
      mockedStatic.when(StudyUtil::getLoginUser).thenReturn("testUser");

      StudyBeanUtil.setStudyEntityProperties(target);

      assertNotNull(target.getUpdDate());
      assertEquals("testUser", target.getUpdUser());
    }
  }

  @Test
  void setStudyEntityPropertiesNull_SetsPropertiesToNull() {
    Books target = new Books();
    target.setInsUser("user");
    target.setInsDate(new Date());

    StudyBeanUtil.setStudyEntityPropertiesNull(target);

    assertNull(target.getInsUser());
    assertNull(target.getInsDate());
  }

  @Test
  public void testSetStudyEntityListPropertiesNull() {
    Books mockEntity1 = mock(Books.class);
    Books mockEntity2 = mock(Books.class);
    List<Books> entities = Arrays.asList(mockEntity1, mockEntity2);

    StudyBeanUtil.setStudyEntityListPropertiesNull(entities);

    verify(mockEntity1).setInsUser(null);
    verify(mockEntity1).setInsDate(null);
    verify(mockEntity1).setUpdUser(null);
    verify(mockEntity1).setUpdDate(null);

    verify(mockEntity2).setInsUser(null);
    verify(mockEntity2).setInsDate(null);
    verify(mockEntity2).setUpdUser(null);
    verify(mockEntity2).setUpdDate(null);
  }

  @Test
  void setStudyEntityListPropertiesNull_SetsPropertiesToNullInAllEntities() {
    List<Books> entities = new ArrayList<>();
    Books entity1 = new Books();
    entity1.setInsUser("user1");
    entities.add(entity1);

    Books entity2 = new Books();
    entity2.setInsUser("user2");
    entities.add(entity2);

    StudyBeanUtil.setStudyEntityListPropertiesNull(entities);

    entities.forEach(entity -> {
      assertNull(entity.getInsUser());
      assertNull(entity.getInsDate());
    });
  }

  @Test
  void createInstanceFromBean_CopiesProperties() {
    BooksForm source = new BooksForm();
    source.setBooksId("value");

    Books target = StudyBeanUtil.createInstanceFromBean(source, Books.class);

    assertEquals("value", target.getBooksId());
  }

  @Test
  void createInstanceFromBean_ThrowsExceptionForInaccessibleConstructor() {
    assertThrows(BusinessException.class, () -> {
      StudyBeanUtil.createInstanceFromBean(new Books(), BooksController.class);
    });
  }

  @Test
  void createInstanceFromBeanList_CreatesInstances() {
    List<BooksForm> sourceList = new ArrayList<>();
    BooksForm source1 = new BooksForm();
    source1.setBooksId("value1");
    sourceList.add(source1);

    BooksForm source2 = new BooksForm();
    source2.setBooksId("value2");
    sourceList.add(source2);

    List<Books> targetList = StudyBeanUtil.createInstanceFromBeanList(sourceList, Books.class);

    assertEquals(2, targetList.size());
    assertEquals("value1", targetList.get(0).getBooksId());
    assertEquals("value2", targetList.get(1).getBooksId());
  }
}
