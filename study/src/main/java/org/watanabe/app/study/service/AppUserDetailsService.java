package org.watanabe.app.study.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.watanabe.app.study.entity.Account;

/**
 * ユーザ情報サービス.
 */
@Service
public class AppUserDetailsService implements UserDetailsService {

  @Autowired
  private AccountService accountService;

  @Autowired
  private PasswordEncoder passwordEncoder;

  @Override
  public UserDetails loadUserByUsername(String userId) throws UsernameNotFoundException {
    Account account = accountService.findOne(userId);

    // パスワードのハッシュ化と認証の流れ
    // テストユーザーのパスワードはこれで作成可能
    // String pass = "wata";
    // String a = passwordEncoder.encode(pass);
    // boolean b = passwordEncoder.matches(pass, a);

    if (account == null) {
      throw new UsernameNotFoundException("User not found");
    }
    return new AppUserDetails(account);
  }
}
