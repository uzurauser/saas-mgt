# 名前で表示する VIEW 定義集（status フィールド対応版）

本ファイルは、SummaryVendorService・SummaryVendorServiceCspService・SummaryOutsourcingServiceCspService の各テーブルを「名前」と「status を含む全てのフィールド」で一覧表示するための MySQL VIEW 定義例です。

---

## 1. SummaryVendorService（名前＋ status フィールド）VIEW

```sql
CREATE OR REPLACE VIEW v_summary_vendor_service AS
SELECT
  s.id,
  c.name AS client_name,
  v.name AS vendor_name,
  vs.name AS vendor_service_name,
  s.cycleId,
  s.vendorAntisocialCheckStatus,
  s.vendorCommonChecklistStatus,
  s.vendorDetailChecklistStatus,
  s.createdAt,
  s.updatedAt
FROM
  SummaryVendorService s
  JOIN Client c ON s.clientId = c.id
  JOIN Vendor v ON s.vendorId = v.id
  JOIN VendorService vs ON s.vendorServiceId = vs.id;
```

---

## 2. SummaryVendorServiceCspService（名前＋ status フィールド）VIEW

```sql
CREATE OR REPLACE VIEW v_summary_vendor_service_csp_service AS
SELECT
  s.id,
  c.name AS client_name,
  v.name AS vendor_name,
  vs.name AS vendor_service_name,
  cs.name AS csp_name,
  css.name AS csp_service_name,
  s.cycleId,
  s.vendorAntisocialCheckStatus,
  s.vendorCommonChecklistStatus,
  s.vendorDetailChecklistStatus,
  s.cspAntisocialCheckStatus,
  s.cspCommonChecklistStatus,
  s.cspDetailChecklistStatus,
  s.createdAt,
  s.updatedAt
FROM
  SummaryVendorServiceCspService s
  JOIN Client c ON s.clientId = c.id
  JOIN Vendor v ON s.vendorId = v.id
  JOIN VendorService vs ON s.vendorServiceId = vs.id
  JOIN Csp cs ON s.cspId = cs.id
  JOIN CspService css ON s.cspServiceId = css.id;
```

---

## 3. SummaryOutsourcingServiceCspService（名前＋ status フィールド）VIEW

```sql
CREATE OR REPLACE VIEW v_summary_outsourcing_service_csp_service AS
SELECT
  s.id,
  c.name AS client_name,
  op.name AS outsourcing_partner_name,
  os.name AS outsourcing_service_name,
  cs.name AS csp_name,
  css.name AS csp_service_name,
  s.cycleId,
  s.outsourcingPartnerAntisocialCheckStatus,
  s.cspAntisocialCheckStatus,
  s.cspServiceCommonChecklistStatus,
  s.cspServiceDetailChecklistStatus,
  s.createdAt,
  s.updatedAt
FROM
  SummaryOutsourcingServiceCspService s
  JOIN Client c ON s.clientId = c.id
  JOIN OutsourcingPartner op ON s.outsourcingPartnerId = op.id
  JOIN OutsourcingService os ON s.outsourcingServiceId = os.id
  JOIN Csp cs ON s.cspId = cs.id
  JOIN CspService css ON s.cspServiceId = css.id;
```

---
---

## PrismaクライアントでDBビュー（VIEW）を使う方法

Prisma（v4.7以降）はMySQLのVIEWを`model`としてschema.prismaに定義し、Prisma ClientからSELECT参照が可能です。

### 1. 事前準備
- すでにMySQLでVIEW（例: `v_summary_vendor_service` など）を作成済みであること。
- `prisma db pull`でスキーマ同期を行う。

### 2. schema.prismaへの具体的な追記例

#### どこに書く？
- 通常のテーブル定義（model ...）と同じ場所（ファイル末尾や適切な位置）にVIEW用の`model`を追加します。

#### 例: v_summary_vendor_service

```prisma
model v_summary_vendor_service {
  id                          Int      @map("id")
  client_name                 String   @map("client_name")
  vendor_name                 String   @map("vendor_name")
  vendor_service_name         String   @map("vendor_service_name")
  cycleId                     Int      @map("cycleId")
  vendorAntisocialCheckStatus String   @map("vendorAntisocialCheckStatus")
  vendorCommonChecklistStatus String   @map("vendorCommonChecklistStatus")
  vendorDetailChecklistStatus String   @map("vendorDetailChecklistStatus")
  createdAt                   DateTime @map("createdAt")
  updatedAt                   DateTime @map("updatedAt")

  @@ignore  // db pull時に自動で付与される場合あり
}
```

#### 例: v_summary_vendor_service_csp_service

```prisma
model v_summary_vendor_service_csp_service {
  id                          Int      @map("id")
  client_name                 String   @map("client_name")
  vendor_name                 String   @map("vendor_name")
  vendor_service_name         String   @map("vendor_service_name")
  csp_name                    String   @map("csp_name")
  csp_service_name            String   @map("csp_service_name")
  cycleId                     Int      @map("cycleId")
  vendorAntisocialCheckStatus String   @map("vendorAntisocialCheckStatus")
  vendorCommonChecklistStatus String   @map("vendorCommonChecklistStatus")
  vendorDetailChecklistStatus String   @map("vendorDetailChecklistStatus")
  cspAntisocialCheckStatus    String   @map("cspAntisocialCheckStatus")
  cspCommonChecklistStatus    String   @map("cspCommonChecklistStatus")
  cspDetailChecklistStatus    String   @map("cspDetailChecklistStatus")
  createdAt                   DateTime @map("createdAt")
  updatedAt                   DateTime @map("updatedAt")
}
```

#### 例: v_summary_outsourcing_service_csp_service

```prisma
model v_summary_outsourcing_service_csp_service {
  id                                 Int      @map("id")
  client_name                        String   @map("client_name")
  outsourcing_partner_name           String   @map("outsourcing_partner_name")
  outsourcing_service_name           String   @map("outsourcing_service_name")
  csp_name                           String   @map("csp_name")
  csp_service_name                   String   @map("csp_service_name")
  cycleId                            Int      @map("cycleId")
  outsourcingPartnerAntisocialCheckStatus String @map("outsourcingPartnerAntisocialCheckStatus")
  cspAntisocialCheckStatus           String   @map("cspAntisocialCheckStatus")
  cspServiceCommonChecklistStatus    String   @map("cspServiceCommonChecklistStatus")
  cspServiceDetailChecklistStatus    String   @map("cspServiceDetailChecklistStatus")
  createdAt                          DateTime @map("createdAt")
  updatedAt                          DateTime @map("updatedAt")
}
```

- `@map`属性でVIEWのカラム名とPrismaのフィールド名を対応させます。
- `@@ignore`を外すことでPrisma ClientでSELECT参照が可能になります（v4.7以降）。
- **VIEWは読み取り専用**です。INSERT/UPDATE/DELETEはできません。

### 3. Prisma Clientでの利用例

```typescript
const data = await prisma.v_summary_vendor_service.findMany();
```

---

### 注意点
- VIEWをschema.prismaに追加した後は、必ず`prisma db pull`でスキーマを同期してください。
- PrismaのバージョンやDBの種類によって一部挙動が異なる場合があります。
- 詳細は[公式ドキュメント](https://www.prisma.io/docs/orm/prisma-schema/data-model/views)も参照してください。
---

## PrismaでVIEWを利用する手順と`prisma db pull`の詳細

### 手順の順序について

1. **まずMySQL上でVIEW（例: v_summary_vendor_service など）を作成します。**
   - 例: `CREATE OR REPLACE VIEW ...` をMySQLで実行
2. **次に`prisma db pull`を実行します。**
   - これにより、PrismaがDBの最新状態（テーブル・VIEW含む）を自動で取得し、`schema.prisma`を自動更新します。
3. **必要に応じて、schema.prismaのVIEWモデル定義を調整します。**
   - 型やフィールド名の修正、@map属性の追加など

> **ポイント**: 先にMySQLでVIEWを作成→`prisma db pull`→schema.prisma調整、の順です。

---

### `prisma db pull`とは？

- `prisma db pull`は、**既存のデータベーススキーマ（テーブル・VIEW・カラム構成など）を自動で検出し、`schema.prisma`ファイルに反映するコマンド**です。
- これにより、DBで追加・変更されたテーブルやVIEWがPrismaプロジェクトに自動で取り込まれます。
- 公式ドキュメント: https://www.prisma.io/docs/orm/prisma-cli/cli-commands#db-pull

#### 使い方
```sh
npx prisma db pull
```
- デフォルトで`prisma/schema.prisma`が更新されます。

#### 主な用途
- 既存DBから新規プロジェクトを開始したい場合
- DBに新しいテーブルやVIEWを追加した場合
- DB構造をPrismaに常に同期したい場合

#### 注意点
- `db pull`はDBの最新状態を**schema.prismaに上書き**します。手動で加えたmodelの修正はpull後に再調整が必要な場合があります。
- VIEWは読み取り専用で、Prisma ClientからはSELECTのみ可能です。

---

### まとめ
- まずMySQLでVIEWを作成→`prisma db pull`でschema.prismaに反映→必要に応じてmodel調整、という順番で進めてください。
- `prisma db pull`はDBスキーマをPrismaプロジェクトに自動反映する重要なコマンドです。
---

## 運用例・schema.prisma調整ノウハウ

### 運用例

#### 1. VIEW追加・変更の運用フロー
1. **MySQLでVIEWを作成・変更**
   - 例: 新しいカラムを追加したVIEWを`CREATE OR REPLACE VIEW ...`で作成
2. **`npx prisma db pull`を実行**
   - DBの最新状態が`schema.prisma`に反映される
3. **schema.prismaのVIEWモデルを確認・調整**
   - 型やフィールド名、@map属性の追加・修正を行う
4. **Prisma Clientで参照・開発**
   - 必要に応じてTypeScript型の自動生成も行われる

#### 2. 既存VIEWの仕様変更時
- 例：VIEWに新しいカラムを追加した場合
  - まずMySQLでVIEWを再定義
  - `prisma db pull`でschema.prismaに反映
  - 追加カラムがmodelに自動追加されるか確認し、必要に応じて型や@map属性を調整

#### 3. 複数人開発時のベストプラクティス
- VIEW定義SQL・schema.prismaを必ずバージョン管理（git等）
- VIEW追加・変更時は、SQLとschema.prismaの両方をpull requestでレビュー
- `prisma db pull`後にmodelの意図しない変更があれば、手動で調整し、理由をコメントで明記

---

### schema.prisma調整ノウハウ

- **@map属性の活用**
  - DBのカラム名とPrismaのフィールド名が異なる場合は必ず@mapで対応
  - 例: `cspServiceCommonChecklistStatus String @map("cspServiceCommonChecklistStatus")`
- **型の自動判定と手動修正**
  - db pullはMySQLの型を自動判定するが、enumや特殊な型は手動で修正することも
  - 例: ステータス系はenum型に変更可能
- **@@ignoreの扱い**
  - db pull時に@@ignoreが付与されることがあるが、SELECT参照したい場合は外す
- **VIEWのmodel名はDB名に合わせるのが無難**
  - ただしPrismaの命名規則に合わせてキャメルケース等にしてもよい
- **不要なmodelの整理**
  - db pullで不要なmodelが増えた場合は、手動で削除してOK
- **コメントや説明を積極的に追加**
  - schema.prismaのmodelやフィールドにコメントを付けておくと、チーム開発や将来の保守に役立つ

---

### 参考: よくあるトラブルと対策
- db pullでmodelが意図せず上書きされた → 必ずpull前後でgit diff確認
- enum型がString型で生成された → 手動でenum型に修正し、@mapでDBカラムと対応
- VIEWのカラム名が変更されたのにmodelが古いまま → db pull後にmodelを確認・修正

---

より高度な運用や自動化スクリプト例もご案内できますので、ご要望があればお知らせください。
---

### git diffによるpull前後の確認について（詳細）

- `prisma db pull`はDBの最新状態をschema.prismaに**上書き**するため、意図しないmodelの追加・削除・型変更が発生することがあります。
- そのため、pull前後で必ず`git diff`等でschema.prismaの差分を確認し、
  - どのmodel/fieldが追加・削除・変更されたか
  - 既存のmodel定義や手動修正が消えていないか
  - VIEWのmodelが正しく反映されているか
 などをチェックします。
- 差分に問題があれば、pull後に手動で修正し、必要ならpullリクエストやコミットコメントで理由を明記しましょう。

#### 例: 差分確認コマンド
```sh
git diff prisma/schema.prisma
```

---

### db pullとschema.prismaへの手動追記（VIEW）の比較・おすすめ

- **基本的には`prisma db pull`で自動生成→必要に応じて手動で調整、の運用がおすすめです。**

#### 理由
- db pullはDBスキーマの最新状態を自動で反映するため、ヒューマンエラーや記述漏れを防げる
- VIEWのカラム名や型も自動で取得されるため、型のミスを減らせる
- DB側でVIEWの仕様変更があった場合も、pullで自動反映できる

#### 手動追記が有効なケース
- db pullでは意図通りの型や属性が付かない場合（enum型や@map属性など）
- 特定のmodelだけ細かくカスタマイズしたい場合
- ただし、**手動追記だけでDBに存在しないVIEWをmodel化しても、Prisma Clientからは利用できません**

#### おすすめ運用まとめ
1. MySQLでVIEW作成
2. `prisma db pull`でschema.prismaに自動反映
3. 必要に応じてmodelを手動で調整
4. 差分は必ずgit diffで確認

---

この運用により、DBとPrismaのスキーマの一貫性・安全性を高く保つことができます。
