package org.book.app.study.helper;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.UUID;
import org.apache.commons.io.FilenameUtils;
import org.book.app.study.dto.data.FormConfirmData;
import org.book.app.study.dto.list.CategoryFormList;
import org.book.app.study.entity.Category;
import org.book.app.study.entity.Image;
import org.book.app.study.enums.flag.DeleteFlag;
import org.book.app.study.enums.type.CategoryType;
import org.book.app.study.enums.type.ColType;
import org.book.app.study.enums.type.ImageType;
import org.book.app.study.form.CategoryForm;
import org.book.app.study.service.CategoryService;
import org.book.app.study.service.ImageService;
import org.book.app.study.util.StudyBeanUtil;
import org.book.app.study.util.StudyMessageUtil;
import org.book.app.study.util.StudyStringUtil;
import org.book.app.study.util.StudyUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.validation.BindingResult;
import org.springframework.validation.FieldError;
import org.springframework.web.multipart.MultipartFile;
import lombok.extern.slf4j.XSlf4j;

/**
 * カテゴリーの関する処理を行うためのHelperクラスを作成
 */
@Component
@XSlf4j
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
   * 画像情報 Service
   */
  @Autowired
  private ImageService imageService;

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
   * @return 更新件数
   */
  public void validateIfDoUpdate(CategoryFormList catListParam, BindingResult result) {
    List<CategoryForm> catDataList = catListParam.getCatDataList();
    for (int i = 0; i < catDataList.size(); i++) {
      CategoryForm catForm = catDataList.get(i);
      if (categoryService.countCatNameExceptCatCode(catForm.getCatCode(),
          catForm.getCatName()) > 0) {
        result.addError(
            new FieldError(result.getObjectName(),
                StudyMessageUtil.getArrayFieldName("catDataList", i, "catName"),
                "入力したカテゴリー名は既に登録されています。"));
        log.error("入力したカテゴリー名は既に登録されています。", catForm.getCatName());
      }

    }
  }

  /**
   * 確認画面用のデータに加工
   * 
   * @param form フォーム入力値
   * @param contextPath コンテキストパス
   * @return
   */
  public List<FormConfirmData> getConfirmList(CategoryForm form, String contextPath) {
    List<FormConfirmData> list = new ArrayList<FormConfirmData>();
    int index = 0;

    list.add(new FormConfirmData(index++, "カテゴリーコード",
        StudyMessageUtil.getConfirmMessage(form.getCatCode()),
        ColType.STRING.getCode()));
    list.add(new FormConfirmData(index++, "カテゴリー名",
        StudyMessageUtil.getConfirmMessage(form.getCatName()),
        ColType.STRING.getCode()));
    list.add(new FormConfirmData(index++, "メモ", StudyMessageUtil.getConfirmMessage(form.getNote()),
        ColType.STRING.getCode()));
    list.add(
        new FormConfirmData(index++, "画像タイプ",
            StudyMessageUtil.getConfirmMessage(
                StudyStringUtil.isNullOrEmpty(form.getImgType()) ? null
                    : ImageType.codeOf(form.getImgType()).getName(),
                ColType.SELECT),
            ColType.STRING.getCode()));
    list.add(new FormConfirmData(index++, "カテゴリータイプ",
        StudyMessageUtil.getConfirmMessage(
            StudyStringUtil.isNullOrEmpty(form.getCatType()) ? null
                : CategoryType.codeOf(form.getCatType()).getName(),
            ColType.RADIO),
        ColType.STRING.getCode()));
    list.add(
        new FormConfirmData(index++, "アクティブ",
            StudyMessageUtil.getConfirmMessage(form.getActive(), ColType.CHECK),
            ColType.STRING.getCode()));

    // アップロードしたICON
    MultipartFile catIcon = form.getCatIcon();
    String imgPath = null;
    // 画像をアップロードしたとき
    if (!Objects.equals(catIcon, null)) {
      // アップロードされたICONの拡張子
      String imgExt = FilenameUtils.getExtension(catIcon.getOriginalFilename());
      // アップロードされたファイルをbase64にエンコードした後にstring型に変換
      imgPath = uploadHelper.encodeBase64(catIcon, imgExt);
    } else {
      Image img = imageService.findOne(StudyUtil.getNoImageCode());
      imgPath = StudyStringUtil.pathJoin(contextPath, img.getImgPath(), img.getImgName());
    }

    list.add(new FormConfirmData(index++, "アイコン", imgPath, ColType.IMAGE.getCode()));

    return list;
  }

}
