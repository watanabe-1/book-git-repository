package org.book.app.study.service;

import java.util.List;

import org.book.app.study.entity.CodeList;
import org.book.app.study.mapper.CodeListMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

/**
 * CODE_LIST:コードリスト(コード定義テーブル(ヘッダー))のserviceクラス
 */
@Service
@RequiredArgsConstructor
public class CodeListService {

  private final CodeListMapper codelistMapper;

  /**
   * 全検索
   * @return 検索結果(複数行)
   */
  public List<CodeList> findAll() {
    return codelistMapper.findAll();
  }

  /**
   * 1行検索(引数にプライマルキーを指定)
   * @param listName LIST_NAME(リストネーム)
   * @return 検索結果(1行)
   */
  public CodeList findOne(String listName) {
    return codelistMapper.findOne(listName);
  }

  /**
   * 複数行insert
   * @param codList entity(CodeList)のList
   * @return insert行数
   */
  @Transactional
  public int saveBulk(List<CodeList> codList) {
    return codelistMapper.saveBulk(codList);
  }

  /**
   * 1行insert
   * @param cod entity(CodeList)
   * @return insert行数
   */
  @Transactional
  public int saveOne(CodeList cod) {
    return codelistMapper.saveOne(cod);
  }

  /**
   * 全行update
   * @param cod entity(CodeList)
   * @return update行数
   */
  @Transactional
  public int updateAll(CodeList cod) {
    return codelistMapper.updateAll(cod);
  }

  /**
   * 1行update
   * プライマルキーをWhere句に指定
   * プライマルキー：String listName
   * @param cod entity(CodeList)
   * @param listName LIST_NAME(リストネーム)
   * @return update行数
   */
  @Transactional
  public int updateOne(CodeList cod, String listName) {
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
