# API

## 環境

```
$ node -v
v22.17.0
$ npx wrangler -v

 ⛅️ wrangler 4.23.0
───────────────────
```

## 前準備

### 実行環境を作成

```sh
npm install
```

### Cloudflare と連携

デスクトップ環境にて、以下を実行

```sh
npx wrangler login
```

ブラウザが開き、ログイン後、ターミナルでログインに成功したログが出力される。

## 操作方法

### R2 バケット

#### 作成方法

```sh
npx wrangler r2 bucket create cfblog-practice
```

#### 削除

```sh
npx wrangler r2 bucket delete cfblog-practice
```

### D1 データベース

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

#### seed の作成

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
## マイグレーションの名称
MIGRATION_NAME=define-new-table
## マイグレーションを作成
npx wrangler d1 migrations create cfblog-practice ${MIGRATION_NAME}
## 作成したマイグレーションへprismaで書き込み
npx prisma migrate diff --from-local-d1 --to-schema-datamodel ./prisma/schema.prisma --script --output migrations/<SQLファイル>
## マイグレーションを適応
npx wrangler d1 migrations apply cfblog-practice --local
```

#### D1 データベース削除

```sh
## d1のリストを取得
npx wrangler d1 list
## データベースの削除
npx wrangler d1 delete cfblog-practice
```

### API 操作

データを仮登録

```sh
## APIを起動
npm run dev
## トークンを発行
curl -H "Content-Type: application/json" -X POST http://localhost:8787/user/admin -d '{"handle": "admin", "passwd": "admin"}'

## D1へデータ登録
curl -H "Authorization: Bearer <token>" -H "Content-Type: application/json" -X POST -d "{\"pageId\": \"sample\", \"title\": \"sample\", \"text\": \"sampletext\", \"date\": \"2025-06-17 13:57:24\", \"tags\": [\"hoge\"]}"  http://localhost:8787/pages
## 取得
curl http://localhost:8787/pages/sample
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

## 本番構築

### デプロイ

```sh
## リモートデプロイ
npx wrangler d1 migrations apply cfblog-practice --remote
## シードの登録
npm run seed:remote
## デプロイ
npm run deploy
## JWTを生成
tsx -e "console.log(require('crypto').randomBytes(256).toString('base64'));"
## 登録
npx wrangler secret put JWT_SECRET
```

### デストロイ

```sh
## workerを削除
npx wrangler delete
## DB削除
npx wrangler d1 delete cfblog-practice
## バケット削除
npx wrangler r2 bucket delete cfblog-practice
```
