package org.watanabe.app.study.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.watanabe.app.study.entity.Codelist;


/**
 * CODELIST:コードリスト(コード定義テーブル(ヘッダー))のmapperクラス
 */
@Mapper
public interface CodelistMapper {

  /**
   * 全検索
   * 
   * @return 検索結果(複数行)
   */
  List<Codelist> findAll();

  /**
   * 1行検索(引数にプライマルキーを指定)
   * 
   * @param listName LIST_NAME(リストネーム)
   * @return 検索結果(1行)
   */
  Codelist findOne(@Param("listName") String listName);

  /**
   * 複数行insert
   * 
   * @param codList entity(Codelist)のList
   * @return insert行数
   */
  int saveBulk(@Param("codList") List<Codelist> codList);

  /**
   * 1行insert
   * 
   * @param cod entity(Codelist)
   * @return insert行数
   */
  int saveOne(Codelist cod);

  /**
   * 全行update
   * 
   * @param cod entity(Codelist)
   * @return update行数
   */
  int updateAll(Codelist cod);

  /**
   * 1行update プライマルキーをWhere句に指定 プライマルキー：@Param("listNameWhere")String listName
   * 
   * @param cod entity(Codelist)
   * @return update行数
   */
  int updateOne(Codelist cod, @Param("listNameWhere") String listName);

  /**
   * 全行delete
   * 
   * @return delete行数
   */
  int deleteAll();

  /**
   * 1行delete(引数にプライマルキーを指定)
   * 
   * @param listName LIST_NAME(リストネーム)
   * @return delete行数
   */
  int deleteOne(@Param("listName") String listName);

}

