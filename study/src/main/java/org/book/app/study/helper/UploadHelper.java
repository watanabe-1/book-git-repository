package org.book.app.study.helper;

import java.io.File;
import java.io.IOException;
import java.util.Base64;
import java.util.UUID;

import org.apache.commons.io.FileUtils;
import org.book.app.common.exception.BusinessException;
import org.book.app.study.dto.dir.Dir;
import org.book.app.study.entity.Image;
import org.book.app.study.form.CategoryForm;
import org.book.app.study.service.ImageService;
import org.book.app.study.util.StudyBeanUtil;
import org.book.app.study.util.StudyStringUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

/**
 * アップロードを行うためのHelperクラスを作成
 */
@Component
@RequiredArgsConstructor
public class UploadHelper {

  /**
   * プロパティファイルから読み取り 一時ファイル保管ディレクトリ
   */
  @Value("${app.upload.temporaryDirectoryPath}")
  private File uploadTmpDir;

  /**
   * 本ファイル保管ディレクトリ
   */
  @Value("${app.upload.imagesBaseDirectoryPath}")
  private File uploadImgDefDir;

  /**
   * 本ファイル保管ディレクトリパス
   */
  @Value("${app.upload.imagesBaseDirectoryPath}")
  private String uploadImgDefDirPath;

  /**
   * icon保管ディレクトリパス
   */
  @Value("${app.upload.iconDirectoryPath}")
  private String uploadIconDirPath;

  /**
   * 画像情報 Service
   */
  private final ImageService imageService;

  /**
   * 起動ディレクトリ情報
   */
  private final Dir fileDir;

  /**
   * ファイルを一時ファイルとして保存
   * 
   * @param MultipartFile アップロードされたデータ
   * @return 一時ファイル
   */
  public File saveTemporaryFile(MultipartFile multipartFile) {
    // 画像IDの発番
    String uploadTmpFileId = UUID.randomUUID().toString();
    File uploadTemporaryFile = getFileDir(uploadTmpDir, uploadTmpFileId);

    // アップロードしたファイルを一時ファイルとして保存
    try {
      FileUtils.copyInputStreamToFile(multipartFile.getInputStream(), uploadTemporaryFile);
    } catch (IOException e) {
      throw new BusinessException("1.01.01.1004", e.getMessage());
    }

    return uploadTemporaryFile;
  }

  /**
   * アイコンファイルを本保存
   * 
   * @param form カテゴリーformデータ
   * @return String 発番した画像ID
   */
  public void saveIconFile(CategoryForm form) {
    // ファイルを本保存
    saveImageFile(uploadIconDirPath, "category", form.getImgId(), form.getImgExt(),
        form.getImgType());
  }

  /**
   * ファイルを本保存
   * 
   * @param uploadDirPath 保管ディレクトリパス
   * @param baseNameCode 新ファイル名のベースとなるコード
   * @param imgId 画像ID
   * @param imgExt 画像拡張子
   * @param ingType 画像タイプ
   * @return String 発番した画像ID
   */
  public void saveImageFile(String uploadDirPath, String baseNameCode, String imgId, String imgExt,
      String ingType) {
    String uploadIconDir = StudyStringUtil.replaceFirstOneLeft(uploadDirPath, "/", "");
    String newImgName = String.format("%s_%s_%s.%s", baseNameCode, uploadIconDir, imgId, imgExt);

    // 仮保存していた画像を本保存
    String newImgFilePath = moveTemporaryFileToImagesFolder(newImgName, imgId, uploadIconDir);

    // 画像テーブル登録元情報をセット
    Image img = new Image();
    img.setImgId(imgId);
    img.setImgName(newImgName);
    img.setImgPath(newImgFilePath);
    img.setImgType(ingType);

    // 共通項目をセット
    StudyBeanUtil.setStudyEntityProperties(img);

    try {
      // dbのimagesテーブルに登録
      imageService.saveOne(img);
    } catch (DuplicateKeyException e) {
      throw new BusinessException("1.01.01.1005", e.getMessage());
    }
  }

  /**
   * 一時ファイルとして保存したファイルを本保存
   * 
   * @param String 新ファイル名
   * @param String 一時ファイル保存時に発番した画像ID
   */
  public String moveTemporaryFileToImagesFolder(String newFileName, String uploadTmpFileId) {
    return moveTemporaryFileToImagesFolder(newFileName, uploadTmpFileId, null);
  }

  /**
   * 一時ファイルとして保存したファイルを本保存
   * 
   * @param String 新ファイル名
   * @param String 一時ファイル保存時に発番した画像ID
   * @param String 追加ファイルパス（デフォルト保存ディレクトリの下に追加）
   * @return String 本保存したファイルの抽象パス
   */
  public String moveTemporaryFileToImagesFolder(String newFileName, String uploadTmpFileId,
      String addFilePath) {
    // 追加ファイルパスがnullもしくは空文字の場合
    boolean addPathIsNullOrEmpty = StudyStringUtil.isNullOrEmpty(addFilePath);
    File destinationDir = addPathIsNullOrEmpty ? uploadImgDefDir
        : new File(uploadImgDefDir, addFilePath);
    String newFilePath = addPathIsNullOrEmpty ? uploadImgDefDirPath
        : StudyStringUtil.pathJoin(uploadImgDefDirPath, addFilePath);

    File tempFile = getFileDir(uploadTmpDir, uploadTmpFileId);
    File newFile = getFileDir(destinationDir, newFileName);

    try {
      FileUtils.moveFile(tempFile, newFile);
    } catch (IOException e) {
      throw new BusinessException("1.01.01.1004", e.getMessage());
    }

    // 抽象パスを返却
    return newFilePath;
  }

  /**
   * アップロードされた画像データを取得し、base64でエンコードする<br/>
   * エンコードしたものを文字列に変更(同時に拡張子を指定)
   * 
   * @param imageForm アップロードされたデータ
   * @param String アップロードされたファイルの拡張子
   * @return String
   */
  public String encodeBase64(MultipartFile multipartFile, String extension) {
    try {
      String base64 = Base64.getEncoder().encodeToString(multipartFile.getBytes());
      return String.format("data:image/%s;base64,%s", extension, base64);
    } catch (IOException e) {
      throw new BusinessException("1.01.01.1006", e.getMessage());
    }
  }

  /**
   * ベースと合成して返却
   * 
   * @param base 元となるディレクトリ
   * @param name ファイル名
   * @return ファイル
   */
  public File getFileDir(File base, String name) {
    return new File(new File(fileDir.getStaticFileDir(), base.getPath()), name);
  }

}
