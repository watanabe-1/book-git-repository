package org.watanabe.app.study.controller;

import java.io.IOException;
import java.util.ArrayList;
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
import org.springframework.validation.ObjectError;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.multipart.MultipartFile;
import org.terasoluna.gfw.common.exception.BusinessException;
import org.terasoluna.gfw.common.message.ResultMessages;
import org.watanabe.app.common.logger.LogIdBasedLogger;
import org.watanabe.app.study.dto.CategoryList;
import org.watanabe.app.study.entity.Image;
import org.watanabe.app.study.form.CategoryForm;
import org.watanabe.app.study.helper.UploadHelper;
import org.watanabe.app.study.service.CategoryService;
import org.watanabe.app.study.service.ImageService;
import org.watanabe.app.study.util.StudyUtil;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;

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
  public String input(@ModelAttribute CategoryForm form, Model model) {
    // 画面にセット
    model = setInputConfirm(model);

    //
    // ResultMessages messages = ResultMessages.error(); messages.add("e.ad.od.5001", "s"); throw
    // new BusinessException(messages);

    model.addAttribute("selectedCategory", "key_B");

    return "category/input";
  }

  @RequestMapping(value = "/category/confirm", method = RequestMethod.POST)
  public String confirm(@ModelAttribute @Validated CategoryForm form, BindingResult result,
      Model model
  // , MultipartFile catIcon
  ) throws IOException {
    // エラーがあったら画面を返す
    if (result.hasErrors()) {
      return input(form, model);
    }

    // 画面にセット
    model = setInputConfirm(model);

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
      model.addAttribute("uploadIcon", uploadHelper.encodeBase64(catIcon, imgExt));
    } else {
      String noImgCd = StudyUtil.getNoImageCode();
      Image img = imageService.findOne(noImgCd);
      form.setImgId(noImgCd);
      form.setImgIds(img);
    }
    return "category/confirm";
  }

  @RequestMapping(value = "/category/result", method = RequestMethod.POST)
  public String result(@ModelAttribute CategoryForm form, BindingResult result, Model model
  // , MultipartFile catIcon
  ) {

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

    String imgId = form.getImgId();
    // 画像をアップロードしたとき
    if (!imgId.equals(StudyUtil.getNoImageCode())) {
      // アイコン画像を本保存
      uploadHelper.saveIconFile(form);
    }

    return "/category/result";

  }

  @RequestMapping(value = "/category/list", method = RequestMethod.GET)
  public String displayList(Model model) {
    ObjectMapper mapper = new ObjectMapper();

    String imgListJson = null;
    try {
      imgListJson = mapper.writeValueAsString(imageService.findAll());
    } catch (JsonProcessingException e) {
      throw new BusinessException(ResultMessages.error().add("1.01.01.1001"));
    }

    // 画面にセット
    model = setInputConfirm(model);
    model.addAttribute("catListParam", categoryService.findAlljoinImage());
    model.addAttribute("imgList", imgListJson);

    return "category/list";
  }


  /**
   * ユーザー情報一覧更新
   * 
   * @param userRequest リクエストデータ
   * @param model Model
   * @return ユーザー情報詳細画面
   */
  @RequestMapping(value = "/category/listUpdate", method = RequestMethod.POST)
  public String listUpdate(@Validated @ModelAttribute CategoryList catListParam,
      BindingResult result, Model model) {
    if (result.hasErrors()) {
      List<String> errorList = new ArrayList<String>();
      for (ObjectError error : result.getAllErrors()) {
        if (!errorList.contains(error.getDefaultMessage())) {
          errorList.add(error.getDefaultMessage());
        }
      }
      model.addAttribute("validationError", errorList);
      return displayList(model);
    }

    // カテゴリー情報の更新
    // 全件数送信されるため、変更してなくても更新される。とりあえず仮で実装
    for (CategoryForm catForm : catListParam.getCatDataList()) {
      if (catForm.getIsDelete()) {
        categoryService.delete(catForm);
      } else {
        // アップロードしたICON
        MultipartFile catIcon = catForm.getCatIcon();

        // 画像をアップロードしたとき
        if (!catIcon.isEmpty()) {
          // アップロードファイルを一時保存するためのHelperメソッドを呼び出す
          // 一時保存したファイルの識別するためのIDがHelperメソッドの返り値として返却される
          String imgId = uploadHelper.saveTemporaryFile(catIcon);
          catForm.setImgId(imgId);
          catForm.setImgExt(FilenameUtils.getExtension(catIcon.getOriginalFilename()));

          // アイコン画像を本保存
          uploadHelper.saveIconFile(catForm);

          // カテゴリーupdate用にセット
          catForm.setImgId(imgId);
        }

        categoryService.update(catForm);
      }
    }

    return "redirect:/category/list";
  }


  // test
  // @PostMapping("/category/upload")
  // @RequestMapping(value = "/category/upload", method = RequestMethod.POST)
  // public String upload(CategoryForm uploadForm, Model model,
  // @RequestParam("upload_file") MultipartFile multipartFile) {
  // // model.addAttribute("originalFilename", uploadForm.getMultipartFile()
  // // .getOriginalFilename());
  //
  // return "sample/result";
  // }

  // test
  // @RequestMapping(value = "/category/test", method = RequestMethod.GET)
  // public ModelAndView test(@ModelAttribute CategoryForm form, ModelAndView model) {
  // model.setViewName("category/test");
  // // 画面にセット
  // model = setInputConfirm(model);
  //
  // // model.addObject("selectedCategory","key_B");
  // return model;
  // }

  // パラメーターのセット
  // private ModelAndView setInputConfirm(ModelAndView model) {
  // // select box
  // model.addObject("imgTypes", getImgTypes());
  //
  // // radio botan
  // model.addObject("catTypes", getCatTypes());
  //
  // // check box
  // model.addObject("actives", getActives());
  //
  // return model;
  // }

  // パラメーターのセット
  private Model setInputConfirm(Model model) {
    // select box
    model.addAttribute("imgTypes", getImgTypes());

    // radio botan
    model.addAttribute("catTypes", getCatTypes());

    // check box
    model.addAttribute("actives", getActives());

    // 削除確認
    model.addAttribute("isDeleteList", getIsDeleteList());

    return model;
  }

  private Map<Boolean, String> getIsDeleteList() {
    Map<Boolean, String> map = new LinkedHashMap<Boolean, String>();
    map.put(true, "削除する");

    return map;
  }

  private Map<String, String> getImgTypes() {
    Map<String, String> map = new LinkedHashMap<String, String>();
    map.put("CATEGORY_ICON", "カテゴリーアイコン");

    return map;
  }

  private Map<String, String> getCatTypes() {
    Map<String, String> map = new LinkedHashMap<String, String>();
    map.put("1", "TEST1");
    map.put("2", "TEST2");

    return map;
  }

  private Map<String, String> getActives() {
    Map<String, String> map = new LinkedHashMap<String, String>();
    map.put("1", "有効");

    return map;
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
