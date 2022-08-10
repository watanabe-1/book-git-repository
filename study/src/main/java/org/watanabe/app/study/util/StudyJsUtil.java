package org.watanabe.app.study.util;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.Objects;
import java.util.StringJoiner;
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

  /**
   * jsを読み込み実行する
   * 
   * @param request リクエスト
   * @param scriptPath jsファイルのパス
   * @param serverApi jsに埋め込むjavaオブジェクト
   * @return 実行結果
   * @throws ScriptException
   * @throws IOException
   */
  public static String render(HttpServletRequest request, String scriptPath, ServerApi serverApi)
      throws ScriptException, IOException {
    GraalJSScriptEngine engine = initializeEngine(request, scriptPath, serverApi);
    StringJoiner joiner = new StringJoiner("");
    joiner.add("<div id=\"root\">");
    joiner.add(engine.eval("window.renderAppOnServer()").toString());
    joiner.add("</div>\n");
    joiner.add(String.format("<script src=\"%s\"></script>\n",
        scriptPath.replace("/static", request.getContextPath())));
    joiner.add(
        "<script type=\"module\">function renderWhenAvailable() {window.renderApp ? window.renderApp()"
            + ": window.setTimeout(renderWhenAvailable, 100)}renderWhenAvailable()</script>");

    return joiner.toString();
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
    BufferedReader reader = new BufferedReader(new InputStreamReader(in));
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
    GraalJSScriptEngine engine = GraalJSScriptEngine.create(
        null,
        Context
            .newBuilder("js")
            .allowHostAccess(HostAccess.ALL)
            .allowHostClassLookup(s -> true));

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
    try {
      engine.eval(readFile("/static/js/depens.bundle.js"));
      engine.eval(readFile(scriptPath));
    } catch (ScriptException e) {
      log.error("", e.toString());
    }

    return engine;
  }
}
