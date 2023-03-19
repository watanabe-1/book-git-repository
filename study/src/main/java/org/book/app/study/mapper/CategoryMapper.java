package org.book.app.study.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.book.app.study.entity.Category;

/**
 * CATEGORY:カテゴリー(カテゴリー定義テーブル)のmapperクラス
 */
@Mapper
public interface CategoryMapper {

  /**
   * 全検索
   * 
   * @return 検索結果(複数行)
   */
  List<Category> findAll();

  /**
   * 1行検索(引数にプライマルキーを指定)
   * 
   * @param catCode CAT_CODE(カテゴリーコード)
   * @return 検索結果(1行)
   */
  Category findOne(@Param("catCode") String catCode);

  /**
   * 複数行insert
   * 
   * @param catList entity(Category)のList
   * @return insert行数
   */
  int saveBulk(@Param("catList") List<Category> catList);

  /**
   * 1行insert
   * 
   * @param cat entity(Category)
   * @return insert行数
   */
  int saveOne(Category cat);

  /**
   * 全行update
   * 
   * @param cat entity(Category)
   * @return update行数
   */
  int updateAll(Category cat);

  /**
   * 1行update プライマルキーをWhere句に指定 プライマルキー：@Param("catCodeWhere")String catCode
   * 
   * @param cat     entity(Category)
   * @param catCode CAT_CODE(カテゴリーコード)
   * @return update行数
   */
  int updateOne(@Param("cat") Category cat, @Param("catCodeWhere") String catCode);

  /**
   * 全行delete
   * 
   * @return delete行数
   */
  int deleteAll();

  /**
   * 1行delete(引数にプライマルキーを指定)
   * 
   * @param catCode CAT_CODE(カテゴリーコード)
   * @return delete行数
   */
  int deleteOne(@Param("catCode") String catCode);

  /**
   * 全検索(画像テーブルと結合)
   * 
   * @return 検索結果(複数行)
   */
  List<Category> findAllJoinImage();
}
