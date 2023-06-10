package org.book.app.common.validation;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.springframework.web.multipart.MultipartFile;

/**
 * ファイルのサイズが許容サイズ内であることを検証するためのバリデーションの実装<br>
 * ファイルのサイズが、許容サイズ内であることを検証するための、実装を行うクラスを作成
 */
public class UploadFileMaxSizeValidator
    implements ConstraintValidator<UploadFileMaxSize, MultipartFile> {

  private UploadFileMaxSize constraint;

  @Override
  public void initialize(UploadFileMaxSize constraint) {
    this.constraint = constraint;
  }

  @Override
  public boolean isValid(MultipartFile multipartFile, ConstraintValidatorContext context) {
    if (constraint.value() < 0 || multipartFile == null) {
      return true;
    }
    return multipartFile.getSize() <= constraint.value();
  }

}
