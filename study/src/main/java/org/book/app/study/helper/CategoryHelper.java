package org.book.app.study.helper;

import java.io.File;
import java.util.List;
import java.util.Objects;
import java.util.UUID;

import org.apache.commons.io.FilenameUtils;
import org.book.app.study.dto.data.TypeData;
import org.book.app.study.dto.list.CategoryFormList;
import org.book.app.study.entity.Category;
import org.book.app.study.entity.Image;
import org.book.app.study.enums.flag.ActiveFlag;
import org.book.app.study.enums.flag.DeleteFlag;
import org.book.app.study.form.CategoryForm;
import org.book.app.study.form.ImageForm;
import org.book.app.study.service.CategoryService;
import org.book.app.study.service.ImageService;
import org.book.app.study.util.StudyBeanUtil;
import org.book.app.study.util.StudyMessageUtil;
import org.book.app.study.util.StudyStringUtil;
import org.book.app.study.util.StudyUtil;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;
import org.springframework.validation.BindingResult;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

/**
 * カテゴリーの関する処理を行うためのHelperクラスを作成
 */
@Component
@RequiredArgsConstructor
public class CategoryHelper {

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
   * 画像 Helper
   */
  private final ImageHelper imageHelper;

  /**
   * 複数のカテゴリーをアップデート
   * 
   * @return 更新件数
   */
  public int updatCeategorys(CategoryFormList catListParam) {
    List<CategoryForm> catList = catListParam.getCatDataList();
    if (catList == null) {
      return 0;
    }

    // カテゴリー情報の更新
    int updCnt = 0;
    for (CategoryForm catForm : catList) {
      if (DeleteFlag.isDelete(catForm.getDelete())) {
        updCnt += categoryService.deleteOne(catForm.getCatCode());
      } else {
        // アップロードしたICON
        MultipartFile catIcon = catForm.getCatIcon();

        // 画像をアップロードしたとき
        if (!Objects.isNull(catIcon) && !catIcon.isEmpty()) {
          // アップロードファイルを一時保存するためのHelperメソッドを呼び出す
          // 一時保存したファイルがHelperメソッドの返り値として返却される
          File uploadTemporaryFile = uploadHelper.saveTemporaryFile(catIcon);
          String imgId = uploadTemporaryFile.getName();

          catForm.setImgId(imgId);
          catForm.setImgExt(FilenameUtils.getExtension(catIcon.getOriginalFilename()));

          // アイコン画像を本保存
          uploadHelper.saveIconFile(catForm);

          // カテゴリーupdate用にセット
          catForm.setImgId(imgId);
        }

        // カテゴリーが登録されていなかったら仮でいったん登録
        Category cat = new Category();
        // フォームの値をエンティティにコピーし、共通項目をセット
        StudyBeanUtil.copyAndSetStudyEntityProperties(catForm, cat);
        // imgaeIdをセット
        if (StudyStringUtil.isNullOrEmpty(cat.getImgId())) {
          cat.setImgId(catForm.getImgIds().getImgId());
        }
        // 空文字などが入っているときは0を設定
        if (!ActiveFlag.isActive(cat.getActive())) {
          cat.setActive(ActiveFlag.NON_ACTIVE.getValue());
        }

        updCnt += categoryService.updateOne(cat, catForm.getCatCode());
      }
    }

    return updCnt;
  }

  /**
   * カテゴリーテーブルにカテゴリーネームが登録されているか確認し、カテゴリーコードを取得
   * 
   * @param catName カテゴリーネーム
   * @return String カテゴリコード
   */
  public String getCatCode(List<Category> catList, String catName) {
    // 突きつけ合わせ
    for (Category cat : catList) {
      if (Objects.equals(catName, cat.getCatName())) {
        return cat.getCatCode();
      }
    }
    // カテゴリーが登録されていなかったら仮でいったん登録
    Category cat = new Category();
    String catCode = UUID.randomUUID().toString();
    cat.setCatCode(catCode);
    cat.setCatName(catName);
    // 仮で保存し後から変更
    cat.setImgId(StudyUtil.getNoImageCode());
    cat.setImgType("");
    cat.setCatType("");
    cat.setActive("1");

    // 共通項目をセット
    StudyBeanUtil.setStudyEntityProperties(cat);

    // リストに追加
    catList.add(cat);
    // dbに登録
    categoryService.saveOne(cat);

    return catCode;
  }

  /**
   * カテゴリータイプデータの取得
   * 
   * @return カテゴリータイプデータ
   */
  public List<TypeData> getCategoryTypeDataList() {
    return categoryService.findAll().stream()
        .map(cat -> new TypeData(cat.getCatCode(), cat.getCatName()))
        .toList();
  }

  /**
   * デフォルトカテゴリーフォームリストデータの取得
   * 
   * @return デフォルトカテゴリーフォームリストデータ
   */
  public CategoryFormList getCategoryFormList() {
    CategoryFormList catFromList = new CategoryFormList();
    catFromList.setCatDataList(
        categoryListToCategoryFormList(categoryService.findAlljoinImage()));

    return catFromList;
  }

  /**
   * カテゴリーイメージリストデータの取得
   * 
   * @return カテゴリーイメージリストデータ
   */
  public List<ImageForm> getCategoryImageList() {
    return imageHelper.imageListToImageFormList(imageService.findAll());
  }

  /**
   * CategiryFormListからTypeDataListに変換
   * 
   * @param target 変換対象
   * @return カテゴリータイプデータ
   */
  public List<TypeData> categoryFormListToTypeDataList(List<CategoryForm> target) {
    return target.stream()
        .map(cat -> new TypeData(cat.getCatCode(), cat.getCatName()))
        .toList();
  }

  /**
   * CategoryListからCategiryFormListに変換
   * 
   * @param target 変換対象
   * @return CategoryFormList
   */
  public List<CategoryForm> categoryListToCategoryFormList(@NonNull List<Category> target) {
    return StudyBeanUtil.createInstanceFromBeanList(target, CategoryForm.class,
        cat -> categoryToCategoryForm(cat == null ? new Category() : cat));
  }

  /**
   * CategoryからCategiryFormに変換
   * 
   * @param target 変換対象
   * @return CategoryForm
   */
  public CategoryForm categoryToCategoryForm(@NonNull Category target) {
    return StudyBeanUtil.createInstanceFromBean(target, CategoryForm.class,
        (cat, catForm) -> {
          Image img = cat.getImgIds();
          catForm.setImgIds(imageHelper.imageToImageForm(img == null ? new Image() : img));
          return catForm;
        });
  }

  /**
   * アップデート時のエラーチェックを実施<br>
   * エラー時はBindingResultに結果をセット
   * 
   * @param catListParam 更新対象
   * @param result 結果
   * @return 更新件数
   */
  public void validateIfDoUpdate(CategoryFormList catListParam, BindingResult result) {
    List<CategoryForm> catDataList = catListParam.getCatDataList();
    for (int i = 0; i < catDataList.size(); i++) {
      CategoryForm catForm = catDataList.get(i);
      if (categoryService.countCatNameExceptCatCode(catForm.getCatCode(),
          catForm.getCatName()) > 0) {
        StudyMessageUtil.addError(result,
            StudyMessageUtil.getArrayFieldName("catDataList", i, "catName"),
            "CategoryNameDuplication.message", catForm.getCatName());
      }

    }
  }

  /**
   * インサート時のエラーチェックを実施<br>
   * エラー時はBindingResultに結果をセット
   * 
   * @param catForm 挿入対象
   * @param result 結果
   * @return 更新件数
   */
  public void validateIfDoInsert(CategoryForm catForm, BindingResult result) {
    if (categoryService.countCatCode(
        catForm.getCatCode()) > 0) {
      StudyMessageUtil.addError(result,
          "catCode",
          "CategoryCodeDuplication.message", catForm.getCatCode());
    }

    if (categoryService.countCatName(
        catForm.getCatName()) > 0) {
      StudyMessageUtil.addError(result,
          "catName",
          "CategoryNameDuplication.message", catForm.getCatName());
    }
  }

}
