package org.watanabe.app.study.helper;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import org.terasoluna.gfw.common.exception.BusinessException;
import org.terasoluna.gfw.common.message.ResultMessages;
import org.watanabe.app.study.entity.Books;
import org.watanabe.app.study.enums.dbcode.BooksTab;
import org.watanabe.app.study.util.StudyCodeUtil;
import org.watanabe.app.study.util.StudyDateUtil;
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
   * 家計簿画面の初期表示のタブを取得
   * 
   * @return 家計簿画面の初期表示のタブ
   */
  public String getDefaltTab() {
    return StudyCodeUtil.getShort(BooksTab.DEFALT_TAB.getListName(), BooksTab.DEFALT_TAB.getCode());
  }

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
        books.setBooksDate(StudyDateUtil.strToDate(StudyStringUtil.trimDoubleQuot(split[0]),
            StudyDateUtil.FMT_YEAR_MONTH_DAY_SLASH));
        books.setBooksPlace(StudyStringUtil.trimDoubleQuot(split[1]));
        books.setCatCode(categoryHelper.getCatCode(StudyStringUtil.trimDoubleQuot(split[2])));
        books.setBooksMethod(StudyStringUtil.trimDoubleQuot(split[3]));
        books.setBooksAmmount(Integer.parseInt(StudyStringUtil.trimDoubleQuot(split[4])));
        // 共通項目をセット
        StudyModelUtil.setStudyEntityProperties(books);
        booksList.add(books);
      }
    } catch (IOException e) {
      throw new BusinessException(ResultMessages.error().add("1.01.01.1001"));
    }

    return booksList;
  }

  /**
   * 家計簿日付けで集約とソートを行う
   * 
   * @param target 対象
   * @return 集約、ソート後のmap
   */
  public Map<String, Long> groupByCatNameAndSortByReversedToLong(List<Books> target) {
    // カテゴリーネームを取得するようのファンクション
    Function<Books, String> getCatName = booksByCat -> {
      return booksByCat.getCatCodes().getCatName();
    };

    return groupAndSortToLong(target, getCatName, Collectors.summingLong(Books::getBooksAmmount),
        Map.Entry.<String, Long>comparingByValue().reversed());
  }

  /**
   * 家計簿日付けで集約とソートを行う
   * 
   * @param target 対象
   * @return 集約、ソート後のmap
   */
  public Map<String, Long> groupByBooksMethodAndSortByReversedToLong(List<Books> target) {

    return groupAndSortToLong(target, Books::getBooksMethod,
        Collectors.summingLong(Books::getBooksAmmount),
        Map.Entry.<String, Long>comparingByValue().reversed());
  }

  /**
   * 家計簿日付けで集約とソートを行う
   * 
   * @param target 対象
   * @return 集約、ソート後のmap
   */
  public Map<String, Long> groupByBooksDateAndSortToLong(List<Books> target) {
    // 年/月を取得するようのファンクション
    Function<Books, String> getYearMonth = booksByCat -> {
      return StudyDateUtil.getYearMonth(booksByCat.getBooksDate());
    };

    return groupAndSortToLong(target, getYearMonth, Collectors.summingLong(Books::getBooksAmmount),
        Map.Entry.<String, Long>comparingByKey());
  }

  /**
   * カテゴリーネームで集約とソートを行う
   * 
   * @param target 対象
   * @return 集約、ソート後のmap
   */
  public Map<String, List<Books>> groupByCatNameAndSortToList(List<Books> target) {
    // カテゴリーネームを取得するようのファンクション
    Function<Books, String> getCatName = booksByCat -> {
      return booksByCat.getCatCodes().getCatName();
    };

    return groupAndSortToList(target, getCatName, Map.Entry.<String, List<Books>>comparingByKey());
  }

  /**
   * 家計簿の方法で集約とソートを行う
   * 
   * @param target 対象
   * @return 集約、ソート後のmap
   */
  public Map<String, List<Books>> groupByBooksMethodAndSortToList(List<Books> target) {

    return groupAndSortToList(target, Books::getBooksMethod,
        Map.Entry.<String, List<Books>>comparingByKey());
  }

  /**
   * 集約とソートを行う
   * 
   * @param target 対象
   * @param groupingKey 集約キー
   * @param comparator ソートキー
   * @return 集約、ソート後のmap
   */
  public Map<String, Long> groupAndSortToLong(List<Books> target,
      Function<Books, String> groupingKey, Collector<Books, ?, Long> downstream,
      Comparator<? super Entry<String, Long>> comparator) {
    return target.stream()
        // 集約
        .collect(Collectors.groupingBy(groupingKey, downstream))
        // 集約された結果が詰まったマップをソート
        .entrySet().stream().sorted(comparator)
        // 順番が保証されるLinkedHashMapに詰める
        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1,
            LinkedHashMap::new));
  }

  /**
   * 集約とソートを行う
   * 
   * @param target 対象
   * @param groupingKey 集約キー
   * @param comparator ソートキー
   * @return 集約、ソート後のmap
   */
  public Map<String, List<Books>> groupAndSortToList(List<Books> target,
      Function<Books, String> groupingKey,
      Comparator<? super Entry<String, List<Books>>> comparator) {
    return target.stream()
        // 集約
        .collect(Collectors.groupingBy(groupingKey))
        // 集約された結果が詰まったマップをソート
        .entrySet().stream().sorted(comparator)
        // 順番が保証されるLinkedHashMapに詰める
        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1,
            LinkedHashMap::new));
  }

}
