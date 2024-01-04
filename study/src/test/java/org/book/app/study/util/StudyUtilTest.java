package org.book.app.study.util;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

import java.util.Date;

import org.book.app.study.entity.Account;
import org.book.app.study.service.AppUserDetails;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

class StudyUtilTest {

  @BeforeEach
  void setUp() {
    SecurityContextHolder.clearContext(); // コンテキストをクリア
  }

  @Test
  void getLoginUser_WithValidUser_ReturnsUserId() {
    // モックのセットアップ
    AppUserDetails userDetails = mock(AppUserDetails.class);
    Account account = mock(Account.class);
    when(userDetails.getAccount()).thenReturn(account);
    when(account.getUserId()).thenReturn("expectedUserId");

    Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null);
    SecurityContextHolder.getContext().setAuthentication(authentication);

    // テストの実行
    String userId = StudyUtil.getLoginUser();
    assertEquals("expectedUserId", userId);
  }

  @Test
  void getLoginUser_WithNoAuthentication() {
    String userId = StudyUtil.getLoginUser();
    assertEquals(StudyUtil.getNoUser(), userId);
  }

  @Test
  void getLoginUser_WithDifferentPrincipalType() {
    Authentication authentication = new UsernamePasswordAuthenticationToken("notAppUserDetails", null);
    SecurityContextHolder.getContext().setAuthentication(authentication);

    String userId = StudyUtil.getLoginUser();
    assertEquals(StudyUtil.getNoUser(), userId);
  }

  @Test
  void getLoginUser_WithNullUserId() {
    AppUserDetails userDetails = mock(AppUserDetails.class);
    Account account = mock(Account.class);
    when(userDetails.getAccount()).thenReturn(account);
    when(account.getUserId()).thenReturn(null);

    Authentication authentication = new UsernamePasswordAuthenticationToken(userDetails, null);
    SecurityContextHolder.getContext().setAuthentication(authentication);

    // テストの実行
    String userId = StudyUtil.getLoginUser();
    assertEquals(StudyUtil.getNoUser(), userId);
  }

  @Test
  public void getCommonUser_ReturnsCommonUserId() {
    // メソッドの実行
    String commonUserId = StudyUtil.getCommonUser();

    // 期待値との比較
    assertEquals("common", commonUserId, "getCommonUser should return 'common'");
  }

  @Test
  public void getNoImageCode_ReturnsNoImageCode() {
    // メソッドの実行
    String noImageCode = StudyUtil.getNoImageCode();

    // 期待値との比較
    assertEquals("no_image", noImageCode, "getNoImageCode should return 'no_image'");
  }

  @Test
  public void getNowDate_ReturnsCurrentDate() {
    // メソッドの実行前の日時
    Date before = new Date();

    // メソッドの実行
    Date now = StudyUtil.getNowDate();

    // メソッドの実行後の日時
    Date after = new Date();

    // 期待値との比較
    assertTrue(now.after(before) || now.equals(before),
        "getNowDate should return a date after or equal to the current date before calling the method");
    assertTrue(now.before(after) || now.equals(after),
        "getNowDate should return a date before or equal to the current date after calling the method");
  }

}
