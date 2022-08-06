# book-git-repository

## java spring framework の勉強用に自分用家計簿の作成

### book-git-repository\study に使用しているライブラリ情報が入っている

本プロジェクトは gradle を使用して構築されている

- node.js の npm コマンドを使用 → [node.js](https://nodejs.org/ja/)
  - gradel から利用するため node.js をインストールしていなくても実行可能
- db は PostgreSQL を使用 → [PostgreSQL](https://www.enterprisedb.com/downloads/postgres-postgresql-downloads)

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
2. eclips や vs code に gradle プロジェクトとして import

### デバッグ(eclips)

1. [実行の構成] -> [Gradle プロジェクト] -> Gradle タスクに`bootrun --debug-jvm`コマンドを設定
2. 1 を実行
3. [実行の構成] -> [リモート Java アプリケーション] からポート:7778 にアクセス

### js のみビルドする場合

1. ライブラリのインストール(更新)
   - book-git-repository\study で`gradlew npmInstall`コマンドを実施(初回やライブラリを更新する場合)
2. webpack を使用し js をビルド
   - book-git-repository\study で`gradlew webpack`コマンドを実施
