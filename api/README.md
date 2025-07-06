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

### 実行環境を作成

```sh
npm install
```

### Cloudflareと連携

デスクトップ環境にて、以下を実行

```sh
npx wrangler login
```

ブラウザが開き、ログイン後、ターミナルでログインに成功したログが出力される。

## 操作方法

### R2バケット

#### 作成方法

```sh
npx wrangler r2 bucket create cfblog-practice
```

#### 削除

```sh
npx wrangler r2 bucket delete cfblog-practice
```

### D1データベース

#### 作成方法

```sh
## D1作成
npx wrangler d1 create cfblog-practice
## マイグレーションの作成
npx wrangler d1 migrations create cfblog-practice initialize-table
## prismaによるDBマイグレーションを作成
npx prisma migrate diff --from-empty --to-schema-datamodel ./prisma/schema.prisma --script --output migrations/0001_initialize-table.sql
## スキーマをコードに変換
npx prisma generate
#マイグレーションをローカルへ適応
npx wrangler d1 migrations apply cfblog-practice --local
```

#### seedの作成

```sh
npm run seed
## 既存DBも全部削除する場合
npm run reset
```

#### データベース更新後

https://www.prisma.io/docs/orm/overview/databases/cloudflare-d1#3-generate-sql-statements-using-prisma-migrate-diff-1

```sh
## 定義の更新
npx prisma generate 
## マイグレーションを作成
npx wrangler d1 migrations create cfblog-practice update-table
## 作成したマイグレーションへprismaで書き込み
npx prisma migrate diff --from-local-d1 --to-schema-datamodel ./prisma/schema.prisma --script --output migrations/<SQLファイル>
## マイグレーションを適応
npx wrangler d1 migrations apply cfblog-practice --local
```

#### D1データベース削除

```sh
## d1のリストを取得
npx wrangler d1 list
## データベースの削除
npx wrangler d1 delete cfblog-practice
```


### API操作

データを仮登録

```sh
## APIを起動
npm run dev
## ログイン
curl -H "Content-Type: application/json" -X POST http://localhost:8787/user/admin -d '{"handle": "admin", "passwd": "admin"}'

## D1へデータ登録
curl -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -X POST -d "{\"pageId\": \"sample\", \"title\": \"sample\", \"text\": \"sampletext\", \"date\": \"2025-06-17 13:57:24\", \"tags\": [\"hoge\"]}"  http://localhost:8787/pages
## 取得
curl http://localhost:8787/pages/sample

## R2へイメージアップロード
curl -H "Content-Type: image/png" -X POST --data-binary @${PWD}/testimg.png  http://localhost:8787/upload/image
## uuid bf12fdcfa28d476e975288af0f184af4.png
## ユーザ登録
curl -H "Content-Type: application/json" -X POST http://localhost:8787/signup -d '{"handle": "test", "passwd": "testuser"}'
## トークンを使ってログイン専用ページへアクセス
curl -H "Authorization: Bearer <token>" -H "Content-Type: application/json" http://localhost:8787/user/profile
```

データの参照

```sh
## 登録したD1データベースを参照
curl http://localhost:8787/sample
```


## テスト

開発サーバを起動しておく
```sh
npm run dev
```

テストの実行
```sh
npm run test
```

### 本番構築

```sh
npx wrangler secret put JWT_SECRET
```