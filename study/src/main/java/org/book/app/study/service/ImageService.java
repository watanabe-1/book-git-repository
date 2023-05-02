package org.book.app.study.service;

import java.util.List;
import org.book.app.study.entity.Image;
import org.book.app.study.mapper.ImageMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import lombok.RequiredArgsConstructor;

/**
 * IMAGE:画像パス(画像パス保存テーブル)のserviceクラス
 */
@Service
@RequiredArgsConstructor
public class ImageService {

  private final ImageMapper imageMapper;

  /**
   * 全検索
   * 
   * @return 検索結果(複数行)
   */
  public List<Image> findAll() {
    return imageMapper.findAll();
  }

  /**
   * 1行検索(引数にプライマルキーを指定)
   * 
   * @param imgId IMG_ID(画像ID)
   * @return 検索結果(1行)
   */
  public Image findOne(String imgId) {
    return imageMapper.findOne(imgId);
  }

  /**
   * 複数行insert
   * 
   * @param imaList entity(Image)のList
   * @return insert行数
   */
  @Transactional
  public int saveBulk(List<Image> imaList) {
    return imageMapper.saveBulk(imaList);
  }

  /**
   * 1行insert
   * 
   * @param ima entity(Image)
   * @return insert行数
   */
  @Transactional
  public int saveOne(Image ima) {
    return imageMapper.saveOne(ima);
  }

  /**
   * 全行update
   * 
   * @param ima entity(Image)
   * @return update行数
   */
  @Transactional
  public int updateAll(Image ima) {
    return imageMapper.updateAll(ima);
  }

  /**
   * 1行update プライマルキーをWhere句に指定 プライマルキー：String imgId
   * 
   * @param ima entity(Image)
   * @param imgId IMG_ID(画像ID)
   * @return update行数
   */
  @Transactional
  public int updateOne(Image ima, String imgId) {
    return imageMapper.updateOne(ima, imgId);
  }

  /**
   * 全行delete
   * 
   * @return delete行数
   */
  @Transactional
  public int deleteAll() {
    return imageMapper.deleteAll();
  }

  /**
   * 1行delete(引数にプライマルキーを指定)
   * 
   * @param imgId IMG_ID(画像ID)
   * @return delete行数
   */
  @Transactional
  public int deleteOne(String imgId) {
    return imageMapper.deleteOne(imgId);
  }
}
