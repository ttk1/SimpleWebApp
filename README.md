App Engine用のWebアプリたたき台、Node.js偏

# App Engineへのデプロイ

```bash
# デプロイ環境の設定ファイル作成
# https://cloud.google.com/appengine/docs/standard/nodejs/configuring-your-app-with-app-yaml?hl=ja
echo 'runtime: nodejs10' > app.yaml

# 認証処理（ブラウザが開くので、内容を確認しログイン）
gcloud init

# デプロイ
gcloud app deploy
```

# App Engineのドキュメント

## Node.jsランタイム環境

- https://cloud.google.com/appengine/docs/standard/nodejs/runtime?hl=ja

# 各パッケージのドキュメント

## Express

- https://expressjs.com/ja/guide/routing.html

## EJS

- https://github.com/mde/ejs/wiki/Using-EJS-with-Express
