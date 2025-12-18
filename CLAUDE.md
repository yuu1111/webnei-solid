# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

WebNEIは、Minecraft ModのNot Enough Items (NEI)をWeb上で閲覧するためのフロントエンドアプリケーション。主にGregTech: New Horizons (GTNH)のレシピデータを表示する。

## 開発コマンド

```bash
bun install      # 依存関係インストール
bun run dev      # 開発サーバー起動 (http://localhost:3000)
bun run build    # 本番用ビルド
bun run preview  # ビルドプレビュー
bun run lint     # Biomeでlint
bun run format   # Biomeでフォーマット
bun run check    # Biomeでlint+format
```

**前提条件**: バックエンド (https://github.com/OrderedSet86/webnei-backend) が `http://localhost:5000/graphql` で起動している必要がある。

## 技術スタック

- **ランタイム/パッケージマネージャー**: Bun
- **UIフレームワーク**: React 18
- **状態管理**: Zustand (グローバル状態) + TanStack Query (サーバー状態)
- **GraphQL**: graphql-request
- **スタイリング**: Tailwind CSS
- **ビルド**: Vite
- **Linter/Formatter**: Biome

## アーキテクチャ

### 状態管理
- [src/hooks/useAppState.ts](src/hooks/useAppState.ts) - Zustandによるグローバル状態
  - 検索クエリ、選択中のアイテム、make/use切り替え状態、ウィンドウサイズなど

### GraphQL
- [src/lib/graphql.ts](src/lib/graphql.ts) - GraphQLクライアントとクエリ定義
  - `SIDEBAR_ITEMS_QUERY` - サイドバーアイテム取得
  - `MAKE_RECIPES_QUERY` / `USE_RECIPES_QUERY` - レシピ取得

### 主要コンポーネント構成

```
src/App.tsx
├── NEIBrowser (左パネル: レシピ表示)
│   └── MachineTabs (マシン別タブ)
│       └── FallbackRecipeRenderer (レシピカード)
└── Sidebar (右パネル: アイテム検索)
    ├── Items (アイテムグリッド)
    │   └── ClickableItem
    └── SearchBar
```

### データフロー
1. `Items.tsx` - TanStack QueryでGraphQLアイテム一覧を取得、グリッド表示
2. `ClickableItem` - クリックで `useAppState().setCurrentItem()` を呼び出し
3. `NEIBrowser.tsx` - appStateの変更を検知し、make/use用のGraphQLクエリを発行
4. `MachineTabs.tsx` - レシピをアイコンIDでグループ化してタブ表示

### 型定義
[src/types/index.ts](src/types/index.ts) に全データ型を定義:
- `ItemInterface` / `FluidInterface` - アイテム・液体データ
- `BaseRecipeInterface` / `GTRecipeInterface` - レシピデータ
- `AssociatedRecipesInterface` - GraphQLレスポンス用
- `SidebarItemInterface` - サイドバー表示用

## パスエイリアス

`~/` は `./src/` にマップされている (tsconfig.json)

```typescript
import { useAppState } from '~/hooks/useAppState'
```
