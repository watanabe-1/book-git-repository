package org.book.app.study.api;

import java.util.List;
import org.book.app.study.dto.file.BooksColumn;
import org.book.app.study.dto.ui.BooksUi;
import org.book.app.study.entity.Books;
import org.book.app.study.enums.type.BooksType;
import org.book.app.study.form.BooksForm;
import org.book.app.study.helper.BooksHelper;
import org.book.app.study.service.BooksService;
import org.book.app.study.service.api.BooksApiService;
import org.book.app.study.util.StudyModelUtil;
import org.book.app.study.util.StudyStringUtil;
import org.book.app.study.util.StudyUtil;
import org.book.app.study.view.DownloadCsvView;
import org.springframework.stereotype.Controller;
import org.springframework.validation.BindException;
import org.springframework.validation.BindingResult;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.servlet.ModelAndView;
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
    throwBindExceptionIfNeeded(result);

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
  public ModelAndView download(@ModelAttribute BooksForm form, ModelAndView model) {
    model.setViewName(StudyStringUtil.getlowerCaseFirstClassName(DownloadCsvView.class));

    String fileNameType =
        StudyStringUtil.isNullOrEmpty(form.getBooksYear()) ? "ALL" : form.getBooksYear();
    List<BooksColumn> columnList = booksHelper.listBooksToListBooksColumn(
        booksHelper.finByYearAndType(form.getBooksYear(), form.getBooksType()));

    model.addObject(StudyModelUtil.MODEL_KEY_FILE_NAME, String.format("家計簿_%s_%s",
        BooksType.codeOf(form.getBooksType()).getName(), fileNameType));
    model.addObject(StudyModelUtil.MODEL_KEY_FILE_DATA, columnList);
    model.addObject(StudyModelUtil.MODEL_KEY_FILE_DATA_CLASS, BooksColumn.class);

    return model;
  }
}
