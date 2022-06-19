package org.watanabe.app.study.service;

import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.watanabe.app.study.entity.Templatechartcolour;
import org.watanabe.app.study.mapper.TemplatechartcolourMapper;

/**
 * TEMPLATECHARTCOLOUR:チャートカラーマスタ(図の表示に使用するrgbaの組み合わせを管理するマスタ)のserviceクラス
 */
@Service
public class TemplatechartcolourService {

  @Autowired
  private TemplatechartcolourMapper templatechartcolourMapper;

  /**
   * 全検索
   * 
   * @return 検索結果(複数行)
   */
  public List<Templatechartcolour> findAll() {
    return templatechartcolourMapper.findAll();
  }

  /**
   * 1行検索(引数にプライマルキーを指定)
   * 
   * @param templateId TEMPLATE_ID(色の組み合わせID)
   * @return 検索結果(1行)
   */
  public Templatechartcolour findOne(String templateId) {
    return templatechartcolourMapper.findOne(templateId);
  }

  /**
   * 複数行insert
   * 
   * @param temList entity(Templatechartcolour)のList
   * @return insert行数
   */
  @Transactional
  public int saveBulk(List<Templatechartcolour> temList) {
    return templatechartcolourMapper.saveBulk(temList);
  }

  /**
   * 1行insert
   * 
   * @param tem entity(Templatechartcolour)
   * @return insert行数
   */
  @Transactional
  public int saveOne(Templatechartcolour tem) {
    return templatechartcolourMapper.saveOne(tem);
  }

  /**
   * 全行update
   * 
   * @param tem entity(Templatechartcolour)
   * @return update行数
   */
  @Transactional
  public int updateAll(Templatechartcolour tem) {
    return templatechartcolourMapper.updateAll(tem);
  }

  /**
   * 1行update プライマルキーをWhere句に指定 プライマルキー：String templateId
   * 
   * @param tem entity(Templatechartcolour)
   * @param templateId TEMPLATE_ID(色の組み合わせID)
   * @return update行数
   */
  @Transactional
  public int updateOne(Templatechartcolour tem, String templateId) {
    return templatechartcolourMapper.updateOne(tem, templateId);
  }

  /**
   * 全行delete
   * 
   * @return delete行数
   */
  @Transactional
  public int deleteAll() {
    return templatechartcolourMapper.deleteAll();
  }

  /**
   * 1行delete(引数にプライマルキーを指定)
   * 
   * @param templateId TEMPLATE_ID(色の組み合わせID)
   * @return delete行数
   */
  @Transactional
  public int deleteOne(String templateId) {
    return templatechartcolourMapper.deleteOne(templateId);
  }

  /**
   * ユーザーID検索
   * 
   * @param userId USER_ID
   * @return 検索結果(複数行)
   */
  public List<Templatechartcolour> findByUserId(String userId) {
    return templatechartcolourMapper.findByUserId(userId);
  }

  /**
   * ユーザーIDとアクティブ検索
   * 
   * @param userId USER_ID
   * @param active ACTIVE
   * @return 検索結果(複数行)
   */
  public List<Templatechartcolour> findByUserIdAndActive(String userId, String active) {
    return templatechartcolourMapper.findByUserIdAndActive(userId, active);
  }

  /**
   * 1行update active、templateNameを更新
   * 
   * @param active 更新値
   * @param templateName 更新値
   * @param templateId TEMPLATE_ID(色の組み合わせID)
   * @return update行数
   */
  @Transactional
  public int updateActiveAndNameById(String active, String templateName, Date updDate,
      String updUser, String templateId) {
    return templatechartcolourMapper.updateActiveAndNameById(active, templateName, updDate, updUser,
        templateId);
  }


}

