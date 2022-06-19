package org.watanabe.app.common.validation;

import static java.lang.annotation.ElementType.*;
import static java.lang.annotation.RetentionPolicy.*;
import java.lang.annotation.Documented;
import java.lang.annotation.Repeatable;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;
import javax.validation.Constraint;
import javax.validation.Payload;
import org.watanabe.app.common.validation.UploadFileRequired.List;

/**
 * ファイルが選択されていることを検証するためのバリデーションの実装<br>
 * ファイルが、選択されていることを検証するための、アノテーションを作成
 */
@Target({METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE})
@Retention(RUNTIME)
@Constraint(validatedBy = UploadFileRequiredValidator.class)
@Repeatable(List.class)
public @interface UploadFileRequired {
  String message() default "{org.watanabe.app.common.validation.UploadFileRequired.message}";

  Class<?>[] groups() default {};

  Class<? extends Payload>[] payload() default {};

  @Target({METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE})
  @Retention(RUNTIME)
  @Documented
  @interface List {
    UploadFileRequired[] value();
  }

}
