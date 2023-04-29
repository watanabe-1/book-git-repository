package org.book.app.study.api;

import java.util.Comparator;
import java.util.List;
import org.book.app.study.dto.ui.BooksUi;
import org.book.app.study.entity.Books;
import org.book.app.study.form.BooksForm;
import org.book.app.study.helper.BooksHelper;
import org.book.app.study.service.BooksService;
import org.book.app.study.service.api.BooksApiService;
import org.book.app.study.util.StudyUtil;
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
   * 画面情報取得
   * 
   * @return json(カテゴリーごとの家計簿情報)
   */
  @RequestMapping(value = "/books/info", method = RequestMethod.GET)
  @ResponseBody
  public BooksUi getInfo() {
    return booksApiService.getInfo();
  }

  /**
   * カテゴリー登録
   * 
   * @param form 送信されたデータ
   * @param result エラーチェック]-+結果
   * @param model モデル
   * @return json
   */
  @RequestMapping(value = "/books/result", method = RequestMethod.POST)
  @ResponseBody
  public String result(@ModelAttribute @Validated BooksForm form,
      BindingResult result, ModelAndView model) throws BindException {
    throwBindExceptionIfNeeded(result);

    model.setViewName("/thymeleaf/books/result");
    List<Books> booksList = booksHelper.csvToBooksList(form.getBooksFile(), form.getBooksType());
    // 取得したファイル内の日付の最小値、最大値、帳票タイプ(支出)に合わせて今登録済みの内容を削除
    booksService.deleteByBooksDateAndBooksTypeAndUserId(
        booksList.stream().min(Comparator.comparing(Books::getBooksDate)).get().getBooksDate(),
        booksList.stream().max(Comparator.comparing(Books::getBooksDate)).get().getBooksDate(),
        form.getBooksType(), StudyUtil.getLoginUser());
    booksService.saveBulk(booksList);

    return null;

  }
}
