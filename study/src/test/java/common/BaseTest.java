package common;

import org.book.app.study.entity.Account;
import org.book.app.study.enums.type.AccountType;
import org.book.app.study.service.AppUserDetails;
import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;

import common.util.StudyTestUtil;

@SpringBootTest
@java.lang.SuppressWarnings({ "squid:S2187" })
public class BaseTest {
    @BeforeEach
    protected void setUp() {
        // ログイン情報の設定
        Account acount = new Account();
        acount.setUserId("userid");
        acount.setUserName("user");
        acount.setPassword("password");
        acount.setAccountType(AccountType.ADMIN.getCode());
        AppUserDetails userDetails = new AppUserDetails(acount);
        UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(userDetails, null,
                userDetails.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    @AfterEach
    protected void tearDown() {
        // テンプディレクトリのクリーン
        StudyTestUtil.cleanTestTempDir();
        // ログイン情報のクリア
        SecurityContextHolder.clearContext();
    }
}
