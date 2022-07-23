package org.watanabe.app.study.helper;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.apache.commons.io.FilenameUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.watanabe.app.study.dto.CategoryList;
import org.watanabe.app.study.entity.Category;
import org.watanabe.app.study.enums.flag.DeleteFlag;
import org.watanabe.app.study.form.CategoryForm;
import org.watanabe.app.study.service.CategoryService;
import org.watanabe.app.study.util.StudyModelUtil;
import org.watanabe.app.study.util.StudyUtil;

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
  public int updatCeategorys(CategoryList catListParam) {
    // カテゴリー情報の更新
    // 全件数送信されるため、変更してなくても更新される。とりあえず仮で実装
    int updCnt = 0;
    for (CategoryForm catForm : catListParam.getCatDataList()) {
      if (DeleteFlag.isDelete(catForm.getDeleteFlag())) {
        updCnt += categoryService.deleteOne(catForm.getCatCode());
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

        // カテゴリーが登録されていなかったら仮でいったん登録
        Category cat = new Category();
        // フォームの値をエンティティにコピーし、共通項目をセット
        StudyModelUtil.copyAndSetStudyEntityProperties(catForm, cat);
        // imgaeIdをセット
        cat.setImgId(catForm.getImgIds().getImgId());

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
      if (catName.equals(cat.getCatName())) {
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
    StudyModelUtil.setStudyEntityProperties(cat);

    categoryService.saveOne(cat);
    catList = categoryService.findAll();

    return catCode;
  }

}
