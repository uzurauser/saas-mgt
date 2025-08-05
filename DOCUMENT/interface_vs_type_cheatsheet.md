# TypeScript `interface` vs `type` 使い分け Cheat Sheet

## ✅ まず結論

| ケース | おすすめ | 理由 |
|--------|----------|------|
| **オブジェクトの形を表す（基本）** | どっちでもOK | 機能的には同じ |
| **クラスに implements させる** | `interface` | クラス設計に親和性が高い |
| **複数オブジェクトの拡張（extends）を使う** | `interface` | 宣言的に拡張しやすい |
| **ユニオン型、交差型を使いたい** | `type` | 合成型が得意 |
| **プリミティブ型やタプル、関数型を定義する** | `type` | これしか使えない |
| **ライブラリの公開型定義** | `interface` | 後から拡張可能なため |

---

## ✅ interface の特徴

- オブジェクトの型専用
- クラスに implements できる
- `extends` で拡張しやすい
- 後から「マージ」できる（宣言的に追加可能）

```typescript
interface User {
  name: string;
}

interface User {
  age: number;
}

// 実際は ↓ のように統合される
// interface User { name: string; age: number; }
```

---

## ✅ type の特徴

- 何でも型にできる（オブジェクト、プリミティブ、ユニオン、タプル、関数型 など）
- 型合成（交差型 & ユニオン型）に強い
- 名前空間をまたいだマージはできない（interfaceはできる）

```typescript
type Point = { x: number; y: number };
type Label = { label: string };

type LabeledPoint = Point & Label;
// { x: number; y: number; label: string }
```

---

## ✅ 使い分けの黄金ルール

| 状況 | interface | type |
|------|-----------|------|
| **オブジェクトの形** | ◎ | ◎ |
| **クラス設計** | ◎ | △ |
| **後から型を拡張したい** | ◎ | ✕ |
| **ユニオン型・タプル・関数型などもまとめたい** | ✕ | ◎ |
| **軽いオブジェクトのデータ定義だけ** | 好みでOK | 好みでOK |

---

## ✅ おすすめ運用指針

- オブジェクト設計 (クラス・APIレスポンス系) → `interface`
- 複数型の合成・柔軟な型操作 (関数・ユニオン・交差型) → `type`
- 迷ったら interface でOK（後で型拡張できるので安全）

---

## ✅ 1行でまとめると：

> **「オブジェクトの形」なら `interface`、型の「計算や合成」なら `type`**

---

## ✅ あなたのケース（今回のやつ）は：

→ **interface でOK**（純粋なオブジェクトの形なので）