## ✅ Prisma で View を扱う時の実際

Prisma では View を正式サポートしていません（2025 年 8 月時点でも同様）。
ですが、普通のテーブルと同じように model で扱うことは可能 です。

ただし：
View は更新できません（readonly）

Prisma は「更新できるテーブル」として解釈しようとする → でも実行時にエラー

そのため「誤って更新しないように」 or 「migrate 時に無視する」目的で @@ignore を使う

## ✅ @@ignore の正しい使い方

1. スキーマに定義する（read-only で使う）

```prisma
model VendorServiceView {
  id              Int
  client          String
  vendorName      String
  serviceName     String
  createdAtJST    DateTime

  @@map("vendor_service_view")  // DBのView名にマッピング
  @@ignore                      // migrate では無視（読み取り専用にする）
}
```

- @@map("vendor_service_view") → View 名に紐付け
- @@ignore → Prisma migrate や introspect で「このモデルを無視する」

  - これを入れると Prisma schema は認識しても DB への変更対象から外れる

  - 読み取り（findMany, findFirst など）は普通に使える

## ✅ よくある誤解

| 誤解                              | 実際は                                     |
| --------------------------------- | ------------------------------------------ |
| @@ignore をつけると使えなくなる？ | ❌ 使えます（migrate から除外されるだけ）  |
| View は Prisma で使えない？       | ❌ 使えます（readonly で OK なら問題なし） |

## ✅ 実運用での Best Practice

| やりたいこと                  | どうするべきか                        |
| ----------------------------- | ------------------------------------- |
| MySQL に View を作成          | 普通に CREATE VIEW する               |
| Prisma でその View を使いたい | model を書いて @@map で View に紐付け |
| migrate 時に View を無視する  | @@ignore をつける                     |

→ これが「Prisma で View を使う」正しいやり方です。

## ✅ まとめ

- View を Prisma で扱うなら @@map で View に紐付け
- migrate/introspect で邪魔しないよう @@ignore を使う
- select/findMany で普通に読める

## ✅ 意味

Prisma の View 用 model を書いておけば、
Prisma Client からは「普通のテーブル」と同じ感覚で findMany など使える
→ つまり TypeScript 側ではテーブルと同じ書き方ができる

## ✅ 具体例（イメージ）

Prisma Schema 側：

```prisma
model VendorServiceView {
  id              Int
  client          String
  vendorName      String
  serviceName     String
  antisocialCheck AntisocialCheckStatus
  checklistCommon ChecklistStatusEnum
  checklistDetail ChecklistStatusEnum

  @@map("vendor_service_view")  // ← ここでViewにマッピング
  @@ignore                      // ← migrateから除外
}
```

TypeScript で使うとき：

```typescript
const results = await prisma.vendorServiceView.findMany({
  where: {
    client: "事務システム部",
  },
  orderBy: {
    vendorName: "asc",
  },
})

console.log(results)
```

→ これで普通に View のデータを取得できます。
Prisma 的には「テーブルっぽく見えてる」状態。

## ✅ 重要なポイント

| ポイント                                | 内容                                         |
| --------------------------------------- | -------------------------------------------- |
| CRUD の CUD は使えない                  | View なので、create/update/delete はできない |
| 読み取り系(findMany, findFirst 等)は OK | 普通に使える                                 |
| 型定義も効く（TypeScript の補完効く）   | model 定義したので型が通る                   |
| @@ignore は migrate 用の保護            | 読取には影響しない                           |

## ✅ Prisma 公式見解

Prisma は「View 正式対応」とは言ってませんが、
@@map + @@ignore を組み合わせたこの方法は、多くのプロダクション環境で普通に使われているベストプラクティス です。
