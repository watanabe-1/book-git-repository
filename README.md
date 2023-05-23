# book-git-repository

## java spring framework の勉強用に自分用家計簿の作成

現在は thymeleaf を使用して作成した画面を勉強もかねて react を使用して同じように作成し直している途中です。

カテゴリー系画面、家計簿系画面が thymeleaf→react でだいたい作成完了しています。
それ以外の画面は thymeleaf を使用して作成されています。
もともと作成していた thymeleaf での画面は旧メニューから確認出来ます。
以下が本プロジェクトの説明になります。

本プロジェクトは gradle を使用して構築されている

- node.js の npm コマンドを使用 → [node.js](https://nodejs.org/ja/)
  - gradel から利用するため node.js をインストールしていなくても実行可能
- db は PostgreSQL を使用 → [PostgreSQL](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)
- 本プロジェクトで扱う家計簿データは楽天家計簿を参考に作成 →[楽天家計簿](https://support.rakuten-card.jp/faq/show/127262?category_id=886&return_path=%2Fcategory%2Fshow%2F886%3Fpage%3D1%26site_domain%3Dguest%26site_domain%3Dguest%26sort%3Dsort_access%26sort_order%3Ddesc&site_domain=guest)
- 家計簿データの取り込み csv 形式も楽天家計簿で出力される形式に合わせている
- SSR の実装方法に関しては右記サイトを参考に作成 →[Spring Boot で React を SSR したかった話](https://www.luku.work/spring-react-ssr)

### pull 後の流れ

book-git-repository\study に使用しているライブラリ情報が入っている

1. db 環境の作成

   - PostgreSQL をインストール → [PostgreSQL](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)
   - スキーマの作成
   - 作成したスキーマで book-git-repository\db\sql\DDL\ALL\CREATE_ALL.sql の実行
   - 作成したスキーマで book-git-repository\db\sql\DML\INSERT 内の sql の実行
   - book-git-repository\study\src\main\resources\config\properties\database.properties を環境に合わせて作成(下記参照)

     ```properties:database.properties
     jdbc.driverClassName=org.postgresql.Driver
     jdbc.url=jdbc:postgresql://localhost:5432/studydb
     jdbc.username=xxxx
     jdbc.password=xxxx
     jdbc.maxTotal=10
     ```

2. ビルドからログインまで
   - お好みで book-git-repository\study\src\main\resources\static\images 内の画像を好きな画像に変更する
   - book-git-repository\bat\commond\bootrun.bat を実行することでビルドとサーバの起動が実行される
   - サーバー起動後 admin/admin でシステム管理者としてログイン可能

### 開発環境(Java)

#### eclips を使用する場合

1. gradle を使用し eclips プロジェクトの作成
   - book-git-repository\study で`gradlew eclips`コマンドを実施
2. eclips に gradle プロジェクトとして book-git-repository\study 配下を import
3. book-git-repository\bat\commond\bootrun.bat(もしくは gradle bootrun コマンド)でサーバーが起動されている状態で compile を行うと、内容がサーバーに反映される
4. java の formatter は google が公開しているものを使用 → [google-java-format]

### 開発環境(js)

1. book-git-repository\bat\commond\daemonwatch.bat(もしくは gradlew --no-daemon watch コマンド) を起動することで js のファイル監視が可能
   - js のファイル監視がされている状態では js ファイルを編集、保存すると自動的にトラ
     ンスパイルされ book-git-repository\study\src\main\resources\static 配下に出力され、サーバに反映される。
2. js(ts、json) の formatter は prettier,eslint を使用(vscode などを使用する場合は拡張機能として導入可能)
3. また react で作成してある画面は url パラメータに ssr="ssr"を渡すことで、SSR が可能
   - 例 <http://localhost:8080/study/books/household?ssr="ssr>"

### デバッグ(eclips)

1. サーバーを起動した状態で [実行の構成] -> [リモート Java アプリケーション] からポート:7778 にアクセス
   - 通常のデバッグと同じくブレイクポイントなどが使用可能
2. js もソースマップが出力されているため、ブラウザなどでデバッグ可能
   - react のデバッグは右記 Chrome 拡張機能で可能 →[React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/fmkadmapgofadopljbjfkapdkoienihi?hl=ja)

### js のみビルドしたい場合

1. ライブラリのインストール(更新)
   - book-git-repository\study で`gradlew npmInstall`コマンドを実施
2. webpack を使用し js をビルド
   - book-git-repository\study で`gradlew webpack`コマンドを実施

### その他

- ログは book-git-repository\study\logs 配下に出力
- -DB 定義は book-git-repository\spreadsheet\DB 定義.xlsx
  - Google スプレッドシートに取り込み、book-git-repository\spreadsheet\gas 配下のマクロファイルを設定すれば create 文生成などのマクロが使用可能
- 家計簿データの例は book-git-repository\example 配下に
  - 家計簿登録画面からそのまま登録可能
- 一度ビルドが完了している場合は、book-git-repository\bat\bootrunAndDaemonwatch.bat からサーバーの起動、js ファイル監視の起動をまとめて実行可能
