# book-git-repository

## java spring framework の勉強用に自分用家計簿の作成

### pull 後の流れ

1. book-git-repository\study に使用しているライブラリ情報が入っている
   - gradle の コマンドを使用
   - node.js の npm コマンドを使用 → [node.js](https://nodejs.org/ja/)
2. package.json をもとに自環境にライブラリーをインストール
   - book-git-repository\study で`gradlew npmInstall`コマンドを実施(初回のみ)
3. webpack を使用し js をビルド
   - book-git-repository\study で`gradlew webpack`コマンドを実施
4. gradle を使用し eclips プロジェクトの作成
   - book-git-repository\study で`gradlew eclips`コマンドを実施
5. eclips に gradle プロジェクトとして import
6. 動的 web プロジェクトに変更
7. デプロイメントアセンブリーに WebContent 配下と外部との依存関係を追加
8. お好みで book-git-repository\study\WebContent\images 内の画像を好きな画像に変更する
