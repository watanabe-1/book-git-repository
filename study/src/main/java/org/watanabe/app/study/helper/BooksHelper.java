package org.watanabe.app.study.helper;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.terasoluna.gfw.common.exception.BusinessException;
import org.terasoluna.gfw.common.message.ResultMessages;
import org.watanabe.app.study.entity.Books;
import org.watanabe.app.study.enums.dbcode.BooksTab;
import org.watanabe.app.study.util.StudyCodeUtil;
import org.watanabe.app.study.util.StudyFileUtil;
import org.watanabe.app.study.util.StudyModelUtil;
import org.watanabe.app.study.util.StudyStringUtil;
import org.watanabe.app.study.util.StudyUtil;

/**
 * 家計簿のHelperクラスを作成
 */
@Component
public class BooksHelper {

  /**
   * カテゴリーヘルパー
   */
  @Autowired
  private CategoryHelper categoryHelper;

  /**
   * アップロードされたファイルデータをもとにentytiにセットし返却
   * 
   * @param booksFile アップロードされたデータ
   * @param booksType アップロードされたデータの種類
   * @param charset 文字コード
   * @return Books セットされたentity
   */
  public List<Books> getBooksByCsv(MultipartFile booksFile, String booksType) {
    // ログインユーザー取得
    String user = StudyUtil.getLoginUser();
    SimpleDateFormat sdFormat = new SimpleDateFormat("yyyy/MM/dd");
    List<Books> booksList = new ArrayList<Books>();
    String charset = StudyFileUtil.detectFileEncoding(booksFile);

    try (BufferedReader br =
        new BufferedReader(new InputStreamReader(booksFile.getInputStream(), charset))) {
      String line = null;
      while ((line = br.readLine()) != null) {
        final String[] split = line.split(",");
        Books books = new Books();
        books.setBooksId(UUID.randomUUID().toString());
        books.setUserId(user);
        books.setBooksType(booksType);
        books.setBooksDate(sdFormat.parse(StudyStringUtil.trimDoubleQuot(split[0])));
        books.setBooksPlace(StudyStringUtil.trimDoubleQuot(split[1]));
        books.setCatCode(categoryHelper.getCatCode(StudyStringUtil.trimDoubleQuot(split[2])));
        books.setBooksMethod(StudyStringUtil.trimDoubleQuot(split[3]));
        books.setBooksAmmount(Integer.parseInt(StudyStringUtil.trimDoubleQuot(split[4])));
        // 共通項目をセット
        StudyModelUtil.setStudyEntityProperties(books);
        booksList.add(books);
      }
    } catch (ParseException e) {
      throw new BusinessException(ResultMessages.error().add("1.01.01.1002", "日付(収入日、購入日)"));
    } catch (IOException e) {
      throw new BusinessException(ResultMessages.error().add("1.01.01.1001"));
    }

    return booksList;
  }

  /**
   * 家計簿画面の初期表示のタブを取得
   * 
   * @return 家計簿画面の初期表示のタブ
   */
  public String getDefaltTab() {
    return StudyCodeUtil.getShort(BooksTab.DEFALT_TAB.getListName(), BooksTab.DEFALT_TAB.getCode());
  }

}
