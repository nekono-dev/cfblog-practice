#!/bin/bash
cd $(dirname $0)

cd ../api

## 開発サーバ起動
npm run dev &
sleep 3s
PID=`ps aux | grep "node" | grep "wrangler dev" | awk '{ print $2 }'`

cd ../astro
## クライアントをジェネレート
docker run --net host --rm -v ${PWD}/src:/local openapitools/openapi-generator-cli generate -i http://localhost:8787/openapi.json -g typescript-fetch -o /local/client
## クライアントを移行
echo "$PID"
echo "$PID" | xargs kill
sleep 3s