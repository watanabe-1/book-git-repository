package org.book.app.common.validation;

import static java.lang.annotation.ElementType.*;
import static java.lang.annotation.RetentionPolicy.*;
import java.lang.annotation.Documented;
import java.lang.annotation.Repeatable;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import org.book.app.common.validation.UploadFileNotEmpty.List;

/**
 * ファイルが空でないことを検証するためのバリデーションの実装<br>
 * ファイルが、空でないことを検証するための、アノテーションを作成
 */
@Target({METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE})
@Retention(RUNTIME)
@Constraint(validatedBy = UploadFileNotEmptyValidator.class)
@Repeatable(List.class)
public @interface UploadFileNotEmpty {
  String message() default "{UploadFileNotEmpty.message}";

  Class<?>[] groups() default {};

  Class<? extends Payload>[] payload() default {};

  @Target({METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE})
  @Retention(RUNTIME)
  @Documented
  @interface List {
    UploadFileNotEmpty[] value();
  }

}
