package org.book.app.study.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.book.app.study.entity.DefaultCategory;
import org.book.app.study.mapper.DefaultCategoryMapper;

/**
 * DEFAULT_CATEGORY:デフォルトカテゴリー(家計簿につける項目ごとのデフォルトカテゴリーを設定)のserviceクラス
 */
@Service
public class DefaultCategoryService {

  @Autowired
  private DefaultCategoryMapper defaultcategoryMapper;

  /**
   * 全検索
   * @return 検索結果(複数行)
   */
  public List<DefaultCategory> findAll() {
    return defaultcategoryMapper.findAll();
  }

  /**
   * 1行検索(引数にプライマルキーを指定)
   * @param userId USER_ID(ユーザーID)
   * @param booksPlace BOOKS_PLACE(場所--収入元、購入先)
   * @param booksType BOOKS_TYPE(帳簿の種類--収入、支出を選ぶ)
   * @param booksMethod BOOKS_METHOD(方法--受け取り方、支払い方)
   * @return 検索結果(1行)
   */
  public DefaultCategory findOne(String userId, String booksPlace, String booksType, String booksMethod) {
    return defaultcategoryMapper.findOne(userId, booksPlace, booksType, booksMethod);
  }

  /**
   * 複数行insert
   * @param defList entity(DefaultCategory)のList
   * @return insert行数
   */
  @Transactional
  public int saveBulk(List<DefaultCategory> defList) {
    return defaultcategoryMapper.saveBulk(defList);
  }

  /**
   * 1行insert
   * @param def entity(DefaultCategory)
   * @return insert行数
   */
  @Transactional
  public int saveOne(DefaultCategory def) {
    return defaultcategoryMapper.saveOne(def);
  }

  /**
   * 全行update
   * @param def entity(DefaultCategory)
   * @return update行数
   */
  @Transactional
  public int updateAll(DefaultCategory def) {
    return defaultcategoryMapper.updateAll(def);
  }

  /**
   * 1行update
   * プライマルキーをWhere句に指定
   * プライマルキー：String userId, String booksPlace, String booksType, String booksMethod
   * @param def entity(DefaultCategory)
   * @param userId USER_ID(ユーザーID)
   * @param booksPlace BOOKS_PLACE(場所--収入元、購入先)
   * @param booksType BOOKS_TYPE(帳簿の種類--収入、支出を選ぶ)
   * @param booksMethod BOOKS_METHOD(方法--受け取り方、支払い方)
   * @return update行数
   */
  @Transactional
  public int updateOne(DefaultCategory def, String userId, String booksPlace, String booksType, String booksMethod) {
    return defaultcategoryMapper.updateOne(def, userId, booksPlace, booksType, booksMethod);
  }

  /**
   * 全行delete
   * @return delete行数
   */
  @Transactional
  public int deleteAll() {
    return defaultcategoryMapper.deleteAll();
  }

  /**
   * 1行delete(引数にプライマルキーを指定)
   * @param userId USER_ID(ユーザーID)
   * @param booksPlace BOOKS_PLACE(場所--収入元、購入先)
   * @param booksType BOOKS_TYPE(帳簿の種類--収入、支出を選ぶ)
   * @param booksMethod BOOKS_METHOD(方法--受け取り方、支払い方)
   * @return delete行数
   */
  @Transactional
  public int deleteOne(String userId, String booksPlace, String booksType, String booksMethod) {
    return defaultcategoryMapper.deleteOne(userId, booksPlace, booksType, booksMethod);
  }

}

