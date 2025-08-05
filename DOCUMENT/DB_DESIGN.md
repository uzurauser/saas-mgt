# DB 設計書

本ドキュメントは、`mgt-app/prisma/schema.prisma` をもとに作成したデータベース設計書です。

## データベース: MySQL

---

## 1. Enum 定義

### AntisocialCheckStatus

- unchecked
- checked
- check_exception
- monitor_checked

### ChecklistStatusEnum

- not_created
- completed
- not_required
- is_examined

---

## 2. テーブル定義

### Client（クライアント）

| カラム名  | 型       | 属性                  |
| --------- | -------- | --------------------- |
| id        | Int      | 主キー, AutoIncrement |
| name      | String   | 一意, 必須            |
| createdAt | DateTime | デフォルト: 現在日時  |
| updatedAt | DateTime | 自動更新              |

- リレーション: SummaryVendorService[], SummaryVendorServiceCspService[], SummaryOutsourcingServiceCspService[]

---

### Vendor（ベンダー）

| カラム名              | 型                    | 属性                  |
| --------------------- | --------------------- | --------------------- |
| id                    | Int                   | 主キー, AutoIncrement |
| name                  | String                | 一意, 必須            |
| createdAt             | DateTime              | デフォルト: 現在日時  |
| updatedAt             | DateTime              | 自動更新              |
| antisocialCheckStatus | AntisocialCheckStatus | デフォルト: unchecked |

- リレーション: VendorService[], SummaryVendorService[], SummaryVendorServiceCspService[]

---

### VendorService（ベンダーサービス）

| カラム名  | 型       | 属性                  |
| --------- | -------- | --------------------- |
| id        | Int      | 主キー, AutoIncrement |
| name      | String   | 一意, 必須            |
| vendorId  | Int      | 外部キー: Vendor      |
| createdAt | DateTime | デフォルト: 現在日時  |
| updatedAt | DateTime | 自動更新              |

- リレーション: Vendor, SummaryVendorService[], SummaryVendorServiceCspService[]

---

### Csp（クラウドサービスプロバイダ）

| カラム名              | 型                    | 属性                  |
| --------------------- | --------------------- | --------------------- |
| id                    | Int                   | 主キー, AutoIncrement |
| name                  | String                | 一意, 必須            |
| createdAt             | DateTime              | デフォルト: 現在日時  |
| updatedAt             | DateTime              | 自動更新              |
| antisocialCheckStatus | AntisocialCheckStatus | デフォルト: unchecked |

---

### CspService（クラウドサービス）

| カラム名  | 型       | 属性                  |
| --------- | -------- | --------------------- |
| id        | Int      | 主キー, AutoIncrement |
| name      | String   | 一意, 必須            |
| cspId     | Int      | 外部キー: Csp         |
| createdAt | DateTime | デフォルト: 現在日時  |
| updatedAt | DateTime | 自動更新              |

---

### Cycle（サイクル）

| カラム名  | 型       | 属性                  |
| --------- | -------- | --------------------- |
| id        | Int      | 主キー, AutoIncrement |
| name      | String   | 一意, 必須            |
| startDate | DateTime | 必須                  |
| endDate   | DateTime | 必須                  |
| isActive  | Boolean  | デフォルト: false     |
| createdAt | DateTime | デフォルト: 現在日時  |
| updatedAt | DateTime | 自動更新              |

---

### OutsourcingPartner（アウトソーシングパートナー）

| カラム名              | 型                    | 属性                  |
| --------------------- | --------------------- | --------------------- |
| id                    | Int                   | 主キー, AutoIncrement |
| name                  | String                | 一意, 必須            |
| createdAt             | DateTime              | デフォルト: 現在日時  |
| updatedAt             | DateTime              | 自動更新              |
| antisocialCheckStatus | AntisocialCheckStatus | デフォルト: unchecked |

---

### OutsourcingService（アウトソーシングサービス）

| カラム名             | 型       | 属性                         |
| -------------------- | -------- | ---------------------------- |
| id                   | Int      | 主キー, AutoIncrement        |
| name                 | String   | 一意, 必須                   |
| outsourcingPartnerId | Int      | 外部キー: OutsourcingPartner |
| createdAt            | DateTime | デフォルト: 現在日時         |
| updatedAt            | DateTime | 自動更新                     |

---

## 3. サマリ系テーブル

### SummaryVendorService

| カラム名                    | 型                    | 属性                    |
| --------------------------- | --------------------- | ----------------------- |
| id                          | Int                   | 主キー, AutoIncrement   |
| cycleId                     | Int                   | 外部キー: Cycle         |
| clientId                    | Int                   | 外部キー: Client        |
| vendorId                    | Int                   | 外部キー: Vendor        |
| vendorServiceId             | Int                   | 外部キー: VendorService |
| vendorAntisocialCheckStatus | AntisocialCheckStatus | デフォルト: unchecked   |
| vendorCommonChecklistStatus | ChecklistStatusEnum   | デフォルト: not_created |
| vendorDetailChecklistStatus | ChecklistStatusEnum   | デフォルト: not_created |
| createdAt                   | DateTime              | デフォルト: 現在日時    |
| updatedAt                   | DateTime              | 自動更新                |

---

### SummaryVendorServiceCspService

| カラム名                    | 型                    | 属性                    |
| --------------------------- | --------------------- | ----------------------- |
| id                          | Int                   | 主キー, AutoIncrement   |
| cycleId                     | Int                   | 外部キー: Cycle         |
| clientId                    | Int                   | 外部キー: Client        |
| vendorId                    | Int                   | 外部キー: Vendor        |
| vendorServiceId             | Int                   | 外部キー: VendorService |
| cspId                       | Int                   | 外部キー: Csp           |
| cspServiceId                | Int                   | 外部キー: CspService    |
| vendorAntisocialCheckStatus | AntisocialCheckStatus | デフォルト: unchecked   |
| vendorCommonChecklistStatus | ChecklistStatusEnum   | デフォルト: not_created |
| vendorDetailChecklistStatus | ChecklistStatusEnum   | デフォルト: not_created |
| cspAntisocialCheckStatus    | AntisocialCheckStatus | デフォルト: unchecked   |
| cspCommonChecklistStatus    | ChecklistStatusEnum   | デフォルト: not_created |
| cspDetailChecklistStatus    | ChecklistStatusEnum   | デフォルト: not_created |
| createdAt                   | DateTime              | デフォルト: 現在日時    |
| updatedAt                   | DateTime              | 自動更新                |

- 一意制約: (clientId, vendorServiceId, cspServiceId)

---

### SummaryOutsourcingServiceCspService

| カラム名                                | 型                    | 属性                         |
| --------------------------------------- | --------------------- | ---------------------------- |
| id                                      | Int                   | 主キー, AutoIncrement        |
| cycleId                                 | Int                   | 外部キー: Cycle              |
| clientId                                | Int                   | 外部キー: Client             |
| outsourcingPartnerId                    | Int                   | 外部キー: OutsourcingPartner |
| outsourcingServiceId                    | Int                   | 外部キー: OutsourcingService |
| cspId                                   | Int                   | 外部キー: Csp                |
| cspServiceId                            | Int                   | 外部キー: CspService         |
| outsourcingPartnerAntisocialCheckStatus | AntisocialCheckStatus | デフォルト: unchecked        |
| cspAntisocialCheckStatus                | AntisocialCheckStatus | デフォルト: unchecked        |
| cspServiceCommonChecklistStatus         | ChecklistStatusEnum   | デフォルト: not_created      |
| cspServiceDetailChecklistStatus         | ChecklistStatusEnum   | デフォルト: not_created      |
| createdAt                               | DateTime              | デフォルト: 現在日時         |
| updatedAt                               | DateTime              | 自動更新                     |

- 一意制約: (clientId, outsourcingServiceId, cspServiceId)

---

## 4. リレーション図（概要）

- Client, Vendor, VendorService, Csp, CspService, OutsourcingPartner, OutsourcingService, Cycle などの各エンティティが、Summary テーブルで多対多・1 対多の関係で結びついています。

## 5. ER 図（リレーション図）

```
[Client] 1 --- n [SummaryVendorService] n --- 1 [Vendor]
                    |
                    n
                    |
                    1
              [VendorService]

[Client] 1 --- n [SummaryVendorServiceCspService] n --- 1 [Vendor]
                    |                                     |
                    n                                     n
                    |                                     |
                    1                                     1
              [VendorService]                       [Csp]
                                                        |
                                                        n
                                                        |
                                                        1
                                                  [CspService]

[Client] 1 --- n [SummaryOutsourcingServiceCspService] n --- 1 [OutsourcingPartner]
                    |                                            |
                    n                                            n
                    |                                            |
                    1                                            1
              [OutsourcingService]                         [Csp]
                                                                |
                                                                n
                                                                |
                                                                1
                                                          [CspService]

[Cycle] 1 --- n [SummaryVendorService]
[Cycle] 1 --- n [SummaryVendorServiceCspService]
[Cycle] 1 --- n [SummaryOutsourcingServiceCspService]
```

- `1 --- n` は 1 対多、`n --- 1`も多対 1 の関係を示します。
- Summary テーブルが各エンティティ（Client, Vendor, VendorService, Csp, CspService, OutsourcingPartner, OutsourcingService, Cycle）を橋渡ししています。
