# Next.js（Prisma あり）本番デプロイ手順

## 前提条件

- OS: Fedora（Docker 動作確認済）

- DB（開発）: ローカル Docker MySQL（例: localhost:3308）

- DB（本番）: AWS RDS MySQL

- アプリ本番環境: AWS ECS Fargate

- ソース管理: Git（コミット ID をイメージタグに利用）

- AWS CLI: 設定済み（aws configure 済）

- Dockerfile: Prisma ビルド時にローカル DB へ接続する設定済

## 1. ローカル動作確認用ビルド & 実行

Prisma ビルド時にローカル MySQL へアクセスするため、--add-host を必ず付ける。

```bash
# 1. ローカルビルド
docker build \
  --add-host=host.docker.internal:host-gateway \
  -t nextjs-app-local .

# 2. ローカル実行（環境変数でローカルDBを指定）
docker run --rm \
  -p 3000:3000 \
  --add-host=host.docker.internal:host-gateway \
  -e DATABASE_URL="mysql://mock:mock@host.docker.internal:3308/mock_db?charset=utf8mb4" \
  nextjs-app-local

# ブラウザで動作確認
xdg-open http://localhost:3000

```

- ポイント：

  - --add-host=host.docker.internal:host-gateway
    → Linux Docker でホスト PC の MySQL にアクセスするために必要

  - -e DATABASE_URL=...
    → 実行時に環境変数を上書き可能（Dockerfile の ENV より優先される）

## 2. ECR リポジトリ作成（初回のみ）

```bash
AWS_REGION=us-east-1
ECR_REPO_NAME=nextjs-app

aws ecr create-repository \
  --repository-name ${ECR_REPO_NAME} \
  --region ${AWS_REGION}
```

## 3. Git コミット ID 取得

```bash
  GIT_COMMIT=$(git rev-parse --short HEAD)
```

## 4. 本番用ビルド（ECR 向け）

Prisma がビルド中に DB アクセスするため、ECR 用ビルドでも --add-host が必要。

```bash
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
AWS_REGION=us-east-1
ECR_REPO_NAME=nextjs-app
GIT_COMMIT=$(git rev-parse --short HEAD)

docker build \
  --add-host=host.docker.internal:host-gateway \
  -t ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}:${GIT_COMMIT} \
  -t ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}:latest .
```

5. ECR ログイン & push

```bash
aws ecr get-login-password --region ${AWS_REGION} \
| docker login --username AWS \
--password-stdin ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com

docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}:${GIT_COMMIT}
docker push ${AWS_ACCOUNT_ID}.dkr.ecr.${AWS_REGION}.amazonaws.com/${ECR_REPO_NAME}:latest
```

## 6. ECS タスク定義更新

### 6.1 既存タスク定義を取得して編集

```bash
# 最新タスク定義を取得

aws ecs describe-task-definition \
 --task-definition ${ECR_REPO_NAME} \
 --region ${AWS_REGION} \
> task-def.json

# "image" を新しい ECR イメージに変更
# 例: "image": "123456789012.dkr.ecr.us-east-1.amazonaws.com/nextjs-app:abcd123"
```

### 6.2 新リビジョン登録

```bash

aws ecs register-task-definition \
 --cli-input-json file://task-def.json \
 --region ${AWS_REGION}
```

## 7 サービス更新（デプロイ）

```bash
CLUSTER_NAME=your-cluster
SERVICE_NAME=your-service

aws ecs update-service \
 --cluster ${CLUSTER_NAME} \
 --service ${SERVICE_NAME} \
 --force-new-deployment \
 --region ${AWS_REGION}
```

## 8 AWS マネジメント コンソール を使用する場合

1. AWS コンソール → ECS → 対象クラスター → サービス を開く

2. サービスを選択して「新しいタスク定義を作成」

3. 既存タスク定義を複製して、コンテナイメージの URI を新しいタグ（例: コミット ID or latest）に変更

4. タスク定義を登録

5. サービスを更新して、新しいタスク定義リビジョンを適用

6. デプロイが完了したら、コンテナが新イメージで動作しているか確認

## 9 動作確認（本番）

- ALB 経由の本番 URL にアクセスして確認

- CloudWatch Logs でエラーが出ていないか確認

## 9. 運用メモ

- タグ運用:

  - ${GIT_COMMIT} タグ → その時点のソースを再現できる

  - latest タグ → 常に最新を指す

- ビルド時 DB:

  - Prisma のため、ローカル Docker MySQL を立てておくこと

  - --add-host=host.docker.internal:host-gateway はローカルでも ECR 向けでも必要

- デプロイ失敗時:

  - タスク定義を以前のリビジョンに戻すことでロールバック可能

## 補足: なぜ --add-host=host.docker.internal:host-gateway が必要か

背景
host.docker.internal は、Docker コンテナから「ホストマシン（あなたの Fedora）」にアクセスするための特別なホスト名です。

Mac / Windows の Docker では最初から有効ですが、Linux ではデフォルトで無効。

そのため、Linux で使う場合は --add-host=host.docker.internal:host-gateway を指定して、コンテナの /etc/hosts にエントリを追加してあげる必要があります。

実際に何が起きているか
例えばこのオプションを付けると、コンテナ内の /etc/hosts にこんな 1 行が追加されます：

```csharp

172.17.0.1   host.docker.internal
```

ここで 172.17.0.1 はコンテナから見たホストマシンのゲートウェイ IP です。
こうすることで、mysql://...@host.docker.internal のような接続文字列が使えるようになります。

「host.docker.internal を有効化」の意味
これは単に「Linux Docker ではデフォルトで無効なので、--add-host で使えるようにする」という意味です。
Mac / Windows では不要ですが、Linux では必須です。

## タグはコミット ID がいいか？バージョン番号がいいか？

これはチーム運用の方針次第ですが：

コミット ID タグ：いつのソースから作ったイメージか完全に追跡できる（デバッグ・ロールバックしやすい）

バージョン番号タグ（例: v1.0.0）：リリースの節目に向いている

latest タグ：常に最新版

ベストプラクティスは：

本番リリース時に v1.0.0 のようなタグを付ける

同時にコミット ID タグも付けて残す（履歴追跡用）

latest は動作確認や検証用に使う（本番依存は避ける）
