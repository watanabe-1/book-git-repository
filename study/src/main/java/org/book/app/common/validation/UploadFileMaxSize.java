package org.book.app.common.validation;

import static java.lang.annotation.ElementType.*;
import static java.lang.annotation.RetentionPolicy.*;
import java.lang.annotation.Documented;
import java.lang.annotation.Repeatable;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;
import javax.validation.Constraint;
import javax.validation.Payload;
import org.book.app.common.validation.UploadFileMaxSize.List;

/**
 * ファイルのサイズが許容サイズ内であることを検証するためのバリデーションの実装<br>
 * ファイルのサイズが、許容サイズ内であることを検証するための、アノテーションを作成
 */
@Target({METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE})
@Retention(RUNTIME)
@Constraint(validatedBy = UploadFileMaxSizeValidator.class)
@Repeatable(List.class)
public @interface UploadFileMaxSize {
  String message() default "{UploadFileMaxSize.message}";

  long value() default (1024 * 1024);

  Class<?>[] groups() default {};

  Class<? extends Payload>[] payload() default {};

  @Target({METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE})
  @Retention(RUNTIME)
  @Documented
  @interface List {
    UploadFileMaxSize[] value();
  }

}
