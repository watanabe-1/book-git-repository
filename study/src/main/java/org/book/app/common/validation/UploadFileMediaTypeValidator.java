package org.book.app.common.validation;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;
import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;
import org.apache.commons.io.FilenameUtils;
import org.springframework.http.MediaType;
import org.springframework.web.multipart.MultipartFile;

/**
 * ファイルの拡張子が供された拡張子であることを検証するためのバリデーションの実装<br>
 * ファイルの拡張子が供された拡張子であることを検証するための、実装を行うクラスを作成
 */
public class UploadFileMediaTypeValidator
    implements ConstraintValidator<UploadFileMediaType, MultipartFile> {

  /**
   * 指定する拡張子をカンマ区切りで指定
   */
  private String exts;

  /**
   * メディアタイプをMediaType.IMAGE_PNG.toString()の値を指定する
   */
  private String mediaTypes;

  @Override
  public void initialize(UploadFileMediaType constraint) {
    exts = constraint.exts();
    mediaTypes = constraint.mediaTypes();
  }

  @Override
  public boolean isValid(MultipartFile multipartFile, ConstraintValidatorContext context) {
    // Emptyなら通す。他のバリデーターで検証する
    if (multipartFile == null || multipartFile.isEmpty()) {
      return true;
    }
    // メディアタイプ
    MediaType mediaType = MediaType.parseMediaType(multipartFile.getContentType());
    // 拡張子
    String ext = FilenameUtils.getExtension(multipartFile.getOriginalFilename());

    // 引数に指定されたメディアタイプをリストに変換
    List<MediaType> mediaTypeList = new ArrayList<>();
    for (String mt : mediaTypes.split(",")) {
      mediaTypeList.add(MediaType.parseMediaType(mt));
    }
    // 引数に指定された拡張子をリストに変換
    List<String> extList = Arrays.asList(exts.split(","));
    // メディアタイプと拡張子をチェック
    return mediaTypeList.stream().anyMatch((mType) -> mediaType.includes(mType))
        && extList.stream().anyMatch((v) -> Objects.equals(ext.toLowerCase(), v));
  }

}
