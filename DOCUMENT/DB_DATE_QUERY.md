## ✅ insert の履歴確認方法（MySQL）

### 1. 特定日付の INSERT 履歴を確認

たとえば、`Vendor` テーブルで、2024 年 8 月 1 日に作成されたデータを見たい場合：

```sql
SELECT * FROM Vendor
WHERE DATE(createdAt) = '2024-08-01';
```

### 2. 日付の範囲で確認

例：2024 年 8 月 1 日 〜 2024 年 8 月 3 日 の間に作成されたデータ：

```sql
SELECT * FROM Vendor
WHERE createdAt BETWEEN '2024-08-01 00:00:00' AND '2024-08-03 23:59:59';
```

`BETWEEN` は 両端を含む ので、「以上かつ以下」で比較できます。
