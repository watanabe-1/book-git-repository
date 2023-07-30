package org.book.app.study.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.book.app.study.entity.DefaultCategory;


/**
 * DEFAULT_CATEGORY:デフォルトカテゴリー(家計簿につける項目ごとのデフォルトカテゴリーを設定)のmapperクラス
 */
@Mapper
public interface DefaultCategoryMapper {

  /**
   * 全検索
   * 
   * @return 検索結果(複数行)
   */
  List<DefaultCategory> findAll();

  /**
   * 1行検索(引数にプライマルキーを指定)
   * 
   * @param userId USER_ID(ユーザーID)
   * @param booksPlace BOOKS_PLACE(場所--収入元、購入先)
   * @param booksType BOOKS_TYPE(帳簿の種類--収入、支出を選ぶ)
   * @param booksMethod BOOKS_METHOD(方法--受け取り方、支払い方)
   * @return 検索結果(1行)
   */
  DefaultCategory findOne(@Param("userId") String userId, @Param("booksPlace") String booksPlace,
      @Param("booksType") String booksType, @Param("booksMethod") String booksMethod);

  /**
   * 複数行insert
   * 
   * @param defList entity(DefaultCategory)のList
   * @return insert行数
   */
  int saveBulk(@Param("defList") List<DefaultCategory> defList);

  /**
   * 1行insert
   * 
   * @param def entity(DefaultCategory)
   * @return insert行数
   */
  int saveOne(DefaultCategory def);

  /**
   * 全行update
   * 
   * @param def entity(DefaultCategory)
   * @return update行数
   */
  int updateAll(DefaultCategory def);

  /**
   * 1行update プライマルキーをWhere句に指定 プライマルキー：@Param("userIdWhere")String userId, @Param("booksPlaceWhere")String
   * booksPlace, @Param("booksTypeWhere")String booksType, @Param("booksMethodWhere")String booksMethod
   * 
   * @param def entity(DefaultCategory)
   * @param userId USER_ID(ユーザーID)
   * @param booksPlace BOOKS_PLACE(場所--収入元、購入先)
   * @param booksType BOOKS_TYPE(帳簿の種類--収入、支出を選ぶ)
   * @param booksMethod BOOKS_METHOD(方法--受け取り方、支払い方)
   * @return update行数
   */
  int updateOne(@Param("def") DefaultCategory def, @Param("userIdWhere") String userId,
      @Param("booksPlaceWhere") String booksPlace, @Param("booksTypeWhere") String booksType,
      @Param("booksMethodWhere") String booksMethod);

  /**
   * 全行delete
   * 
   * @return delete行数
   */
  int deleteAll();

  /**
   * 1行delete(引数にプライマルキーを指定)
   * 
   * @param userId USER_ID(ユーザーID)
   * @param booksPlace BOOKS_PLACE(場所--収入元、購入先)
   * @param booksType BOOKS_TYPE(帳簿の種類--収入、支出を選ぶ)
   * @param booksMethod BOOKS_METHOD(方法--受け取り方、支払い方)
   * @return delete行数
   */
  int deleteOne(@Param("userId") String userId, @Param("booksPlace") String booksPlace,
      @Param("booksType") String booksType, @Param("booksMethod") String booksMethod);

  /**
   * ユーザーID検索
   * 
   * @param userId USER_ID(ユーザーID)
   * @return 検索結果(複数行)
   */
  List<DefaultCategory> findByUserId(@Param("userId") String userId);

  /**
   * 1行件数取得(引数にプライマルキーを指定)
   * 
   * @param userId USER_ID(ユーザーID)
   * @param booksPlace BOOKS_PLACE(場所--収入元、購入先)
   * @param booksType BOOKS_TYPE(帳簿の種類--収入、支出を選ぶ)
   * @param booksMethod BOOKS_METHOD(方法--受け取り方、支払い方)
   * @return 件数
   */
  int countOne(@Param("userId") String userId, @Param("booksPlace") String booksPlace,
      @Param("booksType") String booksType, @Param("booksMethod") String booksMethod);

  /**
   * 家計簿データから登録
   * 
   * @param userId USER_ID(ユーザーID)
   * @param listName LIST_NAME(リストネーム)
   * @return insert行数
   */
  int saveAllFromBooks(@Param("userId") String userId, @Param("listName") String listName);
}

