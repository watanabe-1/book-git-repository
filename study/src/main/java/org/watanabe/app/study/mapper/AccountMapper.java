package org.watanabe.app.study.mapper;

import java.util.List;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.watanabe.app.study.entity.Account;


/**
 * ACCOUNT:アカウント(アカウント情報保持テーブル)のmapperクラス
 */
@Mapper
public interface AccountMapper {

  /**
   * 全検索
   * 
   * @return 検索結果(複数行)
   */
  List<Account> findAll();

  /**
   * 1行検索(引数にプライマルキーを指定)
   * 
   * @param userId USER_ID(ユーザーID)
   * @return 検索結果(1行)
   */
  Account findOne(@Param("userId") String userId);

  /**
   * 複数行insert
   * 
   * @param accList entity(Account)のList
   * @return insert行数
   */
  int saveBulk(@Param("accList") List<Account> accList);

  /**
   * 1行insert
   * 
   * @param acc entity(Account)
   * @return insert行数
   */
  int saveOne(Account acc);

  /**
   * 全行update
   * 
   * @param acc entity(Account)
   * @return update行数
   */
  int updateAll(Account acc);

  /**
   * 1行update プライマルキーをWhere句に指定 プライマルキー：@Param("userIdWhere")String userId
   * 
   * @param acc entity(Account)
   * @param userId USER_ID(ユーザーID)
   * @return update行数
   */
  int updateOne(Account acc, @Param("userIdWhere") String userId);

  /**
   * 全行delete
   * 
   * @return delete行数
   */
  int deleteAll();

  /**
   * 1行delete(引数にプライマルキーを指定)
   * 
   * @param userId USER_ID(ユーザーID)
   * @return delete行数
   */
  int deleteOne(@Param("userId") String userId);

}

