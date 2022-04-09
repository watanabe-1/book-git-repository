package org.watanabe.app.study.mapper;


import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.watanabe.app.study.entity.Image;

@Mapper
public interface ImageMapper {

	List<Image> findAll();

	Image findOne(String imgId);

	void save(Image img);

	void update(Image img);

	void delete(Image img);
}