package org.book.app.study.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.book.app.study.entity.CodeList;


/**
 * CODE_LIST:コードリスト(コード定義テーブル(ヘッダー))のmapperクラス
 */
@Mapper
public interface CodeListMapper {

  /**
   * 全検索
   * @return 検索結果(複数行)
   */
  List<CodeList> findAll();

  /**
   * 1行検索(引数にプライマルキーを指定)
   * @param listName LIST_NAME(リストネーム)
   * @return 検索結果(1行)
   */
  CodeList findOne(@Param("listName")String listName);

  /**
   * 複数行insert
   * @param codList entity(CodeList)のList
   * @return insert行数
   */
  int saveBulk(@Param("codList")List<CodeList> codList);

  /**
   * 1行insert
   * @param cod entity(CodeList)
   * @return insert行数
   */
  int saveOne(CodeList cod);

  /**
   * 全行update
   * @param cod entity(CodeList)
   * @return update行数
   */
  int updateAll(CodeList cod);

  /**
   * 1行update
   * プライマルキーをWhere句に指定
   * プライマルキー：@Param("listNameWhere")String listName
   * @param cod entity(CodeList)
   * @param listName LIST_NAME(リストネーム)
   * @return update行数
   */
  int updateOne(@Param("cod") CodeList cod, @Param("listNameWhere")String listName);

  /**
   * 全行delete
   * @return delete行数
   */
  int deleteAll();

  /**
   * 1行delete(引数にプライマルキーを指定)
   * @param listName LIST_NAME(リストネーム)
   * @return delete行数
   */
  int deleteOne(@Param("listName")String listName);

}

