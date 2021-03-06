package org.watanabe.app.study.mapper;

import java.util.Date;
import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.watanabe.app.study.entity.Templatechartcolour;


/**
 * TEMPLATECHARTCOLOUR:チャートカラーマスタ(図の表示に使用するrgbaの組み合わせを管理するマスタ)のmapperクラス
 */
@Mapper
public interface TemplatechartcolourMapper {

  /**
   * 全検索
   * 
   * @return 検索結果(複数行)
   */
  List<Templatechartcolour> findAll();

  /**
   * 1行検索(引数にプライマルキーを指定)
   * 
   * @param templateId TEMPLATE_ID(色の組み合わせID)
   * @return 検索結果(1行)
   */
  Templatechartcolour findOne(@Param("templateId") String templateId);

  /**
   * 複数行insert
   * 
   * @param temList entity(Templatechartcolour)のList
   * @return insert行数
   */
  int saveBulk(@Param("temList") List<Templatechartcolour> temList);

  /**
   * 1行insert
   * 
   * @param tem entity(Templatechartcolour)
   * @return insert行数
   */
  int saveOne(Templatechartcolour tem);

  /**
   * 全行update
   * 
   * @param tem entity(Templatechartcolour)
   * @return update行数
   */
  int updateAll(Templatechartcolour tem);

  /**
   * 1行update プライマルキーをWhere句に指定 プライマルキー：@Param("templateIdWhere")String templateId
   * 
   * @param tem entity(Templatechartcolour)
   * @param templateId TEMPLATE_ID(色の組み合わせID)
   * @return update行数
   */
  int updateOne(@Param("tem") Templatechartcolour tem, @Param("templateIdWhere") String templateId);

  /**
   * 全行delete
   * 
   * @return delete行数
   */
  int deleteAll();

  /**
   * 1行delete(引数にプライマルキーを指定)
   * 
   * @param templateId TEMPLATE_ID(色の組み合わせID)
   * @return delete行数
   */
  int deleteOne(@Param("templateId") String templateId);

  /**
   * ユーザーID検索
   * 
   * @param userId USER_ID
   * @return 検索結果(複数行)
   */
  List<Templatechartcolour> findByUserId(@Param("userId") String userId);

  /**
   * ユーザーIDとアクティブ検索
   * 
   * @param userId USER_ID
   * @param active ACTIVE
   * @return 検索結果(複数行)
   */
  List<Templatechartcolour> findByUserIdAndActive(@Param("userId") String userId,
      @Param("active") String active);

  /**
   * 1行update activeを更新
   * 
   * @param active 更新値
   * @param templateId TEMPLATE_ID(色の組み合わせID)
   * @return update行数
   */
  int updateActiveAndNameById(@Param("active") String active,
      @Param("templateName") String templateName, @Param("updDate") Date updDate,
      @Param("updUser") String updUser, @Param("templateIdWhere") String templateId);

}

