package org.watanabe.app.common.config;

import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.watanabe.app.study.enums.type.AccountType;
import org.watanabe.app.study.service.AppUserDetailsService;

@EnableWebSecurity
@Configuration
public class WebSecurityConfig {

  /**
   * アカウント登録時のパスワードエンコードで利用するためDI管理する
   * 
   * @return PasswordEncoder
   */
  @Bean
  BCryptPasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }

  /**
   * 認証ロジッククラス
   * 
   * @return AppUserDetailsService
   */
  AppUserDetailsService appUserDetailsService() {
    return new AppUserDetailsService();
  }

  /**
   * スプリングセキュリティ設定
   * 
   * @param http HttpSecurity
   * @return 設定結果
   * @throws Exception
   */
  @Bean
  SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        // ログイン
        .formLogin(login -> login
            .loginProcessingUrl("/login")
            .loginPage("/login")
            .defaultSuccessUrl("/")
            .usernameParameter("userId")
            .passwordParameter("password")
            .failureUrl("/login?error=true")
            .permitAll())
        // ログアウト
        .logout(logout -> logout
            .logoutUrl("/logout")
            .logoutSuccessUrl("/login")
            .invalidateHttpSession(true)
            .deleteCookies("JSESSIONID"))
        // url
        .authorizeHttpRequests(authz -> authz
            .requestMatchers(PathRequest.toStaticResources().atCommonLocations()).permitAll()
            // すべてのユーザーがアクセスできる権限を付与する
            // noneでの除外はセキュリティ敵に非推奨らしいので、すべてpermitAllで管理
            .mvcMatchers("/login/**").permitAll()
            .mvcMatchers("/js/*.*").permitAll()
            .mvcMatchers("/css/*.*").permitAll()
            .mvcMatchers("/res/*.*").permitAll()
            .mvcMatchers("/images/*.*").permitAll()
            // システム管理者のみ
            .mvcMatchers("/system/**").hasRole(AccountType.SYSTEM.getRole())
            // システム管理者および管理者のみ
            .mvcMatchers("/admin/**").hasRole(AccountType.ADMIN.getRole())
            .anyRequest().authenticated());
    return http.build();
  }
}
