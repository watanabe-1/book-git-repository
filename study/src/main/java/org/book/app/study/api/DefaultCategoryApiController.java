package org.book.app.study.api;

import org.book.app.study.dto.list.DefaultCategoryFormList;
import org.book.app.study.dto.ui.defaultCategory.DefaultCategoryUi;
import org.book.app.study.entity.DefaultCategory;
import org.book.app.study.helper.DefaultCategoryHelper;
import org.book.app.study.service.DefaultCategoryService;
import org.book.app.study.service.api.DefaultCategoryApiService;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import lombok.AllArgsConstructor;

/**
 * デフォルトカテゴリー画面API
 *
 */
@Controller
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
  @RequestMapping(value = "/defaultCategory/info", method = RequestMethod.GET)
  @ResponseBody
  public DefaultCategoryUi getInfo() {
    return defaultCategoryApiService.getInfo();
  }

  /**
   * リスト画面情報取得
   * 
   * @return json(カテゴリーの一覧)
   */
  @RequestMapping(value = "/defaultCategory/listdata", method = RequestMethod.GET)
  @ResponseBody
  public DefaultCategoryFormList getListData() {
    return defaultCategoryHelper.getDefaultCategoryFormList();
  }

  /**
   * 家計簿データからデフォルトカテゴリーを登録
   * 
   * @return json(カテゴリーの一覧)
   */
  @RequestMapping(value = "/defaultCategory/inputAll", method = RequestMethod.POST)
  @ResponseBody
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
  @RequestMapping(value = "/defaultCategory/listdataUpdate", method = RequestMethod.POST)
  @ResponseBody
  public DefaultCategoryFormList listUpdate(
      @ModelAttribute @Validated DefaultCategoryFormList defCatListParam,
      BindingResult result, ModelAndView model) throws BindException {
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
  @RequestMapping(value = "/defaultCategory/listdataPush", method = RequestMethod.POST)
  @ResponseBody
  public DefaultCategoryFormList listDataPush(
      @ModelAttribute @Validated DefaultCategoryFormList defCatListParam,
      BindingResult result, ModelAndView model) throws BindException {
    // デフォルトカテゴリー情報の初期データ登録
    DefaultCategory defCat = defaultCategoryHelper.getDefault(defCatListParam);
    defaultCategoryService.saveOne(defCat);

    return getListData();
  }

}
