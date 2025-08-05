# DB 設計書

## 概要

このドキュメントは `schema.prisma` をもとに自動生成した DB 設計書です。

---

## エンティティ一覧

### 1. Client

| カラム名  | 型       | 属性・制約        | 説明            |
| --------- | -------- | ----------------- | --------------- |
| id        | Int      | PK, AutoIncrement | クライアント ID |
| name      | String   | Unique            | クライアント名  |
| createdAt | DateTime | Default(now())    | 作成日時        |
| updatedAt | DateTime | AutoUpdate        | 更新日時        |

#### リレーション

| table                            | relation                          |
| -------------------------------- | --------------------------------- |
| vendors                          | ClientVendor[]                    |
| csp                              | ClientCsp[]                       |
| outsourcingPartners              | ClientOutsourcingPartner[]        |
| vendorServiceCspAssignments      | VendorServiceCspAssignment[]      |
| outsourcingServiceCspAssignments | OutsourcingServiceCspAssignment[] |

---

### 2. Vendor

| カラム名              | 型       | 属性・制約         | 説明             |
| --------------------- | -------- | ------------------ | ---------------- |
| id                    | Int      | PK, AutoIncrement  | ベンダー ID      |
| name                  | String   | Unique             | ベンダー名       |
| createdAt             | DateTime | Default(now())     | 作成日時         |
| updatedAt             | DateTime | AutoUpdate         | 更新日時         |
| antisocialCheckStatus | Enum     | Default(unchecked) | 反社チェック状態 |

#### リレーション

| table                       | relation                     |
| --------------------------- | ---------------------------- |
| clients                     | ClientVendor[]               |
| vendorServices              | VendorService[]              |
| vendorServiceCspAssignments | VendorServiceCspAssignment[] |

---

### 3. VendorService

| カラム名  | 型       | 属性・制約        | 説明        |
| --------- | -------- | ----------------- | ----------- |
| id        | Int      | PK, AutoIncrement | サービス ID |
| name      | String   | Unique            | サービス名  |
| vendorId  | Int      | FK                | ベンダー ID |
| createdAt | DateTime | Default(now())    | 作成日時    |
| updatedAt | DateTime | AutoUpdate        | 更新日時    |

#### リレーション

| table                       | relation                     |
| --------------------------- | ---------------------------- |
| vendor                      | Vendor                       |
| vendorServiceCspAssignments | VendorServiceCspAssignment[] |

---

### 4. Csp

| カラム名  | 型       | 属性・制約        | 説明     |
| --------- | -------- | ----------------- | -------- |
| id        | Int      | PK, AutoIncrement | CSP ID   |
| name      | String   | Unique            | CSP 名   |
| createdAt | DateTime | Default(now())    | 作成日時 |
| updatedAt | DateTime | AutoUpdate        | 更新日時 |

---

### 5. CspService

| カラム名  | 型       | 属性・制約        | 説明            |
| --------- | -------- | ----------------- | --------------- |
| id        | Int      | PK, AutoIncrement | CSP サービス ID |
| name      | String   | Unique            | サービス名      |
| cspId     | Int      | FK                | CSP ID          |
| createdAt | DateTime | Default(now())    | 作成日時        |
| updatedAt | DateTime | AutoUpdate        | 更新日時        |

---

### 6. OutsourcingPartner

| カラム名  | 型       | 属性・制約        | 説明      |
| --------- | -------- | ----------------- | --------- |
| id        | Int      | PK, AutoIncrement | 外注先 ID |
| name      | String   | Unique            | 外注先名  |
| createdAt | DateTime | Default(now())    | 作成日時  |
| updatedAt | DateTime | AutoUpdate        | 更新日時  |

---

### 7. OutsourcingService

| カラム名             | 型       | 属性・制約        | 説明        |
| -------------------- | -------- | ----------------- | ----------- |
| id                   | Int      | PK, AutoIncrement | サービス ID |
| name                 | String   | Unique            | サービス名  |
| outsourcingPartnerId | Int      | FK                | 外注先 ID   |
| createdAt            | DateTime | Default(now())    | 作成日時    |
| updatedAt            | DateTime | AutoUpdate        | 更新日時    |

---

### 8. リレーション・中間テーブル

| table                           | relation                          |
| ------------------------------- | --------------------------------- |
| ClientVendor                    | ClientVendor[]                    |
| ClientCsp                       | ClientCsp[]                       |
| ClientOutsourcingPartner        | ClientOutsourcingPartner[]        |
| VendorServiceCspAssignment      | VendorServiceCspAssignment[]      |
| OutsourcingServiceCspAssignment | OutsourcingServiceCspAssignment[] |

（詳細は schema.prisma を参照）

---

## Enum 定義

- AntisocialCheckStatus: `unchecked`, `checked`, `check_exception`, `monitor_checked`

---
