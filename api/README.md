# API
## 環境

```
$ node -v
v22.16.0
$ npx wrangler -v

 ⛅️ wrangler 4.20.0
───────────────────
```

## 前準備

### npm install

実行環境を作成
```sh
npm install
```

### wrangler login

デスクトップ環境にて、以下を実行
```sh
npx wrangler login
```
ブラウザが開き、ログイン後、ターミナルでログインに成功したログが出力される。


## 構築

### データベース作成

```sh
npx wrangler d1 create cfblog-practice
##
npx wrangler d1 migrations create cloudflare-d1-practice create-post-table
## prismaによるDBマイグレーションを作成
npx prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script --output migrations/0001_create-tables.sql
## スキーマをコードに変換
npx prisma generate
```

マイグレーションをローカルへ適応
```sh 
npx wrangler d1 migrations apply cfblog-practice --local
```

データを仮登録
```sh
## D1へデータ登録
curl -H "Content-Type: application/json" -X POST -d "{\"pageId\": \"sample\", \"title\": \"sample\", \"text\": \"sampletext\", \"date\": \"2025-06-17 13:57:24\"}" http://localhost:8787/upload/post
## R2へイメージアップロード
curl -H "Content-Type: image/png" -X POST --data-binary @${PWD}/testimg.png  http://localhost:8787/upload/image
```

データの参照
```sh
## 登録したD1データベースを参照
curl http://localhost:8787/sample
```

## テスト

