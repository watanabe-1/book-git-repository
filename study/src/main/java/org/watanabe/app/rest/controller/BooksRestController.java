package org.watanabe.app.rest.controller;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.ModelAndView;
import org.watanabe.app.common.logger.LogIdBasedLogger;
import org.watanabe.app.rest.form.BooksChartByMonthData;
import org.watanabe.app.rest.form.BooksChartByMonthDatasets;
import org.watanabe.app.study.controller.TopController;
import org.watanabe.app.study.entity.Books;
import org.watanabe.app.study.form.BooksForm;
import org.watanabe.app.study.helper.BooksHelper;
import org.watanabe.app.study.helper.ChartColourHelper;
import org.watanabe.app.study.service.BooksService;
import org.watanabe.app.study.util.StudyUtil;

@RestController
public class BooksRestController {

  private static final LogIdBasedLogger logger = LogIdBasedLogger.getLogger(TopController.class);

  /**
   * 家計簿 Service
   */
  @Autowired
  private BooksService booksService;

  /**
   * 家計簿 Helper
   */
  @Autowired
  private BooksHelper booksHelper;

  /**
   * 図の色 Helper
   */
  @Autowired
  private ChartColourHelper chartColourHelper;

  /**
   * 家計簿一覧画面内の1月ごとのカテゴリーごとの図用
   * 
   * @param date 開いている画面の指定されている日付け
   * @return json(カテゴリーごとの家計簿情報)
   */
  @RequestMapping(value = "/books/rest/chart/byMonth/category", method = RequestMethod.POST)
  public BooksChartByMonthData chartByMonthCategory(@ModelAttribute BooksForm form,
      ModelAndView model, Date date) {
    // カテゴリーネームを取得するようのファンクション
    Function<Books, String> getCatName = booksByCat -> {
      return booksByCat.getCatCodes().getCatName();
    };

    // 対象を取得
    List<Books> books = booksService.findByBooksDateAndBooksTypeAndUserIdJoinCategory(
        booksHelper.getStartDate(date), booksHelper.getEndDate(date),
        BooksHelper.BOOKS_TYPE_EXPENSES, StudyUtil.getLoginUser());

    // カテゴリーごとに集約し金額の合計を求め、金額が大きい順に並び替え、
    // 順番が保証されるLinkedHashMapに詰める
    Map<String, Long> booksByCatMap = books.stream()
        // 集約
        .collect(Collectors.groupingBy(getCatName, Collectors.summingLong(Books::getBooksAmmount)))
        // 集約された結果が詰まったマップをソート
        .entrySet().stream().sorted(Map.Entry.<String, Long>comparingByValue().reversed())
        // 順番が保証されるLinkedHashMapに詰める
        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1,
            LinkedHashMap::new));

    BooksChartByMonthDatasets bddd = new BooksChartByMonthDatasets();
    bddd.setBackgroundColor(
        chartColourHelper.getActiveRgbaList(booksByCatMap.keySet().size(), (float) 0.5));
    bddd.setBorderColor(
        chartColourHelper.getActiveRgbaList(booksByCatMap.keySet().size(), (float) 1));
    bddd.setData(new ArrayList<Long>(booksByCatMap.values()));

    List<BooksChartByMonthDatasets> dataSets = new ArrayList<>();
    dataSets.add(bddd);

    BooksChartByMonthData bdd = new BooksChartByMonthData();
    bdd.setLabels(new ArrayList<String>(booksByCatMap.keySet()));
    bdd.setDatasets(dataSets);

    return bdd;
  }

  /**
   * 家計簿一覧画面内の1月ごとの支払いごとの図用
   * 
   * @param date 開いている画面の指定されている日付け
   * @return json(支払いごとの家計簿情報)
   */
  @RequestMapping(value = "/books/rest/chart/byMonth/method", method = RequestMethod.POST)
  public BooksChartByMonthData chartByMonthMethod(@ModelAttribute BooksForm form,
      ModelAndView model, Date date) {
    // 対象を取得
    List<Books> books = booksService.findByBooksDateAndBooksTypeAndUserIdJoinCategory(
        booksHelper.getStartDate(date), booksHelper.getEndDate(date),
        BooksHelper.BOOKS_TYPE_EXPENSES, StudyUtil.getLoginUser());
    // 支払い方法ごとに集約し金額の合計を求め、金額が大きい順に並び替え、
    // 順番が保証されるLinkedHashMapに詰める
    Map<String, Long> booksByMethodMap = books.stream()
        // 集約
        .collect(Collectors.groupingBy(Books::getBooksMethod,
            Collectors.summingLong(Books::getBooksAmmount)))
        // 集約された結果が詰まったマップをソート
        .entrySet().stream().sorted(Map.Entry.<String, Long>comparingByKey().reversed())
        // 順番が保証されるLinkedHashMapに詰める
        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1,
            LinkedHashMap::new));

    BooksChartByMonthDatasets bddd = new BooksChartByMonthDatasets();
    bddd.setBackgroundColor(
        chartColourHelper.getActiveRgbaList(booksByMethodMap.keySet().size(), (float) 0.5));
    bddd.setBorderColor(
        chartColourHelper.getActiveRgbaList(booksByMethodMap.keySet().size(), (float) 1));
    bddd.setData(new ArrayList<Long>(booksByMethodMap.values()));

    List<BooksChartByMonthDatasets> dataSets = new ArrayList<>();
    dataSets.add(bddd);

    BooksChartByMonthData bdd = new BooksChartByMonthData();
    bdd.setLabels(new ArrayList<String>(booksByMethodMap.keySet()));
    bdd.setDatasets(dataSets);

    return bdd;
  }

  /**
   * 家計簿一覧画面内の1年ごとの図用
   * 
   * @param date 開いている画面の指定されている日付け
   * @return json(カテゴリーごとの家計簿情報)
   */
  @RequestMapping(value = "/books/rest/chart/byYear/all", method = RequestMethod.POST)
  public BooksChartByMonthData chartByYearAll(@ModelAttribute BooksForm form, ModelAndView model,
      Date date) {
    // 月を取得するようのファンクション
    Function<Books, String> getMonth = booksByCat -> {
      SimpleDateFormat sdfYyyyMm = new SimpleDateFormat("yyyy/MM");
      return sdfYyyyMm.format(booksByCat.getBooksDate());
    };
    // カテゴリーネームを取得するようのファンクション
    Function<Books, String> getCatName = booksByCat -> {
      return booksByCat.getCatCodes().getCatName();
    };

    final String RGB_WHITE = "rgba(255,255,255,1)";
    final String BAR = "bar";
    final String LINE = "line";

    // 支出を取得
    List<Books> booksByExpenses = booksService.findByBooksDateAndBooksTypeAndUserIdJoinCategory(
        booksHelper.getOneYearAgoMonth(date), booksHelper.getEndDate(date),
        BooksHelper.BOOKS_TYPE_EXPENSES, StudyUtil.getLoginUser());
    // 収入を取得
    List<Books> booksByIncome = booksService.findByBooksDateAndBooksTypeAndUserIdJoinCategory(
        booksHelper.getOneYearAgoMonth(date), booksHelper.getEndDate(date),
        BooksHelper.BOOKS_TYPE_INCOME, StudyUtil.getLoginUser());

    List<BooksChartByMonthDatasets> dataSets = new ArrayList<>();

    // bar
    // 方法ごとに集約し金額の合計を求め、金額が大きい順に並び替え、
    // 順番が保証されるLinkedHashMapに詰める
    Map<String, List<Books>> booksByMethodMap = booksByExpenses.stream()
        // 集約
        .collect(Collectors.groupingBy(Books::getBooksMethod))
        // 集約された結果が詰まったマップをソート
        .entrySet().stream().sorted(Map.Entry.<String, List<Books>>comparingByKey())
        // 順番が保証されるLinkedHashMapに詰める
        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1,
            LinkedHashMap::new));

    List<String> backgroundColorsByBar =
        chartColourHelper.getActiveRgbaList(booksByMethodMap.keySet().size(), (float) 0.5);
    List<String> borderColorsByBar =
        chartColourHelper.getActiveRgbaList(booksByMethodMap.keySet().size(), (float) 1);

    // 方法ごとに集約したのちにさらに月ごとに集約
    int indexByMethod = 0;
    // indexを使用したいためforeachではなくfor文を使用
    for (String keyByMethod : booksByMethodMap.keySet()) {
      List<Long> data = new ArrayList<>();
      Map<String, Long> booksByMethodAndMonthMap = booksByMethodMap.get(keyByMethod).stream()
          // 集約
          .collect(Collectors.groupingBy(getMonth, Collectors.summingLong(Books::getBooksAmmount)))
          // 集約された結果が詰まったマップをソート
          .entrySet().stream().sorted(Map.Entry.<String, Long>comparingByKey())
          // 順番が保証されるLinkedHashMapに詰める
          .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1,
              LinkedHashMap::new));
      booksByMethodAndMonthMap = chartColourHelper.setEntityMapByYear(booksByMethodAndMonthMap,
          booksHelper.getOneYearAgoMonth(date));
      booksByMethodAndMonthMap.forEach((keyByMonth, valueBymethod) -> {
        data.add(valueBymethod);
      });
      BooksChartByMonthDatasets bddd = new BooksChartByMonthDatasets();
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
    Map<String, List<Books>> booksByCategoryMap = booksByExpenses.stream()
        // 集約
        .collect(Collectors.groupingBy(getCatName))
        // 集約された結果が詰まったマップをソート
        .entrySet().stream().sorted(Map.Entry.<String, List<Books>>comparingByKey())
        // 順番が保証されるLinkedHashMapに詰める
        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1,
            LinkedHashMap::new));

    // 総支出、総収入、貯金額分も使用のため+3
    List<String> borderColorsByLine =
        chartColourHelper.getActiveRgbaList(booksByCategoryMap.keySet().size() + 3, (float) 1);

    // 方法ごとに集約したのちにさらに月ごとに集約
    int indexByLine = 0;
    // indexを使用したいためforeachではなくfor文を使用
    for (String keyByCategoryAndMonth : booksByCategoryMap.keySet()) {
      List<Long> data = new ArrayList<>();
      Map<String, Long> booksByCategoryAndMonthMap = booksByCategoryMap.get(keyByCategoryAndMonth)
          .stream()
          // 集約
          .collect(Collectors.groupingBy(getMonth, Collectors.summingLong(Books::getBooksAmmount)))
          // 集約された結果が詰まったマップをソート
          .entrySet().stream().sorted(Map.Entry.<String, Long>comparingByKey())
          // 順番が保証されるLinkedHashMapに詰める
          .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1,
              LinkedHashMap::new));
      booksByCategoryAndMonthMap = chartColourHelper.setEntityMapByYear(booksByCategoryAndMonthMap,
          booksHelper.getOneYearAgoMonth(date));
      booksByCategoryAndMonthMap.forEach((keyByMonth, valueBymethod) -> {
        data.add(valueBymethod);
      });
      BooksChartByMonthDatasets bddd = new BooksChartByMonthDatasets();
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
    Map<String, Long> _booksByMonthSumAmountDataByExpenses = booksByExpenses.stream()
        // 集約
        .collect(Collectors.groupingBy(getMonth, Collectors.summingLong(Books::getBooksAmmount)))
        // 集約された結果が詰まったマップをソート
        .entrySet().stream().sorted(Map.Entry.<String, Long>comparingByKey())
        // 順番が保証されるLinkedHashMapに詰める
        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1,
            LinkedHashMap::new));
    Map<String, Long> booksByMonthSumAmountDataByExpenses = chartColourHelper.setEntityMapByYear(
        _booksByMonthSumAmountDataByExpenses, booksHelper.getOneYearAgoMonth(date));
    BooksChartByMonthDatasets bdddByMonthSumAmountByExpenses = new BooksChartByMonthDatasets();
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
    Map<String, Long> booksByMonthSumAmountDataByIncome = booksByIncome.stream()
        // 集約
        .collect(Collectors.groupingBy(getMonth, Collectors.summingLong(Books::getBooksAmmount)))
        // 集約された結果が詰まったマップをソート
        .entrySet().stream().sorted(Map.Entry.<String, Long>comparingByKey())
        // 順番が保証されるLinkedHashMapに詰める
        .collect(Collectors.toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e1,
            LinkedHashMap::new));
    booksByMonthSumAmountDataByIncome = chartColourHelper.setEntityMapByYear(
        booksByMonthSumAmountDataByIncome, booksHelper.getOneYearAgoMonth(date));
    BooksChartByMonthDatasets bdddByMonthSumAmountByIncome = new BooksChartByMonthDatasets();
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
    BooksChartByMonthDatasets differenceBdddByMonthSumAmount = new BooksChartByMonthDatasets();
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

    BooksChartByMonthData bdd = new BooksChartByMonthData();
    bdd.setDatasets(dataSets);
    bdd.setLabels(new ArrayList<String>(booksByMonthSumAmountDataByExpenses.keySet()));

    return bdd;
  }



}
