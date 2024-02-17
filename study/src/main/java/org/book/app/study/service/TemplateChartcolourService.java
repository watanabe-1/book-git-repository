package org.book.app.study.service;

import java.time.LocalDateTime;
import java.util.List;

import org.book.app.study.entity.TemplateChartcolour;
import org.book.app.study.mapper.TemplateChartcolourMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

/**
 * TEMPLATE_CHARTCOLOUR:チャートカラーマスタ(図の表示に使用するrgbaの組み合わせを管理するマスタ)のserviceクラス
 */
@Service
@RequiredArgsConstructor
public class TemplateChartcolourService {

  private final TemplateChartcolourMapper templateChartcolourMapper;

  /**
   * 全検索
   * 
   * @return 検索結果(複数行)
   */
  public List<TemplateChartcolour> findAll() {
    return templateChartcolourMapper.findAll();
  }

  /**
   * 1行検索(引数にプライマルキーを指定)
   * 
   * @param templateId TEMPLATE_ID(色の組み合わせID)
   * @return 検索結果(1行)
   */
  public TemplateChartcolour findOne(String templateId) {
    return templateChartcolourMapper.findOne(templateId);
  }

  /**
   * 複数行insert
   * 
   * @param temList entity(TemplateChartcolour)のList
   * @return insert行数
   */
  @Transactional
  public int saveBulk(List<TemplateChartcolour> temList) {
    return templateChartcolourMapper.saveBulk(temList);
  }

  /**
   * 1行insert
   * 
   * @param tem entity(Template)
   * @return insert行数
   */
  @Transactional
  public int saveOne(TemplateChartcolour tem) {
    return templateChartcolourMapper.saveOne(tem);
  }

  /**
   * 全行update
   * 
   * @param tem entity(TemplateChartcolour)
   * @return update行数
   */
  @Transactional
  public int updateAll(TemplateChartcolour tem) {
    return templateChartcolourMapper.updateAll(tem);
  }

  /**
   * 1行update プライマルキーをWhere句に指定 プライマルキー：String templateId
   * 
   * @param tem entity(TemplateChartcolour)
   * @param templateId TEMPLATE_ID(色の組み合わせID)
   * @return update行数
   */
  @Transactional
  public int updateOne(TemplateChartcolour tem, String templateId) {
    return templateChartcolourMapper.updateOne(tem, templateId);
  }

  /**
   * 全行delete
   * 
   * @return delete行数
   */
  @Transactional
  public int deleteAll() {
    return templateChartcolourMapper.deleteAll();
  }

  /**
   * 1行delete(引数にプライマルキーを指定)
   * 
   * @param templateId TEMPLATE_ID(色の組み合わせID)
   * @return delete行数
   */
  @Transactional
  public int deleteOne(String templateId) {
    return templateChartcolourMapper.deleteOne(templateId);
  }

  /**
   * ユーザーID検索
   * 
   * @param userId USER_ID
   * @return 検索結果(複数行)
   */
  public List<TemplateChartcolour> findByUserId(String userId) {
    return templateChartcolourMapper.findByUserId(userId);
  }

  /**
   * ユーザーIDとアクティブ検索
   * 
   * @param userId USER_ID
   * @param active ACTIVE
   * @return 検索結果(複数行)
   */
  public List<TemplateChartcolour> findByUserIdAndActive(String userId, String active) {
    return templateChartcolourMapper.findByUserIdAndActive(userId, active);
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
  public int updateActiveAndNameById(String active, String templateName, LocalDateTime updDate,
      String updUser, String templateId) {
    return templateChartcolourMapper.updateActiveAndNameById(active, templateName, updDate, updUser,
        templateId);
  }

}
