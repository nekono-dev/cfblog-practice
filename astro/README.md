# Astro

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
apt install docker.io
sudo gpasswd --add $USER docker
newgrp docker
```

### クライアントを生成

```sh
## クライアントを作成
./gen_client
## 権限を修正
sudo chown -R <user> src/client/
```

### APIサーバを起動

あらかじめAPIサーバを起動しておくこと

```sh
## apiディレクトリへ移動
cd ../api
npm run dev
## 本ディレクトリに復帰
cd ../astro
```

## フロントエンドの開始

```sh
npm run dev
```
