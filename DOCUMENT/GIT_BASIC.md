# Git 基本操作ガイド

## 目次
1. [HEADとは](#headとは)
2. [チェックアウト（checkout）](#チェックアウトcheckout)
3. [新しいコマンド: switch と restore](#新しいコマンドswitch-と-restore)
4. [コマンド対応表](#コマンド対応表)

## HEADとは

`HEAD` は、現在作業しているコミットを指すポインタです。本で例えると「しおり」のようなものです。

```bash
# 現在のHEADが指すコミットハッシュを表示（完全版）
git rev-parse HEAD

# 短縮ハッシュで表示（先頭7文字）
git rev-parse --short HEAD
```

## チェックアウト（checkout）

`git checkout` は、作業ディレクトリを特定の状態に切り替えるコマンドです。

### 基本的な使い方

```bash
# ブランチの切り替え
git checkout ブランチ名

# 新しいブランチを作成して切り替え
git checkout -b 新しいブランチ名

# 特定のコミットに移動
git checkout コミットハッシュ

# ファイルの変更を破棄
git checkout -- ファイル名
```

## 新しいコマンド: switch と restore

Git 2.23以降では、`checkout` の機能が2つに分離されました。

### git switch
ブランチの操作に特化したコマンドです。

```bash
# ブランチの切り替え
git switch ブランチ名

# 新しいブランチを作成して切り替え
git switch -c 新しいブランチ名  # -c は --create の省略形

# 特定のコミットに移動（detached HEAD）
git switch --detach コミットハッシュ
```

### git restore
ファイルの復元に特化したコマンドです。

```bash
# 作業ディレクトリの変更を破棄
git restore ファイル名

# ステージングエリアから取り消し
git restore --staged ファイル名

# 特定のコミットの状態に戻す
git restore --source=コミットハッシュ ファイル名
```

## コマンド対応表

| 目的 | 古いコマンド | 新しいコマンド |
|------|-------------|---------------|
| ブランチの切り替え | `git checkout ブランチ名` | `git switch ブランチ名` |
| 新規ブランチ作成 | `git checkout -b 新ブランチ` | `git switch -c 新ブランジ` |
| コミットの確認 | `git checkout コミットハッシュ` | `git switch --detach コミットハッシュ` |
| 変更の破棄 | `git checkout -- ファイル名` | `git restore ファイル名` |
| ステージングの取り消し | `git reset HEAD ファイル名` | `git restore --staged ファイル名` |
| 別ブランチからファイル取得 | `git checkout ブランチ -- ファイル名` | `git restore --source=ブランチ ファイル名` |

## 推奨事項

- 新しいバージョンのGit（2.23以降）を使用している場合は、`switch` と `restore` の使用が推奨されます
- チームで作業する場合は、使用するコマンドを統一すると良いでしょう
- 古いバージョンのGitを使用する場合は、`checkout` を使用する必要があります

## 参考資料

- [Git公式ドキュメント](https://git-scm.com/doc)
- [Gitの公式チュートリアル](https://git-scm.com/docs/gittutorial)
