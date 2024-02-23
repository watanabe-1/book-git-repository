package org.book.app.study.controller;

import org.book.app.study.entity.Account;
import org.book.app.study.enums.type.AccountType;
import org.book.app.study.form.AccountForm;
import org.book.app.study.service.AccountService;
import org.book.app.study.service.AppUserDetails;
import org.book.app.study.util.StudyBeanUtil;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.lang.NonNull;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.servlet.ModelAndView;

import lombok.RequiredArgsConstructor;

/**
 * アカウントコントローラ.
 *
 */
@Controller
@RequiredArgsConstructor
public class AccountController {

  /**
   * アカウントサービス
   */
  private final AccountService accountService;

  /**
   * パスワードエンコーダー
   */
  private final BCryptPasswordEncoder passwordEncoder;

  /**
   * アトリビュート名 アカウントタイプ
   */
  private static final String ATTRIBUTE_NAME_ACCOUNT_TYPE_LIST = "accountTypeList";

  /**
   * アカウント情報一覧.
   * 
   * @param form アクションフォーム
   * @param model モデル
   * @return 入力画面HTML名
   */
  @GetMapping(value = "/system/account")
  public ModelAndView index(ModelAndView model) {
    model.setViewName("account/index");

    // リスト設定
    model.addObject("accountList", accountService.findAll());
    model.addObject(ATTRIBUTE_NAME_ACCOUNT_TYPE_LIST, AccountType.values());

    return model;
  }

  /**
   * アカウント情報入力.
   * 
   * @param form アクションフォーム
   * @param model モデル
   * @return 入力画面HTML名
   */
  @GetMapping(value = "/system/account/input")
  public ModelAndView input(@ModelAttribute AccountForm form, ModelAndView model) {
    model.setViewName("account/input");
    // リスト設定
    model.addObject(ATTRIBUTE_NAME_ACCOUNT_TYPE_LIST, AccountType.values());

    return model;
  }

  /**
   * アカウント情報入力確認.
   * 
   * @param formアクションフォーム
   * @param result フォームバインド結果
   * @param model モデル
   * @return 入力確認画面HTML名
   */
  @PostMapping(value = "/system/account/confirm")
  public ModelAndView confirm(@ModelAttribute @Validated AccountForm form, BindingResult result,
      ModelAndView model) {
    model.setViewName("account/confirm");

    // 入力チェックエラー有無判定
    if (result.hasErrors()) {
      // エラーありの場合は再度入力画面を表示
      return input(form, model);
    }

    // リスト設定
    model.addObject(ATTRIBUTE_NAME_ACCOUNT_TYPE_LIST, AccountType.values());

    return model;
  }

  /**
   * アカウント情報登録.
   * 
   * @param userDetail 認証済みユーザ情報
   * @param form アクションフォーム
   * @param result フォームバインド結果
   * @param model モデル
   * @return 登録完了画面HTML名
   */
  @PostMapping(value = "/system/account/store")
  public ModelAndView store(@AuthenticationPrincipal AppUserDetails userDetail,
      @ModelAttribute @Validated @NonNull AccountForm form, BindingResult result,
      ModelAndView model) {
    model.setViewName("account/complete");

    // 入力チェックエラー有無判定
    if (result.hasErrors()) {
      model.setViewName("redirect:/errors");
      // エラーありの場合はシステムエラー（パラメータ改ざん）
      return model;
    }

    // フォームの値をエンティティにコピーし、共通項目をセット
    Account account = new Account();
    StudyBeanUtil.copyAndSetStudyEntityProperties(form, account);

    // エンコードしたパスワードをセット
    account.setPassword(passwordEncoder.encode(form.getPassword()));

    try {
      // DBへデータを保存
      accountService.saveOne(account);
    } catch (DuplicateKeyException dke) {
      result.addError(new FieldError(result.getObjectName(), "userId", "入力したアカウントは既に登録されています。"));
      return input(form, model);
    }

    return model;
  }
}
