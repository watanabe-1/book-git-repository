package org.watanabe.app.study.mapper;

import java.util.Date;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.watanabe.app.study.entity.Books;


/**
 * BOOKS:家計簿(家計簿データ保存テーブル)のmapperクラス
 */
@Mapper
public interface BooksMapper {

  /**
   * 全検索
   * 
   * @return 検索結果(複数行)
   */
  List<Books> findAll();

  /**
   * 1行検索(引数にプライマルキーを指定)
   * 
   * @param booksId BOOKS_ID(家計簿ID)
   * @param userId USER_ID(ユーザーID)
   * @return 検索結果(1行)
   */
  Books findOne(@Param("booksId") String booksId, @Param("userId") String userId);

  /**
   * 複数行insert
   * 
   * @param booList entity(Books)のList
   * @return insert行数
   */
  int saveBulk(@Param("booList") List<Books> booList);

  /**
   * 1行insert
   * 
   * @param boo entity(Books)
   * @return insert行数
   */
  int saveOne(Books boo);

  /**
   * 全行update
   * 
   * @param boo entity(Books)
   * @return update行数
   */
  int updateAll(Books boo);

  /**
   * 1行update プライマルキーをWhere句に指定 プライマルキー：@Param("booksIdWhere")String
   * booksId, @Param("userIdWhere")String userId
   * 
   * @param boo entity(Books)
   * @param booksId BOOKS_ID(家計簿ID)
   * @param userId USER_ID(ユーザーID)
   * @return update行数
   */
  int updateOne(Books boo, @Param("booksIdWhere") String booksId,
      @Param("userIdWhere") String userId);

  /**
   * 全行delete
   * 
   * @return delete行数
   */
  int deleteAll();

  /**
   * 1行delete(引数にプライマルキーを指定)
   * 
   * @param booksId BOOKS_ID(家計簿ID)
   * @param userId USER_ID(ユーザーID)
   * @return delete行数
   */
  int deleteOne(@Param("booksId") String booksId, @Param("userId") String userId);


  /**
   * 家計簿日付、家計簿種類を指定してdelete(引数にプライマルキーを指定)
   * 
   * @param start から
   * @param end まで
   * @param booksType 家計簿の種類
   * @param userId USER_ID(ユーザーID)
   * @return delete行数
   */
  int deleteByBooksDateAndBooksTypeAndUserId(@Param("start") Date start, @Param("end") Date end,
      @Param("booksType") String booksType, @Param("userId") String userId);

  /**
   * 家計簿日付、家計簿種類を指定して対象を取得
   * 
   * @param start から
   * @param end まで
   * @param booksType 家計簿の種類
   * @param userId USER_ID(ユーザーID)
   * @return 検索結果(複数行)
   */
  List<Books> findByBooksDateAndBooksTypeAndUserIdJoinCategory(@Param("start") Date start,
      @Param("end") Date end, @Param("booksType") String booksType, @Param("userId") String userId);

  /**
   * ユーザーIDで検索
   * 
   * @param booksId BOOKS_ID(家計簿ID)
   * @return 検索結果(複数行)
   */
  public List<Books> findByUserId(@Param("userId") String userId);
}
