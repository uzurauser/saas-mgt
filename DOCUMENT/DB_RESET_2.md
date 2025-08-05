## 安全にリセット・再構築する方法

### 🎯 目的

Prisma + Docker（MySQL）環境において、以下のケースで安全かつクリーンにデータベースとマイグレーションを初期化する手順をまとめます。

- `schema.prisma` を大幅に書き直した
- 既存の `migrations` フォルダや `seed.ts` は使いものにならない
- Docker Compose を使って MySQL を起動している
- 名前付きボリュームを使用している（`volumes: db-data:`）

---

### ✅ この手順で解決できること

- Prisma のマイグレーション履歴をきれいに削除
- Docker コンテナとボリューム（MySQL データ）を完全削除
- Prisma の新しいスキーマで初期マイグレーションを作成
- 新しい `seed.ts` でシードデータを投入

---

### 📦 使用中の `docker-compose.yml`（抜粋）

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

- volumes: db-data: のように記述されている場合は、「名前付きボリューム」です。

- この場合は、docker volume rm で削除する必要はありません。

### 🧹 Prisma + Docker の完全リセット手順

```bash
# 1. Prisma のマイグレーション履歴を削除
rm -rf prisma/migrations

# 2. 使えない seed.ts を一時退避（または削除）
mv prisma/seed.ts prisma/seed.bak.ts

# 3. Docker のコンテナとボリュームを完全削除
docker compose down -v

# 4. コンテナ再構築・起動（新しい空のDBになる）
docker compose up -d

# 5. Prisma のマイグレーション初期化（新しいスキーマで）
npx prisma migrate dev --name init

# 6. 新しい seed.ts を作成 or 戻す
mv prisma/seed.bak.ts prisma/seed.ts  # または新規作成

# 7. seed を実行
npx prisma db seed
```

### 🧪 ボリュームの削除状況を確認するには？

```bash
# 現在のボリューム一覧
docker volume ls

# 手動でボリュームを削除したい場合（通常不要）
docker volume rm db-data
```

- 通常は docker compose down -v を使えば、ボリュームも削除されるため、手動で rm する必要はありません。
