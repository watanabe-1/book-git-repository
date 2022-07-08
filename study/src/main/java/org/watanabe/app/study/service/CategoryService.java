package org.watanabe.app.study.service;

import java.util.Date;
import java.util.List;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.watanabe.app.study.dto.CategoryList;
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
    // insert処理実行
    categoryMapper.save(setCategory(catForm));
  }

  @Transactional
  public void update(CategoryForm catForm) {
    categoryMapper.update(setCategory(catForm));
  }

  @Transactional
  public void delete(CategoryForm catForm) {
    categoryMapper.delete(setCategory(catForm));
  }

  public CategoryList findAlljoinImage() {
    CategoryList catDatalist = new CategoryList();

    // カテゴリー情報を取得しformに変換しセット
    catDatalist.setCatDataList(categoryMapper.findAllJoinImage().stream().map(cat -> {
      CategoryForm data = new CategoryForm();
      // 同名のフィールドにセット 引数1から2へ
      BeanUtils.copyProperties(cat, data);
      return data;
    }).toList());

    return catDatalist;
  }

  private Category setCategory(CategoryForm catForm) {
    Category cat = new Category();

    // 現在日時取得
    Date now = StudyUtil.getNowDate();

    // ログインユーザー取得
    String user = StudyUtil.getLoginUser();

    // 画面入力情報を取得
    cat.setCatCode(catForm.getCatCode());
    cat.setCatName(catForm.getCatName());
    cat.setNote(catForm.getNote());
    if (catForm.getImgId() == null) {
      cat.setImgId(catForm.getImgIds().getImgId());
    } else {
      cat.setImgId(catForm.getImgId());
    }
    cat.setImgType(catForm.getImgType());
    cat.setCatType(catForm.getCatType());
    cat.setActive(catForm.getActive());
    if (catForm.getInsUser() == null) {
      cat.setInsUser(user);
      cat.setInsDate(now);
    } else {
      cat.setInsUser(catForm.getInsUser());
      cat.setInsDate(catForm.getInsDate());
    }
    cat.setUpdUser(user);
    cat.setUpdDate(now);

    return cat;
  }
}
