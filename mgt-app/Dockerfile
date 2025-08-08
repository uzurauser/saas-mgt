# 1. 依存関係インストール & ビルドステージ
FROM node:18-alpine AS builder

# 作業ディレクトリ
WORKDIR /app

# package.json と lockファイルだけコピー（キャッシュを効かせるため）
COPY package*.json ./

# 依存関係インストール
RUN npm install

# ソースコードコピー
COPY . .

# Next.js を本番用にビルド
RUN npm run build

# 2. 実行用ステージ（軽量）
FROM node:18-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# ビルド済みファイルと必要な依存関係だけコピー
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# ポート3000を開放
EXPOSE 3000

# Next.js の本番起動
CMD ["npm", "start"]
