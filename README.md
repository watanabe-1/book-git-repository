# book-git-repository

## java spring framework の勉強用に自分用家計簿の作成

### book-git-repository\study に使用しているライブラリ情報が入っている

本プロジェクトは gradle を使用して構築されている

- node.js の npm コマンドを使用 → [node.js](https://nodejs.org/ja/)
  - gradel から利用するため node.js をインストールしていなくても実行可能
- db は PostgreSQL を使用 → [PostgreSQL](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)
- 本プロジェクトで扱う家計簿データは楽天家計簿を参考に作成 →[楽天家計簿](https://support.rakuten-card.jp/faq/show/127262?category_id=886&return_path=%2Fcategory%2Fshow%2F886%3Fpage%3D1%26site_domain%3Dguest%26site_domain%3Dguest%26sort%3Dsort_access%26sort_order%3Ddesc&site_domain=guest)
- 家計簿データの取り込み csv 形式も楽天家計簿で出力される形式に合わせている

### pull 後の流れ

book-git-repository\study に使用しているライブラリ情報が入っている

1. db 環境の作成

   - PostgreSQL をインストール → [PostgreSQL](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)
   - スキーマの作成
   - 作成したスキーマで book-git-repository\DB\sql\DDL\ALL\CREATE_ALL.sql の実行
   - 作成したスキーマで book-git-repository\DB\sql\DML\INSERT 内の sql の実行
   - book-git-repository\study\src\main\resources\config\properties\database.properties を環境に合わせて修正

2. ビルドの実施
   - お好みで book-git-repository\study\WebContent\images 内の画像を好きな画像に変更する
   - book-git-repository\study で`gradle bootrun`コマンドを実施
   - ブラウザから[localhost:8080/study/](http://localhost:8080/study/)にアクセス
   - admin/admin でシステム管理者としてログイン可能

### 開発環境

1. gradle を使用し eclips プロジェクトの作成
   - book-git-repository\study で`gradlew eclips`コマンドを実施
2. eclips や vs code に gradle プロジェクトとして importp

### デバッグ(eclips)

1. プロジェクトを選択して[右クリック] -> [プロパティ] -> [Java のビルドパス]
   - [study/main/java]：[bin/main] -> [build/classes/java/main]に変更
   - [src/main/resources]：[bin/main] -> [build/resources/main]に変更
2. book-git-repository\study で`gradle bootrun`コマンドを設定
3. [実行の構成] -> [リモート Java アプリケーション] からポート:7778 にアクセス
   - java ファイル編集、コンパイル後に自動的にサーバーに反映される
   - 通常のデバッグと同じくブレイクポイントなどが使用可能
   - js もソースマップが出力されているため、ブラウザなどでデバッグ可能
4. js のファイル監視は`gradlew --no-daemon watch`で実行可能
   - js ファイルの編集後に自動的にトランスパイルされサーバーに反映されるようになる

### js のみビルドしたい場合

1. ライブラリのインストール(更新)
   - book-git-repository\study で`gradlew npmInstall`コマンドを実施(初回やライブラリを更新する場合)
2. webpack を使用し js をビルド
   - book-git-repository\study で`gradlew webpack`コマンドを実施

### その他

- ログは C:\logs\study 配下に出力
- -DB 定義は book-git-repository\spreadsheet\DB 定義.xlsx
  - Google スプレッドシートに取り込み、book-git-repository\spreadsheet\gas 配下のマクロファイルを設定すれば create 文生成などのマクロが使用可能
- 家計簿データの例は book-git-repository\example 配下に
- java の formatter は google が公開しているものを使用 → [git](https://github.com/google/google-java-format)
- js(ts、json) の formatter は prettier,eslint を使用
