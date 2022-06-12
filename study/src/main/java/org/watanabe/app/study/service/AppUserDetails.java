package org.watanabe.app.study.service;

import org.springframework.security.core.authority.AuthorityUtils;
import org.springframework.security.core.userdetails.User;
import org.watanabe.app.study.entity.Account;
import org.watanabe.app.study.enums.AccountType;

/**
 * ユーザ情報
 */
public class AppUserDetails extends User {

  private static final long serialVersionUID = 1L;

  private final Account account;

  public AppUserDetails(Account account) {
    super(account.getUserId(), account.getPassword(),
        AuthorityUtils.createAuthorityList(getAuthorityList(account.getAccountType())));
    this.account = account;
  }

  private static String[] getAuthorityList(final String accountType) {
    for (AccountType accountTypeEnum : AccountType.values()) {
      if (accountTypeEnum.toString().equals(accountType)) {
        return new String[] {accountTypeEnum.getRole()};
      }
    }
    return new String[] {AccountType.USER.getRole()};
  }

  public Account getAccount() {
    return account;
  }
}
