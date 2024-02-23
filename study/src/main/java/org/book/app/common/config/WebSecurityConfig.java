package org.book.app.common.config;

import org.book.app.study.enums.type.AccountType;
import org.book.app.study.service.AppUserDetailsService;
import org.book.app.study.util.StudyUtil;
import org.slf4j.MDC;
import org.springframework.boot.autoconfigure.security.servlet.PathRequest;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.HttpStatusEntryPoint;
import org.springframework.security.web.context.SecurityContextHolderFilter;
import org.springframework.security.web.util.matcher.RequestHeaderRequestMatcher;

import lombok.RequiredArgsConstructor;

/**
 * スプリングセキュリティ設定クラス
 */
@EnableWebSecurity
@Configuration
@RequiredArgsConstructor
public class WebSecurityConfig {

  private final AppUserDetailsService appUserDetailsService;

  /**
   * ログインURL
   */
  private static final String LOGIN_URL = "/login";

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
    return appUserDetailsService;
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
            .loginProcessingUrl(LOGIN_URL)
            .loginPage(LOGIN_URL)
            .defaultSuccessUrl("/")
            .usernameParameter("userId")
            .passwordParameter("password")
            .failureUrl(new StringBuffer().append(LOGIN_URL).append(
                "?error=true").toString())
            .permitAll())
        // ログアウト
        .logout(logout -> logout
            .logoutUrl("/logout")
            .logoutSuccessUrl(LOGIN_URL)
            .invalidateHttpSession(true)
            .deleteCookies("JSESSIONID"))
        // url
        .authorizeHttpRequests(authz -> authz
            .requestMatchers(PathRequest.toStaticResources().atCommonLocations()).permitAll()
            // すべてのユーザーがアクセスできる権限を付与する
            // noneでの除外はセキュリティ敵に非推奨らしいので、すべてpermitAllで管理
            .requestMatchers(new StringBuffer().append(LOGIN_URL).append("/**").toString()).permitAll()
            .requestMatchers("/js/*.*").permitAll()
            .requestMatchers("/css/*.*").permitAll()
            .requestMatchers("/res/*.*").permitAll()
            .requestMatchers("/images/*.*").permitAll()
            // システム管理者のみ
            .requestMatchers("/system/**").hasRole(AccountType.SYSTEM.getBaseRole())
            // システム管理者および管理者のみ
            .requestMatchers("/admin/**")
            .hasAnyRole(AccountType.SYSTEM.getBaseRole(), AccountType.ADMIN.getBaseRole())
            .anyRequest().authenticated())
        // filterを使用してログ出力用情報をMDCに付与
        .addFilterAfter((servletRequest, servletResponse, filterChain) -> {
          final String USER_ID = "user";
          try {
            // useridをMDCに付与
            // logback-sprig.xml内で%X{user}として参照できる
            MDC.put(USER_ID, StudyUtil.getLoginUser());
            filterChain.doFilter(servletRequest, servletResponse);
          } finally {
            MDC.remove(USER_ID);
          }
        }, SecurityContextHolderFilter.class)
        // ReactからのAPIリクエストに対するエラーハンドリング
        // 認証切れの状態でのReactからのAPIリクエスト(X-Requested-With: XMLHttpRequest ヘッダーを持つ)に対してHTTPステータスコード 401（Unauthorized）を返すようにする
        .exceptionHandling(customizer -> customizer.defaultAuthenticationEntryPointFor(
            new HttpStatusEntryPoint(HttpStatus.UNAUTHORIZED),
            new RequestHeaderRequestMatcher("X-Requested-With", "XMLHttpRequest")));
    return http.build();
  }
}
