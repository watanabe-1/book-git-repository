package org.book.app.study.helper;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Map.Entry;
import java.util.Optional;
import java.util.UUID;
import java.util.function.Function;
import java.util.stream.Collector;
import java.util.stream.Collectors;
import org.book.app.study.dto.data.BooksChartData;
import org.book.app.study.dto.data.BooksChartDatasets;
import org.book.app.study.dto.file.BooksColumn;
import org.book.app.study.dto.list.BooksFormList;
import org.book.app.study.entity.Books;
import org.book.app.study.entity.DefaultCategory;
import org.book.app.study.enums.dbcode.BooksTab;
import org.book.app.study.enums.flag.DeleteFlag;
import org.book.app.study.enums.type.BooksType;
import org.book.app.study.form.BooksForm;
import org.book.app.study.service.BooksService;
import org.book.app.study.util.StudyBeanUtil;
import org.book.app.study.util.StudyCodeUtil;
import org.book.app.study.util.StudyDateUtil;
import org.book.app.study.util.StudyFileUtil;
import org.book.app.study.util.StudyStringUtil;
import org.book.app.study.util.StudyUtil;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;
import lombok.RequiredArgsConstructor;

/**
 * 家計簿のHelperクラスを作成
 */
@Component
@RequiredArgsConstructor
public class BooksHelper {

  /**
   * 家計簿 Service
   */
  private final BooksService booksService;

  /**
   * 図の色 Helper
   */
  private final ChartColourHelper chartColourHelper;

  /**
   * カテゴリーヘルパー
   */
  private final CategoryHelper categoryHelper;

  /**
   * デフォルトカテゴリーヘルパー
   */
  private final DefaultCategoryHelper defaultCategoryHelper;

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
   * 対象の家計簿データから最大日付(収入日、購入日)を取得
   * 
   * @return 最大日付(収入日、購入日)
   */
  public Date getMaxBooksDate(List<Books> booksList) {
    return booksList.stream().max(Comparator.comparing(Books::getBooksDate)).get().getBooksDate();
  }

  /**
   * 対象の家計簿データから最少日付(収入日、購入日)を取得
   * 
   * @return 最少日付(収入日、購入日)
   */
  public Date getMinBooksDate(List<Books> booksList) {
    return booksList.stream().min(Comparator.comparing(Books::getBooksDate)).get().getBooksDate();
  }

  /**
   * 複数の家計簿データをアップデート
   * 
   * @return 更新件数
   */
  public int updatBooks(BooksFormList booksListParam) {
    List<BooksForm> booksFormList = booksListParam.getBooksDataList();
    if (booksFormList == null) {
      return 0;
    }

    // 家計簿データの更新
    int updCnt = 0;
    for (BooksForm booksForm : booksFormList) {
      if (DeleteFlag.isDelete(booksForm.getDelete())) {
        updCnt += booksService.deleteOne(booksForm.getBooksId(), StudyUtil.getLoginUser());
      } else {
        Books books = new Books();
        // フォームの値をエンティティにコピーし、共通項目をセット
        StudyBeanUtil.copyAndSetStudyEntityProperties(booksForm, books);

        updCnt += booksService.updateOne(books, booksForm.getBooksId(), StudyUtil.getLoginUser());
      }
    }

    return updCnt;
  }

  /**
   * アップロードされたファイルデータをもとにentytiにセットし返却
   * 
   * @param booksFile アップロードされたデータ
   * @param booksType アップロードされたデータの種類
   * @param charset 文字コード
   * @return Books セットされたentity
   */
  public List<Books> csvToBooksList(MultipartFile booksFile, String booksType) {
    // ログインユーザー取得
    String user = StudyUtil.getLoginUser();
    // デフォルトカテゴリーマスタ変更対象
    List<String> defCatTargets = defaultCategoryHelper.getDefaultCategoryTargets();
    List<DefaultCategory> defCatList = defaultCategoryHelper.getDefaultCategoryList();

    return StudyFileUtil.csvFileToList(booksFile, BooksColumn.class, false)
        .stream()
        .map(col -> {
          String catCode = categoryHelper.getCatCode(col.getCatName());
          String booksPlace = col.getBooksPlace();
          String booksMethod = col.getBooksMethod();

          // カテゴリーがデフォルトカテゴリーマスタ変更対象の場合
          if (defCatTargets.contains(catCode)) {
            Optional<DefaultCategory> mutchDefCat =
                defaultCategoryHelper.findOneFromDefaultCeategoryList(
                    booksPlace, booksType, booksMethod, defCatList);
            // デフォルトカテゴリーマスタに対象が設定されていたら
            if (mutchDefCat.isPresent()) {
              catCode = mutchDefCat.get().getCatCode();
            }
          }

          Books books = new Books();
          books.setBooksId(UUID.randomUUID().toString());
          books.setUserId(user);
          books.setBooksType(booksType);
          books.setBooksDate(col.getBooksDate());
          books.setBooksPlace(booksPlace);
          books.setCatCode(catCode);
          books.setBooksMethod(booksMethod);
          books.setBooksAmmount(col.getBooksAmmount());
          // 共通項目をセット
          StudyBeanUtil.setStudyEntityProperties(books);

          return books;
        }).toList();
  }

  /**
   * 家計簿リストデータの取得
   * 
   * @param date 日付
   * @param booksType 家計簿タイプ
   * @return 家計簿リストデータ
   */
  public BooksFormList getBooksFormList(Date date, String booksType) {
    BooksFormList booksFromList = new BooksFormList();
    booksFromList.setBooksDataList(
        booksListToBooksFormList(findByMonthAndType(date, booksType)));

    return booksFromList;
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
    Map<String, Long> booksByCatMap = groupByCatNameAndSortByReversedToLong(
        findByMonthAndType(date, BooksType.EXPENSES.getCode()));

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
    Map<String, Long> booksByMethodMap = groupByBooksMethodAndSortByReversedToLong(
        findByMonthAndType(date, BooksType.EXPENSES.getCode()));

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
    BooksChartData bdd = new BooksChartData();
    setChartDataByYear(bdd, date);

    return bdd;
  }

  /**
   * 1月ごとの家計簿データを取得
   * 
   * @param date 基準日付
   * @param booksType 家計簿の種類
   * @return 家計簿データ
   */
  public List<Books> findByMonthAndType(Date date, String booksType) {
    return booksService.findByBooksDateAndBooksTypeAndUserIdJoinCategory(
        StudyDateUtil.getStartDateByMonth(date), StudyDateUtil.getEndDateByMonth(date), booksType,
        StudyUtil.getLoginUser());
  }

  /**
   * 基準日から1年前までの家計簿データを取得
   * 
   * @param date 基準日付
   * @param booksType 家計簿の種類
   * @return 家計簿データ
   */
  public List<Books> findOneYearAgoByDateAndType(Date date, String booksType) {
    return booksService.findByBooksDateAndBooksTypeAndUserIdJoinCategory(
        StudyDateUtil.getOneYearAgoMonth(date), StudyDateUtil.getEndDateByMonth(date), booksType,
        StudyUtil.getLoginUser());
  }

  /**
   * 基準年の家計簿データを取得<br>
   * 基準年がnullの場合は全年度のデータ取得
   * 
   * @param date 基準日付
   * @param booksType 家計簿の種類
   * @return 家計簿データ
   */
  public List<Books> finByYearAndType(String dateStr, String booksType) {
    if (StudyStringUtil.isNullOrEmpty(dateStr)) {
      return booksService.findByBooksTypeAndUserIdJoinCategory(booksType, StudyUtil.getLoginUser());
    } else {
      Date date = StudyDateUtil.strToDate(dateStr, StudyDateUtil.FMT_YEAR);

      return booksService.findByBooksDateAndBooksTypeAndUserIdJoinCategory(date,
          StudyDateUtil.getEndDateByYear(date), booksType, StudyUtil.getLoginUser());
    }
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
   * 年月ごとのデータをセットする
   * 
   * @param bdd セット対象
   * @param booksMap セット元データ
   */
  public void setChartDataByYear(BooksChartData bdd, Date date) {
    final String RGB_WHITE = "rgba(255,255,255,1)";
    final String BAR = "bar";
    final String LINE = "line";
    final String LABEL_MAX_EXPENSES = "総支出";
    final String LABEL_MAX_INCOME = "総収入";
    final String LABEL_SAVE_AMOUNT = "貯金額";

    // 支出を取得
    List<Books> booksByExpenses = findOneYearAgoByDateAndType(date, BooksType.EXPENSES.getCode());
    // 収入を取得
    List<Books> booksByIncome = findOneYearAgoByDateAndType(date, BooksType.INCOME.getCode());;

    // セット対象
    List<BooksChartDatasets> dataSets = new ArrayList<>();

    // bar
    // 方法ごとに集約
    // ソートしているが意味はない
    // 順番が保証されるLinkedHashMapに詰める
    Map<String, List<Books>> booksByMethodMap = groupByBooksMethodAndSortToList(booksByExpenses);
    int barSize = booksByMethodMap.keySet().size();

    List<String> backgroundColorsByBar = chartColourHelper.getActiveRgbaList(barSize, (float) 0.5);
    List<String> borderColorsByBar = chartColourHelper.getActiveRgbaList(barSize, (float) 1);

    // 方法ごとに集約したのちにさらに月ごとに集約し、月順に並び替え
    int indexByMethod = 0;
    // indexを使用したいためforeachではなくfor文を使用
    for (String keyByMethod : booksByMethodMap.keySet()) {
      Map<String, Long> booksByMethodAndMonthMap =
          groupByBooksDateAndSortToLong(booksByMethodMap.get(keyByMethod));

      setChartDatasetsByYear(dataSets, dataSets.size(), booksByMethodAndMonthMap, date, keyByMethod,
          BAR, backgroundColorsByBar.get(indexByMethod), borderColorsByBar.get(indexByMethod),
          false);

      indexByMethod++;
    }

    // line
    // カテゴリー
    Map<String, List<Books>> booksByCategoryMap = groupByCatNameAndSortToList(booksByExpenses);
    int lineSize = booksByCategoryMap.keySet().size() + 3;

    // 総支出、総収入、貯金額分も使用のため+3
    List<String> borderColorsByLine = chartColourHelper.getActiveRgbaList(lineSize, (float) 1);

    // 方法ごとに集約したのちにさらに月ごとに集約
    int indexByLine = 0;
    // indexを使用したいためforeachではなくfor文を使用
    for (String keyByCategoryAndMonth : booksByCategoryMap.keySet()) {
      Map<String, Long> booksByCategoryAndMonthMap = groupByBooksDateAndSortToLong(
          booksByCategoryMap.get(keyByCategoryAndMonth));

      setChartDatasetsByYear(dataSets, dataSets.size(), booksByCategoryAndMonthMap, date,
          keyByCategoryAndMonth, LINE, RGB_WHITE, borderColorsByLine.get(indexByLine), true);

      indexByLine++;
    }

    // 総支出
    Map<String, Long> booksByMonthSumAmountDataByExpenses =
        groupByBooksDateAndSortToLong(booksByExpenses);

    // lineの先頭に追加
    setChartDatasetsByYear(dataSets, barSize, booksByMonthSumAmountDataByExpenses, date,
        LABEL_MAX_EXPENSES, LINE, RGB_WHITE, borderColorsByLine.get(indexByLine++), false);

    // 総収入
    Map<String, Long> booksByMonthSumAmountDataByIncome =
        groupByBooksDateAndSortToLong(booksByIncome);

    // lineの先頭に追加
    setChartDatasetsByYear(dataSets, barSize, booksByMonthSumAmountDataByIncome, date,
        LABEL_MAX_INCOME, LINE, RGB_WHITE, borderColorsByLine.get(indexByLine++), true);

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

    // lineの先頭に追加
    setChartDatasetsByYear(dataSets, barSize, differenceBooksByMonthSumAmountData, date,
        LABEL_SAVE_AMOUNT, LINE, RGB_WHITE, borderColorsByLine.get(indexByLine++), false);

    // セット
    bdd.setDatasets(dataSets);
    bdd.setLabels(new ArrayList<String>(chartColourHelper
        .setEntityMapByYear(new HashMap<>(), StudyDateUtil.getOneYearAgoMonth(date)).keySet()));
  }

  /**
   * 年ごとのデータセットをセットする
   * 
   * @param dataSets セット対象
   * @param dataSetsIndex 追加場所
   * @param booksMapByYear 年ごとのデータ
   * @param date 基準日付
   * @param label ラベル
   * @param type タイプ
   * @param backgroundColor バックグラウンドカラー
   * @param borderColor ボーダーカラー
   * @param isHidden 初期表示をhiddenにするか
   * 
   */
  public void setChartDatasetsByYear(List<BooksChartDatasets> dataSets, int dataSetsIndex,
      Map<String, Long> booksMapByYear, Date date, String label, String type,
      String backgroundColor, String borderColor, boolean isHidden) {
    List<Long> data = new ArrayList<>();
    booksMapByYear = chartColourHelper.setEntityMapByYear(booksMapByYear,
        StudyDateUtil.getOneYearAgoMonth(date));
    booksMapByYear.forEach((keyByMonth, value) -> {
      data.add(value);
    });

    BooksChartDatasets bddd = new BooksChartDatasets();
    bddd.setLabel(label);
    bddd.setType(type);
    bddd.setBackgroundColor(Arrays.asList(backgroundColor));
    bddd.setBorderColor(Arrays.asList(borderColor));
    bddd.setData(data);
    bddd.setHidden(isHidden);
    dataSets.add(dataSetsIndex, bddd);
  }

  /**
   * 金額を合計する
   * 
   * @param target 対象
   * @return 金額の合計
   */
  public int sumAmount(List<Books> target) {
    return target.stream().mapToInt(book -> book.getBooksAmmount()).sum();
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

  /**
   * booksリストをBooksColumnリストに変換
   * 
   * @param target 対象 List<Books>
   * @return List<BooksColumn>
   */
  public List<BooksColumn> booksListToBooksColumnList(List<Books> target) {
    return target
        .stream().map(e -> new BooksColumn(e.getBooksDate(), e.getBooksPlace(),
            e.getCatCodes().getCatName(), e.getBooksMethod(), e.getBooksAmmount()))
        .collect(Collectors.toList());
  }

  /**
   * BooksListからBooksFormListに変換
   * 
   * @param target 変換対象
   * @return BooksFormList
   */
  public List<BooksForm> booksListToBooksFormList(List<Books> target) {
    return StudyBeanUtil.createInstanceFromBeanList(target, BooksForm.class,
        books -> booksToBooksForm(books));
  }

  /**
   * BooksからBooksFormに変換
   * 
   * @param target 変換対象
   * @return BooksForm
   */
  public BooksForm booksToBooksForm(Books target) {
    return StudyBeanUtil.createInstanceFromBean(target, BooksForm.class,
        (books, booksForm) -> {
          booksForm.setCatCodes(
              categoryHelper.categoryToCategoryForm(books.getCatCodes()));
          return booksForm;
        });
  }

  /**
   * 日付を取得
   * 
   * @param form BooksForm
   * @return 日付
   */
  public Date getDate(BooksForm form) {
    return form.getDate() == null ? StudyUtil.getNowDate() : form.getDate();
  }

  /**
   * 日付を取得
   * 
   * @param date
   * @return 日付
   */
  public Date getDate(LocalDate date) {
    return date == null ? StudyUtil.getNowDate() : StudyDateUtil.LocalDateToDate(date);
  }

}
