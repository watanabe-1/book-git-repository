package org.book.app.study.util;

import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Objects;
import java.util.regex.Matcher;
import java.util.regex.Pattern;
import java.util.stream.Collectors;

import javax.script.ScriptException;

import org.book.app.common.exception.BusinessException;
import org.book.app.study.api.js.ServerApi;
import org.book.app.study.form.Form;
import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.HostAccess;
import org.springframework.lang.NonNull;
import org.springframework.web.servlet.ModelAndView;

import com.oracle.truffle.js.scriptengine.GraalJSScriptEngine;

import jakarta.servlet.http.HttpServletRequest;
import lombok.AccessLevel;
import lombok.NoArgsConstructor;
import lombok.extern.slf4j.XSlf4j;

/**
 * js(react)実行用utilクラス
 *
 */
@XSlf4j
@NoArgsConstructor(access = AccessLevel.PRIVATE)
public class StudyJsUtil {

  /**
   * reactjs用view名
   */
  public static final String VIEW_NAME = "common/frame";

  /**
   * reactjs用view-title
   */
  public static final String VIEW_TITLE = "jsTitle";

  /**
   * reactjs用view-body
   */
  public static final String VIEW_BODY = "jsBody";

  /**
   * reactjs用view-script
   */
  public static final String VIEW_SCRIPT = "jsScript";

  /**
   * depens.bundle.jsのパス
   */
  private static final String DEPENS_BUNDLE_PATH = "/static/js/depens.bundle.js";

  /**
   * webapi.bundle.jsのパス
   */
  private static final String WEBAPI_BUNDLE_PATH = "/static/js/webapi.bundle.js";

  /**
   * js実行テンプレートのセット
   * 
   * @param model モデル
   * @param title タイトル
   * @param request リクエスト
   * @param scriptPath jsファイルのパス
   * @param serverApi jsに埋め込むjavaオブジェクト
   * @param form ssr判定用兼パラメータ用
   */
  public static void setJsTemplate(ModelAndView model, String title, HttpServletRequest request,
      @NonNull String scriptPath, ServerApi serverApi, Form form) {
    setJsTemplate(model, title, request, scriptPath, serverApi, isSSR(form));
  }

  /**
   * js実行テンプレートのセット
   * 
   * @param model モデル
   * @param title タイトル
   * @param request リクエスト
   * @param scriptPath jsファイルのパス
   * @param serverApi jsに埋め込むjavaオブジェクト
   * @param isSSR jsを実行するか
   */
  public static void setJsTemplate(ModelAndView model, String title, HttpServletRequest request,
      @NonNull String scriptPath, ServerApi serverApi, boolean isSSR) {
    model.setViewName(VIEW_NAME);

    // react用bodyを作成
    String body = render(request, scriptPath, serverApi, isSSR);
    // scriptタグの抜き出し
    List<String> scriptList = readScripts(body);
    body = StudyStringUtil.delete(body, scriptList);
    log.info("1.03.01.1004", () -> new Object[] { scriptList.size() });

    model.addObject(VIEW_TITLE, title);
    model.addObject(VIEW_BODY, body);
    model.addObject(VIEW_SCRIPT, scriptList.stream().collect(Collectors.joining("")));
  }

  /**
   * react jsを読み込み実行する<br/>
   * もしくはreact js をクライアントで実行する環境を整える
   * 
   * @param request リクエスト
   * @param scriptPath jsファイルのパス
   * @param serverApi jsに埋め込むjavaオブジェクト
   * @param isSSR jsを実行するか
   * @return 実行結果
   */
  public static String render(HttpServletRequest request,
      @NonNull String scriptPath, ServerApi serverApi,
      boolean isSSR) {
    return isSSR ? renderSSR(request, scriptPath, serverApi)
        : renderCSR(request, scriptPath);
  }

  /**
   * react jsを読み込み実行する<br/>
   * 
   * @param request リクエスト
   * @param scriptPath jsファイルのパス
   * @param serverApi jsに埋め込むjavaオブジェクト
   * @return 実行結果
   */
  public static String renderSSR(HttpServletRequest request, @NonNull String scriptPath,
      ServerApi serverApi) {
    GraalJSScriptEngine engine = initializeEngine(request, scriptPath, serverApi);
    String ret = null;
    try {
      String url = request.getRequestURL().toString();
      String queryString = request.getQueryString();
      String fullUrl = new StringBuffer().append(url).append("?").append(queryString).toString();

      ret = engine.eval(String.format("window.renderAppOnServer('%s');", fullUrl))
          .toString();
    } catch (ScriptException e) {
      log.error("1.03.01.1001", e);
      throw new BusinessException("1.01.01.1010", e.getMessage());
    }
    return new StringBuffer()
        .append(addRoute(ret))
        .append(createSourcePathScript(scriptPath, request.getContextPath()))
        .append(createRenderWhenAvailableScript("hydrateApp"))
        .toString();
  }

  /**
   * react jsをクライアントで実行する<br/>
   * 
   * @param request リクエスト
   * @param scriptPath jsファイルのパス
   * @return 実行準備結果
   */
  public static String renderCSR(HttpServletRequest request, String scriptPath) {
    return new StringBuffer()
        .append(addRoute(""))
        .append(createSourcePathScript(scriptPath, request.getContextPath()))
        .append(createRenderWhenAvailableScript("renderApp"))
        .toString();
  }

  /**
   * ルートタグを付与
   * 
   * @param base ベース
   * @return 付与結果
   */
  private static String addRoute(String base) {
    return new StringBuffer()
        .append("<div id=\"root\">")
        .append(base)
        .append("</div>\n")
        .toString();
  }

  /**
   * reactのレンダリング処理実行スクリプトタグ作成
   * 
   * @param renderName 実行関数名
   * @return レンダリング処理実行スクリプトタグ
   */
  private static String createRenderWhenAvailableScript(String renderName) {
    String base = "<script type=\"module\">function renderWhenAvailable() {window.%s?window.%s()"
        + ": window.setTimeout(renderWhenAvailable, 100)}renderWhenAvailable()</script>";

    return String.format(base, renderName, renderName);
  }

  /**
   * ソースパス格納スクリプトタグ作成
   * 
   * @param scriptPath ファイルパス
   * @param contextPath コンテキストパス
   * @return ソースパス格納スクリプトタグ
   */
  private static String createSourcePathScript(String scriptPath, String contextPath) {
    return String.format("<script src=\"%s\"></script>",
        scriptPath.replace("/static", contextPath));
  }

  /**
   * jsファイル実行出力結果からscriptタグをすべて取得
   * 
   * @param outPut jsファイル出力結果
   * @return サーバーデータ格納scriptタグ
   */
  private static List<String> readScripts(String outPut) {
    // 正規表現のパターンを作成
    // [\s\S] = 改行を含む全ての文字１字
    // * = 直前の文字を0文字以上繰り返す
    // ? = ?をつけることで最小マッチ（条件に合う最も短い範囲）
    Pattern p = Pattern.compile("<script[\\s\\S]*?</script>");
    Matcher m = p.matcher(outPut);
    List<String> ret = new ArrayList<>();
    int cnt = 0;
    while (m.find()) {
      String script = m.group();
      ret.add(script);
      log.info("1.03.01.1005", cnt++, script);
    }

    // <script src= から始まるものを先頭に変更し、それ以外は昇順でソート(見栄え用)
    return ret.stream()
        .sorted(Comparator.comparing(script -> script.indexOf("src=") >= 0
            ? new StringBuffer().append("a").append(script).toString()
            : new StringBuffer().append("z").append(script).toString()))
        .toList();
  }

  /**
   * jsファイルの読み込み
   * 
   * @param path パス
   */
  public static String readJsFile(@NonNull String path) {
    return StudyFileUtil.readClassPathFile(path, StandardCharsets.UTF_8.name());
  }

  /**
   * js実行エンジンの初期化
   * 
   * @param request リクエスト
   * @param scriptPath jsファイルのパス
   * @param serverApi jsに埋め込むjavaオブジェクト
   * @return js実行エンジン
   */
  private static GraalJSScriptEngine initializeEngine(HttpServletRequest request, @NonNull String scriptPath,
      ServerApi serverApi) {
    GraalJSScriptEngine engine = GraalJSScriptEngine.create(
        null,
        Context
            .newBuilder("js")
            .allowHostAccess(HostAccess.ALL)
            .allowHostClassLookup(s -> true)
    // .allowIO(true)
    // .allowExperimentalOptions(true)
    // .option("js.nashorn-compat", "true")
    );
    try {
      // window、navigator、selfをそのままだと解決できないため、グルーバルオブジェクトとして定義
      engine.eval("navigator = { userAgent: 'server'}");
      engine.eval("self = {}");
      engine.eval("bind = {}");
      engine.eval(String.format(
          "window = { location: { hostname: 'localhost' }, navigator: navigator, isServer: true, requestUrl: \"%s\", contextPath: \"%s\" }",
          request.getRequestURI(), request.getContextPath()));

      // api
      if (!Objects.isNull(serverApi)) {
        engine.put("api", serverApi);
        engine.eval("window.api = api");
      }

      engine.eval(readJsFile(DEPENS_BUNDLE_PATH));
      // TextEncoderがwebapi(ブラウザで用意されているapi)のため別で読み込みしなおす
      // text-encoding-polyfill
      engine.eval(readJsFile(WEBAPI_BUNDLE_PATH));
      engine.eval("TextEncoder = window.TextEncoder");
      engine.eval("setTimeout = window.setTimeout");
      engine.eval(readJsFile(scriptPath));
    } catch (ScriptException e) {
      log.error("1.03.01.1001", e);
      throw new BusinessException("1.01.01.1010", e.getMessage());
    }

    return engine;
  }

  /**
   * SSRを行うか判定する
   * 
   * @param form フォーム
   */
  public static boolean isSSR(Form form) {
    return form != null && !StudyStringUtil.isNullOrEmpty(form.getSsr());
  }
}
