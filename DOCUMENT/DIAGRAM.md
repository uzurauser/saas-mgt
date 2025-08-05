## ER 図

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
