package org.watanabe.app.study.service;

import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.watanabe.app.study.entity.Image;
import org.watanabe.app.study.form.ImageForm;
import org.watanabe.app.study.mapper.ImageMapper;
import org.watanabe.app.study.util.StudyUtil;

@Service
public class ImageService {

  @Autowired
  private ImageMapper imageMapper;

  public List<Image> findAll() {
    return imageMapper.findAll();
  }

  public Image findOne(String imgCode) {
    return imageMapper.findOne(imgCode);
  }

  @Transactional
  public void save(ImageForm imgForm) {
    Image img = new Image();

    // 現在日時取得
    Date now = StudyUtil.getNowDate();

    // ログインユーザー取得
    String user = StudyUtil.getLoginUser();

    // 画面入力情報を取得
    img.setImgId(imgForm.getImgId());
    img.setImgName(imgForm.getImgName());
    img.setImgPath(imgForm.getImgPath());
    img.setImgType(imgForm.getImgType());
    img.setNote(imgForm.getNote());
    img.setInsUser(user);
    img.setInsDate(now);
    img.setUpdUser(user);
    img.setUpdDate(now);

    // insert処理実行
    imageMapper.save(img);
  }

  @Transactional
  public void update(Image img) {
    imageMapper.update(img);
  }

  @Transactional
  public void delete(Image img) {
    imageMapper.delete(img);
  }
}
