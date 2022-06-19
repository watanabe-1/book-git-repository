package org.watanabe.app.study.controller;

import java.util.Date;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.watanabe.app.study.entity.Account;
import org.watanabe.app.study.enums.type.AccountType;
import org.watanabe.app.study.form.AccountForm;
import org.watanabe.app.study.service.AccountService;
import org.watanabe.app.study.service.AppUserDetails;
import org.watanabe.app.study.util.StudyUtil;

/**
 * アカウントコントローラ.
 *
 */
@Controller
public class AccountController {

  @Autowired
  private AccountService accountService;

  @Autowired
  private BCryptPasswordEncoder passwordEncoder;

  /**
   * アカウント情報一覧.
   * 
   * @param form アクションフォーム
   * @param model モデル
   * @return 入力画面HTML名
   */
  @RequestMapping(value = "/system/account", method = RequestMethod.GET)
  public String index(Model model) {

    // リスト設定
    model.addAttribute("accountList", accountService.findAll());
    model.addAttribute("accountTypeList", AccountType.values());

    return "account/index";
  }

  /**
   * アカウント情報入力.
   * 
   * @param form アクションフォーム
   * @param model モデル
   * @return 入力画面HTML名
   */
  @RequestMapping(value = "/system/account/input", method = RequestMethod.GET)
  public String input(@ModelAttribute AccountForm form, Model model) {

    // リスト設定
    model.addAttribute("accountTypeList", AccountType.values());

    return "account/input";
  }

  /**
   * アカウント情報入力確認.
   * 
   * @param formアクションフォーム
   * @param result フォームバインド結果
   * @param model モデル
   * @return 入力確認画面HTML名
   */
  @RequestMapping(value = "/system/account/confirm", method = RequestMethod.POST)
  public String confirm(@ModelAttribute @Validated AccountForm form, BindingResult result,
      Model model) {

    // 入力チェックエラー有無判定
    if (result.hasErrors()) {
      // エラーありの場合は再度入力画面を表示
      return input(form, model);
    }

    // リスト設定
    model.addAttribute("accountTypeList", AccountType.values());

    return "account/confirm";
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
  @RequestMapping(value = "/system/account/store", method = RequestMethod.POST)
  public String store(@AuthenticationPrincipal AppUserDetails userDetail,
      @ModelAttribute @Validated AccountForm form, BindingResult result, Model model) {

    // 入力チェックエラー有無判定
    if (result.hasErrors()) {
      // エラーありの場合はシステムエラー（パラメータ改ざん）
      return "redirect:/errors";
    }

    // フォームの値をエンティティにコピー
    Account account = new Account();
    BeanUtils.copyProperties(form, account);

    // エンコードしたパスワードをセット
    account.setPassword(passwordEncoder.encode(form.getPassword()));

    // 共通項目をセット
    Date now = StudyUtil.getNowDate();
    account.setInsDate(now);
    account.setInsUser(userDetail.getAccount().getUserId());
    account.setUpdDate(now);
    account.setUpdUser(userDetail.getAccount().getUserId());

    try {
      // DBへデータを保存
      accountService.saveOne(account);
    } catch (DuplicateKeyException dke) {
      result.addError(new FieldError(result.getObjectName(), "userId", "入力したアカウントは既に登録されています。"));
      return input(form, model);
    }

    return "account/complete";
  }
}
