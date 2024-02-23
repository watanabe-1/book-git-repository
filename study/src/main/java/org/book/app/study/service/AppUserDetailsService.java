package org.book.app.study.service;

import org.book.app.study.entity.Account;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import lombok.RequiredArgsConstructor;

/**
 * ユーザ情報サービス.
 */
@Service
@RequiredArgsConstructor
public class AppUserDetailsService implements UserDetailsService {

  private final AccountService accountService;

  @Override
  public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
    Account account = accountService.findOne(userId);

    if (account == null) {
      throw new UsernameNotFoundException("User not found");
    }
    return new AppUserDetails(account);
  }
}
