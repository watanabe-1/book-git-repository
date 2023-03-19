package org.book.app.study.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.book.app.study.entity.Account;

/**
 * ユーザ情報サービス.
 */
@Service
public class AppUserDetailsService implements UserDetailsService {

  @Autowired
  private AccountService accountService;

  @Override
  public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
    Account account = accountService.findOne(userId);

    if (account == null) {
      throw new UsernameNotFoundException("User not found");
    }
    return new AppUserDetails(account);
  }
}
