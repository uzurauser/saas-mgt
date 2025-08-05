# 本番 DB（AWS RDS）への接続手順

## Migrate and Seed

```sh
cd mgt-app/
npx prisma migrate deploy --schema=prisma/schema.prisma
npx prisma db seed
```

## .env ファイル

本番用にファイルを書き換える。
RDS インスタンスを private subnet に配置しているため、ポートフォワードを経て接続する。

```sh
# dev
# DATABASE_URL="mysql://mock:mock@localhost:3308/mock_db?charset=utf8mb4"

# prod
# DATABASE_URL="mysql://user:password123@saas-mgt-db-2025-08.cp2qy822eivd.us-east-1.rds.amazonaws.com:3306/saas_mgt_db_prod?charset=utf8mb4"

# prod via session manager
# SSM ポートフォワーディング 13306->3306
DATABASE_URL="mysql://user:password123@localhost:13306/saas_mgt_db_prod?charset=utf8mb4"
```

```sh
aws ssm start-session --profile us-east-1 --target i-0b48d5a7dc8b1f5f8 --document-name AWS-StartPortForwardingSessionToRemoteHost --parameters '{"host":["saas-mgt-db-2025-08.cp2qy822eivd.us-east-1.rds.amazonaws.com"],"portNumber":["3306"],"localPortNumber":["13306"]}'

# Starting session with SessionId: osamu.harada-p5xtrx7pt7d7niha9xirn7g9fe
# Port 13306 opened for sessionId osamu.harada-p5xtrx7pt7d7niha9xirn7g9fe.
# Waiting for connections...
```

```sh
# 別ターミナルで
mysql -h localhost -P 13306 -u user -p
```

---

## RDS、EC2 インスタンスのセキュリティグループ設定
