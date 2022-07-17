# book-git-repository
## java spring frameworkの勉強用に自分用家計簿の作成

### pull後の流れ
1. book-git-repository\study\WebContent\node_modules に使用しているライブラリ情報が入っている
    - node.jsのnpmコマンドを使用 → [node.js](https://nodejs.org/ja/)
2. package.jsonをもとに自環境にライブラリーをインストール
    - book-git-repository\npmで`npm install`コマンドを実施
    - book-git-repository\npm\npm_install.batを実行すると上記コマンドが実行される
3. インストールしたモジュールから本プロジェクトで使用している下記ファイルのみ、下記パスに移動させる
    - book-git-repository\npm\copy_node_modules.batを実行することで指定のフォルダにファイルの配置が行われる
4. book-git-repository\study\WebContent\images内の画像を好きな画像に変更する

### bootstrap
> node_modules\bootstrap\dist\js\bootstrap.min.js  
> → book-git-repository\study\WebContent\js\npm\bootstrap  
> node_modules\bootstrap\dist\css\bootstrap.css  
> →book-git-repository\study\WebContent\css\npm\bootstrap

### bootstrap-icons
> node_modules\bootstrap-icons\font\bootstrap-icons.css  
> →book-git-repository\study\WebContent\css\npm\bootstrap  
> node_modules\bootstrap-icons\font\fonts  
> →book-git-repository\study\WebContent\css\npm\bootstrap

### chart.js
> node_modules\chart.js\dist\chart.min.js  
> → book-git-repository\study\WebContent\js\npm\chart.js

### flatpickr
> node_modules\flatpickr\dist\flatpickr.min.js  
> → book-git-repository\study\WebContent\js\npm\flatpickr  
> node_modules\flatpickr\dist\l10n\ja.js  
> → book-git-repository\study\WebContent\js\npm\flatpickr\l10n  
> node_modules\flatpickr\dist\plugins\monthSelect\index.js  
> →book-git-repository\study\WebContent\js\npm\flatpickr\plugins\monthSelect  
> node_modules\flatpickr\dist\flatpickr.min.css  
> →book-git-repository\study\WebContent\css\npm\flatpickr  
> node_modules\flatpickr\dist\plugins\monthSelect\style.css  
> →book-git-repository\study\WebContent\css\npm\flatpickr\plugins\monthSelect

### popper.js
> node_modules\popper.js\dist\umd\popper.min.js  
> → book-git-repository\study\WebContent\js\npm\popper.js
