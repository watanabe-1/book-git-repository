package org.watanabe.app.study.service;

import java.util.Date;
import java.util.List;
import org.apache.ibatis.annotations.Param;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.watanabe.app.study.entity.Books;
import org.watanabe.app.study.mapper.BooksMapper;


/**
 * BOOKS:家計簿(家計簿データ保存テーブル)のserviceクラス
 */
@Service
public class BooksService {

  @Autowired
  private BooksMapper booksMapper;

  /**
   * 全検索
   * 
   * @return 検索結果(複数行)
   */
  public List<Books> findAll() {
    return booksMapper.findAll();
  }

  /**
   * 1行検索(引数にプライマルキーを指定)
   * 
   * @param booksId BOOKS_ID(家計簿ID)
   * @return 検索結果(1行)
   */
  public Books findOne(String booksId) {
    return booksMapper.findOne(booksId);
  }

  /**
   * 複数行insert
   * 
   * @param booList entity(Books)のList
   * @return insert行数
   */
  @Transactional
  public int saveBulk(List<Books> booList) {
    return booksMapper.saveBulk(booList);
  }

  /**
   * 1行insert
   * 
   * @param boo entity(Books)
   * @return insert行数
   */
  @Transactional
  public int saveOne(Books boo) {
    return booksMapper.saveOne(boo);
  }

  /**
   * 全行update
   * 
   * @param boo entity(Books)
   * @return update行数
   */
  @Transactional
  public int updateAll(Books boo) {
    return booksMapper.updateAll(boo);
  }

  /**
   * 1行update プライマルキーをWhere句に指定 プライマルキー：String booksId
   * 
   * @param boo entity(Books)
   * @return update行数
   */
  @Transactional
  public int updateOne(Books boo) {
    return booksMapper.updateOne(boo);
  }

  /**
   * 全行delete
   * 
   * @return delete行数
   */
  @Transactional
  public int deleteAll() {
    return booksMapper.deleteAll();
  }

  /**
   * 1行delete(引数にプライマルキーを指定)
   * 
   * @param booksId BOOKS_ID(家計簿ID)
   * @return delete行数
   */
  @Transactional
  public int deleteOne(String booksId) {
    return booksMapper.deleteOne(booksId);
  }

  /**
   * 家計簿日付を指定してdelete(引数にプライマルキーを指定)
   * 
   * @param start から
   * @param end まで
   * @param booksType 家計簿の種類
   * @return delete行数
   */
  @Transactional
  public int deleteByBooksDateAndBooksType(Date start, Date end, String booksType) {
    return booksMapper.deleteByBooksDateAndBooksType(start, end, booksType);
  }

  /**
   * 家計簿日付、家計簿種類を指定して対象を取得
   * 
   * @param start から
   * @param end まで
   * @param booksType 家計簿の種類
   * @return 検索結果(複数行)
   */
  public List<Books> findByBooksDateAndBooksTypeJoinCategory(@Param("start") Date start,
      @Param("end") Date end, @Param("booksType") String booksType) {
    return booksMapper.findByBooksDateAndBooksTypeJoinCategory(start, end, booksType);
  };
}

