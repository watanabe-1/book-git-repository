package org.book.app.study.service;

import java.util.List;

import org.book.app.study.entity.CodeLookup;
import org.book.app.study.mapper.CodeLookupMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

/**
 * CODE_LOOKUP:コードルックアップ(コード定義テーブル(明細))のserviceクラス
 */
@Service
@RequiredArgsConstructor
public class CodeLookupService {

  private final CodeLookupMapper codelookupMapper;

  /**
   * 全検索
   * 
   * @return 検索結果(複数行)
   */
  public List<CodeLookup> findAll() {
    return codelookupMapper.findAll();
  }

  /**
   * 1行検索(引数にプライマルキーを指定)
   * 
   * @param listName LIST_NAME(リストネーム)
   * @param code CODE(コード)
   * @return 検索結果(1行)
   */
  public CodeLookup findOne(String listName, String code) {
    return codelookupMapper.findOne(listName, code);
  }

  /**
   * 複数行insert
   * 
   * @param codList entity(CodeLookup)のList
   * @return insert行数
   */
  @Transactional
  public int saveBulk(List<CodeLookup> codList) {
    return codelookupMapper.saveBulk(codList);
  }

  /**
   * 1行insert
   * 
   * @param cod entity(CodeLookup)
   * @return insert行数
   */
  @Transactional
  public int saveOne(CodeLookup cod) {
    return codelookupMapper.saveOne(cod);
  }

  /**
   * 全行update
   * 
   * @param cod entity(CodeLookup)
   * @return update行数
   */
  @Transactional
  public int updateAll(CodeLookup cod) {
    return codelookupMapper.updateAll(cod);
  }

  /**
   * 1行update プライマルキーをWhere句に指定 プライマルキー：String listName, String code
   * 
   * @param cod entity(CodeLookup)
   * @param listName LIST_NAME(リストネーム)
   * @param code CODE(コード)
   * @return update行数
   */
  @Transactional
  public int updateOne(CodeLookup cod, String listName, String code) {
    return codelookupMapper.updateOne(cod, listName, code);
  }

  /**
   * 全行delete
   * 
   * @return delete行数
   */
  @Transactional
  public int deleteAll() {
    return codelookupMapper.deleteAll();
  }

  /**
   * 1行delete(引数にプライマルキーを指定)
   * 
   * @param listName LIST_NAME(リストネーム)
   * @param code CODE(コード)
   * @return delete行数
   */
  @Transactional
  public int deleteOne(String listName, String code) {
    return codelookupMapper.deleteOne(listName, code);
  }

  /**
   * リストネーム検索
   * 
   * @param listName LIST_NAME(リストネーム)
   * @return 検索結果(複数行)
   */
  public List<CodeLookup> findByListName(String listName) {
    return codelookupMapper.findByListName(listName);
  }

}
