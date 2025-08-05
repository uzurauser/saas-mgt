## 1. プロジェクト新規作成

```sh
npx create-next-app@latest mgt-app
```

- インタラクティブに質問されるので、下記を推奨:
  - TypeScript: Yes
  - ESLint: Yes
  - Tailwind CSS: Yes
  - src ディレクトリ: Yes
  - App Router: Yes
  - Turbopack: Yes

## 2. shadcn/ui の初期化

```sh
cd mgt-app
npx shadcn@latest init
```

## 3. コンポーネント追加例

```sh
npx shadcn@latest add button
```

## 4. データベースの作成

```bash
cd mock-db
touch docker-compose.yml
```

```yaml
services:
  db:
    image: mysql:8
    container_name: mock-db
    environment:
      MYSQL_ROOT_PASSWORD: root
      MYSQL_DATABASE: mock_db
      MYSQL_USER: mock
      MYSQL_PASSWORD: mock
    ports:
      - "3308:3306"
    volumes:
      - db-data:/var/lib/mysql

volumes:
  db-data:
```

データベースの起動

```sh
cd mock-db
docker compose up -d
```

prisma とクライアントのインストール

```sh
npm install prisma --save-dev
npm install @prisma/client
```

## 5. データベースの初期化

```sh
npx prisma init --datasource-provider mysql
```

```bash
mgt-app/
├── package.json
├── prisma/
│   ├── schema.prisma     # Prisma スキーマファイル
│   └── .env              # 環境変数（DB接続情報）
└── ...
```

🎓 補足：--output を使うべき？

- --output ../generated/prisma を使うと...

  - Prisma の設定ファイルが generated/prisma に出力される
  - schema.prisma が標準以外になるため、毎回 --schema を指定する必要がある
  - generated/ は「自動生成物用」の意味を持つことが多く、設定ファイルの置き場としては不自然

  ✅ 通常の開発では --output を使わず、標準の prisma/ ディレクトリを使うのがベスト。

## 6. データベースの接続設定

.env

```env
DATABASE_URL="mysql://mock:mock@localhost:3308/mock_db?charset=utf8mb4"
```

### prisma コマンド 説明

root で入り、権限を付与する

```sql
SELECT user, host FROM mysql.user;

+------------------+-----------+
| user             | host      |
+------------------+-----------+
| mock             | %         |
| root             | %         |
| mysql.infoschema | localhost |
| mysql.session    | localhost |
| mysql.sys        | localhost |
| root             | localhost |
+------------------+-----------+


SHOW GRANTS FOR 'mock'@'%';

GRANT ALL PRIVILEGES ON *.* TO 'mock'@'%' WITH GRANT OPTION;
FLUSH PRIVILEGES;
```

- 参考：MySQL シェルで「自分がどのユーザーとしてログインしているか」を確認するには?

```sql
SELECT USER(), CURRENT_USER();
```

| 関数 |意味
| USER()|クライアントが認証に使おうとしたユーザー（接続ユーザー）
| CURRENT_USER()|実際に MySQL が認証したユーザー（有効ユーザー）

```bash
npx prisma migrate dev --name init  #マイグレーションを実行し、DB にテーブルを作成
npx prisma generate                 #Prisma Client を生成
npx prisma studio                   #Web UI で DB をブラウズ（http://localhost:5555）
npx prisma validate                 #schema.prisma の文法エラーチェック ✅
npx prisma format                   #schema.prisma の自動整形（Prettier風）
npx prisma format --check           #整形が必要かどうかだけをチェック（CI 用）
```

🛠️ 注意点

- npx prisma generate は通常、prisma migrate などのコマンド実行後にも自動的に呼び出されます。
- 生成されたクライアントが古い場合、手動で npx prisma generate を実行することで最新の schema.prisma に同期させることができます。

### seed の自動実行のための package.json 設定

- 下記を行うことで、npx prisma db seed を実行すれば、seed.ts が走ります。

- ts-node を使う場合、devDependencies に ts-node を入れる必要があります。

```bash
npm install --save-dev ts-node
```

```json
"prisma": {
  "seed": "ts-node prisma/seed.ts"
}
```

- seed.ts を実行するには、以下のコマンドを実行します。

```bash
npx prisma db seed
```

### MySQL のバージョン確認方法

```bash
docker compose exec db mysql -u mock -p
```

```sql
SELECT VERSION();

+-----------+
| version() |
+-----------+
| 8.4.6     |
+-----------+
```

### 文字コード確認

```sql
SHOW VARIABLES LIKE 'character_set%';

+--------------------------+--------------------------------+
| character_set_client     | utf8mb3                        |
| character_set_connection | utf8mb3                        |
| character_set_database   | utf8mb4                        |
| character_set_filesystem | binary                         |
| character_set_results    | utf8mb3                        |
| character_set_server     | utf8mb4                        |
| character_set_system     | utf8mb3                        |
| character_sets_dir       | /usr/share/mysql-8.4/charsets/ |
+--------------------------+--------------------------------+


SHOW VARIABLES LIKE 'collation%';

+----------------------+--------------------+
| Variable_name        | Value              |
+----------------------+--------------------+
| collation_connection | utf8mb3_general_ci |
| collation_database   | utf8mb4_0900_ai_ci |
| collation_server     | utf8mb4_0900_ai_ci |
+----------------------+--------------------+
```

### MySQL クライアント接続時の文字セットを utf8mb4 に変更

MySQL クライアント（mysql コマンドなど）やアプリケーションの接続設定で、以下を明示的に指定する

```sql
SET NAMES utf8mb4;
```

これは、

```sql
SET character_set_client = utf8mb4;
SET character_set_connection = utf8mb4;
SET character_set_results = utf8mb4;
```

と同じ意味。
