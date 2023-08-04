package org.book.app.study.api;

import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;
import java.util.Objects;
import org.book.app.study.dto.file.BooksColumn;
import org.book.app.study.dto.file.SuicaColumn;
import org.book.app.study.dto.ui.books.BooksConvertUi;
import org.book.app.study.dto.ui.books.BooksUi;
import org.book.app.study.dto.ui.books.HouseholdCalendarUi;
import org.book.app.study.dto.ui.books.HouseholdChartUi;
import org.book.app.study.dto.ui.books.HouseholdUi;
import org.book.app.study.entity.Books;
import org.book.app.study.enums.type.BooksType;
import org.book.app.study.enums.type.FileType;
import org.book.app.study.form.BooksConvertForm;
import org.book.app.study.form.BooksForm;
import org.book.app.study.helper.BooksConvertHelper;
import org.book.app.study.helper.BooksHelper;
import org.book.app.study.helper.DownloadHelper;
import org.book.app.study.service.BooksService;
import org.book.app.study.service.api.BooksApiService;
import org.book.app.study.util.StudyFileUtil;
import org.book.app.study.util.StudyStringUtil;
import org.book.app.study.util.StudyUtil;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.method.annotation.StreamingResponseBody;
import lombok.AllArgsConstructor;


/**
 * 家計簿画面API
 *
 */
@Controller
@AllArgsConstructor
public class BooksApiController extends ApiController {

  /**
   * 家計簿画面apiサービス
   */
  private final BooksApiService booksApiService;

  /**
   * 家計簿 Service
   */
  private final BooksService booksService;

  /**
   * 家計簿 Helper
   */
  private final BooksHelper booksHelper;

  /**
   * ダウンロード Helper
   */
  private final DownloadHelper downloadHelper;

  /**
   * コンバート Helper
   */
  private final BooksConvertHelper booksConvertHelper;

  /**
   * アップロード画面情報取得
   * 
   * @return json(アップロード画面情報)
   */
  @RequestMapping(value = "/books/uploadInfo", method = RequestMethod.GET)
  @ResponseBody
  public BooksUi getUploadInfo() {
    return booksApiService.getUploadInfo();
  }

  /**
   * ダウンロード画面情報取得
   * 
   * @return json(ダウンロード画面情報取得)
   */
  @RequestMapping(value = "/books/downloadInfo", method = RequestMethod.GET)
  @ResponseBody
  public BooksUi getDownloadInfo() {
    return booksApiService.getDownloadInfo();
  }

  /**
   * 変換画面情報取得
   * 
   * @return json(変換画面情報)
   */
  @RequestMapping(value = "/books/convertInfo", method = RequestMethod.GET)
  @ResponseBody
  public BooksConvertUi getConvertInfo() {
    return booksApiService.getConvertInfo();
  }

  /**
   * 家計簿確認画面情報取得
   * 
   * @param form booksForm
   * @return json(家計簿確認画面情報取得)
   */
  @RequestMapping(value = "/books/householdInfo", method = RequestMethod.GET)
  @ResponseBody
  public HouseholdUi getHouseholdInfo(
      @RequestParam(name = "date", required = false) LocalDate date) {
    return booksApiService.getHouseholdInfo(date);
  }

  /**
   * 家計簿確認画面図情報取得
   * 
   * @param form booksForm
   * @return json(家計簿確認画面図情報取得)
   */
  @RequestMapping(value = "/books/householdChartInfo", method = RequestMethod.GET)
  @ResponseBody
  public HouseholdChartUi getHouseholdChartInfo(
      @RequestParam(name = "date", required = false) LocalDate date) {
    return booksApiService.getHouseholdChartInfo(date);
  }

  /**
   * 家計簿確認画面カレンダー情報取得
   * 
   * @param form booksForm
   * @return json(家計簿確認画面カレンダー情報取得)
   */
  @RequestMapping(value = "/books/householdCalendarInfo", method = RequestMethod.GET)
  @ResponseBody
  public HouseholdCalendarUi getHouseholdCalendarInfo(
      @RequestParam(name = "date", required = false) LocalDate date) {
    return booksApiService.getHouseholdCalendarInfo(date);
  }

  /**
   * 家計簿登録
   * 
   * @param form 送信されたデータ
   * @param result エラーチェック]-+結果
   * @param model モデル
   * @return null
   */
  @RequestMapping(value = "/books/result", method = RequestMethod.POST)
  @ResponseBody
  public String result(@ModelAttribute @Validated BooksForm form,
      BindingResult result, ModelAndView model) throws BindException {
    throwBindExceptionIfHasErrors(result);

    List<Books> booksList = booksHelper.csvToBooksList(form.getBooksFile(), form.getBooksType());
    // 取得したファイル内の日付の最小値、最大値、帳票タイプ(支出)に合わせて今登録済みの内容を削除
    booksService.deleteByBooksDateAndBooksTypeAndUserId(
        booksHelper.getMinBooksDate(booksList),
        booksHelper.getMaxBooksDate(booksList),
        form.getBooksType(), StudyUtil.getLoginUser());
    booksService.saveBulk(booksList);

    return null;

  }

  /**
   * 家計簿ダウンロード
   * 
   * @param form 送信されたデータ
   * @param model モデル
   * @return beenView名(viewパッケージ配下に定義)
   */
  @RequestMapping(value = "/books/download", method = RequestMethod.POST)
  public ResponseEntity<StreamingResponseBody> download(@ModelAttribute BooksForm form) {
    List<BooksColumn> columnList = booksHelper.booksListToBooksColumnList(
        booksHelper.finByYearAndType(form.getBooksYear(), form.getBooksType()));
    String fileNameType =
        StudyStringUtil.isNullOrEmpty(form.getBooksYear()) ? "ALL" : form.getBooksYear();
    String fileNameBase = String.format("家計簿_%s_%s",
        BooksType.codeOf(form.getBooksType()).getName(), fileNameType);
    String fileName = StudyFileUtil.addExtension(fileNameBase,
        StudyFileUtil.EXTENSION_BY_CSV);

    return downloadHelper.buildStreamingResponse(
        fileName, StandardCharsets.UTF_8,
        StudyStringUtil.objectToCsvStr(columnList, BooksColumn.class, true));
  }

  /**
   * 家計簿ダウンロード
   * 
   * @param form 送信されたデータ
   * @param model モデル
   * @return beenView名(viewパッケージ配下に定義)
   */
  @RequestMapping(value = "/books/convertFile", method = RequestMethod.POST)
  public ResponseEntity<StreamingResponseBody> convertFile(@ModelAttribute BooksConvertForm form) {
    String fileNameBase = String.format("家計簿_%s_%s",
        FileType.codeOf(form.getFileType()).getName(), BooksType.EXPENSES.getName());
    String fileName = StudyFileUtil.addExtension(fileNameBase,
        StudyFileUtil.EXTENSION_BY_CSV);
    ResponseEntity<StreamingResponseBody> ret = null;

    // Suicaが選択されたとき
    if (Objects.equals(FileType.SUICA.getCode(), form.getFileType())) {
      List<SuicaColumn> suciaList = booksConvertHelper.suicaPdfToList(form.getFile());
      List<BooksColumn> columnList = booksConvertHelper.suicaListToBooksList(suciaList);
      ret = downloadHelper.buildStreamingResponse(
          fileName, StandardCharsets.UTF_8,
          StudyStringUtil.objectToCsvStr(columnList, BooksColumn.class, true));
    }

    return ret;
  }

}
