package org.book.app.study.helper;

import java.util.List;

import org.book.app.study.entity.Image;
import org.book.app.study.form.ImageForm;
import org.book.app.study.util.StudyBeanUtil;
import org.springframework.lang.NonNull;
import org.springframework.stereotype.Component;

import lombok.RequiredArgsConstructor;

/**
 * 画像に関する処理を行うためのHelperクラスを作成
 */
@Component
@RequiredArgsConstructor
public class ImageHelper {

  /**
   * ImageListからImageFormListに変換
   * 
   * @param target 変換対象
   * @return ImageFormList
   */
  public List<ImageForm> imageListToImageFormList(@NonNull List<Image> target) {
    return StudyBeanUtil.createInstanceFromBeanList(target, ImageForm.class,
        img -> imageToImageForm(img == null ? new Image() : img));
  }

  /**
   * ImageからImageFormに変換
   * 
   * @param target 変換対象
   * @return ImageForm
   */
  public ImageForm imageToImageForm(@NonNull Image target) {
    return StudyBeanUtil.createInstanceFromBean(target, ImageForm.class);
  }
}
