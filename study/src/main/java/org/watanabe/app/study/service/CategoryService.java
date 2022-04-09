package org.watanabe.app.study.service;

import java.util.Date;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.watanabe.app.study.entity.Category;
import org.watanabe.app.study.form.CategoryForm;
import org.watanabe.app.study.mapper.CategoryMapper;
import org.watanabe.app.study.util.StudyUtil;

@Service
public class CategoryService {

  @Autowired
  private CategoryMapper categoryMapper;

  public List<Category> findAll() {
    return categoryMapper.findAll();
  }

  public Category findOne(String catCode) {
    return categoryMapper.findOne(catCode);
  }

  @Transactional
  public void save(CategoryForm catForm) {

    /*
     * ResultMessages messages = ResultMessages.error(); // (2)
     * messages.add("e.ab.cd.3001","replace_value_3"); // (3) throw new BusinessException(messages);
     */
    Category cat = new Category();

    // 現在日時取得
    Date now = StudyUtil.getNowDate();

    // ログインユーザー取得
    String user = StudyUtil.getLoginUser();

    // 画面入力情報を取得
    cat.setCatCode(catForm.getCatCode());
    cat.setCatName(catForm.getCatName());
    cat.setNote(catForm.getNote());
    cat.setImgId(catForm.getImgId());
    cat.setImgType(catForm.getImgType());
    cat.setCatType(catForm.getCatType());
    cat.setActive(catForm.getActive());
    cat.setInsUser(user);
    cat.setInsDate(now);
    cat.setUpdUser(user);
    cat.setUpdDate(now);

    // insert処理実行
    categoryMapper.save(cat);
  }

  @Transactional
  public void update(Category cat) {
    categoryMapper.update(cat);
  }

  @Transactional
  public void delete(Category cat) {
    categoryMapper.delete(cat);
  }

  public List<Category> findAlljoinImage() {
    return categoryMapper.findAllJoinImage();
  }
}
