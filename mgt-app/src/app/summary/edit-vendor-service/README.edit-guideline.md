# Vendor Service Summary UI 開発ガイドライン

このドキュメントは、`mgt-app/src/app/summary/edit-vendor-service` ディレクトリのUI開発における要件・設計方針・過去の失敗とその対策をまとめたものです。
今後の実装は必ずこのガイドラインに従って進めてください。

---

## 1. ユーザーからの要求・要件

- **Next.js App Router 構成**
  - `page.tsx` はサーバーコンポーネントとして、データ取得のみを担当。
  - UI・状態管理・イベント処理はすべてクライアントコンポーネントで行う。
  - Prismaスキーマ（`mgt-app/prisma/schema.prisma`）に厳密に準拠し、データ取得・保存ロジックを記述する。
- **データ取得・保存要件**
  - 既存レコードの表示は必ず `SummaryVendorService` テーブルから取得する。
  - 新規作成や編集時の保存処理では、`SummaryVendorService` だけでなく、`Vendor`、`VendorService` など関連テーブルにも必要に応じて書き込みを行い、全テーブルで整合性を担保する。
  - `Client` テーブルは「既存データからの選択のみ許可」であり、この画面から新規作成・編集は行わない。
- **API Routeの扱い**
  - サーバーアクション方式に統一しているため、`api`ディレクトリや`save`ディレクトリ、API Routeは不要。今後も使用しない。
- **UI/UX**
  - 行の追加・削除、各種入力欄（セレクト/テキスト/オートコンプリートなど）
  - 保存・キャンセルボタン
  - 英語UI、Tailwind CSSベース
  - Vendorは`react-select/creatable`でフリーテキスト入力可
  - Addボタンで追加した新規行は背景色で区別

---

## 2. 保存時の整合性担保仕様

- Clientは既存データのみ選択可能であり、書き込み不要。
- Vendor/VendorServiceは、入力値が未登録の場合はinsertし、既存の場合は既存idを参照。
- SummaryVendorServiceは「clientId+vendorServiceId」組み合わせで存在チェックし、**既に存在する場合は何もしない。なければinsert（上書きやエラー表示はしない）**。
- 必ずSummaryVendorServiceに保存（insertのみ、重複時はスキップ）。

---

## 3. 過去の失敗と原因

- サーバー/クライアント混在によるエラー
- クライアントコンポーネントの空実装
- Prismaスキーマに準拠しないカラム指定によるエラー

---

## 4. 今後の実装方針

- サーバー/クライアント完全分離
- Prismaスキーマ準拠の徹底
- 関連テーブルも含めた整合性のある保存処理
- 段階的なUI実装
- 画面が常に「何か表示される」状態を維持

---
