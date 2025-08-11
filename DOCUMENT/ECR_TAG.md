# AWS ECR イメージタグ管理ガイド

## 目次
1. [イメージタグの重要性](#イメージタグの重要性)
2. [推奨されるタグ付け方法](#推奨されるタグ付け方法)
3. [Dockerイメージのビルドとプッシュ](#dockerイメージのビルドとプッシュ)
4. [ベストプラクティス](#ベストプラクティス)
5. [トラブルシューティング](#トラブルシューティング)

## イメージタグの重要性

Dockerイメージに適切なタグを付けることは、以下の理由で重要です：

- **バージョン管理**: どのコードバージョンからビルドされたか追跡可能
- **ロールバック**: 問題が発生した場合に以前のバージョンに簡単に戻せる
- **環境管理**: 開発、ステージング、本番環境で異なるタグを使用可能
- **監査**: 誰がいつデプロイしたか記録を残せる

## 推奨されるタグ付け方法

### 1. コミットハッシュを使用する方法
```bash
# コミットハッシュを取得
GIT_COMMIT=$(git rev-parse --short HEAD)

# イメージにタグ付け
docker tag your-app:latest 123456789012.dkr.ecr.region.amazonaws.com/your-repo:${GIT_COMMIT}
```

### 2. セマンティックバージョニングと組み合わせる
```
v1.0.0-abc1234  # メジャー.マイナー.パッチ-コミットハッシュ
```

### 3. 環境タグを追加
```
production-latest  # 本番環境の最新
staging-latest    # ステージング環境の最新
develop-latest    # 開発環境の最新
```

## Dockerイメージのビルドとプッシュ

### 1. ECRにログイン
```bash
aws ecr get-login-password --region region | docker login --username AWS --password-stdin 123456789012.dkr.ecr.region.amazonaws.com
```

### 2. イメージをビルド
```bash
docker build -t your-app .
```

### 3. タグ付け
```bash
# コミットハッシュでタグ付け
GIT_COMMIT=$(git rev-parse --short HEAD)
docker tag your-app:latest 123456789012.dkr.ecr.region.amazonaws.com/your-repo:${GIT_COMMIT}

# 必要に応じて追加のタグ（例: latest）
docker tag your-app:latest 123456789012.dkr.ecr.region.amazonaws.com/your-repo:latest
```

### 4. イメージをプッシュ
```bash
# コミットハッシュ付きのイメージをプッシュ
docker push 123456789012.dkr.ecr.region.amazonaws.com/your-repo:${GIT_COMMIT}

# 必要に応じてlatestタグもプッシュ
docker push 123456789012.dkr.ecr.region.amazonaws.com/your-repo:latest
```

## ベストプラクティス

1. **常に明示的なタグを使用する**
   - `latest`タグだけに依存しない
   - どのバージョンが本番環境で動いているか明確に

2. **CI/CDパイプラインで自動化**
   ```yaml
   # GitHub Actionsの例
   - name: Build and push
     env:
       ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
       ECR_REPOSITORY: your-repo
       IMAGE_TAG: ${{ github.sha }}
     run: |
       docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG .
       docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
   ```

3. **ライフサイクルポリシーを設定**
   - 未使用のイメージを自動削除
   - 例: タグのないイメージは7日後に削除、`latest`以外のタグは30日間保持

4. **セキュリティ**
   - 定期的にイメージをスキャン
   - 最小限のベースイメージを使用

## トラブルシューティング

### 認証エラーが発生する場合
```bash
# 再度ログインを試す
aws ecr get-login-password --region region | docker login --username AWS --password-stdin 123456789012.dkr.ecr.region.amazonaws.com

# IAMユーザーに適切な権限があるか確認
# 必要なポリシー: AmazonEC2ContainerRegistryFullAccess または必要な最小限の権限
```

### イメージが見つからない場合
```bash
# リポジトリの一覧を確認
aws ecr describe-repositories

# タグの一覧を確認
aws ecr describe-images --repository-name your-repo
```

### ディスク容量の問題
```bash
# 使用していないイメージを削除
docker system prune -a

# ECRのライフサイクルポリシーを確認・設定
```

## 参考資料

- [AWS ECR ドキュメント](https://docs.aws.amazon.com/ja_jr/AmazonECR/latest/userguide/what-is-ecr.html)
- [Docker ベストプラクティス](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/)
- [セマンティック バージョニング](https://semver.org/lang/ja/)
