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

## Prisma クライアントで DB ビュー（VIEW）を使う方法

Prisma（v4.7 以降）は MySQL の VIEW を`model`として schema.prisma に定義し、Prisma Client から SELECT 参照が可能です。

### 1. 事前準備

- すでに MySQL で VIEW（例: `v_summary_vendor_service` など）を作成済みであること。
- `prisma db pull`でスキーマ同期を行う。

### 2. schema.prisma への具体的な追記例

#### どこに書く？

- 通常のテーブル定義（model ...）と同じ場所（ファイル末尾や適切な位置）に VIEW 用の`model`を追加します。

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

- `@map`属性で VIEW のカラム名と Prisma のフィールド名を対応させます。
- `@@ignore`を外すことで Prisma Client で SELECT 参照が可能になります（v4.7 以降）。
- **VIEW は読み取り専用**です。INSERT/UPDATE/DELETE はできません。

### 3. Prisma Client での利用例

```typescript
const data = await prisma.v_summary_vendor_service.findMany()
```

---

### 注意点

- Prisma のバージョンや DB の種類によって一部挙動が異なる場合があります。
- 詳細は[公式ドキュメント](https://www.prisma.io/docs/orm/prisma-schema/data-model/views)も参照してください。

---

## Prisma で VIEW を利用する手順と`prisma db pull`の詳細

### 手順の順序について

1. **まず MySQL 上で VIEW（例: v_summary_vendor_service など）を作成します。**
   - 例: `CREATE OR REPLACE VIEW ...` を MySQL で実行
2. **次に`prisma db pull`を実行します。**
   - これにより、Prisma が DB の最新状態（テーブル・VIEW 含む）を自動で取得し、`schema.prisma`を自動更新します。
3. **必要に応じて、schema.prisma の VIEW モデル定義を調整します。**
   - 型やフィールド名の修正、@map 属性の追加など

> **ポイント**: 先に MySQL で VIEW を作成 →`prisma db pull`→schema.prisma 調整、の順です。

---

### `prisma db pull`とは？

- `prisma db pull`は、**既存のデータベーススキーマ（テーブル・VIEW・カラム構成など）を自動で検出し、`schema.prisma`ファイルに反映するコマンド**です。
- これにより、DB で追加・変更されたテーブルや VIEW が Prisma プロジェクトに自動で取り込まれます。
- 公式ドキュメント: https://www.prisma.io/docs/orm/prisma-cli/cli-commands#db-pull

#### 使い方

```sh
npx prisma db pull
```

- デフォルトで`prisma/schema.prisma`が更新されます。

#### 主な用途

- 既存 DB から新規プロジェクトを開始したい場合
- DB に新しいテーブルや VIEW を追加した場合
- DB 構造を Prisma に常に同期したい場合

#### 注意点

- `db pull`は DB の最新状態を**schema.prisma に上書き**します。手動で加えた model の修正は pull 後に再調整が必要な場合があります。
- VIEW は読み取り専用で、Prisma Client からは SELECT のみ可能です。

---

### まとめ

- まず MySQL で VIEW を作成 →`prisma db pull`で schema.prisma に反映 → 必要に応じて model 調整、という順番で進めてください。
- `prisma db pull`は DB スキーマを Prisma プロジェクトに自動反映する重要なコマンドです。

---

## 運用例・schema.prisma 調整ノウハウ

### 運用例

#### 1. VIEW 追加・変更の運用フロー

1. **MySQL で VIEW を作成・変更**
   - 例: 新しいカラムを追加した VIEW を`CREATE OR REPLACE VIEW ...`で作成
2. **`npx prisma db pull`を実行**
   - DB の最新状態が`schema.prisma`に反映される
3. **schema.prisma の VIEW モデルを確認・調整**
   - 型やフィールド名、@map 属性の追加・修正を行う
4. **Prisma Client で参照・開発**
   - 必要に応じて TypeScript 型の自動生成も行われる

#### 2. 既存 VIEW の仕様変更時

- 例：VIEW に新しいカラムを追加した場合
  - まず MySQL で VIEW を再定義
  - `prisma db pull`で schema.prisma に反映
  - 追加カラムが model に自動追加されるか確認し、必要に応じて型や@map 属性を調整

#### 3. 複数人開発時のベストプラクティス

- VIEW 定義 SQL・schema.prisma を必ずバージョン管理（git 等）
- VIEW 追加・変更時は、SQL と schema.prisma の両方を pull request でレビュー
- `prisma db pull`後に model の意図しない変更があれば、手動で調整し、理由をコメントで明記

---

### schema.prisma 調整ノウハウ

- **@map 属性の活用**
  - DB のカラム名と Prisma のフィールド名が異なる場合は必ず@map で対応
  - 例: `cspServiceCommonChecklistStatus String @map("cspServiceCommonChecklistStatus")`
- **型の自動判定と手動修正**
  - db pull は MySQL の型を自動判定するが、enum や特殊な型は手動で修正することも
  - 例: ステータス系は enum 型に変更可能
- **@@ignore の扱い**
  - db pull 時に@@ignore が付与されることがあるが、SELECT 参照したい場合は外す
- **VIEW の model 名は DB 名に合わせるのが無難**
  - ただし Prisma の命名規則に合わせてキャメルケース等にしてもよい
- **不要な model の整理**
  - db pull で不要な model が増えた場合は、手動で削除して OK
- **コメントや説明を積極的に追加**
  - schema.prisma の model やフィールドにコメントを付けておくと、チーム開発や将来の保守に役立つ

---

### 参考: よくあるトラブルと対策

- db pull で model が意図せず上書きされた → 必ず pull 前後で git diff 確認
- enum 型が String 型で生成された → 手動で enum 型に修正し、@map で DB カラムと対応
- VIEW のカラム名が変更されたのに model が古いまま → db pull 後に model を確認・修正

---

## より高度な運用や自動化スクリプト例もご案内できますので、ご要望があればお知らせください。

### git diff による pull 前後の確認について（詳細）

- `prisma db pull`は DB の最新状態を schema.prisma に**上書き**するため、意図しない model の追加・削除・型変更が発生することがあります。
- そのため、pull 前後で必ず`git diff`等で schema.prisma の差分を確認し、
  - どの model/field が追加・削除・変更されたか
  - 既存の model 定義や手動修正が消えていないか
  - VIEW の model が正しく反映されているか
    などをチェックします。
- 差分に問題があれば、pull 後に手動で修正し、必要なら pull リクエストやコミットコメントで理由を明記しましょう。

#### 例: 差分確認コマンド

```sh
git diff prisma/schema.prisma
```

---

### db pull と schema.prisma への手動追記（VIEW）の比較・おすすめ

- **基本的には`prisma db pull`で自動生成 → 必要に応じて手動で調整、の運用がおすすめです。**

#### 理由

- db pull は DB スキーマの最新状態を自動で反映するため、ヒューマンエラーや記述漏れを防げる
- VIEW のカラム名や型も自動で取得されるため、型のミスを減らせる
- DB 側で VIEW の仕様変更があった場合も、pull で自動反映できる

#### 手動追記が有効なケース

- db pull では意図通りの型や属性が付かない場合（enum 型や@map 属性など）
- 特定の model だけ細かくカスタマイズしたい場合
- ただし、**手動追記だけで DB に存在しない VIEW を model 化しても、Prisma Client からは利用できません**

#### おすすめ運用まとめ

1. MySQL で VIEW 作成
2. `prisma db pull`で schema.prisma に自動反映
3. 必要に応じて model を手動で調整
4. 差分は必ず git diff で確認

---

## この運用により、DB と Prisma のスキーマの一貫性・安全性を高く保つことができます。

## 開発 DB・本番 DB での VIEW 運用・Prisma 同期フロー（実践例）

### 1. DB 環境の整理

- **ローカル開発 DB**: docker-compose（MySQL 8、ポート 3308、DB 名：mock_db、ユーザー：mock）
- **本番 DB**: AWS RDS（MySQL、本番 DB 名：saas_mgt_db_prod、SSM ポートフォワーディング利用）

### 2. 運用フロー

#### A. ローカル開発 DB での運用・検証

1. ローカル DB に VIEW を作成（docker exec や MySQL クライアントで CREATE VIEW 実行）
2. .env の DATABASE_URL をローカル用にし、`npx prisma db pull`で schema.prisma に反映
3. 必要に応じて model を調整（@map や型修正）
4. Prisma Client で VIEW へのクエリをテスト（下記参照）
5. VIEW 定義 SQL をバージョン管理（例：/DOCUMENT/QUERY_VIEW.md 等）に保存

#### B. 本番 DB への反映

6. 本番 DB への VIEW 反映は、**必ずPrismaのmigrationファイル（migration.sql）にCREATE VIEW文を記述し、`npx prisma migrate deploy`で自動適用**してください。
   - mysqlシェル等で手動でVIEWを作成する必要はありません。
   - migration.sqlで一元管理し、DBの再現性・安全性を確保します。
7. **本番 DB で`prisma db pull`は原則行わず、schema.prisma はローカル pull・調整版を本番にも適用する**

> **要点：本番 DB で直接`prisma db pull`や手動CREATE VIEWは推奨しません。ローカルpull→調整→migration経由で本番反映が安全です。**

### 3. Prisma Client で VIEW に対するクエリを簡単にテストする方法

- `npx ts-node`や`node`で下記のようなスクリプトを作成・実行します。
- 例：`scripts/test-view.ts` を作成

```typescript
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
  const result = await prisma.v_summary_vendor_service.findMany({
    take: 5, // 例: 5件だけ取得
  })
  console.log(result)
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect())
```

- 実行例:
  ```sh
  npx ts-node scripts/test-view.ts
  ```
- これで VIEW からデータが取得できれば、Prisma Client 経由での参照が正常に動作していることを確認できます。

---

### まとめ

- ローカル（docker）で VIEW 作成・db pull・テスト → 本番 DB へ VIEW 反映、が安全な運用
- schema.prisma はローカル pull・調整版を本番にも適用（本番で pull しない）
- Prisma Client での VIEW テストは TypeScript の簡単なスクリプトで OK

---

## 運用や自動化のさらなる工夫例もご案内できますので、ご要望があればご相談ください。

## VIEW の model 追加時の`prisma migrate`と`prisma generate`の使い分け

### VIEW の model 追加時の正しい運用

- **MySQL で VIEW を作成し、schema.prisma に model を手動追加した場合は、`npx prisma generate`だけで十分です。**
- `prisma migrate`は不要です。
- migrate は「Prisma の model 変更を DB スキーマに反映する」ためのコマンドなので、VIEW のように「既に DB に存在するもの」を Prisma で参照したい場合は使いません。

#### 手順まとめ

1. MySQL で CREATE VIEW ...
2. schema.prisma に model を手動追加（VIEW のカラム構造に合わせる）
3. `npx prisma generate`で Prisma Client の型・API を再生成

### migrate を実行した場合の影響

- migrate を実行すると、Prisma は model 追加分を「新しいテーブルとして DB に作ろう」とするため、
  - 既に VIEW が存在する場合はエラーになることがあります。
  - 何も起きずにスルーされる場合もありますが、意図しない migration ファイルが生成されるリスクがあるため推奨されません。

---

## エラー内容の確認と評価

- あなたが migrate を実行した際のエラーは、
  - 「既に同名の VIEW が DB に存在しているため、テーブル作成に失敗した」
  - もしくは「何も migration が発生しなかった」
- どちらも**DB 構造やデータを壊すような致命的な問題ではありません**。
- ただし、migration ファイルが不要に生成されている場合は、git で確認し、不要なら削除してください。

---

### まとめ

- VIEW の model 追加には`prisma migrate`は不要、`npx prisma generate`だけで OK
- migrate は「DB の構造を変更したい時」にのみ使う
- エラーが出ても DB やデータが壊れることはないが、今後は migrate せず generate のみで十分

---

## 運用や migration ファイルの整理についてもご相談があればご案内します。

## Prisma VIEW モデルのテストコード例と tsconfig 運用ノウハウ

### Prisma VIEW モデルのテストコード例

Prisma Client で MySQL の VIEW を参照するには、以下のような TypeScript スクリプトを作成します。

```typescript
import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()

async function main() {
  const result = await prisma.v_summary_vendor_service.findMany({
    take: 5, // 例: 5件だけ取得
  })
  console.log(result)
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect())
```

#### 実行方法

Node.js v20 以降や Next.js 系のプロジェクトでは、プロジェクト全体の`tsconfig.json`が ESM/フロントエンド向けとなっているため、
**サーバーサイドスクリプト用に専用の tsconfig を用意するのが安全です。**

#### 例: サーバーサイド用 tsconfig（mgt-app/prisma/scripts/tsconfig.script.json）

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "module": "commonjs",
    "esModuleInterop": true,
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["../prisma/scripts/*.ts"]
}
```

#### 実行コマンド

```sh
npx ts-node --project prisma/scripts/tsconfig.script.json prisma/scripts/test-view.ts
```

- プロジェクト直下で`ts-node`を実行する場合、`--project`でサーバーサイド用 tsconfig を明示的に指定してください。
- これにより、Next.js やフロントエンド向けの tsconfig 設定の影響を受けず、純粋な Node.js スクリプトとして TypeScript ファイルを安全に実行できます。

---

### トラブルシューティング

- Node.js v20 以降＋`module: "esnext"`や`moduleResolution: "bundler"`の設定では、ts-node で`.ts`ファイルを直接実行できないことがあります。
- 上記のように**サーバーサイド用 tsconfig を分離**し、`commonjs`で動かすことで解決できます。
- それでもエラーが出る場合は、Node.js のバージョンや ts-node のバージョンも確認してください。

---

### まとめ

- Prisma で VIEW を model 化した場合のテストは、専用 tsconfig ＋ ts-node で安全に実行できる
- Next.js やフロントエンドの tsconfig とは分離運用がベスト
- サンプルやノウハウは`mgt-app/prisma/scripts/tsconfig.script.json`に格納

---

## この運用をプロジェクト標準として推奨します。

## Node.js v20 以降＋ esnext/bundler 設定で ts-node が直接実行できない背景

Node.js v20 以降では、ECMAScript Modules（ESM）サポートが正式仕様に近づき、
「.ts ファイルや ESM 形式のファイルの解釈」がより厳格になりました。

- これまでの Node.js（v18 以前）は、拡張子や型判定が比較的緩やかで、ts-node も柔軟に動作していました。
- v20 以降は、
  - `module: "esnext"`や`moduleResolution: "bundler"`の設定環境下で、
  - `.ts`拡張子や ESM 形式のファイルを直接実行しようとすると、
  - Node.js が「どのローダーで解釈すべきか」を厳密に判定し、
  - ts-node の内部ローダーや CommonJS との互換性が崩れやすくなりました。

このため、**フロントエンド用途の tsconfig（esnext/bundler）とサーバーサイド用途の tsconfig（commonjs）を分けて運用するのが必須**となっています。

背景には、Node.js 本体の「ESM と CommonJS の厳密な分離」「拡張子ごとの厳格な解釈」「互換性の明示的な制御」があります。

---

## 本番 DB に VIEW を追加する場合の運用

### 基本方針

- **MySQL の VIEW 追加は、Prisma の migrate 機能では直接サポートされていません。**
- VIEW 追加の SQL（CREATE VIEW ...）は、マイグレーションファイル（SQL 形式）として手動で管理するのが一般的です。

### 運用例

1. `prisma/migrations/xxxxxx_add_view/migration.sql` に CREATE VIEW 文を記載
2. 本番環境では、
   ```sh
   npx prisma migrate deploy
   ```
   でマイグレーションを適用

- これにより、テーブル・VIEW 等の DB 構造変更が本番 DB に反映されます。
- Prisma の schema.prisma には VIEW の model を手動で追加しておくこと。

### 注意点

- migrate deploy は「migrations ディレクトリ内のすべての migration.sql」を順番に適用します。
- 既存の VIEW と競合しないように、SQL の内容を事前に本番 DB でテストしておくことを推奨します。

---

### md ファイルへの運用例追記

- 上記の内容を「VIEW 運用・本番反映の手順」セクションに追記しました。

---

この運用で、本番 DB にも安全に VIEW を追加・管理できます。
---

### 【補足】本番DBへのVIEW作成は「マイグレーションで自動適用」が推奨

- 本番DBにVIEWを作成する際は、**Prismaのmigration.sqlにCREATE VIEW文を書き、`npx prisma migrate deploy`で自動的に反映させる**のがベストプラクティスです。
- **mysqlシェル等で手動でVIEWを作成する必要はありません。**
- migration.sqlに正しくCREATE VIEW文が書かれていれば、`migrate deploy`で本番DBにもVIEWが自動作成されます。
- 逆に、手動でVIEWを作成すると、migration適用時に「既に存在する」となってエラーになる場合があります。

> **要点：VIEWもmigrationファイルで管理し、本番DBは`npx prisma migrate deploy`で一元的に反映するのが安全です。**

---
---

## 【運用例・トラブル例の記録】

### migrate deployの繰り返し実行とエラー例

- `npx prisma migrate deploy` は何度実行しても安全です。適用済みのmigrationはスキップされ、新規のみ適用されます。
- ただし、**過去のmigrationが失敗したまま残っている場合（例：途中でエラーになったmigration.sqlがある場合）、以降のmigrationは適用されません**。
- その場合は、エラーメッセージ（例：P3009 migrate found failed migrations...）を参考に、
  - 不要なmigrationディレクトリを削除、または
  - `prisma migrate resolve`で失敗状態を解消（resolved）する必要があります。
- エラーの例や解決方法は公式ドキュメントも参照してください。
  - https://pris.ly/d/migrate-resolve

### 実際の運用例

- ローカルDBで失敗したmigration（例：`20250806020303_add_view`）が残っていると、以降のmigrationが適用されない。
- 不要なmigrationを削除し、再度`npx prisma migrate deploy`を実行すればOK。
- 本番DBでは「No pending migrations to apply.」と出れば、すべて適用済みで問題なし。

---

このようなトラブルや運用例も、プロジェクトのナレッジとして記録・共有していくことを推奨します。
---

## 【補足】ENUM型・デフォルト値のmigration管理例

- DBテーブルのENUM型やデフォルト値の変更も、Prismaのmigration.sqlで一元管理できます。
- 例：`20250805143817_add_default_statuses/migration.sql`

```sql
-- AlterTable
ALTER TABLE `SummaryOutsourcingServiceCspService` MODIFY `cspServiceCommonChecklistStatus` ENUM('not_created', 'completed', 'not_required', 'is_examined') NOT NULL DEFAULT 'not_created',
    MODIFY `cspServiceDetailChecklistStatus` ENUM('not_created', 'completed', 'not_required', 'is_examined') NOT NULL DEFAULT 'not_created';

-- AlterTable
ALTER TABLE `SummaryVendorService` MODIFY `vendorCommonChecklistStatus` ENUM('not_created', 'completed', 'not_required', 'is_examined') NOT NULL DEFAULT 'not_created',
    MODIFY `vendorDetailChecklistStatus` ENUM('not_created', 'completed', 'not_required', 'is_examined') NOT NULL DEFAULT 'not_created';

-- AlterTable
ALTER TABLE `SummaryVendorServiceCspService` MODIFY `vendorCommonChecklistStatus` ENUM('not_created', 'completed', 'not_required', 'is_examined') NOT NULL DEFAULT 'not_created',
    MODIFY `vendorDetailChecklistStatus` ENUM('not_created', 'completed', 'not_required', 'is_examined') NOT NULL DEFAULT 'not_created',
    MODIFY `cspCommonChecklistStatus` ENUM('not_created', 'completed', 'not_required', 'is_examined') NOT NULL DEFAULT 'not_created',
    MODIFY `cspDetailChecklistStatus` ENUM('not_created', 'completed', 'not_required', 'is_examined') NOT NULL DEFAULT 'not_created';
```

- このように、**テーブル定義の変更もmigrationで管理し、`npx prisma migrate deploy`で本番DBへ自動反映**できます。
- テーブル定義・VIEW定義・ENUM定義など、**DB構成の全てをmigrationで一元管理することが推奨運用**です。

---
