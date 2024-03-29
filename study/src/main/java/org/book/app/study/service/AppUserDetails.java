package org.book.app.study.service;

import org.book.app.study.entity.Account;
import org.book.app.study.enums.type.AccountType;
import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;

import lombok.EqualsAndHashCode;
import lombok.Getter;

/**
 * ユーザ情報
 */
@EqualsAndHashCode(callSuper = false)
public class AppUserDetails extends User {

  /**
   * シリアルバージョンUID
   */
  private static final long serialVersionUID = 1L;

  /**
   * アカウント
   */
  @Getter
  private final Account account;

  /**
   * コンストラクター
   * 
   * @param account
   */
  public AppUserDetails(Account account) {
    super(account.getUserId(), account.getPassword(),
        AuthorityUtils.createAuthorityList(getAuthorityList(account.getAccountType())));
    this.account = account;
  }

  /**
   * コードに応じたアカウント権限を取得
   * 
   * @param accountType アカウントタイプ
   * @return 対応する権限
   */
  private static String[] getAuthorityList(final String accountType) {
    return new String[] { AccountType.codeOf(accountType).getRole() };
  }
}
