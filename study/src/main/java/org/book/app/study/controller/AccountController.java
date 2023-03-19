package org.book.app.study.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.servlet.ModelAndView;
import org.book.app.study.entity.Account;
import org.book.app.study.enums.type.AccountType;
import org.book.app.study.form.AccountForm;
import org.book.app.study.service.AccountService;
import org.book.app.study.service.AppUserDetails;
import org.book.app.study.util.StudyBeanUtil;

/**
 * アカウントコントローラ.
 *
 */
@Controller
public class AccountController {

  /**
   * アカウントサービス
   */
  @Autowired
  private AccountService accountService;

  /**
   * パスワードエンコーダー
   */
  @Autowired
  private BCryptPasswordEncoder passwordEncoder;

  /**
   * アカウント情報一覧.
   * 
   * @param form  アクションフォーム
   * @param model モデル
   * @return 入力画面HTML名
   */
  @RequestMapping(value = "/system/account", method = RequestMethod.GET)
  public ModelAndView index(ModelAndView model) {
    model.setViewName("account/index");

    // リスト設定
    model.addObject("accountList", accountService.findAll());
    model.addObject("accountTypeList", AccountType.values());

    return model;
  }

  /**
   * アカウント情報入力.
   * 
   * @param form  アクションフォーム
   * @param model モデル
   * @return 入力画面HTML名
   */
  @RequestMapping(value = "/system/account/input", method = RequestMethod.GET)
  public ModelAndView input(@ModelAttribute AccountForm form, ModelAndView model) {
    model.setViewName("account/input");
    // リスト設定
    model.addObject("accountTypeList", AccountType.values());

    return model;
  }

  /**
   * アカウント情報入力確認.
   * 
   * @param formアクションフォーム
   * @param result        フォームバインド結果
   * @param model         モデル
   * @return 入力確認画面HTML名
   */
  @RequestMapping(value = "/system/account/confirm", method = RequestMethod.POST)
  public ModelAndView confirm(@ModelAttribute @Validated AccountForm form, BindingResult result,
      ModelAndView model) {
    model.setViewName("account/confirm");

    // 入力チェックエラー有無判定
    if (result.hasErrors()) {
      // エラーありの場合は再度入力画面を表示
      return input(form, model);
    }

    // リスト設定
    model.addObject("accountTypeList", AccountType.values());

    return model;
  }

  /**
   * アカウント情報登録.
   * 
   * @param userDetail 認証済みユーザ情報
   * @param form       アクションフォーム
   * @param result     フォームバインド結果
   * @param model      モデル
   * @return 登録完了画面HTML名
   */
  @RequestMapping(value = "/system/account/store", method = RequestMethod.POST)
  public ModelAndView store(@AuthenticationPrincipal AppUserDetails userDetail,
      @ModelAttribute @Validated AccountForm form, BindingResult result,
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
