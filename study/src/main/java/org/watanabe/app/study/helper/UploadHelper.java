package org.watanabe.app.study.helper;

import java.io.File;
import java.io.IOException;
import java.util.Base64;
import java.util.UUID;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.terasoluna.gfw.common.exception.BusinessException;
import org.terasoluna.gfw.common.message.ResultMessages;
import org.watanabe.app.study.form.CategoryForm;
import org.watanabe.app.study.form.ImageForm;
import org.watanabe.app.study.service.ImageService;
import org.watanabe.app.study.util.StudyUtil;


/**
 * アップロードを行うためのHelperクラスを作成
 */
@Component
public class UploadHelper {

  // プロパティファイルから読み取り
  // 一時ファイル保管ディレクトリ
  @Value("${app.upload.temporaryDirectoryPath}")
  private File uploadTmpDir;

  // 本ファイル保管ディレクトリ
  @Value("${app.upload.imagesBaseDirectoryPath}")
  private File uploadImgDefDir;

  // 本ファイル保管ディレクトリパス
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
  @Autowired
  private ImageService imageService;

  /**
   * ファイルを一時ファイルとして保存
   * 
   * @param MultipartFile アップロードされたデータ
   * @return String 発番した画像ID
   */
  public String saveTemporaryFile(MultipartFile multipartFile) {
    // 画像IDの発番
    String uploadTmpFileId = UUID.randomUUID().toString();
    File uploadTemporaryFile = new File(uploadTmpDir, uploadTmpFileId);

    // アップロードしたファイルを一時ファイルとして保存
    try {
      FileUtils.copyInputStreamToFile(multipartFile.getInputStream(), uploadTemporaryFile);
    } catch (IOException e) {
      throw new BusinessException(ResultMessages.error().add("1.01.01.1001"));
    }

    return uploadTmpFileId;
  }

  /**
   * アイコンファイルを本保存
   * 
   * @param form カテゴリーformデータ
   * @return String 発番した画像ID
   */
  public void saveIconFile(CategoryForm form) {
    // ファイルを本保存
    saveImageFile(uploadIconDirPath, form.getCatCode(), form.getImgId(), form.getImgExt(),
        form.getImgType());
  }

  /**
   * ファイルを本保存
   * 
   * @param uploadDirPath 保管ディレクトリパス
   * @param baseNameCode 新ファイル名のベースとなるコード
   * @return String 発番した画像ID
   */
  public void saveImageFile(String uploadDirPath, String baseNameCode, String imgId, String ImgExt,
      String ingType) {

    String uploadIconDir = StudyUtil.replaceFirstOneLeft(uploadDirPath, "/", "");
    // 画像テーブル登録元情報をセット
    ImageForm imgForm = new ImageForm();
    StringBuffer sb = new StringBuffer();
    String newImgName = sb.append(baseNameCode).append("_").append(uploadIconDir).append("_")
        .append(imgId).append(".").append(ImgExt).toString();
    // 仮保存していた画像を本保存
    String newImgFilePath = moveTemporaryFileToImagesFolder(newImgName, imgId, uploadIconDir);
    imgForm.setImgId(imgId);
    imgForm.setImgName(newImgName);
    imgForm.setImgPath(newImgFilePath);
    imgForm.setImgType(ingType);

    try {
      // dbのimagesテーブルに登録
      imageService.save(imgForm);
    } catch (DuplicateKeyException dke) {
      // result.addError(new FieldError(result.getObjectName(), "imgId", "採番された画像IDは既に登録されています。"));
      throw new BusinessException(ResultMessages.error().add("1.01.01.1001"));
    }
  }

  /**
   * 一時ファイルとして保存したファイルを本保存
   * 
   * @param String 新ファイル名
   * @param String 一時ファイル保存時に発番した画像ID
   */
  public String moveTemporaryFileToImagesFolder(String newFileName, String uploadTmpFileId)
      throws IOException {
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
    File newFile = null;
    String newFilePath = null;
    // 追加ファイルパスがnullもしくは空文字の場合
    if (StudyUtil.isNullOrEmpty(addFilePath)) {
      newFile = uploadImgDefDir;
      newFilePath = uploadImgDefDirPath;
    } else {
      newFile = new File(uploadImgDefDir, addFilePath);
      newFilePath = StudyUtil.pathJoin(uploadImgDefDirPath, addFilePath);
    }

    File file = new File(uploadTmpDir, uploadTmpFileId);
    File fileToMove = new File(newFile, newFileName);

    try {
      FileUtils.moveFile(file, fileToMove);
    } catch (IOException e) {
      throw new BusinessException(ResultMessages.error().add("1.01.01.1001"));
    }

    // 抽象パスを返却
    return newFilePath;
  }

  /**
   * アップロードされた画像データを取得し、base64でエンコードする エンコードしたものを文字列に変更(同時に拡張子を指定)
   * 
   * @param imageForm アップロードされたデータ
   * @param String アップロードされたファイルの拡張子
   * @return String
   * @throws IOException
   */
  public String encodeBase64(MultipartFile multipartFile, String expand) throws IOException {
    StringBuffer data = new StringBuffer();
    String base64 = new String(Base64.getEncoder().encode(multipartFile.getBytes()), "ASCII");
    data.append("data:image/").append(expand).append(";base64,").append(base64);

    return data.toString();
  }

}
