package org.watanabe.app.study.helper;

import java.io.File;
import java.io.IOException;
import java.util.Base64;
import java.util.UUID;
import org.apache.commons.io.FileUtils;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
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
   * ファイルを一時ファイルとして保存
   * 
   * @param MultipartFile アップロードされたデータ
   * @return String 発番した画像ID
   * @throws IOException
   */
  public String saveTemporaryFile(MultipartFile multipartFile) throws IOException {
    // 画像IDの発番
    String uploadTmpFileId = UUID.randomUUID().toString();
    File uploadTemporaryFile = new File(uploadTmpDir, uploadTmpFileId);

    // アップロードしたファイルを一時ファイルとして保存
    FileUtils.copyInputStreamToFile(multipartFile.getInputStream(), uploadTemporaryFile);

    return uploadTmpFileId;
  }

  /**
   * 一時ファイルとして保存したファイルを本保存
   * 
   * @param String 新ファイル名
   * @param String 一時ファイル保存時に発番した画像ID
   * @throws IOException
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
   * @throws IOException
   */
  public String moveTemporaryFileToImagesFolder(String newFileName, String uploadTmpFileId,
      String addFilePath) throws IOException {
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

    FileUtils.moveFile(file, fileToMove);

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
