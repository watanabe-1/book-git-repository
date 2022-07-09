package org.watanabe.app.study.helper;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.UUID;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.terasoluna.gfw.common.exception.BusinessException;
import org.terasoluna.gfw.common.message.ResultMessages;
import org.watanabe.app.study.entity.Books;
import org.watanabe.app.study.entity.Category;
import org.watanabe.app.study.enums.dbcode.BooksTab;
import org.watanabe.app.study.service.CategoryService;
import org.watanabe.app.study.util.CodeUtil;
import org.watanabe.app.study.util.StudyUtil;

/**
 * 家計簿のHelperクラスを作成
 */
@Component
public class BooksHelper {

  /**
   * カテゴリー情報 Service
   */
  @Autowired
  private CategoryService categoryService;

  /**
   * カテゴリー情報保存用リスト
   */
  private List<Category> catList = new ArrayList<Category>();


  /**
   * アップロードされたファイルデータをもとにentytiにセットし返却
   * 
   * @param booksFile アップロードされたデータ
   * @param booksType アップロードされたデータの種類
   * @param charset 文字コード
   * @return Books セットされたentity
   */
  public List<Books> getBooksByCsv(MultipartFile booksFile, String booksType) {
    // 現在日時取得
    Date now = StudyUtil.getNowDate();
    // ログインユーザー取得
    String user = StudyUtil.getLoginUser();
    SimpleDateFormat sdFormat = new SimpleDateFormat("yyyy/MM/dd");
    List<Books> booksList = new ArrayList<Books>();
    String charset = StudyUtil.detectFileEncoding(booksFile);

    try (BufferedReader br =
        new BufferedReader(new InputStreamReader(booksFile.getInputStream(), charset))) {
      String line = null;
      while ((line = br.readLine()) != null) {
        final String[] split = line.split(",");
        Books books = new Books();
        books.setBooksId(UUID.randomUUID().toString());
        books.setUserId(user);
        books.setBooksType(booksType);
        books.setBooksDate(sdFormat.parse(StudyUtil.trimDoubleQuot(split[0])));
        books.setBooksPlace(StudyUtil.trimDoubleQuot(split[1]));
        books.setCatCode(getCatCode(StudyUtil.trimDoubleQuot(split[2])));
        books.setBooksMethod(StudyUtil.trimDoubleQuot(split[3]));
        books.setBooksAmmount(Integer.parseInt(StudyUtil.trimDoubleQuot(split[4])));
        books.setInsUser(user);
        books.setInsDate(now);
        books.setUpdUser(user);
        books.setUpdDate(now);
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
   * MultipartFileからfileに変換
   * 
   * @param multipart MultipartFile
   * @return convFile file
   */
  public File multipartToFile(MultipartFile multipart) throws IllegalStateException, IOException {
    File convFile = new File(multipart.getOriginalFilename());
    multipart.transferTo(convFile);

    return convFile;
  }

  /**
   * カテゴリーテーブルにカテゴリーネームが登録されているか確認し、カテゴリーコードを取得
   * 
   * @param catName カテゴリーネーム
   * @return String カテゴリコード
   */
  public String getCatCode(String catName) {
    // まだ一回も呼ばれていない場合
    if (catList.isEmpty()) {
      catList = categoryService.findAll();
    }

    // 突きつけ合わせ
    for (Category cat : catList) {
      if (catName.equals(cat.getCatName())) {
        return cat.getCatCode();
      }
    }

    // 現在日時取得
    Date now = StudyUtil.getNowDate();
    // ログインユーザー取得
    String user = StudyUtil.getLoginUser();

    // カテゴリーが登録されていなかったら仮でいったん登録
    Category cat = new Category();
    String catCode = UUID.randomUUID().toString();
    cat.setCatCode(catCode);
    cat.setCatName(catName);
    // 仮で保存し後から変更
    cat.setImgId(StudyUtil.getNoImageCode());
    cat.setImgType("");
    cat.setCatType("");
    cat.setActive("1");
    cat.setInsUser(user);
    cat.setInsDate(now);
    cat.setUpdUser(user);
    cat.setUpdDate(now);

    categoryService.saveOne(cat);
    catList = categoryService.findAll();

    return catCode;
  }

  /**
   * その月の最初の日に変換して返却
   * 
   * @param date 変更したい日付
   * @return Date 変換語の日付
   */
  public Date getStartDateByMonth(Date date) {
    return StudyUtil.getEdgeDate(date, StudyUtil.START, Calendar.MONTH);
  }

  /**
   * その月の最後の日に変換して返却
   * 
   * @param date 変更したい日付
   * @return Date 変換語の日付
   */
  public Date getEndDateByMonth(Date date) {
    return StudyUtil.getEdgeDate(date, StudyUtil.END, Calendar.MONTH);
  }

  /**
   * その年の最初の日に変換して返却
   * 
   * @param date 変更したい日付
   * @return Date 変換語の日付
   */
  public Date getStartDateByYear(Date date) {
    return getStartDateByMonth(StudyUtil.getEdgeDate(date, StudyUtil.START, Calendar.YEAR));
  }

  /**
   * その年の最後の日に変換して返却
   * 
   * @param date 変更したい日付
   * @return Date 変換語の日付
   */
  public Date getEndDateByYear(Date date) {
    return getEndDateByMonth(StudyUtil.getEdgeDate(date, StudyUtil.END, Calendar.YEAR));
  }

  /**
   * 1年前の月の最初の日を取得
   * 
   * @param date 変更したい日付
   * @return Date 変換語の日付
   */
  public Date getOneYearAgoMonth(Date date) {
    Date startMonth = StudyUtil.calculateDate(date, Calendar.MONTH, -12);
    return StudyUtil.getEdgeDate(startMonth, StudyUtil.START, Calendar.MONTH);
  }

  /**
   * 1月加算してから返却
   * 
   * @param date 加算したい日付
   * @return Date 変換語の日付
   */
  public static Date getNextMonth(Date date) {
    return StudyUtil.calculateDate(date, Calendar.MONTH, 1);
  }

  /**
   * 1月減算してしてから返却
   * 
   * @param date 減算したい日付
   * @return Date 変換語の日付
   */
  public static Date getBackMonth(Date date) {
    return StudyUtil.calculateDate(date, Calendar.MONTH, -1);
  }

  /**
   * 家計簿画面の初期表示のタブを取得
   * 
   * @return 家計簿画面の初期表示のタブ
   */
  public String getDefaltTab() {
    return CodeUtil.getShort(BooksTab.DEFALT_TAB.getListName(), BooksTab.DEFALT_TAB.getCode());
  }

  /**
   * 指定した日付けの最小値と最大値の間の年のリストを取得
   * 
   * @param min 最小日付
   * @param max 最大日付
   * @return 年のリスト
   */
  public List<String> getbetweenYears(Date min, Date max) {
    List<String> result = new ArrayList<>();
    SimpleDateFormat getYearFormat = new SimpleDateFormat("yyyy");
    Date currentDate = min;

    while (currentDate.compareTo(max) < 0) {
      result.add(getYearFormat.format(currentDate));
      currentDate = StudyUtil.calculateDate(currentDate, Calendar.YEAR, 1);
    }

    return result;
  }

}
