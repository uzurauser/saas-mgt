# SaaS 管理アプリ 総合ガイド

本ドキュメントは、SaaS 管理アプリの「DB 設計・運用」と「開発・運用」について、プロジェクト内の各種ガイド・ノウハウを統合した総合的なリファレンスです。

## 目次

1. DB 設計・運用ガイド
2. 開発・運用ガイド
3. 参考リンク・補足

---

# 0. はじめに（Fedora Linux ユーザー向け・完全スタートガイド）

この章では、**Fedora Linux を使う初心者が「このプロジェクト」をゼロから再現するための手順**を、できるだけ丁寧に、コマンド例・Tips 付きで解説します。

---

## 0.1 前提：必要なもの

- Fedora Linux（40 以降推奨、Wayland/X どちらでも可）
- インターネット接続
- ターミナル（GNOME Terminal 等）
- VSCode（推奨、またはお好きなエディタ）

---

## 0.2 Node.js & npm のインストール（Fedora 向け）

Fedora 公式リポジトリの Node.js は古い場合が多いため、**NodeSource** か **nvm** を使うのが確実です。

### 方法 A: NodeSource（推奨）

```sh
sudo dnf install -y curl
curl -fsSL https://rpm.nodesource.com/setup_20.x | sudo bash -
sudo dnf install -y nodejs
node -v  # v20.x 以上を確認
npm -v   # 10.x 以上を確認
```

### 方法 B: nvm（Node Version Manager）

```sh
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
source ~/.bashrc  # または source ~/.zshrc
nvm install 20
nvm use 20
node -v
npm -v
```

---

## 0.3 プロジェクトディレクトリの作成

```sh
mkdir saas-mgt-app
cd saas-mgt-app
```

---

## 0.5 Next.js + TypeScript プロジェクト新規作成

```sh
npx create-next-app@latest mgt-app --typescript
cd mgt-app
```

- 質問はすべて Enter で OK（後から変更可）
- 既存の `mgt-app` ディレクトリがある場合は削除してから実行

---

## 0.6 必要な主要ライブラリのインストール

```sh
npm install prisma @prisma/client mysql2 dotenv
```

- Prisma CLI と MySQL ドライバ、dotenv を導入

---

## 0.7 Docker & Docker Compose のインストール（Fedora 向け）

```sh
sudo dnf install -y dnf-plugins-core
sudo dnf config-manager --add-repo https://download.docker.com/linux/fedora/docker-ce.repo
sudo dnf install -y docker-ce docker-ce-cli containerd.io docker-compose-plugin
sudo systemctl enable --now docker
sudo usermod -aG docker $USER
# ※ 一度ログアウト・再ログインでdockerコマンドが使えるようになります
```

- `docker --version`、`docker compose version` で動作確認

---

## 0.8 VSCode の推奨拡張機能

- ESLint
- Prettier
- Prisma
- Docker
- GitHub Copilot（任意）

---

## 0.9 .env ファイルの作成例

プロジェクト直下に `.env` ファイルを作成し、以下のように記述します（MySQL は docker-compose で立てる場合）。

```
DATABASE_URL="mysql://user:password@localhost:3306/saas_db"
```

---

## 0.10 ディレクトリ構成例

```
saas-mgt-app/
  ├─ mgt-app/           # Next.jsアプリ本体
  │   ├─ src/
  │   ├─ prisma/
  │   ├─ public/
  │   └─ ...
  ├─ db-docs/           # DB設計ドキュメント
  └─ INTEGRATED_GUIDE.md  # 本ガイド
```

---

## 0.11 Fedora での注意点・トラブル例

- 権限エラー：`EACCES`などが出る場合は`sudo`や`usermod -aG docker $USER`を確認
- SELinux が有効な場合、Docker のボリュームマウントでエラーが出ることがある →`z`オプション追加や一時的に`setenforce 0`で回避可（本番は要注意）
- `npx`コマンドが見つからない場合は`npm`のバージョンを確認
- MySQL コンテナの起動失敗時は`docker logs`で詳細確認

---

## 0.12 よくある質問・Tips

- VSCode で日本語入力が不安定な場合は Wayland/X11 切替を試す
- `node_modules`のパーミッションエラーは`rm -rf node_modules && npm install`で再構築
- Windows/Mac とコマンドが異なる場合は[公式ドキュメント](https://nextjs.org/docs)や[Prisma 公式](https://www.prisma.io/docs)も参照

---

これで**プロジェクトの初期セットアップ～ Next.js/Prisma/MySQL/Docker の導入まで**が完了します。

以降は「1. DB 設計・運用ガイド」「2. 開発・運用ガイド」章を参照して、DB 設計やアプリ開発を進めてください。

---

# 1. DB 設計・運用ガイド

## 1.1 SaaS 管理アプリ用データベース設計（コードファースト/Prisma 用）

# SaaS 管理アプリ用データベース設計（コードファースト/Prisma 用）

---

## 1. 要件まとめ

- **vendor（ベンダー）と csp（クラウドサービスプロバイダ）は同一テーブルで管理。is_csp フラグで区別。**
- **vendor は複数の vendor_service（サービス）を持つ。**
- **vendor_service ごとに、csp に運用委託できる（委託しない場合も可）。**
- **client（クライアント）と vendor は 1 対多。**
- **チェックリストは vendor/csp ごと、サービスごと、共通・詳細の 2 種で状態管理。**
- **チェックリストのサイクル（checklist_cycle）単位で運用。**

---

## 2. エンティティ・リレーション図（ER 図）

```mermaid
erDiagram
    CLIENTS ||--o{ VENDORS : has
    VENDORS ||--o{ VENDOR_SERVICES : provides
    VENDOR_SERVICES ||--o{ VENDOR_SERVICE_CSP_ASSIGNMENT : assigned_to
    VENDORS ||--o{ VENDOR_SERVICE_CSP_ASSIGNMENT : is_csp
    CHECKLIST_CYCLES ||--o{ CHECKLIST_STATUS : has
    VENDORS ||--o{ CHECKLIST_STATUS : has_checklist
    VENDOR_SERVICES ||--o{ CHECKLIST_STATUS : for_service
```

#### 【Eraser.io Diagram as Code 例】

> Eraser の Diagram as Code は https://eraser.io/ で「Diagram as Code」→「Paste code」から貼り付けて編集できます。

```eraser
graph TD
  CLIENTS[CLIENTS]
  VENDORS[VENDORS/app/node_modules]
  VENDOR_SERVICES[VENDOR_SERVICES]
  VENDOR_SERVICE_CSP_ASSIGNMENT[VENDOR_SERVICE_CSP_ASSIGNMENT]
  CHECKLIST_CYCLES[CHECKLIST_CYCLES]
  CHECKLIST_STATUS[CHECKLIST_STATUS]

  CLIENTS -- has --> VENDORS
  VENDORS -- provides --> VENDOR_SERVICES
  VENDOR_SERVICES -- assigned_to --> VENDOR_SERVICE_CSP_ASSIGNMENT
  VENDORS -- is_csp --> VENDOR_SERVICE_CSP_ASSIGNMENT
  CHECKLIST_CYCLES -- has --> CHECKLIST_STATUS
  VENDORS -- has_checklist --> CHECKLIST_STATUS
  VENDOR_SERVICES -- for_service --> CHECKLIST_STATUS
```

---

## 3. テーブル（モデル）一覧と主なカラム（定義の完全網羅）

### clients

- id (PK, INT, AUTO_INCREMENT)
- client_name (VARCHAR, NOT NULL)
- created_at (TIMESTAMP, DEFAULT CURRENT_TIMESTAMP)

### vendors

- id (PK, INT, AUTO_INCREMENT)
- vendor_name (VARCHAR, NOT NULL)
- is_csp (BOOLEAN, NOT NULL)

### vendor_services

- id (PK, INT, AUTO_INCREMENT)
- vendor_id (FK)
- service_name (VARCHAR, NOT NULL)

### vendor_service_csp_assignment

- id (PK, INT, AUTO_INCREMENT)
- vendor_service_id (FK)
- csp_id (FK)

### checklist_cycles

- id (PK, INT, AUTO_INCREMENT)
- cycle_name (VARCHAR, NOT NULL)

### checklist_status

- id (PK, INT, AUTO_INCREMENT)
- checklist_cycle_id (FK)
- vendor_id (FK)
- vendor_service_id (FK)
- status_type (ENUM: 共通/詳細)

---

## 4. Prisma 運用 Tips

### Prisma の seed スクリプト自動実行設定について

Prisma で `migrate dev` 後に自動的に `seed.ts` を実行させるには、`package.json` に以下のような設定が必要です（Prisma v3 以降標準）。

```json
"prisma": {
  "seed": "ts-node --compiler-options {\"module\":\"CommonJS\"} prisma/seed.ts"
}
```

- この設定がない場合、`migrate dev` 後に seed.ts は自動実行されません。
- 必要に応じて `package.json` を編集してください。
- 詳細は [Prisma 公式ドキュメント](https://www.prisma.io/docs/guides/database/seed-database) も参照。

#### seed スクリプト自動実行の設定手順

1. `ts-node` をインストールしておく
2. `package.json` に上記の `prisma.seed` 設定を追加

#### 注意

- `npx prisma db seed` コマンドで手動実行も可能です。
- 自動実行されているかは、`migrate dev` 実行時のログに `Running seed command` などが表示されるかで確認できます。

### Node.js の ExperimentalWarning について

Prisma や ts-node など一部の npm パッケージが、Node.js の ESM/CommonJS 混在環境で警告を出すことがあります。

- この警告は現状、**無害ですが非表示にする方法はありません（Node.js や各パッケージの今後のアップデートで改善予定）**
- 実害がない場合は無視して OK です。
- 詳細: https://github.com/nodejs/node/issues/43210

---

## 1.2 インデックス設計

# インデックス設計ガイド

- 主キー・ユニーク制約・外部キー制約の設計例
- パフォーマンス向上のための複合インデックス設計例
- 実際の DDL 例や運用上の注意点

```sql
CREATE TABLE vendors (
  id INT PRIMARY KEY AUTO_INCREMENT,
  vendor_name VARCHAR(255) NOT NULL,
  is_csp BOOLEAN NOT NULL,
  UNIQUE KEY uq_vendor_name (vendor_name)
);

CREATE TABLE vendor_services (
  id INT PRIMARY KEY AUTO_INCREMENT,
  vendor_id INT NOT NULL,
  service_name VARCHAR(255) NOT NULL,
  UNIQUE KEY uq_vendor_service (vendor_id, service_name),
  FOREIGN KEY (vendor_id) REFERENCES vendors(id)
);

-- 複合インデックス例
CREATE INDEX idx_checklist_status ON checklist_status (vendor_id, vendor_service_id, status_type);
```

- インデックス設計は実際のクエリパターン・運用状況に応じて随時見直すこと

---

## 1.3 文字コード・照合順序設計

# 文字コード・照合順序設計ガイド

- 基本は UTF8MB4（MySQL）を推奨
- テーブル・カラムごとに明示的な charset/collate 指定を推奨

```sql
CREATE TABLE clients (
  id INT PRIMARY KEY AUTO_INCREMENT,
  client_name VARCHAR(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL
);
```

- 既存テーブルの charset/collate 変更例

```sql
ALTER TABLE vendors CONVERT TO CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

- 日本語・記号・絵文字対応も utf8mb4 で十分
- 旧 utf8（3 バイト）ではなく utf8mb4（4 バイト）を必ず使う

---

## 1.4 ローカル開発 Tips・接続ノウハウ

# ローカル DB 開発のベストプラクティス

- Docker Compose での DB 運用例
- DB 初期化・マイグレーション・seed 運用例
- DB データ永続化とバックアップ戦略
- 開発用 DB と本番用 DB の切り分け
- トラブル時の復旧手順や Tips

#### 例: docker-compose.yml 抜粋

```yaml
services:
  db:
    image: mysql:8.0
    environment:
      MYSQL_ROOT_PASSWORD: example
      MYSQL_DATABASE: saas_db
    ports:
      - "3306:3306"
    volumes:
      - db-data:/var/lib/mysql
volumes:
  db-data:
```

# MySQL 接続ノウハウ

- MySQL の接続パラメータ例
- 接続エラー時の切り分けポイント
- DB ユーザー権限・ネットワーク設定の注意点
- Prisma/Node.js からの接続例

#### 例: .env

```
DATABASE_URL="mysql://user:password@localhost:3306/saas_db"
```

#### 例: Prisma schema.prisma

```
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}
```

---

## 1.5 DB ディレクトリ概要

# DB ディレクトリ概要

- DB 関連ファイル（Prisma スキーマ/migration/seed/ER 図等）の構成と運用指針
- 実際のディレクトリ例や運用 Tips

---

## 2.1 開発・運用環境セットアップ

### 2.1.1 Docker 開発環境セットアップ

#### 目的

- Next.js アプリを「本番用」と「開発用」で安全・快適に運用するための Docker 構成と、その仕組み・理由を整理。
- 「ホットリロード対応の開発環境」「依存パッケージの分離」「ボリュームの使い方」などを具体例とともに解説。

#### ファイル構成と役割

````
/mgt-app/
  ├─ docker-compose.yml           # 本番用（ベース）
  ├─ docker-compose.override.yml  # 開発用（上書き・追加）
  ├─ Dockerfile.prod              # 本番用イメージ
  ├─ Dockerfile.dev               # 開発用イメージ

- Next.js開発用Docker Compose構成例
- docker-compose.override.ymlの役割
- Dockerfile.devとDockerfile.prodの違い
- ボリューム・ホットリロードTips

#### 例: docker-compose.yml
```yaml
version: '3.8'
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.dev
    ports:
      - "3000:3000"
    volumes:
      - .:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
````

---

### 2.1.2 EC2 本番環境セットアップ

# EC2 本番環境セットアップガイド

- EC2 インスタンス作成・セキュリティグループ設定・SSH ログイン
- Docker Compose による本番デプロイ手順
- Nginx リバースプロキシ・Let's Encrypt 証明書取得
- systemd による自動起動設定

---

### 2.1.3 スタックセットアップガイド

# スタックセットアップガイド

- Next.js, TypeScript, Prisma, MySQL, Redis, S3 等の構成
- .env 設定例・環境切替 Tips

---

## 2.2 Next.js 開発 Tips

### 2.2.1 ビルドエラー・型エラー対応

# ビルドエラー・型エラー対応ガイド

- ローカルと本番で発生するビルド・型エラーの違いと対策
- tsconfig・import パス・CI/CD バリデーション Tips

---

### 2.2.2 Next.js 15.x の PageProps 型と型チェックの厳格化について

- ただし、現時点（v15.3.4）では `next` パッケージから直接 `PageProps` を import することはできません（公式未公開 or 型エラー）。

### PageProps 型の意義・必要性

- ルーティングパラメータ（`params`）やクエリパラメータ（`searchParams`）を型安全に受け取るための型。
- App Router のページ/レイアウト/テンプレート/エラーページ等で props の型を統一できる。
- 型推論・型補完が効きやすくなる。

## 3. 利用方法・代替案

### 利用方法（理想）

```ts
// 理想的にはこう書きたいが、現状は動かないことが多い
import type { PageProps } from 'next';
export default function Page(props: PageProps) { ... }
```

### 現実的な代替案

- **props: any を使う**
  - 一時的な回避策。ESLint の`@typescript-eslint/no-explicit-any`を 1 行だけ無効化してビルドを通す。
- **独自型を定義して明示的に型アサート**
  - 例：

```ts
// 独自型を定義
interface MyPageProps {
  params: { id: string };
  searchParams?: { [key: string]: string | undefined };
}
export default function Page(props: MyPageProps) { ... }
```

- **型エラーを抑制する（非推奨）**
  - 型安全を損なうため、極力避ける。

## 4. まとめ

- Next.js 15.x では PageProps 型の厳格化が進行中。現時点では公式型 import は未対応だが、将来的には標準化される見込み。
- 型安全・型補完の観点からも、独自型で明示的に props 型を定義するのが現実的。

---

### 2.2.3 サーバーアクション（Server Action）と API Route の違いについて

# Next.js App Router における「サーバーアクション」と「API Route+fetch」の違い

## 1. サーバーアクションとは？

- Next.js 13 以降の App Router で導入された「use server」付きのサーバー側関数。
- フォームの`action`属性やイベントハンドラに直接渡すことで、API Route を経由せずサーバー処理を実行できる。
- 例：

```tsx
// app/page.tsx
"use client"

async function createVendorService(formData: FormData) {
  "use server"
  // サーバー側で実行される処理
  // ...
}

export default function Page() {
  return <form action={createVendorService}>{/* ... */}</form>
}
```

## 2. API Route + fetch とは？

- 従来通り、`pages/api/`配下に API エンドポイントを作成し、クライアント側から fetch/axios で呼び出す方式。
- 例：

```ts
// pages/api/create-vendor-service.ts
import { NextApiRequest, NextApiResponse } from "next"

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // ...
}
```

```tsx
// app/page.tsx
"use client"

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault()
  const formData = new FormData(e.currentTarget)
  const name = formData.get("name")
  const vendorId = formData.get("vendorId")
  await fetch("/api/create-vendor-service", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ vendor_service_name: name, vendor_id: vendorId }),
  })
  window.location.href = "/services"
}

return <form onSubmit={handleSubmit}>{/* ... */}</form>
```

---

## 3. 違い・メリットまとめ

| 項目                 | サーバーアクション（Server Action） | API Route + fetch              |
| -------------------- | ----------------------------------- | ------------------------------ |
| サーバー処理の書き方 | "use server"関数を直接呼ぶ          | API Route ファイルを自作       |
| クライアント処理     | フォームの action に関数を渡すだけ  | fetch/axios で API を呼び出す  |
| 型安全               | TypeScript で型安全                 | fetch の型付けは手動           |
| セキュリティ         | サーバー関数はクライアント非公開    | API Route はエンドポイント公開 |
| コード量             | 少ない                              | 多い（API ＋ fetch 両方書く）  |
| 保守性               | 高い（Next.js が自動最適化）        | API 設計・管理が必要           |

---

## 4. なぜ「サーバーアクションで」と明記したか

- App Router では「フォーム送信 → サーバーアクションで直接処理」が新しい標準
- API Route+fetch 方式と区別するため、サーバーアクションで値を受け取ることを明示
- サーバーアクションは API 設計不要・型安全・保守性高いのがメリット

---

## 5. 参考やりとり要約

- サーバーアクションと API Route の違いは何か？
- サーバーアクションは「use server」つき関数で、フォーム action に渡すだけでサーバー処理が書ける
- API Route+fetch 方式は従来型で柔軟だが手間が多い
- サーバーアクションは Next.js の推奨・保守性高い

---

## 2.3 アーキテクチャ・UI 設計

### 2.3.1 Eraser ECS アーキテクチャ

- Eraser ECS の全体構成図・設計思想
- サービス間連携・デプロイ構成例
- CI/CD パイプライン例

#### 【Mermaid 記法による ECS 構成図例】

```mermaid
graph TD
    User -->|HTTPS| Nginx
    Nginx -->|Reverse Proxy| AppServer
    AppServer -->|DB Access| MySQL
    AppServer -->|Cache| Redis
    AppServer -->|Object Storage| S3
    AppServer -->|API| ECSService
    ECSService -->|CI/CD| GithubActions
```

#### 【Eraser.io Diagram as Code 例】

> Eraser の Diagram as Code は https://eraser.io/ で「Diagram as Code」→「Paste code」から貼り付けて編集できます。

```eraser
graph TD
  User[User]
  Nginx[Nginx (Reverse Proxy)]
  AppServer[App Server (Next.js)]
  MySQL[(MySQL DB)]
  Redis[(Redis Cache)]
  S3[(S3 Storage)]
  ECSService[ECS Service]
  GithubActions[GitHub Actions]

  User -->|HTTPS| Nginx
  Nginx --> AppServer
  AppServer --> MySQL
  AppServer --> Redis
  AppServer --> S3
  AppServer --> ECSService
  ECSService --> GithubActions
```

---

### 2.3.2 UI 設計・ワイヤーフレーム

#### Figma ワイヤーフレームテンプレート

- 公式・コミュニティの豊富なテンプレート例
- [Figma Community: Wireframe Kit](https://www.figma.com/community/search?resource_type=files&sort_by=popular&query=wireframe%20kit)
- [Wireframe Kit 3.0（人気・無料）](https://www.figma.com/community/file/888497366492548657)
- [Untitled UI Wireframe Kit](https://www.figma.com/community/file/1116796650552299280)

#### draw.io 用ワイヤーフレームサンプル

- [draw.io 公式 UI ワイヤーフレームテンプレート](https://app.diagrams.net/?splash=0&libs=general;ios;android;ui)

##### サンプル（draw.io で再現できる簡易 UI ワイヤー例）

```
+------------------------------+
| クライアント一覧   [検索]    |
+------------------------------+
| [新規登録]                   |
+------------------------------+
| No | クライアント名 | ...    |
|----|--------------|--------  |
|  1 | 〇〇株式会社   | 詳細→  |
| ...                            |
+------------------------------+
```

#### その他のワイヤーフレーム作図ツール

- Balsamiq（手書き風・超高速）
- Whimsical（図解・ワイヤー両対応・直感的）
- Penpot（OSS・Figma 風 UI）

**Figma や draw.io で作成したワイヤーフレームは画像/PDF/リンクでチーム共有できます。**

---

# 3. 参考リンク・補足

- Prisma 公式: https://www.prisma.io/docs
- Prisma Migrate 運用ガイド: https://www.prisma.io/docs/orm/migrate
- Prisma with MySQL: https://www.prisma.io/docs/orm/databases/mysql

---

> ※各章の詳細は、該当 md ファイルの内容を適宜参照・抜粋・要約して記載してください。
