package org.book.app.study.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.book.app.study.entity.Codelkup;

/**
 * CODELKUP:コードルックアップ(コード定義テーブル(明細))のmapperクラス
 */
@Mapper
public interface CodelkupMapper {

  /**
   * 全検索
   * 
   * @return 検索結果(複数行)
   */
  List<Codelkup> findAll();

  /**
   * 1行検索(引数にプライマルキーを指定)
   * 
   * @param listName LIST_NAME(リストネーム)
   * @param code     CODE(コード)
   * @return 検索結果(1行)
   */
  Codelkup findOne(@Param("listName") String listName, @Param("code") String code);

  /**
   * 複数行insert
   * 
   * @param codList entity(Codelkup)のList
   * @return insert行数
   */
  int saveBulk(@Param("codList") List<Codelkup> codList);

  /**
   * 1行insert
   * 
   * @param cod entity(Codelkup)
   * @return insert行数
   */
  int saveOne(Codelkup cod);

  /**
   * 全行update
   * 
   * @param cod entity(Codelkup)
   * @return update行数
   */
  int updateAll(Codelkup cod);

  /**
   * 1行update プライマルキーをWhere句に指定 プライマルキー：@Param("listNameWhere")String
   * listName, @Param("codeWhere")String code
   * 
   * @param cod      entity(Codelkup)
   * @param listName LIST_NAME(リストネーム)
   * @param code     CODE(コード)
   * @return update行数
   */
  int updateOne(@Param("cod") Codelkup cod, @Param("listNameWhere") String listName,
      @Param("codeWhere") String code);

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
   * @param code     CODE(コード)
   * @return delete行数
   */
  int deleteOne(@Param("listName") String listName, @Param("code") String code);

}
