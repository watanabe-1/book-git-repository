package org.watanabe.app.study.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.watanabe.app.study.entity.Account;
import org.watanabe.app.study.mapper.AccountMapper;


/**
 * ACCOUNT:アカウント(アカウント情報保持テーブル)のserviceクラス
 */
@Service
public class AccountService {

  @Autowired
  private AccountMapper accountMapper;

  /**
   * 全検索
   * 
   * @return 検索結果(複数行)
   */
  public List<Account> findAll() {
    return accountMapper.findAll();
  }

  /**
   * 1行検索(引数にプライマルキーを指定)
   * 
   * @param userId USER_ID(ユーザーID)
   * @return 検索結果(1行)
   */
  public Account findOne(String userId) {
    return accountMapper.findOne(userId);
  }

  /**
   * 複数行insert
   * 
   * @param accList entity(Account)のList
   * @return insert行数
   */
  @Transactional
  public int saveBulk(List<Account> accList) {
    return accountMapper.saveBulk(accList);
  }

  /**
   * 1行insert
   * 
   * @param acc entity(Account)
   * @return insert行数
   */
  @Transactional
  public int saveOne(Account acc) {
    return accountMapper.saveOne(acc);
  }

  /**
   * 全行update
   * 
   * @param acc entity(Account)
   * @return update行数
   */
  @Transactional
  public int updateAll(Account acc) {
    return accountMapper.updateAll(acc);
  }

  /**
   * 1行update プライマルキーをWhere句に指定 プライマルキー：String userId
   * 
   * @param acc entity(Account)
   * @param userId USER_ID(ユーザーID)
   * @return update行数
   */
  @Transactional
  public int updateOne(Account acc, String userId) {
    return accountMapper.updateOne(acc, userId);
  }

  /**
   * 全行delete
   * 
   * @return delete行数
   */
  @Transactional
  public int deleteAll() {
    return accountMapper.deleteAll();
  }

  /**
   * 1行delete(引数にプライマルキーを指定)
   * 
   * @param userId USER_ID(ユーザーID)
   * @return delete行数
   */
  @Transactional
  public int deleteOne(String userId) {
    return accountMapper.deleteOne(userId);
  }

}

