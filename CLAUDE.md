# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

WebNEIは、Minecraft ModのNot Enough Items (NEI)をWeb上で閲覧するためのフロントエンドアプリケーション。主にGregTech: New Horizons (GTNH)のレシピデータを表示する。

## 開発コマンド

```bash
bun install      # 依存関係インストール
bun run dev      # 開発サーバー起動 (http://localhost:3000)
bun run build    # 本番用ビルド
bun run start    # 本番サーバー起動
```

**前提条件**: バックエンド (https://github.com/OrderedSet86/webnei-backend) が `http://localhost:5000/graphql` で起動している必要がある。

## 技術スタック

- **フレームワーク**: SolidJS + SolidStart (SSR無効)
- **UIライブラリ**: Hope UI (@hope-ui/solid)
- **GraphQL**: @solid-primitives/graphql
- **ビルド**: Vite + esbuild

## アーキテクチャ

### 状態管理
- [src/state/appState.tsx](src/state/appState.tsx) - SolidJSのcreateStoreによるグローバル状態
  - 検索クエリ、選択中のアイテム、make/use切り替え状態など

### 主要コンポーネント構成

```
routes/index.tsx
├── NEIBrowser (左パネル: レシピ表示)
│   └── MachineTabs (マシン別タブ)
│       └── FallbackRecipeRenderer (レシピカード)
└── Sidebar (右パネル: アイテム検索)
    ├── Items (アイテムグリッド)
    │   └── ClickableItem
    └── SearchBar
```

### データフロー
1. `Items.tsx` - GraphQLでアイテム一覧を取得、グリッド表示
2. `ClickableItem` - クリックで `appState.currentBasicSidebarItem` を更新
3. `NEIBrowser.tsx` - appStateの変更を検知し、make/use用のGraphQLクエリを発行
4. `MachineTabs.tsx` - レシピをアイコンIDでグループ化してタブ表示

### 型定義
[src/components/Interfaces.tsx](src/components/Interfaces.tsx) に全データ型を定義:
- `ItemInterface` / `FluidInterface` - アイテム・液体データ
- `BaseRecipeInterface` / `GTRecipeInterface` - レシピデータ
- `AssociatedRecipesInterface` - GraphQLレスポンス用

## パスエイリアス

`~/` は `./src/` にマップされている (tsconfig.json)

```typescript
import { appState } from '~/state/appState'
```
