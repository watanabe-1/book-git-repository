package org.book.app.study.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.book.app.study.entity.Codelkup;
import org.book.app.study.mapper.CodelkupMapper;

/**
 * CODELKUP:コードルックアップ(コード定義テーブル(明細))のserviceクラス
 */
@Service
public class CodelkupService {

  @Autowired
  private CodelkupMapper codelkupMapper;

  /**
   * 全検索
   * 
   * @return 検索結果(複数行)
   */
  public List<Codelkup> findAll() {
    return codelkupMapper.findAll();
  }

  /**
   * 1行検索(引数にプライマルキーを指定)
   * 
   * @param listName LIST_NAME(リストネーム)
   * @param code     CODE(コード)
   * @return 検索結果(1行)
   */
  public Codelkup findOne(String listName, String code) {
    return codelkupMapper.findOne(listName, code);
  }

  /**
   * 複数行insert
   * 
   * @param codList entity(Codelkup)のList
   * @return insert行数
   */
  @Transactional
  public int saveBulk(List<Codelkup> codList) {
    return codelkupMapper.saveBulk(codList);
  }

  /**
   * 1行insert
   * 
   * @param cod entity(Codelkup)
   * @return insert行数
   */
  @Transactional
  public int saveOne(Codelkup cod) {
    return codelkupMapper.saveOne(cod);
  }

  /**
   * 全行update
   * 
   * @param cod entity(Codelkup)
   * @return update行数
   */
  @Transactional
  public int updateAll(Codelkup cod) {
    return codelkupMapper.updateAll(cod);
  }

  /**
   * 1行update プライマルキーをWhere句に指定 プライマルキー：String listName, String code
   * 
   * @param cod entity(Codelkup)
   * @return update行数
   */
  @Transactional
  public int updateOne(Codelkup cod, String listName, String code) {
    return codelkupMapper.updateOne(cod, listName, code);
  }

  /**
   * 全行delete
   * 
   * @return delete行数
   */
  @Transactional
  public int deleteAll() {
    return codelkupMapper.deleteAll();
  }

  /**
   * 1行delete(引数にプライマルキーを指定)
   * 
   * @param listName LIST_NAME(リストネーム)
   * @param code     CODE(コード)
   * @return delete行数
   */
  @Transactional
  public int deleteOne(String listName, String code) {
    return codelkupMapper.deleteOne(listName, code);
  }

}
