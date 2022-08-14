package org.watanabe.app.study.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.util.Objects;
import java.util.stream.Collectors;
import javax.script.ScriptException;
import javax.servlet.http.HttpServletRequest;
import org.graalvm.polyglot.Context;
import org.graalvm.polyglot.HostAccess;
import org.springframework.core.io.ClassPathResource;
import org.watanabe.app.study.api.ServerApi;
import com.oracle.truffle.js.scriptengine.GraalJSScriptEngine;
import lombok.extern.slf4j.XSlf4j;

/**
 * コントローラーの抽象クラス<br/>
 * サーバーでjsを実行する設定を行う
 *
 */
@XSlf4j
public abstract class StudyJsUtil {

  public static final String viewName = "common/frame";

  /**
   * react jsを読み込み実行する<br/>
   * もしくはreact js をクライアントで実行する環境を整える
   * 
   * @param request リクエスト
   * @param scriptPath jsファイルのパス
   * @param serverApi jsに埋め込むjavaオブジェクト
   * @param isSSR jsを実行するか
   * @return 実行結果
   * @throws ScriptException
   * @throws IOException
   */
  public static String render(HttpServletRequest request, String scriptPath, ServerApi serverApi,
      boolean isSSR) {
    String ret = "";
    try {
      ret = isSSR ? renderSSR(request, scriptPath, serverApi) : renderCSR(request, scriptPath);
    } catch (ScriptException e) {
      log.error("", e.getMessage());
    } catch (IOException e) {
      log.error("", e.getMessage());
    }
    return ret;
  }

  /**
   * react jsを読み込み実行する<br/>
   * 
   * @param request リクエスト
   * @param scriptPath jsファイルのパス
   * @param serverApi jsに埋め込むjavaオブジェクト
   * @return 実行結果
   * @throws ScriptException
   * @throws IOException
   */
  public static String renderSSR(HttpServletRequest request, String scriptPath, ServerApi serverApi)
      throws ScriptException, IOException {
    GraalJSScriptEngine engine = initializeEngine(request, scriptPath, serverApi);
    String ret = new StringBuffer()
        .append(addRoute(engine.eval("window.renderAppOnServer()").toString()))
        .append(createSourcePathScript(scriptPath, request.getContextPath()))
        .append(createIsSSRScript(true))
        .toString();

    // root配下にサーバーデータ格納scriptタグを含めないようにする(hydrate時に差分が出ないように)
    StringBuffer serverDataScripts = new StringBuffer();
    // 最大1000まで
    int cnt = 0;
    while (cnt < 1000) {
      String serverDataScript = readServerDataScript(ret);
      if (!StudyStringUtil.isNullOrEmpty(serverDataScript)) {
        serverDataScripts.append(serverDataScript);
        ret = ret.replace(serverDataScript, "");
      } else {
        break;
      }
      cnt++;
    }
    ret = new StringBuffer()
        .append(ret)
        .append(serverDataScripts.toString())
        .append(createRenderWhenAvailableScript("hydrateApp"))
        .toString();
    log.info("", new StringBuffer().append("置換script数:").append(cnt));

    return ret;
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
        .append(createIsSSRScript(false))
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
   * ソースパス格納スクリプトタグ作成
   * 
   * @param scriptPath ファイルパス
   * @param contextPath コンテキストパス
   * @return ソースパス格納スクリプトタグ
   */
  private static String createRenderWhenAvailableScript(String renderName) {
    String base =
        "<script type=\"module\">function renderWhenAvailable() {window.%s?window.%s()"
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
    return String.format("<script src=\"%s\"></script>\n",
        scriptPath.replace("/static", contextPath));
  }

  /**
   * ssrが行われたか判定したスクリプトタグ作成
   * 
   * @param isSSR ssrを行ったか
   * @return スクリプトタグ
   */
  private static String createIsSSRScript(boolean isSSR) {
    return String.format("<script>window.isSSR = %s</script>", isSSR);
  }

  /**
   * jsファイル実行出力結果からサーバーデータ格納scriptタグ取得
   * 
   * @param outPut jsファイル出力結果
   * @return サーバーデータ格納scriptタグ
   */
  private static String readServerDataScript(String outPut) {
    String startStr = "<script class=\"serverData\">";
    String endStr = "</script>";
    int startIndex = outPut.indexOf(startStr);
    int endIndex = outPut.indexOf(endStr, startIndex) + endStr.length();

    return startIndex >= 0 ? outPut.substring(startIndex, endIndex) : "";
  }

  /**
   * jsファイルの読み込み
   * 
   * @param path パス
   * @return 読み込んだファイルの中身
   * @throws IOException
   */
  private static String readFile(String path) throws IOException {
    InputStream in = new ClassPathResource(path).getInputStream();
    BufferedReader reader =
        new BufferedReader(new InputStreamReader(in, StandardCharsets.UTF_8.name()));
    log.info("", new StringBuffer().append(path).append(" js file loaded."));

    return reader.lines().collect(Collectors.joining());
  }

  /**
   * js実行エンジンの初期化
   * 
   * @param request リクエスト
   * @param scriptPath jsファイルのパス
   * @param serverApi jsに埋め込むjavaオブジェクト
   * @return js実行エンジン
   * @throws ScriptException
   * @throws IOException
   */
  private static GraalJSScriptEngine initializeEngine(HttpServletRequest request, String scriptPath,
      ServerApi serverApi) throws ScriptException, IOException {
    // Source loadcompatibility = Source.create("js", "load('nashorn:mozilla_compat.js')");
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
    // engine.eval("load('nashorn:mozilla_compat.js')");
    engine.eval(String.format(
        "window = { location: { hostname: 'localhost' }, isServer: true, requestUrl: \"%s\" }",
        request.getRequestURI()));

    if (!Objects.isNull(serverApi)) {
      engine.put("api", serverApi);
      engine.eval("window.api = api");
    }

    engine.eval("navigator = {}");
    // selfをそのままだと解決できないため、グルーバルオブジェクトとして定義
    engine.eval("self = {}");
    // engine.eval("TextEncoder = TextEncoder");
    try {
      engine.eval(readFile("/static/js/depens.bundle.js"));
      engine.eval(readFile(scriptPath));
    } catch (ScriptException e) {
      log.error("", e.toString());
    }

    return engine;
  }
}
