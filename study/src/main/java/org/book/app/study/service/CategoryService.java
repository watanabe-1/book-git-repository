package org.book.app.study.service;

import java.util.List;
import org.book.app.study.dto.list.CategoryFormList;
import org.book.app.study.entity.Category;
import org.book.app.study.form.CategoryForm;
import org.book.app.study.mapper.CategoryMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

/**
 * CATEGORY:カテゴリー(カテゴリー定義テーブル)のserviceクラス
 */
@Service
@RequiredArgsConstructor
public class CategoryService {

  private final CategoryMapper categoryMapper;

  /**
   * 全検索
   * 
   * @return 検索結果(複数行)
   */
  public List<Category> findAll() {
    return categoryMapper.findAll();
  }

  /**
   * 1行検索(引数にプライマルキーを指定)
   * 
   * @param catCode CAT_CODE(カテゴリーコード)
   * @return 検索結果(1行)
   */
  public Category findOne(String catCode) {
    return categoryMapper.findOne(catCode);
  }

  /**
   * 複数行insert
   * 
   * @param catList entity(Category)のList
   * @return insert行数
   */
  @Transactional
  public int saveBulk(List<Category> catList) {
    return categoryMapper.saveBulk(catList);
  }

  /**
   * 1行insert
   * 
   * @param cat entity(Category)
   * @return insert行数
   */
  @Transactional
  public int saveOne(Category cat) {
    return categoryMapper.saveOne(cat);
  }

  /**
   * 全行update
   * 
   * @param cat entity(Category)
   * @return update行数
   */
  @Transactional
  public int updateAll(Category cat) {
    return categoryMapper.updateAll(cat);
  }

  /**
   * 1行update プライマルキーをWhere句に指定 プライマルキー：String catCode
   * 
   * @param cat entity(Category)
   * @param catCode CAT_CODE(カテゴリーコード)
   * @return update行数
   */
  @Transactional
  public int updateOne(Category cat, String catCode) {
    return categoryMapper.updateOne(cat, catCode);
  }

  /**
   * 全行delete
   * 
   * @return delete行数
   */
  @Transactional
  public int deleteAll() {
    return categoryMapper.deleteAll();
  }

  /**
   * 1行delete(引数にプライマルキーを指定)
   * 
   * @param catCode CAT_CODE(カテゴリーコード)
   * @return delete行数
   */
  @Transactional
  public int deleteOne(String catCode) {
    return categoryMapper.deleteOne(catCode);
  }

  /**
   * 全検索(画像テーブルと結合)
   * 
   * @return 検索結果(複数行)
   */
  public CategoryFormList findAlljoinImage() {
    CategoryFormList catDatalist = new CategoryFormList();

    // カテゴリー情報を取得しformに変換しセット
    catDatalist.setCatDataList(categoryMapper.findAllJoinImage().stream().map(cat -> {
      CategoryForm data = new CategoryForm();
      // 同名のフィールドにセット 引数1から2へ
      BeanUtils.copyProperties(cat, data);
      return data;
    }).toList());

    return catDatalist;
  }

  /**
   * 検索対象のカテゴリーを除いてカテゴリー名に対して重複件数を取得
   * 
   * @param catCode CAT_CODE(カテゴリーコード)
   * @param catName CAT_NAME(カテゴリー名)
   * @return 件数
   */
  public int countCatNameExceptCatCode(String catCode, String catName) {
    return categoryMapper.countCatNameExceptCatCode(catCode, catName);
  }

  /**
   * カテゴリーコードの件数を取得
   * 
   * @param catCode CAT_CODE(カテゴリーコード)
   * @return 件数
   */
  public int countCatCode(String catCode) {
    return categoryMapper.countCatCode(catCode);
  }

  /**
   * カテゴリー名の件数を取得
   * 
   * @param catName CAT_NAME(カテゴリー名)
   * @return 件数
   */
  public int countCatName(String catName) {
    return categoryMapper.countCatName(catName);
  }
}
