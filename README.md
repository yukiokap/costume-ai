# CostumeAI - AI Costume Prompt Architect

CostumeAIは、AI画像生成（Stable Diffusion, Midjourney, NovelAIなど）のための高品質な衣装プロンプトを直感的に作成できるWebアプリケーションです。

## 🌟 特徴

- **Cyberspace UI**: 未来的なサイバーパンク・デザインの直感的な操作画面。
- **Environment Vault**: 多彩な背景設定（ファンタジーからプライベートまで）を網羅。
- **Motion Vault**: 80種類以上のポーズ・体位設定をワンクリックで選択。
- **Sexy Evolution**: 清楚(Level 1)から究極にエロティック(Level 10)まで、10段階の変化を一度に生成。
- **Gemini 3 Integration**: Googleの最新AI「Gemini 3 Flash」による精密な衣装描写。
- **Persistent Archive**: 生成したプロンプトを最大100件まで自動保存・検索可能。

## 🚀 使い方

1. Google AI StudioでGemini APIキーを取得します。
2. アプリの右上の「Settings」からAPIキーを入力します。
3. カテゴリー、ベース衣装、アクセサリー、背景、ポーズを選択します。
4. 「プロンプトを生成する」または「1~10 段階進化」をクリックしてAIに出力させます。

## 🛠️ 開発者向けセットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# プロダクションビルド
npm run build
```

---

## 🌎 世界への公開方法（初心者向けガイド）

このプロジェクトを自分のGitHubにアップロードして、世界中に公開する手順です。

### ステップ 1: GitHubアカウントの作成
まずは [GitHub](https://github.com/join) で無料アカウントを作成してください。

### ステップ 2: 新しいリポジトリの作成
1. GitHubのトップページで「New」ボタンを押し、リポジトリ名（例：`costume-ai`）を付けます。
2. 「Public（公開）」を選択して、「Create repository」を押します。

### ステップ 3: パソコンからGitHubへ送信
パソコンのターミナル（またはPowerShell）で、このプロジェクトのフォルダに移動して、以下のコマンドを順番に打ちます。

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/あなたのユーザー名/costume-ai.git
git push -u origin main
```

### ステップ 4: Webサイトとして公開する（Vercelを使うのが一番簡単です！）
1. [Vercel](https://vercel.com/) にGitHubアカウントでログインします。
2. 「Add New」→「Project」を選び、先ほど作った `costume-ai` リポジトリをインポートします。
3. 「Deploy」ボタンを押すだけで、数分後に世界中からアクセスできるURLが発行されます！

---

## 📄 ライセンス
このプロジェクトは MIT License で公開されています。
