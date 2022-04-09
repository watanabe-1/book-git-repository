package org.watanabe.app.study.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.watanabe.app.study.entity.Category;

@Mapper
public interface CategoryMapper {

	List<Category> findAll();

	Category findOne(String catCode);

	void save(Category cat);

	void update(Category cat);

	void delete(Category cat);
	
	List<Category> findAllJoinImage();
}