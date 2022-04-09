package org.watanabe.app.study.service;

import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.watanabe.app.study.entity.Category;
import org.watanabe.app.study.form.CategoryForm;
import org.watanabe.app.study.mapper.CategoryMapper;

@Service
public class CategoryService2 {

  @Autowired
  private CategoryMapper CategoryMapper;

  public List<Category> findAll() {
    return CategoryMapper.findAll();
  }

  public Category findAll(String catCode) {
    return CategoryMapper.findOne(catCode);
  }

  @Transactional
  public void save(CategoryForm catForm) {
    Category cat = new Category();

    // 現在日時取得
    // Date now = new Date();

    // チェックボックス
    // String checkBoxStr = null;
    // String delim = ",";

    /*
     * //チェックボックスで選択した内容を連結 for (String str: catForm.getCategoryCheckBox()){ checkBoxStr += str +
     * delim; } checkBoxStr = checkBoxStr.substring(0, checkBoxStr.length()-1);
     * 
     * //画面入力情報を取得 cat.setCatCode(catForm.getCategoryCode());
     * cat.setCatName(catForm.getCategoryName()); cat.setCatType(catForm.getcategoryRadio());
     * cat.setNote(checkBoxStr); cat.setInsUser(catForm.getSelectedCategory()); cat.setInsDate(now);
     * cat.setUpdUser(catForm.getSelectedCategory()); cat.setUpdDate(now);
     */
    // insert処理実行
    CategoryMapper.save(cat);
  }

  @Transactional
  public void update(Category cat) {
    CategoryMapper.update(cat);
  }

  @Transactional
  public void delete(Category cat) {
    CategoryMapper.delete(cat);
  }
}
