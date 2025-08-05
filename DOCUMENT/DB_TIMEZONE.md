## ✅ 1. 現在のタイムゾーンを確認する

```sql
SELECT @@global.time_zone AS global_time_zone, @@session.time_zone AS session_time_zone;
```

global_time_zone: サーバー全体のデフォルト設定

session_time_zone: 現在の接続セッションでの設定（クエリ結果に影響する）

## ✅ 2. タイムゾーンを変更する

【一時的にセッション単位で変更】（その接続中のみ有効）

```sql
SET time_zone = '+09:00';  -- 日本時間（JST）に設定
または

SET time_zone = 'Asia/Tokyo';
```

【グローバルに（サーバー再起動で消える）変更】

```sql
SET GLOBAL time_zone = '+09:00';
または

SET GLOBAL time_zone = 'Asia/Tokyo';
```

⚠️ 注意：

- SET GLOBAL は SUPER 権限 が必要。
- 新規セッションには適用されますが、今のセッションには効きません → SET time_zone も併用する。

✅ 3. サーバー起動時に恒久的に設定する
MySQL の設定ファイル (my.cnf または my.ini) に記述：

````ini
[mysqld]
default-time-zone = '+09:00'
もしくは

[mysqld]
default-time-zone = 'Asia/Tokyo'
→ その後、MySQL を再起動：

```bash
sudo systemctl restart mysql
````

✅ 4. タイムゾーン情報が読み込まれていない場合

- もし Asia/Tokyo などが認識されない場合は、タイムゾーンテーブルが未ロードの可能性があります：

```bash
mysql_tzinfo_to_sql /usr/share/zoneinfo | mysql -u root mysql
```

✅ 5. 現在日時（タイムゾーン付き）を確認

```sql
SELECT NOW(), CURRENT_TIMESTAMP, CONVERT_TZ(NOW(), 'UTC', 'Asia/Tokyo');
```

✅ まとめ

| 目的                       | コマンド例                                 |
| -------------------------- | ------------------------------------------ |
| 今のセッションだけ変更     | SET time_zone = 'Asia/Tokyo';              |
| サーバー全体を一時変更     | SET GLOBAL time_zone = 'Asia/Tokyo';       |
| 永続的に固定（再起動後も） | my.cnf に default-time-zone = 'Asia/Tokyo' |

## ✅ Prisma でのタイムゾーン事情

- Prisma 自体にタイムゾーン設定はない

- Prisma は DB の値を UTC で保持する ことを前提に動きます。

- タイムゾーン変換は アプリケーション側（Node.js）で行う のが基本。

createdAt, updatedAt などの DateTime 型は UTC で保存・取得。

タイムゾーン付きで表示・利用するには：

Prisma クライアントで取得 → 表示時に変換（日本時間にするなど）

## ✅ Prisma クライアントでタイムゾーンを考慮する例

- 例）Prisma で取得 → JST に変換

```ts
import { PrismaClient } from "@prisma/client"
import { utcToZonedTime, format } from "date-fns-tz"

const prisma = new PrismaClient()

async function getVendors() {
  const vendors = await prisma.vendor.findMany()

  // JST に変換して表示
  const jstVendors = vendors.map((vendor) => {
    const jstTime = utcToZonedTime(vendor.createdAt, "Asia/Tokyo")
    return {
      ...vendor,
      createdAtJST: format(jstTime, "yyyy-MM-dd HH:mm:ssXXX", {
        timeZone: "Asia/Tokyo",
      }),
    }
  })

  console.log(jstVendors)
}

getVendors()
```

- date-fns-tz ライブラリを使ってタイムゾーン変換

- DB は UTC、表示時に JST に変換する（API でもビューでも同様）

## ✅ Prisma で直接タイムゾーンを扱う方法は？

→ SQL 側でタイムゾーン変換して取得することはできる（Raw クエリ）

例）Prisma の queryRaw を使う

```ts
const results = await prisma.$queryRaw`
  SELECT id, name, 
         CONVERT_TZ(createdAt, '+00:00', '+09:00') as createdAtJST
  FROM Vendor;
`
```

- MySQL の CONVERT_TZ を使って DB 側で JST に変換して取得

- このほうが大量データ時に高速（アプリ側変換不要）

## ✅ Prisma でよくある質問

| よくある質問                        | 回答                                         |
| ----------------------------------- | -------------------------------------------- |
| Prisma でタイムゾーンは設定できる？ | ❌ できません（DB と Node.js の扱い次第）    |
| UTC で保存するしかない？            | ✅ 通常は UTC で保存、アプリ側で表示用に変換 |
| DB 側で変換して取得できる？         | ✅ queryRaw で SQL 書いて取得時に変換        |
