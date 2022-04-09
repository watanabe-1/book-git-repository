package org.watanabe.app.study.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.watanabe.app.study.entity.Codelist;
import org.watanabe.app.study.mapper.CodelistMapper;


/**
 * CODELIST:コードリスト(コード定義テーブル(ヘッダー))のserviceクラス
 */
@Service
public class CodelistService {

  @Autowired
  private CodelistMapper codelistMapper;

  /**
   * 全検索
   * @return 検索結果(複数行)
   */
  public List<Codelist> findAll() {
    return codelistMapper.findAll();
  }

  /**
   * 1行検索(引数にプライマルキーを指定)
   * @param listName LIST_NAME(リストネーム)
   * @return 検索結果(1行)
   */
  public Codelist findOne(String listName) {
    return codelistMapper.findOne(listName);
  }

  /**
   * 複数行insert
   * @param codList entity(Codelist)のList
   * @return insert行数
   */
  @Transactional
  public int saveBulk(List<Codelist> codList) {
    return codelistMapper.saveBulk(codList);
  }

  /**
   * 1行insert
   * @param cod entity(Codelist)
   * @return insert行数
   */
  @Transactional
  public int saveOne(Codelist cod) {
    return codelistMapper.saveOne(cod);
  }

  /**
   * 全行update
   * @param cod entity(Codelist)
   * @return update行数
   */
  @Transactional
  public int updateAll(Codelist cod) {
    return codelistMapper.updateAll(cod);
  }

  /**
   * 1行update
   * プライマルキーをWhere句に指定
   * プライマルキー：String listName
   * @param cod entity(Codelist)
   * @return update行数
   */
  @Transactional
  public int updateOne(Codelist cod, String listName) {
    return codelistMapper.updateOne(cod, listName);
  }

  /**
   * 全行delete
   * @return delete行数
   */
  @Transactional
  public int deleteAll() {
    return codelistMapper.deleteAll();
  }

  /**
   * 1行delete(引数にプライマルキーを指定)
   * @param listName LIST_NAME(リストネーム)
   * @return delete行数
   */
  @Transactional
  public int deleteOne(String listName) {
    return codelistMapper.deleteOne(listName);
  }

}

