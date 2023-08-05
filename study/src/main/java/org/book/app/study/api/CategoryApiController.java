package org.book.app.study.api;

import java.io.File;
import java.util.List;
import java.util.Objects;
import org.apache.commons.io.FilenameUtils;
import org.book.app.study.dto.list.CategoryFormList;
import org.book.app.study.dto.ui.category.CategoryUi;
import org.book.app.study.entity.Category;
import org.book.app.study.form.CategoryForm;
import org.book.app.study.form.ImageForm;
import org.book.app.study.helper.CategoryHelper;
import org.book.app.study.helper.UploadHelper;
import org.book.app.study.service.CategoryService;
import org.book.app.study.service.api.CategoryApiService;
import org.book.app.study.util.StudyBeanUtil;
import org.book.app.study.util.StudyUtil;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;
import jakarta.servlet.http.HttpServletRequest;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.XSlf4j;

/**
 * カテゴリー画面API
 *
 */
@Controller
@AllArgsConstructor
@XSlf4j
public class CategoryApiController extends ApiController {

  /**
   * カテゴリー画面apiサービス
   */
  private final CategoryApiService categoryApiService;

  /**
   * カテゴリー用 Helper
   */
  private final CategoryHelper categoryHelper;

  /**
   * ファイル保存用 Helper
   */
  private final UploadHelper uploadHelper;

  /**
   * カテゴリー情報 Service
   */
  private final CategoryService categoryService;

  /**
   * 画面情報取得
   * 
   * @return json(カテゴリーごとの家計簿情報)
   */
  @RequestMapping(value = "/category/info", method = RequestMethod.GET)
  @ResponseBody
  public CategoryUi getInfo() {
    return categoryApiService.getInfo();
  }

  /**
   * 確認画面情報取得
   * 
   * @param form 送信されたデータ
   * @param model モデル
   * @param date 開いている画面の指定されている日付け
   * @return json(空データ)
   * @throws null
   */
  @RequestMapping(value = "/category/confirm", method = RequestMethod.POST)
  @ResponseBody
  public String confirm(@ModelAttribute @Validated CategoryForm form,
      BindingResult result, ModelAndView model, HttpServletRequest request) throws BindException {
    categoryHelper.validateIfDoInsert(form, result);
    throwBindExceptionIfHasErrors(result);
    log.info("checkInputのformの中身", form);

    return null;
  }

  /**
   * カテゴリー登録
   * 
   * @param form 送信されたデータ
   * @param result エラーチェック]-+結果
   * @param model モデル
   * @return null
   */
  @RequestMapping(value = "/category/result", method = RequestMethod.POST)
  @ResponseBody
  public String result(@ModelAttribute @Validated CategoryForm form,
      BindingResult result, ModelAndView model) throws BindException {
    categoryHelper.validateIfDoInsert(form, result);
    throwBindExceptionIfHasErrors(result);
    // アップロードしたICON
    MultipartFile catIcon = form.getCatIcon();

    // 画像をアップロードしたとき
    if (!Objects.equals(catIcon, null)) {
      // アップロードされたICONの拡張子
      String imgExt = FilenameUtils.getExtension(catIcon.getOriginalFilename());
      // アップロードファイルを一時保存するためのHelperメソッドを呼び出す
      // 一時保存したファイルがHelperメソッドの返り値として返却される
      File uploadTemporaryFile = uploadHelper.saveTemporaryFile(catIcon);
      String uploadTemporaryFileId = uploadTemporaryFile.getName();
      // アップロードしたファイルのメタ情報（ファイルを識別するためのID、拡張子など）をフォームオブジェクトに格納する
      // アップロードファイルのファイルの拡張子と一時保存したファイルを識別するためのIDをフォームオブジェクトに格納
      form.setImgId(uploadTemporaryFileId);
      form.setImgExt(imgExt);
    } else {
      form.setImgId(StudyUtil.getNoImageCode());
    }

    Category cat = new Category();
    // フォームの値をエンティティにコピーし、共通項目をセット
    StudyBeanUtil.copyAndSetStudyEntityProperties(form, cat);

    // dbのカテゴリーテーブルに登録
    categoryService.saveOne(cat);

    // 画像をアップロードしたとき
    if (!Objects.equals(catIcon, null)) {
      // アイコン画像を本保存
      uploadHelper.saveIconFile(form);
    }

    return null;

  }

  /**
   * リスト画面情報取得
   * 
   * @return json(カテゴリーの一覧)
   */
  @RequestMapping(value = "/category/listdata", method = RequestMethod.GET)
  @ResponseBody
  public CategoryFormList getListData() {
    return categoryHelper.getCategoryFormList();
  }

  /**
   * 画像情報一覧取得
   * 
   * @return json(画像情報一覧)
   */
  @RequestMapping(value = "/category/imageList", method = RequestMethod.GET)
  @ResponseBody
  public List<ImageForm> getImageList() {
    return categoryHelper.getCategoryImageList();
  }

  /**
   * カテゴリー情報一覧更新
   * 
   * @param catListParam 送信されたデータ
   * @param result エラーチェック]-+結果
   * @param model モデル
   * @return json(カテゴリーの一覧)
   */
  @RequestMapping(value = "/category/listdataUpdate", method = RequestMethod.POST)
  @ResponseBody
  public CategoryFormList listUpdate(
      @ModelAttribute @Validated CategoryFormList catListParam,
      BindingResult result, ModelAndView model) throws BindException {
    categoryHelper.validateIfDoUpdate(catListParam, result);
    throwBindExceptionIfHasErrors(result);

    // カテゴリー情報の更新
    categoryHelper.updatCeategorys(catListParam);

    return getListData();
  }

}
