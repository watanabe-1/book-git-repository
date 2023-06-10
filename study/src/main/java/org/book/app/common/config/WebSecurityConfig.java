package org.book.app.common.config;

import org.book.app.study.enums.type.AccountType;
import org.book.app.study.service.AppUserDetailsService;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

/**
 * スプリングセキュリティ設定クラス
 */
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
            .requestMatchers("/login/**").permitAll()
            .requestMatchers("/js/*.*").permitAll()
            .requestMatchers("/css/*.*").permitAll()
            .requestMatchers("/res/*.*").permitAll()
            .requestMatchers("/images/*.*").permitAll()
            // システム管理者のみ
            .requestMatchers("/system/**").hasRole(AccountType.SYSTEM.getBaseRole())
            // システム管理者および管理者のみ
            .requestMatchers("/admin/**")
            .hasAnyRole(AccountType.SYSTEM.getBaseRole(), AccountType.ADMIN.getBaseRole())
            .anyRequest().authenticated());
    return http.build();
  }
}
