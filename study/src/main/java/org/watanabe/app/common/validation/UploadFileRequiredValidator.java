package org.watanabe.app.common.validation;

import javax.validation.ConstraintValidator;
import javax.validation.ConstraintValidatorContext;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

/**
 * ファイルが選択されていることを検証するためのバリデーションの実装<br>
 * ファイルが、選択されていることを検証するための、実装を行うクラスを作成
 */
public class UploadFileRequiredValidator
    implements ConstraintValidator<UploadFileRequired, MultipartFile> {

  @Override
  public void initialize(UploadFileRequired constraint) {}

  @Override
  public boolean isValid(MultipartFile multipartFile, ConstraintValidatorContext context) {
    return multipartFile != null && StringUtils.hasLength(multipartFile.getOriginalFilename());
  }

}
