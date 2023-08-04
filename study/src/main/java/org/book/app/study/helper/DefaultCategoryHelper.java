package org.book.app.study.helper;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.book.app.study.dto.list.DefaultCategoryFormList;
import org.book.app.study.entity.DefaultCategory;
import org.book.app.study.enums.dbcode.DefaultCategoryTarget;
import org.book.app.study.enums.flag.DeleteFlag;
import org.book.app.study.form.DefaultCategoryForm;
import org.book.app.study.service.DefaultCategoryService;
import org.book.app.study.util.StudyBeanUtil;
import org.book.app.study.util.StudyCodeUtil;
import org.book.app.study.util.StudyMessageUtil;
import org.book.app.study.util.StudyUtil;
import org.springframework.stereotype.Component;
import org.springframework.validation.BindingResult;
import lombok.RequiredArgsConstructor;

/**
 * デフォルトカテゴリーの関する処理を行うためのHelperクラスを作成
 */
@Component
@RequiredArgsConstructor
public class DefaultCategoryHelper {

  /**
   * デフォルトカテゴリー Service
   */
  private final DefaultCategoryService defaultCategoryService;

  /**
   * DefaultCategoryListからDefaultCategoryFormListに変換
   * 
   * @param target 変換対象
   * @return DefaultCategoryFormList
   */
  public List<DefaultCategoryForm> defaultCategoryListToDefaultCategoryFormList(
      List<DefaultCategory> target) {
    return StudyBeanUtil.createInstanceFromBeanList(target, DefaultCategoryForm.class,
        defCat -> defaultCategoryToDefaultCategoryForm(defCat));
  }

  /**
   * DefaultCategoryからDefaultCategoryFormに変換
   * 
   * @param target 変換対象
   * @return DefaultCategoryForm
   */
  public DefaultCategoryForm defaultCategoryToDefaultCategoryForm(DefaultCategory target) {
    return StudyBeanUtil.createInstanceFromBean(target, DefaultCategoryForm.class);
  }

  /**
   * デフォルトカテゴリーフォームリストデータの取得
   * 
   * @return デフォルトカテゴリーフォームリストデータ
   */
  public DefaultCategoryFormList getDefaultCategoryFormList() {
    DefaultCategoryFormList defCatFromList = new DefaultCategoryFormList();
    defCatFromList.setDefCatDataList(
        defaultCategoryListToDefaultCategoryFormList(getDefaultCategoryList()));

    return defCatFromList;
  }

  /**
   * デフォルトカテゴリーリストの中からプライマリーキー指定で検索
   * 
   * @param booksPlace 場所(収入元、購入先)
   * @param booksType 帳簿の種類(収入、支出を選ぶ)
   * @param booksMethod 方法(受け取り方、支払い方)
   * @param defCatList デフォルトカテゴリーリスト
   * @return
   */
  public Optional<DefaultCategory> findOneFromDefaultCeategoryList(String booksPlace,
      String booksType,
      String booksMethod, List<DefaultCategory> defCatList) {
    String targetKey =
        new StringBuffer().append(booksPlace).append(booksType).append(booksMethod).toString();

    return defCatList.stream()
        .filter(defCat -> {
          String defCatKey = new StringBuffer().append(defCat.getBooksPlace())
              .append(defCat.getBooksType()).append(defCat.getBooksMethod()).toString();

          return Objects.equals(defCatKey, targetKey);
        })
        .findFirst();
  }

  /**
   * デフォルトカテゴリーリストデータの取得
   * 
   * @return デフォルトカテゴリーリストデータ
   */
  public List<DefaultCategory> getDefaultCategoryList() {
    return defaultCategoryService.findByUserId(StudyUtil.getLoginUser());
  }

  /**
   * 家計簿データからデフォルトカテゴリーを登録
   * 
   * @return 挿入件数
   */
  public int insertAllFromBooks() {
    return defaultCategoryService.saveAllFromBooks(StudyUtil.getLoginUser(),
        DefaultCategoryTarget.CATEGORY1.getListName());
  }

  /**
   * 複数のカテゴリーをアップデート
   * 
   * @return 更新件数
   */
  public int updatDefaultCeategorys(DefaultCategoryFormList defCatListParam) {
    // カテゴリー情報の更新
    // 全件数送信されるため、変更してなくても更新される
    int updCnt = 0;
    for (DefaultCategoryForm defCatForm : defCatListParam.getDefCatDataList()) {
      if (DeleteFlag.isDelete(defCatForm.getDelete())) {
        updCnt +=
            defaultCategoryService.deleteOne(StudyUtil.getLoginUser(), defCatForm.getBooksPlace(),
                defCatForm.getBooksType(), defCatForm.getBooksMethod());
      }
    }

    return updCnt;
  }

  /**
   * インサート時のエラーチェックを実施<br>
   * エラー時はBindingResultに結果をセット
   * 
   * @param catForm 挿入対象
   * @param result 結果
   * @return 更新件数
   */
  public void validateIfDoInsert(DefaultCategoryFormList defCatListParam, BindingResult result) {
    List<DefaultCategoryForm> defCatDataList = defCatListParam.getDefCatDataList();
    for (int i = 0; i < defCatDataList.size(); i++) {
      DefaultCategoryForm defCatForm = defCatDataList.get(i);
      if (defaultCategoryService.countOne(StudyUtil.getLoginUser(), defCatForm.getBooksPlace(),
          defCatForm.getBooksType(), defCatForm.getBooksMethod()) > 0) {
        StudyMessageUtil.addError(result,
            StudyMessageUtil.getArrayFieldName("defCatDataList", i, "booksPlace"),
            "CategoryNameDuplication.message", defCatForm.getBooksPlace());
        StudyMessageUtil.addError(result,
            StudyMessageUtil.getArrayFieldName("defCatDataList", i, "booksType"),
            "CategoryNameDuplication.message", defCatForm.getBooksPlace());
        StudyMessageUtil.addError(result,
            StudyMessageUtil.getArrayFieldName("defCatDataList", i, "booksMethod"),
            "CategoryNameDuplication.message", defCatForm.getBooksPlace());
      }
    }
  }

  /**
   * デフォルトカテゴリー置き換え対象カテゴリー
   * 
   * @return デフォルトカテゴリー置き換え対象カテゴリー
   */
  public List<String> getDefaultCategoryTargets() {
    return StudyCodeUtil.getShorts(DefaultCategoryTarget.CATEGORY1.getListName());
  }

}
