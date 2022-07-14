package org.watanabe.app.study.helper;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Date;
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
import org.watanabe.app.study.column.BooksChartData;
import org.watanabe.app.study.column.BooksChartDatasets;
import org.watanabe.app.study.entity.Books;
import org.watanabe.app.study.enums.dbcode.BooksTab;
import org.watanabe.app.study.enums.type.BooksType;
import org.watanabe.app.study.service.BooksService;
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
   * 家計簿 Service
   */
  @Autowired
  private BooksService booksService;

  /**
   * 図の色 Helper
   */
  @Autowired
  private ChartColourHelper chartColourHelper;

  /**
   * カテゴリーヘルパー
   */
  @Autowired
  private CategoryHelper categoryHelper;

  /**
   * カテゴリーネームを取得するようのファンクション
   */
  private final Function<Books, String> getCatName = booksByCat -> {
    return booksByCat.getCatCodes().getCatName();
  };

  /**
   * 年/月を取得するようのファンクション
   */
  private final Function<Books, String> getYearMonth = booksByCat -> {
    return StudyDateUtil.getYearMonth(booksByCat.getBooksDate());
  };

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
   * 1月ごとのカテゴリーごとの図用データを取得
   * 
   * @param date 基準日付
   * @return カテゴリーごとの図用データ
   */
  public BooksChartData getChartDataByMonthCategory(Date date) {
    // カテゴリーごとに集約し金額の合計を求め、金額が大きい順に並び替え、
    // 順番が保証されるLinkedHashMapに詰める
    Map<String, Long> booksByCatMap =
        groupByCatNameAndSortByReversedToLong(findExpensesByMonth(date));

    BooksChartData bdd = new BooksChartData();
    setChartDataByMonth(bdd, booksByCatMap);

    return bdd;
  }

  /**
   * 1月ごとの方法ごとの図用データを取得
   * 
   * @param date 基準日付
   * @return 方法ごとの図用データ
   */
  public BooksChartData getChartDataByMonthMethod(Date date) {
    // 支払い方法ごとに集約し金額の合計を求め、金額が大きい順に並び替え、
    // 順番が保証されるLinkedHashMapに詰める
    Map<String, Long> booksByMethodMap =
        groupByBooksMethodAndSortByReversedToLong(findExpensesByMonth(date));

    BooksChartData bdd = new BooksChartData();
    setChartDataByMonth(bdd, booksByMethodMap);

    return bdd;
  }

  /**
   * 1年ごとの図用データを取得
   * 
   * @param date 基準日付
   * @return カテゴリーごとの図用データ
   */
  public BooksChartData getChartDatatByYearAll(Date date) {
    final String RGB_WHITE = "rgba(255,255,255,1)";
    final String BAR = "bar";
    final String LINE = "line";

    // 支出を取得
    List<Books> booksByExpenses = findByYearAndType(date, BooksType.EXPENSES.getCode());
    // 収入を取得
    List<Books> booksByIncome = findByYearAndType(date, BooksType.INCOME.getCode());;

    // セット対象
    List<BooksChartDatasets> dataSets = new ArrayList<>();

    // bar
    // 方法ごとに集約
    // ソートしているが意味はない
    // 順番が保証されるLinkedHashMapに詰める
    Map<String, List<Books>> booksByMethodMap = groupByBooksMethodAndSortToList(booksByExpenses);

    List<String> backgroundColorsByBar =
        chartColourHelper.getActiveRgbaList(booksByMethodMap.keySet().size(), (float) 0.5);
    List<String> borderColorsByBar =
        chartColourHelper.getActiveRgbaList(booksByMethodMap.keySet().size(), (float) 1);

    // 方法ごとに集約したのちにさらに月ごとに集約し、月順に並び替え
    int indexByMethod = 0;
    // indexを使用したいためforeachではなくfor文を使用
    for (String keyByMethod : booksByMethodMap.keySet()) {
      List<Long> data = new ArrayList<>();
      Map<String, Long> booksByMethodAndMonthMap =
          groupByBooksDateAndSortToLong(booksByMethodMap.get(keyByMethod));

      booksByMethodAndMonthMap = chartColourHelper.setEntityMapByYear(booksByMethodAndMonthMap,
          StudyDateUtil.getOneYearAgoMonth(date));
      booksByMethodAndMonthMap.forEach((keyByMonth, valueBymethod) -> {
        data.add(valueBymethod);
      });
      BooksChartDatasets bddd = new BooksChartDatasets();
      bddd.setLabel(keyByMethod);
      bddd.setType(BAR);
      bddd.setBackgroundColor(Arrays.asList(backgroundColorsByBar.get(indexByMethod)));
      bddd.setBorderColor(Arrays.asList(borderColorsByBar.get(indexByMethod)));
      bddd.setData(data);
      dataSets.add(bddd);
      indexByMethod++;
    }

    // line
    // カテゴリー
    Map<String, List<Books>> booksByCategoryMap = groupByCatNameAndSortToList(booksByExpenses);

    // 総支出、総収入、貯金額分も使用のため+3
    List<String> borderColorsByLine =
        chartColourHelper.getActiveRgbaList(booksByCategoryMap.keySet().size() + 3, (float) 1);

    // 方法ごとに集約したのちにさらに月ごとに集約
    int indexByLine = 0;
    // indexを使用したいためforeachではなくfor文を使用
    for (String keyByCategoryAndMonth : booksByCategoryMap.keySet()) {
      List<Long> data = new ArrayList<>();
      Map<String, Long> booksByCategoryAndMonthMap =
          groupByBooksDateAndSortToLong(booksByCategoryMap.get(keyByCategoryAndMonth));

      booksByCategoryAndMonthMap = chartColourHelper.setEntityMapByYear(booksByCategoryAndMonthMap,
          StudyDateUtil.getOneYearAgoMonth(date));
      booksByCategoryAndMonthMap.forEach((keyByMonth, valueBymethod) -> {
        data.add(valueBymethod);
      });
      BooksChartDatasets bddd = new BooksChartDatasets();
      bddd.setLabel(keyByCategoryAndMonth);
      bddd.setType(LINE);
      bddd.setBackgroundColor(Arrays.asList(RGB_WHITE));
      bddd.setBorderColor(Arrays.asList(borderColorsByLine.get(indexByLine)));
      bddd.setData(data);
      bddd.setHidden(true);
      dataSets.add(bddd);
      indexByLine++;
    }

    // 総支出
    Map<String, Long> _booksByMonthSumAmountDataByExpenses =
        groupByBooksDateAndSortToLong(booksByExpenses);

    Map<String, Long> booksByMonthSumAmountDataByExpenses = chartColourHelper.setEntityMapByYear(
        _booksByMonthSumAmountDataByExpenses, StudyDateUtil.getOneYearAgoMonth(date));
    BooksChartDatasets bdddByMonthSumAmountByExpenses = new BooksChartDatasets();
    bdddByMonthSumAmountByExpenses.setLabel("総支出");
    bdddByMonthSumAmountByExpenses.setType(LINE);
    bdddByMonthSumAmountByExpenses.setBackgroundColor(Arrays.asList(RGB_WHITE));
    bdddByMonthSumAmountByExpenses
        .setBorderColor(Arrays.asList(borderColorsByLine.get(indexByLine++)));
    bdddByMonthSumAmountByExpenses
        .setData(new ArrayList<Long>(booksByMonthSumAmountDataByExpenses.values()));
    // lineの先頭に追加
    dataSets.add(booksByMethodMap.keySet().size(), bdddByMonthSumAmountByExpenses);

    // 総収入
    Map<String, Long> booksByMonthSumAmountDataByIncome =
        groupByBooksDateAndSortToLong(booksByIncome);

    booksByMonthSumAmountDataByIncome = chartColourHelper.setEntityMapByYear(
        booksByMonthSumAmountDataByIncome, StudyDateUtil.getOneYearAgoMonth(date));
    BooksChartDatasets bdddByMonthSumAmountByIncome = new BooksChartDatasets();
    bdddByMonthSumAmountByIncome.setLabel("総収入");
    bdddByMonthSumAmountByIncome.setType(LINE);
    bdddByMonthSumAmountByIncome.setBackgroundColor(Arrays.asList(RGB_WHITE));
    bdddByMonthSumAmountByIncome
        .setBorderColor(Arrays.asList(borderColorsByLine.get(indexByLine++)));
    bdddByMonthSumAmountByIncome
        .setData(new ArrayList<Long>(booksByMonthSumAmountDataByIncome.values()));
    bdddByMonthSumAmountByIncome.setHidden(true);
    // lineの先頭に追加
    dataSets.add(booksByMethodMap.keySet().size(), bdddByMonthSumAmountByIncome);

    // 貯金額
    Map<String, Long> differenceBooksByMonthSumAmountData = new LinkedHashMap<>();
    // 差額
    booksByMonthSumAmountDataByIncome.forEach((k, valueByIncome) -> {
      Long valueByExpenses = booksByMonthSumAmountDataByExpenses.get(k);
      if (valueByExpenses != null) {
        differenceBooksByMonthSumAmountData.put(k, valueByIncome - valueByExpenses);
      } else {
        differenceBooksByMonthSumAmountData.put(k, valueByIncome);
      }
    });
    BooksChartDatasets differenceBdddByMonthSumAmount = new BooksChartDatasets();
    differenceBdddByMonthSumAmount.setLabel("貯金額");
    differenceBdddByMonthSumAmount.setType(LINE);
    differenceBdddByMonthSumAmount.setBackgroundColor(Arrays.asList(RGB_WHITE));
    differenceBdddByMonthSumAmount
        .setBorderColor(Arrays.asList(borderColorsByLine.get(indexByLine)));
    differenceBdddByMonthSumAmount
        .setData(new ArrayList<Long>(differenceBooksByMonthSumAmountData.values()));
    differenceBdddByMonthSumAmount.setHidden(false);
    // lineの先頭
    dataSets.add(booksByMethodMap.keySet().size(), differenceBdddByMonthSumAmount);

    BooksChartData bdd = new BooksChartData();
    bdd.setDatasets(dataSets);
    bdd.setLabels(new ArrayList<String>(booksByMonthSumAmountDataByExpenses.keySet()));

    return bdd;
  }

  /**
   * 1月ごとの家計簿支出データを取得
   * 
   * @param date 基準日付
   * @return 家計簿支出データ
   */
  public List<Books> findExpensesByMonth(Date date) {
    return booksService.findByBooksDateAndBooksTypeAndUserIdJoinCategory(
        StudyDateUtil.getStartDateByMonth(date), StudyDateUtil.getEndDateByMonth(date),
        BooksType.EXPENSES.getCode(), StudyUtil.getLoginUser());
  }

  /**
   * 1月ごとの家計簿データを取得
   * 
   * @param date 基準日付
   * @param booksType 家計簿の種類
   * @return 家計簿データ
   */
  public List<Books> findByYearAndType(Date date, String booksType) {
    return booksService.findByBooksDateAndBooksTypeAndUserIdJoinCategory(
        StudyDateUtil.getOneYearAgoMonth(date), StudyDateUtil.getEndDateByMonth(date), booksType,
        StudyUtil.getLoginUser());
  }

  /**
   * 1月ごとのデータをセットする
   * 
   * @param bdd セット対象
   * @param booksMap セット元データ
   */
  public void setChartDataByMonth(BooksChartData bdd, Map<String, Long> booksMap) {
    BooksChartDatasets bddd = new BooksChartDatasets();
    bddd.setBackgroundColor(
        chartColourHelper.getActiveRgbaList(booksMap.keySet().size(), (float) 0.5));
    bddd.setBorderColor(chartColourHelper.getActiveRgbaList(booksMap.keySet().size(), (float) 1));
    bddd.setData(new ArrayList<Long>(booksMap.values()));

    List<BooksChartDatasets> dataSets = new ArrayList<>();
    dataSets.add(bddd);

    bdd.setLabels(new ArrayList<String>(booksMap.keySet()));
    bdd.setDatasets(dataSets);
  }

  /**
   * 年ごとのデータセットをセットする
   * 
   * @param dataSets セット対象
   * @param date 基準日付
   * @param label ラベル
   * @param type タイプ
   * @param backgroundColor バックグラウンドカラー
   * @param borderColor ボーダーカラー
   * 
   */
  public void setChartDatasetsByYear(List<BooksChartDatasets> dataSets, Date date, String label,
      String type, String backgroundColor, String borderColor, Map<String, Long> booksMap) {
    List<Long> data = new ArrayList<>();
    booksMap =
        chartColourHelper.setEntityMapByYear(booksMap, StudyDateUtil.getOneYearAgoMonth(date));
    booksMap.forEach((keyByMonth, valueBymethod) -> {
      data.add(valueBymethod);
    });

    BooksChartDatasets bddd = new BooksChartDatasets();
    bddd.setLabel(label);
    bddd.setType(type);
    bddd.setBackgroundColor(Arrays.asList(backgroundColor));
    bddd.setBorderColor(Arrays.asList(borderColor));
    bddd.setData(data);
    dataSets.add(bddd);
  }

  /**
   * 家計簿日付けで集約とソートを行う
   * 
   * @param target 対象
   * @return 集約、ソート後のmap
   */
  public Map<String, Long> groupByCatNameAndSortByReversedToLong(List<Books> target) {
    return groupAndSortToLong(target, getCatName, Collectors.summingLong(Books::getBooksAmmount),
        Map.Entry.<String, Long>comparingByValue().reversed());
  }

  /**
   * 家計簿日付けで集約とソート（逆順）を行う
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
   * @param downstream 集約関数
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
