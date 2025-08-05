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
## 5. R図（リレーション図）

以下は、主要テーブル間のリレーション（R図）です。

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

- `1 --- n` は1対多、`n --- 1`も多対1の関係を示します。
- Summaryテーブルが各エンティティ（Client, Vendor, VendorService, Csp, CspService, OutsourcingPartner, OutsourcingService, Cycle）を橋渡ししています。
- 詳細なER図・可視化が必要な場合は、PlantUMLやdbdiagram.io形式での出力も可能です。
## 6. ER図（PlantUMLコード例）

以下は、PlantUML形式で記述したER図のコード例です。
PlantUMLやdbdiagram.ioなどのツールで可視化できます。

```plantuml
@startuml
entity Client {
  *id : Int
  *name : String
}
entity Vendor {
  *id : Int
  *name : String
}
entity VendorService {
  *id : Int
  *name : String
  vendorId : Int
}
entity Csp {
  *id : Int
  *name : String
}
entity CspService {
  *id : Int
  *name : String
  cspId : Int
}
entity Cycle {
  *id : Int
  *name : String
}
entity OutsourcingPartner {
  *id : Int
  *name : String
}
entity OutsourcingService {
  *id : Int
  *name : String
  outsourcingPartnerId : Int
}
entity SummaryVendorService {
  *id : Int
  cycleId : Int
  clientId : Int
  vendorId : Int
  vendorServiceId : Int
}
entity SummaryVendorServiceCspService {
  *id : Int
  cycleId : Int
  clientId : Int
  vendorId : Int
  vendorServiceId : Int
  cspId : Int
  cspServiceId : Int
}
entity SummaryOutsourcingServiceCspService {
  *id : Int
  cycleId : Int
  clientId : Int
  outsourcingPartnerId : Int
  outsourcingServiceId : Int
  cspId : Int
  cspServiceId : Int
}

// リレーション
Client ||--o{ SummaryVendorService : ""
Vendor ||--o{ SummaryVendorService : ""
VendorService ||--o{ SummaryVendorService : ""
Cycle ||--o{ SummaryVendorService : ""

Client ||--o{ SummaryVendorServiceCspService : ""
Vendor ||--o{ SummaryVendorServiceCspService : ""
VendorService ||--o{ SummaryVendorServiceCspService : ""
Csp ||--o{ SummaryVendorServiceCspService : ""
CspService ||--o{ SummaryVendorServiceCspService : ""
Cycle ||--o{ SummaryVendorServiceCspService : ""

Client ||--o{ SummaryOutsourcingServiceCspService : ""
OutsourcingPartner ||--o{ SummaryOutsourcingServiceCspService : ""
OutsourcingService ||--o{ SummaryOutsourcingServiceCspService : ""
Csp ||--o{ SummaryOutsourcingServiceCspService : ""
CspService ||--o{ SummaryOutsourcingServiceCspService : ""
Cycle ||--o{ SummaryOutsourcingServiceCspService : ""
@enduml
```

- 上記コードをPlantUMLエディタ等で貼り付けていただくと、ER図として可視化できます。
- dbdiagram.io形式や他フォーマットでの出力もご希望があれば対応可能です。
