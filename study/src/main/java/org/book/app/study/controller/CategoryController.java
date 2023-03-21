package org.book.app.study.controller;

import java.util.List;
import java.util.Objects;
import javax.servlet.http.HttpServletRequest;
import org.apache.commons.io.FilenameUtils;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;
import org.book.app.study.api.js.CategoryApi;
import org.book.app.study.dto.list.CategoryFormList;
import org.book.app.study.entity.Category;
import org.book.app.study.entity.Image;
import org.book.app.study.enums.flag.ActiveFlag;
import org.book.app.study.enums.flag.DeleteFlag;
import org.book.app.study.enums.type.CategoryType;
import org.book.app.study.enums.type.ImageType;
import org.book.app.study.form.CategoryForm;
import org.book.app.study.helper.CategoryHelper;
import org.book.app.study.helper.UploadHelper;
import org.book.app.study.service.CategoryService;
import org.book.app.study.service.ImageService;
import org.book.app.study.util.StudyBeanUtil;
import org.book.app.study.util.StudyJsUtil;
import org.book.app.study.util.StudyStringUtil;
import org.book.app.study.util.StudyUtil;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.XSlf4j;

/**
 * カテゴリーコントローラー
 * 
 */
@Controller
@XSlf4j
@AllArgsConstructor
public class CategoryController {

  /**
   * カテゴリー情報 Service
   */
  private final CategoryService categoryService;

  /**
   * 画像情報 Service
   */
  private final ImageService imageService;

  /**
   * ファイル保存用 Helper
   */
  private final UploadHelper uploadHelper;

  /**
   * カテゴリー用 Helper
   */
  private final CategoryHelper categoryHelper;

  /**
   * カテゴリーjs用api
   */
  private final CategoryApi categoryApi;

  /**
   * カテゴリー登録画面
   * 
   * @param form  送信されたデータ
   * @param model モデル
   * @return 入力画面HTML名
   */
  @RequestMapping(value = "/category/input", method = RequestMethod.GET)
  public ModelAndView input(HttpServletRequest request, @ModelAttribute CategoryForm form,
      ModelAndView model) {
    StudyJsUtil.setJsTemplate(model, "カテゴリー情報登録", request,
        "/static/js/pages/category/input/input.bundle.js", categoryApi, form);

    // 画面にセット
    addCommonAttribute(model);

    return model;
  }

  /**
   * カテゴリー登録画面
   * 
   * @param form  送信されたデータ
   * @param model モデル
   * @return 入力画面HTML名
   */
  @RequestMapping(value = "/category/list", method = RequestMethod.GET)
  public ModelAndView list(HttpServletRequest request, @ModelAttribute CategoryForm form,
      ModelAndView model) {
    StudyJsUtil.setJsTemplate(model, "登録済みカテゴリー情報一覧", request,
        "/static/js/pages/category/list/list.bundle.js", categoryApi, form);

    // 画面にセット
    addCommonAttribute(model);

    return model;
  }

  /**
   * カテゴリー登録画面
   * 
   * @param form  送信されたデータ
   * @param model モデル
   * @return 入力画面HTML名
   */
  @RequestMapping(value = "/category/input2", method = RequestMethod.GET)
  public ModelAndView inputs(HttpServletRequest request, @ModelAttribute CategoryForm form,
      ModelAndView model) {
    model.setViewName("/category/input");

    // 画面にセット
    addCommonAttribute(model);

    return model;
  }

  /**
   * カテゴリー登録確認画面
   * 
   * @param form   送信されたデータ
   * @param result エラーチェック結果
   * @param model  モデル
   * @return 入力画面HTML名
   */
  @RequestMapping(value = "/category/confirm2", method = RequestMethod.POST)
  public ModelAndView confirm(HttpServletRequest request,
      @ModelAttribute @Validated CategoryForm form, BindingResult result,
      ModelAndView model) {
    model.setViewName("/category/confirm");
    // エラーがあったら画面を返す
    if (result.hasErrors()) {
      return input(request, form, model);
    }

    // 画面にセット
    addCommonAttribute(model);

    // アップロードしたICON
    MultipartFile catIcon = form.getCatIcon();

    // 画像をアップロードしたとき
    if (!catIcon.isEmpty()) {
      // アップロードされたICONの拡張子
      String imgExt = FilenameUtils.getExtension(catIcon.getOriginalFilename());

      // アップロードファイルを一時保存するためのHelperメソッドを呼び出す
      // 一時保存したファイルの識別するためのIDがHelperメソッドの返り値として返却される
      String uploadTemporaryFileId = uploadHelper.saveTemporaryFile(catIcon);

      // アップロードしたファイルのメタ情報（ファイルを識別するためのID、拡張子など）をフォームオブジェクトに格納する
      // アップロードファイルのファイルの拡張子と一時保存したファイルを識別するためのIDをフォームオブジェクトに格納
      form.setImgId(uploadTemporaryFileId);
      form.setImgExt(imgExt);

      // アップロードされたファイルをbase64にエンコードした後にstring型に変換し、画面にセット
      model.addObject("uploadIcon", uploadHelper.encodeBase64(catIcon, imgExt));
    } else {
      String noImgCd = StudyUtil.getNoImageCode();
      Image img = imageService.findOne(noImgCd);
      form.setImgId(noImgCd);
      form.setImgIds(img);
    }
    return model;
  }

  /**
   * カテゴリー登録結果画面
   * 
   * @param form   送信されたデータ
   * @param result エラーチェック]-+結果
   * @param model  モデル
   * @return 入力画面HTML名
   */
  @RequestMapping(value = "/category/result2", method = RequestMethod.POST)
  public ModelAndView result(HttpServletRequest request, @ModelAttribute CategoryForm form,
      BindingResult result,
      ModelAndView model) {
    model.setViewName("/category/result");
    Category cat = new Category();
    // フォームの値をエンティティにコピーし、共通項目をセット
    StudyBeanUtil.copyAndSetStudyEntityProperties(form, cat);

    try {
      // dbのカテゴリーテーブルに登録
      categoryService.saveOne(cat);
    } catch (DuplicateKeyException dke) {
      result.addError(
          new FieldError(result.getObjectName(), "catCode", "入力したカテゴリーは既に登録されています。"));
      log.error("Exception happend!", dke);
      return input(request, form, model);
    }

    String imgId = form.getImgId();
    // 画像をアップロードしたとき
    if (!Objects.equals(imgId, StudyUtil.getNoImageCode())) {
      // アイコン画像を本保存
      uploadHelper.saveIconFile(form);
    }

    return model;

  }

  /**
   * カテゴリー一覧画面
   * 
   * @param model モデル
   * @return 入力画面HTML名
   */
  @RequestMapping(value = "/category/index", method = RequestMethod.GET)
  public ModelAndView displayList(ModelAndView model) {
    model.setViewName("category/index");
    // 画面にセット
    addCommonAttribute(model);
    model.addObject("catListParam", categoryService.findAlljoinImage());
    model.addObject("imgList", StudyStringUtil.objectToJsonStr(imageService.findAll()));

    return model;
  }

  /**
   * カテゴリー情報一覧更新
   * 
   * @param catListParam 画面送信情報
   * @return リダイレクト先
   */
  @RequestMapping(value = "/category/listUpdate", method = RequestMethod.POST)
  public ModelAndView listUpdate(@Validated @ModelAttribute CategoryFormList catListParam,
      BindingResult result, ModelAndView model) {
    model.setViewName("redirect:/category/index");
    if (result.hasErrors()) {
      List<String> errorList = result.getAllErrors().stream()
          .map(error -> error.getDefaultMessage()).distinct().toList();
      model.addObject("validationError", errorList);

      return displayList(model);
    }

    // カテゴリー情報の更新
    categoryHelper.updatCeategorys(catListParam);

    return model;
  }

  /**
   * パラメーターのセット
   * 
   * @param model Model
   * @return model
   */
  private void addCommonAttribute(ModelAndView model) {
    // select box
    model.addObject("imgTypes", ImageType.values());

    // radio botan
    model.addObject("catTypes", CategoryType.values());

    // check box
    model.addObject("actives", ActiveFlag.ACTIVE);

    // 削除確認
    model.addObject("isDeleteList", DeleteFlag.DELETE);
  }

}