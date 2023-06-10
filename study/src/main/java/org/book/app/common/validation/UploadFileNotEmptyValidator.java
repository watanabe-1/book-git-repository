package org.book.app.common.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

/**
 * ファイルが空でないことを検証するためのバリデーションの実装<br>
 * ファイルが、空でないことを検証するための、実装を行うクラスを作成
 */
public class UploadFileNotEmptyValidator
    implements ConstraintValidator<UploadFileNotEmpty, MultipartFile> {

  @Override
  public void initialize(UploadFileNotEmpty constraint) {
  }

  @Override
  public boolean isValid(MultipartFile multipartFile, ConstraintValidatorContext context) {
    if (multipartFile == null || !StringUtils.hasLength(multipartFile.getOriginalFilename())) {
      return true;
    }
    return !multipartFile.isEmpty();
  }

}
