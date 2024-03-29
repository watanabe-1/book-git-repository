package org.book.app.study.helper;

import java.io.IOException;
import java.io.InputStream;
import java.time.LocalDate;
import java.util.Arrays;
import java.util.List;
import java.util.Objects;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.apache.pdfbox.text.TextPosition;
import org.book.app.common.exception.BusinessException;
import org.book.app.study.dto.file.BooksColumn;
import org.book.app.study.dto.file.SuicaColumn;
import org.book.app.study.util.StudyDateUtil;
import org.book.app.study.util.StudyStringUtil;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

/**
 * 家計簿のHelperクラスを作成
 */
@Component
@RequiredArgsConstructor
public class BooksConvertHelper {

  /** 種別:物販 */
  private static final String TYPE_MERCHANDISE_SALES = "物販";

  /** 種別:交通 */
  private static final String TYPE_TRAFFIC = "交通";

  /** 場所:不明 */
  private static final String PLACE_UNKNOWN = "不明";

  /**
   * Suica用のPDF読み取りステッパー
   */
  private class SuicaPDFTextStripper extends PDFTextStripper {
    // 数値は後ろ、文字列は前の位置を指定
    // 先頭から、後ろ、後ろ、前、前、前、前、後ろ、後ろの順で値が入っている
    private final List<Float> expectedXs = Arrays.asList((float) 163.0, (float) 190.0, (float) 212.5, (float) 263.8,
        (float) 326.44,
        (float) 376.84, (float) 462.5, (float) 531.5359);
    private int lastIndex = 0;
    private float lastY = 0;

    /**
     * ブロックが変わったタイミングで呼ばれるメソッド<br/>
     * もともとは変更になった値を書き込むだけの処理だったが<br/>
     * 空のカラムの場合も書き込むようにしたかったためオーバーライド
     */
    @Override
    protected void writeString(String text, List<TextPosition> textPositions)
        throws IOException {
      // ブロックごとの1文字目のx座標を取得
      float currentStartX = textPositions.get(0).getX();
      int startIndex = expectedXs.indexOf(currentStartX);
      // ブロックごとの最後の文字のx座標を取得
      float currentLastX = textPositions.get(textPositions.size() - 1).getX();
      int endIndex = expectedXs.indexOf(currentLastX);
      // 現在のy座標
      float currentY = textPositions.get(0).getY();

      // カラム対象である時(1文字目または最後の文字のx座標が特定の値の時)
      if (startIndex >= 0 || endIndex >= 0) {
        int currentIndex = startIndex > 0 ? startIndex : endIndex;

        // 行が変わった時
        if (currentY != lastY) {
          lastIndex = 0;
        }

        // 飛ばした空のカラム分ループする
        for (int i = lastIndex; i < currentIndex - 1; i++) {
          // 空のカラムも区切り文字のみ出力する
          super.writeWordSeparator();
        }

        lastY = currentY;
        lastIndex = currentIndex;
      }

      super.writeString(text, textPositions);
    }

    /**
     * 行が切り変わるタイミングで呼ばれるメソッド<br/>
     * もともとは行の区切り文字を書き込むだけの処理だったが<br/>
     * 空のカラムの場合も書き込むようにしたかったためオーバーライド
     */
    @Override
    protected void writeLineSeparator() throws IOException {
      // 飛ばした空のカラム分ループ処理を行う
      for (int i = lastIndex; i < expectedXs.size() - 1; i++) {
        // 空のカラムも区切り文字のみ出力する
        super.writeWordSeparator();
      }

      super.writeLineSeparator();
    }
  }

  /**
   * 引数に指定したSuica使用履歴PDFから表データを抽出してリスト形式で返却する
   *
   * @param input Suica使用履歴PDF
   * @return PDFから抽出したテキストを
   */
  public List<SuicaColumn> suicaPdfToList(MultipartFile pdf) {
    // PDFからテキストを抽出。
    StringBuilder result = new StringBuilder();
    try (InputStream in = pdf.getInputStream();
        PDDocument doc = Loader.loadPDF(in.readAllBytes())) {
      int totalPages = doc.getNumberOfPages();
      SuicaPDFTextStripper stripper = new SuicaPDFTextStripper();
      // ページごとのループ処理ではなく
      // 最初から最後のページまでを全て一度に指定することもできるが
      // ページごとの区切りで処理を行いたいため、ページごとにループ処理を行う
      for (int pageNum = 1; pageNum <= totalPages; pageNum++) {
        stripper.setStartPage(pageNum);
        stripper.setEndPage(pageNum);
        // 出力文字列の分割文字を指定
        stripper.setWordSeparator(String.valueOf(StudyStringUtil.SEPARATOR_BY_TSV));
        // テキストがテーブルやカラムに配置されたPDFの場合、
        // 座標位置でソートしないとテーブルのセルのテキストが正しく抽出されないことがある
        // setSortByPosition(true)を使用してテキストの正しい順序を維持する
        // ただしただのテキストを抽出したい場合には余計な処理となってしまうため、
        // 必要な時だけtrueにする
        stripper.setSortByPosition(true);
        String pageText = stripper.getText(doc);

        // 前後4行(テーブルデータ以外の文字列)と「*」のみの行を省く
        String lineSeparator = stripper.getLineSeparator();
        String wordSeparator = stripper.getWordSeparator();
        String[] lines = pageText.split(lineSeparator);
        StringBuilder modifiedText = new StringBuilder();
        // 配列の範囲を超えないようにMathクラスを使用(4行より小さい場合はないと思うけど…)
        int startLine = Math.max(0, 4);
        int endLine = Math.min(lines.length - 1, lines.length - 5);
        int dayLine = Math.min(lines.length - 1, lines.length - 4);
        // pdf出力日(下から4行目)
        String strDate = lines[dayLine].split(wordSeparator)[0];
        LocalDate day = StudyDateUtil.strToLocalDate(strDate, StudyDateUtil.FMT_YEAR_ONEMONTH_ONEDAY_SLASH);

        // 前後4行分を除いて取り出す
        for (int i = startLine; i <= endLine; i++) {
          String line = lines[i];
          String[] words = line.split(wordSeparator);
          // 5番目の項目が「*」だけの行は除く
          if (words.length >= 5 && !Objects.equals("*", words[4])) {
            int month = Integer.parseInt(words[0]);
            // 公式から取得できるSuica履歴PDFに年データがないため
            // PDFが出力された日から26周いないのデータしか取得できないことを利用し
            // PDFに記載されている月が何年の月なのか判定する
            int year = StudyDateUtil.getYearOfMonthInPreviousWeeks(day, 26, month)
                .orElseThrow(() -> new BusinessException(
                    "1.01.01.1001"));
            // 頭に年を追加
            StringBuilder sb = new StringBuilder().append(year).append(wordSeparator).append(line);
            modifiedText.append(sb.toString());
            modifiedText.append(lineSeparator);
          }
        }
        result.append(modifiedText.toString());
      }
    } catch (IOException e) {
      throw new BusinessException("1.01.01.1001", e.getMessage());
    }

    return StudyStringUtil.tsvStrToList(result.toString(), SuicaColumn.class, false);
  }

  /**
   * Suicaの履歴データのリストを家計簿形式のListに変換
   * 
   * @param list Suicaの履歴データのリスト
   * @return 家計簿形式のリスト
   */
  public List<BooksColumn> suicaListToBooksList(List<SuicaColumn> list) {
    return list
        .stream()
        .filter(suica -> {
          String amount = suica.getAmount();

          // 金額に値が入っているかつ支出のみ
          return !StudyStringUtil.isNullOrEmpty(amount)
              && Objects.equals(amount.substring(0, 1), "-");
        })
        .map(suica -> {
          BooksColumn col = new BooksColumn();
          // マイナス、プラスの区別はしない
          col.setBooksAmmount(Integer.parseInt(suica.getAmount().replace(",", "").substring(1)));
          col.setBooksDate(LocalDate.of(suica.getYear(), suica.getMonth(), suica.getDay()));
          col.setBooksMethod("Suica");
          col.setBooksPlace(Objects.equals(suica.getType(), TYPE_MERCHANDISE_SALES) ? PLACE_UNKNOWN
              : String.format("%s→%s", suica.getStation(), suica.getStation2()));
          // とりあえずカテゴリーは固定で記載
          col.setCatName(Objects.equals(suica.getType(), TYPE_MERCHANDISE_SALES) ? suica.getType() : TYPE_TRAFFIC);

          return col;
        })
        .toList();
  }

}
