package org.book.app.common.validation;

import static java.lang.annotation.ElementType.*;
import static java.lang.annotation.RetentionPolicy.*;
import java.lang.annotation.Documented;
import java.lang.annotation.Repeatable;
import java.lang.annotation.Retention;
import java.lang.annotation.Target;
import jakarta.validation.Constraint;
import jakarta.validation.Payload;
import org.book.app.common.validation.UploadFileMediaType.List;

/**
 * ファイルの拡張子が供された拡張子であることを検証するためのバリデーションの実装<br>
 * ファイルの拡張子が供された拡張子であることを検証するための、アノテーションを作成
 */
@Target({ METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE })
@Retention(RUNTIME)
@Constraint(validatedBy = UploadFileMediaTypeValidator.class)
@Repeatable(List.class)
public @interface UploadFileMediaType {
  String message()

  default "{MediaTypeImage.message}";

  Class<?>[] groups() default {};

  Class<? extends Payload>[] payload() default {};

  /**
   * 指定する拡張子をカンマ区切りで指定
   */
  String exts() default "png";

  /**
   * メディアタイプをMediaType.IMAGE_PNG.toString()の値を指定する
   */
  String mediaTypes() default "image/png";

  @Target({ METHOD, FIELD, ANNOTATION_TYPE, CONSTRUCTOR, PARAMETER, TYPE_USE })
  @Retention(RUNTIME)
  @Documented
  @interface List {
    UploadFileMediaType[] value();
  }
}
