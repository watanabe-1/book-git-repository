package org.watanabe.app.study.controller;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.ModelAndView;
import org.terasoluna.gfw.common.exception.BusinessException;
import org.terasoluna.gfw.common.message.ResultMessages;
import org.watanabe.app.common.logger.LogIdBasedLogger;
import org.watanabe.app.study.entity.Category;
import org.watanabe.app.study.form.CategoryForm;
import org.watanabe.app.study.form.ImageForm;
import org.watanabe.app.study.helper.UploadHelper;
import org.watanabe.app.study.service.CategoryService;
import org.watanabe.app.study.service.ImageService;
import org.watanabe.app.study.util.StudyUtil;

@Controller
public class CategoryController {

  private static final LogIdBasedLogger logger = LogIdBasedLogger.getLogger(TopController.class);

  private final String ISJAERR = "エラー";
  private final String ISEAERR = "ERR";

  /**
   * icon保管ディレクトリパス
   */
  @Value("${app.upload.iconDirectoryPath}")
  private String uploadIconDirPath;

  /**
   * カテゴリー情報 Service
   */
  @Autowired
  private CategoryService categoryService;

  /**
   * 画像情報 Service
   */
  @Autowired
  private ImageService imageService;

  /**
   * ファイル保存用 Helper
   */
  @Autowired
  UploadHelper uploadHelper;

  @RequestMapping(value = "/category/input", method = RequestMethod.GET)
  public ModelAndView input(@ModelAttribute CategoryForm form, ModelAndView model) {

    model.setViewName("category/input");
    // 画面にセット
    model = setInputConfirm(model);

    /*
     * ResultMessages messages = ResultMessages.error(); messages.add("e.ad.od.5001", "s"); throw
     * new BusinessException(messages);
     */

    model.addObject("selectedCategory", "key_B");
    return model;
  }

  @RequestMapping(value = "/category/confirm", method = RequestMethod.POST)
  public ModelAndView confirm(@ModelAttribute @Validated CategoryForm form, BindingResult result,
      ModelAndView model
  // , MultipartFile catIcon
  ) throws IOException {

    // エラーがあったら画面を返す
    if (result.hasErrors()) {
      return input(form, model);
    }

    model.setViewName("category/confirm");
    // 画面にセット
    model = setInputConfirm(model);

    // アップロードしたICON
    MultipartFile catIcon = form.getCatIcon();

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

    return model;
  }

  @RequestMapping(value = "/category/result", method = RequestMethod.POST)
  public ModelAndView result(@ModelAttribute CategoryForm form, BindingResult result,
      ModelAndView model
  // , MultipartFile catIcon
  ) throws IOException {

    model.setViewName("/category/result");

    // エラー画面遷移確認用
    if (Objects.equals(form.getCatName(), ISJAERR)
        || Objects.equals(form.getCatName().toUpperCase(), ISEAERR)) {
      ResultMessages messages = ResultMessages.error();
      messages.add("e.ab.cd.3001", "エラーです");
      throw new BusinessException(messages);
    }

    try {
      // dbのカテゴリーテーブルに登録
      categoryService.save(form);
    } catch (DuplicateKeyException dke) {
      result.addError(new FieldError(result.getObjectName(), "catCode", "入力したカテゴリーは既に登録されています。"));
      logger.error("Exception happend!", dke);
      return input(form, model);
    }

    String uploadIconDir = StudyUtil.replaceFirstOneLeft(uploadIconDirPath, "/", "");
    // 画像テーブル登録元情報をセット
    ImageForm imgForm = new ImageForm();
    String imgId = form.getImgId();
    StringBuffer sb = new StringBuffer();
    String newImgName = sb.append(form.getCatCode()).append("_").append(uploadIconDir).append(".")
        .append(form.getImgExt()).toString();
    String ingType = form.getImgType();
    // 仮保存していたアイコンを本保存
    String newImgFilePath =
        uploadHelper.moveTemporaryFileToImagesFolder(newImgName, imgId, uploadIconDir);
    imgForm.setImgId(imgId);
    imgForm.setImgName(newImgName);
    imgForm.setImgPath(newImgFilePath);
    imgForm.setImgType(ingType);

    try {
      // dbのimagesテーブルに登録
      imageService.save(imgForm);
    } catch (DuplicateKeyException dke) {
      result.addError(new FieldError(result.getObjectName(), "imgId", "採番された画像IDは既に登録されています。"));
      return input(form, model);
    }

    return model;

  }

  @RequestMapping(value = "/category/list", method = RequestMethod.GET)
  public ModelAndView list(@ModelAttribute CategoryForm form, ModelAndView model) {

    model.setViewName("category/list");

    List<Category> catlist = categoryService.findAlljoinImage();
    model.addObject("catlist", catlist);

    return model;
  }


  // test
  // @PostMapping("/category/upload")
  @RequestMapping(value = "/category/upload", method = RequestMethod.POST)
  public String upload(CategoryForm uploadForm, Model model,
      @RequestParam("upload_file") MultipartFile multipartFile) {
    // model.addAttribute("originalFilename", uploadForm.getMultipartFile()
    // .getOriginalFilename());

    return "sample/result";
  }

  // test
  @RequestMapping(value = "/category/test", method = RequestMethod.GET)
  public ModelAndView test(@ModelAttribute CategoryForm form, ModelAndView model) {

    model.setViewName("category/test");
    // 画面にセット
    model = setInputConfirm(model);

    // model.addObject("selectedCategory","key_B");
    return model;
  }

  // パラメーターのセット
  private ModelAndView setInputConfirm(ModelAndView model) {
    // select box
    model.addObject("imgTypes", getImgTypes());

    // radio botan
    model.addObject("catTypes", getCatTypes());

    // check box
    model.addObject("actives", getActives());

    return model;
  }

  private Map<String, String> getImgTypes() {
    Map<String, String> selectMap = new LinkedHashMap<String, String>();
    selectMap.put("CATEGORY_ICON", "カテゴリーアイコン");
    return selectMap;
  }

  private Map<String, String> getCatTypes() {
    Map<String, String> selectMap = new LinkedHashMap<String, String>();
    selectMap.put("1", "TEST1");
    selectMap.put("2", "TEST2");
    return selectMap;
  }

  private Map<String, String> getActives() {
    Map<String, String> selectMap = new LinkedHashMap<String, String>();
    selectMap.put("1", "有効");
    return selectMap;
  }

  /*
   * //パラメーターのセット private ModelAndView setSelectRadioChecks(ModelAndView model) { //select box
   * model.addObject("selectCategorys",getSelectedCategorys());
   * 
   * //radio botan model.addObject("selectCategoryRadios",getSelectedCategoryRadios());
   * 
   * //check box model.addObject("selectCategoryCheckBoxs",getSelectedCategoryCheckBoxs());
   * 
   * return model; } private Map<String,String> getSelectedCategorys(){ Map<String, String>
   * selectMap = new LinkedHashMap<String, String>(); selectMap.put("key_A", "選択肢Ａは、これですよ");
   * selectMap.put("key_B", "選択肢Ｂは、これですよ"); selectMap.put("key_C", "選択肢Ｃは、これですよ");
   * selectMap.put("key_D", "選択肢Ｄは、これですよ"); selectMap.put("key_E", "選択肢Ｅは、これですよ"); return selectMap;
   * }
   * 
   * private Map<String,String> getSelectedCategoryRadios(){ Map<String, String> selectMap = new
   * LinkedHashMap<String, String>(); selectMap.put("required", "必須"); selectMap.put("notRequired",
   * "必須ではない"); return selectMap; }
   * 
   * private Map<String,String> getSelectedCategoryCheckBoxs(){ Map<String, String> selectMap = new
   * LinkedHashMap<String, String>(); selectMap.put("blue", "青"); selectMap.put("red", "赤");
   * selectMap.put("yellow", "黄色"); return selectMap; }
   */
}
