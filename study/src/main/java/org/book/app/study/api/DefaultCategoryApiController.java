package org.book.app.study.api;

import org.book.app.study.dto.list.DefaultCategoryFormList;
import org.book.app.study.dto.ui.defaultCategory.DefaultCategoryUi;
import org.book.app.study.entity.DefaultCategory;
import org.book.app.study.helper.DefaultCategoryHelper;
import org.book.app.study.service.DefaultCategoryService;
import org.book.app.study.service.api.DefaultCategoryApiService;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;

import lombok.AllArgsConstructor;

/**
 * デフォルトカテゴリー画面API
 *
 */
@RestController
@AllArgsConstructor
public class DefaultCategoryApiController extends ApiController {

  /**
   * デフォルトカテゴリー画面apiサービス
   */
  private final DefaultCategoryApiService defaultCategoryApiService;

  /**
   * デフォルトカテゴリーヘルパー
   */
  private final DefaultCategoryHelper defaultCategoryHelper;

  /**
   * デフォルトカテゴリー Service
   */
  private final DefaultCategoryService defaultCategoryService;

  /**
   * 画面情報取得
   * 
   * @return json(カテゴリーごとの家計簿情報)
   */
  @GetMapping(value = "/defaultCategory/info")
  public DefaultCategoryUi getInfo() {
    return defaultCategoryApiService.getInfo();
  }

  /**
   * リスト画面情報取得
   * 
   * @return json(カテゴリーの一覧)
   */
  @GetMapping(value = "/defaultCategory/listData")
  public DefaultCategoryFormList getListData() {
    return defaultCategoryHelper.getDefaultCategoryFormList();
  }

  /**
   * 家計簿データからデフォルトカテゴリーを登録
   * 
   * @return json(カテゴリーの一覧)
   */
  @PostMapping(value = "/defaultCategory/inputAll")
  public DefaultCategoryFormList inputAll() {
    // 家計簿データからデフォルトカテゴリーを登録
    defaultCategoryHelper.insertAllFromBooks();

    return getListData();
  }

  /**
   * デフォルトカテゴリー情報一覧更新
   * 
   * @param catListParam 送信されたデータ
   * @param result エラーチェック]-+結果
   * @param model モデル
   * @return json(カテゴリーの一覧)
   */
  @PostMapping(value = "/defaultCategory/listDataUpdate")
  public DefaultCategoryFormList listUpdate(
      @ModelAttribute @Validated DefaultCategoryFormList defCatListParam,
      BindingResult result, ModelAndView model) {
    // デフォルトカテゴリー情報の更新
    defaultCategoryHelper.updatDefaultCeategorys(defCatListParam);

    return getListData();
  }

  /**
   * デフォルトカテゴリー新規デフォルトデータ作成
   * 
   * @param catListParam 送信されたデータ
   * @param result エラーチェック]-+結果
   * @param model モデル
   * @return json(カテゴリーの一覧)
   */
  @PostMapping(value = "/defaultCategory/listDataPush")
  public DefaultCategoryFormList listDataPush(
      @ModelAttribute @Validated DefaultCategoryFormList defCatListParam,
      BindingResult result, ModelAndView model) {
    // デフォルトカテゴリー情報の初期データ登録
    DefaultCategory defCat = defaultCategoryHelper.getDefault();
    defaultCategoryService.saveOne(defCat);

    return getListData();
  }

}
