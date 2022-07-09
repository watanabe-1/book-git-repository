package org.watanabe.app.study.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.watanabe.app.study.entity.Image;


/**
 * IMAGE:画像パス(画像パス保存テーブル)のmapperクラス
 */
@Mapper
public interface ImageMapper {

  /**
   * 全検索
   * 
   * @return 検索結果(複数行)
   */
  List<Image> findAll();

  /**
   * 1行検索(引数にプライマルキーを指定)
   * 
   * @param imgId IMG_ID(画像ID)
   * @return 検索結果(1行)
   */
  Image findOne(@Param("imgId") String imgId);

  /**
   * 複数行insert
   * 
   * @param imaList entity(Image)のList
   * @return insert行数
   */
  int saveBulk(@Param("imaList") List<Image> imaList);

  /**
   * 1行insert
   * 
   * @param ima entity(Image)
   * @return insert行数
   */
  int saveOne(Image ima);

  /**
   * 全行update
   * 
   * @param ima entity(Image)
   * @return update行数
   */
  int updateAll(Image ima);

  /**
   * 1行update プライマルキーをWhere句に指定 プライマルキー：@Param("imgIdWhere")String imgId
   * 
   * @param ima entity(Image)
   * @param imgId IMG_ID(画像ID)
   * @return update行数
   */
  int updateOne(@Param("ima") Image ima, @Param("imgIdWhere") String imgId);

  /**
   * 全行delete
   * 
   * @return delete行数
   */
  int deleteAll();

  /**
   * 1行delete(引数にプライマルキーを指定)
   * 
   * @param imgId IMG_ID(画像ID)
   * @return delete行数
   */
  int deleteOne(@Param("imgId") String imgId);

}
