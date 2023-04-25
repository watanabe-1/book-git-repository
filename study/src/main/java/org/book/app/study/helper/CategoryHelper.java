package org.book.app.study.helper;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import org.apache.commons.io.FilenameUtils;
import org.book.app.study.dto.list.CategoryFormList;
import org.book.app.study.entity.Category;
import org.book.app.study.enums.flag.DeleteFlag;
import org.book.app.study.form.CategoryForm;
import org.book.app.study.service.CategoryService;
import org.book.app.study.util.StudyBeanUtil;
import org.book.app.study.util.StudyMessageUtil;
import org.book.app.study.util.StudyStringUtil;
import org.book.app.study.util.StudyUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.validation.BindingResult;
import org.springframework.web.multipart.MultipartFile;

/**
 * カテゴリーの関する処理を行うためのHelperクラスを作成
 */
@Component
public class CategoryHelper {

  /**
   * カテゴリー情報 Service
   */
  @Autowired
  private CategoryService categoryService;

  /**
   * ファイル保存用 Helper
   */
  @Autowired
  private UploadHelper uploadHelper;

  /**
   * カテゴリー情報保存用リスト
   */
  private List<Category> catList = new ArrayList<Category>();

  /**
   * 複数のカテゴリーをアップデート
   * 
   * @return 更新件数
   */
  public int updatCeategorys(CategoryFormList catListParam) {
    // カテゴリー情報の更新
    // 全件数送信されるため、変更してなくても更新される。とりあえず仮で実装
    int updCnt = 0;
    for (CategoryForm catForm : catListParam.getCatDataList()) {
      if (DeleteFlag.isDelete(catForm.getDelete())) {
        updCnt += categoryService.deleteOne(catForm.getCatCode());
      } else {
        // アップロードしたICON
        MultipartFile catIcon = catForm.getCatIcon();

        // 画像をアップロードしたとき
        if (!Objects.isNull(catIcon) && !catIcon.isEmpty()) {
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

        // カテゴリーが登録されていなかったら仮でいったん登録
        Category cat = new Category();
        // フォームの値をエンティティにコピーし、共通項目をセット
        StudyBeanUtil.copyAndSetStudyEntityProperties(catForm, cat);
        // imgaeIdをセット
        if (StudyStringUtil.isNullOrEmpty(cat.getImgId())) {
          cat.setImgId(catForm.getImgIds().getImgId());
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
  public String getCatCode(String catName) {
    // まだ一回も呼ばれていない場合
    if (catList.isEmpty()) {
      catList = categoryService.findAll();
    }

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

    categoryService.saveOne(cat);
    catList = categoryService.findAll();

    return catCode;
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
