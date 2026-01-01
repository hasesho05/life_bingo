# 人生ビンゴクリエイター 開発ガイドライン

このドキュメントは「人生ビンゴクリエイター」プロジェクトの開発ルールをまとめたものです。 Curioプロジェクトの設計思想（堅牢性・責務分離）を踏襲しつつ、**「スマホ特化」「ネオ・ブルータリズムデザイン」「クライアントサイド完結」**の特性に合わせて最適化しています。

## 目次

1. プロジェクト概要
2. 基本コーディング規約
3. TypeScript 開発ルール
4. React コンポーネント開発ルール
5. 状態管理ルール (Zustand)
6. TailwindCSS v4 スタイリングルール
7. アニメーション & D&D 開発ルール
8. 画像生成・ファイル処理ルール
9. エラーハンドリングルール
10. テスト開発ルール
11. モバイルWeb UX開発ルール

## 1. プロジェクト概要

### 人生ビンゴクリエイター

スマートフォンのブラウザ上で、今年の目標をビンゴ形式で作成・編集し、画像としてシェアできるWebアプリケーション。 "Bold & Playful" をテーマに、触り心地の良いUIとポップなデザインを提供する。

### 技術スタック

- 言語: TypeScript (Strict Mode)
- ビルド: Vite
- フレームワーク: React 19
- スタイリング: TailwindCSS v4
- 状態管理: Zustand (w/ persist middleware)
- D&D: @dnd-kit (Core, Sortable, Utilities)
- アニメーション: motion (Framer Motion)
- UIパーツ: Vaul (Drawer), Lucide React (Icons)
- 画像生成: html-to-image
- テスト: Vitest + Testing Library

### ディレクトリ構造

```
src/
├── assets/          # 静的アセット
├── components/      # UIコンポーネント
│   ├── ui/          # 汎用パーツ (Button, Slider, Drawer)
│   ├── bingo/       # ビンゴドメイン (Card, Grid, Editor)
│   └── layout/      # 全体レイアウト
├── hooks/           # カスタムHooks
├── lib/             # ユーティリティ、定数、テーマ定義
├── store/           # Zustand ストア
└── types/           # 型定義
```

## 2. 基本コーディング規約

### 関数定義

- **Arrow Functions Only**: すべてアロー関数を使用する。
- **No Explicit Return Types**: 返り値の型は推論に任せる（複雑な場合を除く）。

```typescript
// ✅ Good
const calculateFontSize = (textLength: number) => {
  if (textLength > 20) return 'text-xs';
  return 'text-base';
};
```

### Props の扱い

- **分割代入禁止**: props オブジェクトとして受け取り、props.xxx でアクセスする。
- 外部からの注入値と、内部の状態を明確に区別するため。

```typescript
// ✅ Good
export const BingoCard = (props: BingoCardProps) => {
  return <div className={props.className}>{props.children}</div>;
};

// ❌ Bad
export const BingoCard = ({ className, children }: BingoCardProps) => { ... };
```

## 3. TypeScript 開発ルール

対象パス: `src/**/*.ts`, `src/**/*.tsx`

### Strict Mode & 型定義

- `noImplicitAny: true`, `strictNullChecks: true` を遵守。
- **Interface Over Type**: オブジェクトの型定義には必ず `interface` を使用する。
- **Type**: Union型やプリミティブのエイリアスにのみ使用する。

```typescript
// ✅ Good
interface BingoCell {
  id: string;
  text: string;
}
type EditMode = 'write' | 'move';
```

### 型ガードとアサーション

- `as` キャストは極力避ける。
- **Non-null assertion (`!`) は禁止**。 Optional Chaining (`?.`) と Nullish Coalescing (`??`) を使用する。

```typescript
// ✅ Good
const text = props.cell?.text ?? '目標を入力';
```

## 4. React コンポーネント開発ルール

対象パス: `src/components/**/*.tsx`

### コンポーネント定義構造

以下の順序で記述する。

1. Imports
2. Props Interface (exportしない)
3. Component Definition
4. Hooks (State -> Custom -> Effect)
5. Handlers
6. Render

```typescript
import { useState } from 'react';
import { motion } from 'motion/react';
import type { BingoCell } from '@/types/bingo';

interface CellProps {
  cell: BingoCell;
  mode: 'write' | 'move';
  onTap?: (id: string) => void;
}

export const Cell = (props: CellProps) => {
  // Hooks
  const [isPressed, setIsPressed] = useState(false);

  // Handlers
  const handlePointerDown = () => {
    if (props.mode === 'write') setIsPressed(true);
  };

  // Render
  return (
    <motion.div onClick={() => props.onTap?.(props.cell.id)}>
      {props.cell.text}
    </motion.div>
  );
};
```

### コンポーネントの責務 (Smart vs Dumb)

- **Smart Components (Pages/Layouts)**: Storeへのアクセス、データの管理を行う。
- **Dumb Components (UI/BingoParts)**: Propsでデータを受け取り、表示とイベント発火のみ行う。ZustandのStoreを直接参照しないことを推奨。

## 5. 状態管理ルール (Zustand)

対象パス: `src/store/**/*.ts`

### ストア設計

- ビジネスロジック（マスの入れ替え、テキスト更新など）はコンポーネントではなくStoreのアクション内に記述する。
- 永続化: `persist` middlewareを使用し、LocalStorageに保存する。

```typescript
// ✅ Good: ロジックをStoreにカプセル化
updateCellText: (id, text) => set((state) => ({
  cells: state.cells.map(c => c.id === id ? { ...c, text } : c)
})),
```

### セレクタの使用

再レンダリングを最適化するため、必要なStateのみをselectする。

```typescript
// ✅ Good
const mode = useBingoStore((state) => state.mode);
// ❌ Bad
const { mode } = useBingoStore();
```

## 6. TailwindCSS v4 スタイリングルール

対象パス: `src/**/*.css`, `src/**/*.tsx`

### デザインシステム (@theme) - Neo-Brutalism

「Nani Now」風のデザインを再現するため、以下のルールを徹底する。 `src/styles/globals.css` に定義されたカスタムトークンを使用する。

#### Borders Over Shadows:

- 要素の境界は「線」で表現する。原則 `border-2` (黒) 以上を使用。

#### Hard Shadows Only:

- ふわっとした影（Blur）は禁止。パキッとした「ハードシャドウ」を使用する。
- `shadow-hard` (例: `4px 4px 0px 0px #000000`)

#### Color Palette:

- Background: `bg-off-white` (#F4F4F5)
- Accent: `bg-acid-lime` (#D9F99D), `bg-electric-blue` (#3B82F6)

```css
@theme {
  --color-acid-lime: #D9F99D;
  --color-electric-blue: #3B82F6;
  --border-width-3: 3px;
}
```

### ユーティリティ

クラスの結合には `clsx` または `tailwind-merge` (cn関数) を使用する。

```typescript
<div className={cn("border-2 bg-white shadow-hard", props.isActive && "bg-acid-lime")}>
```

## 7. アニメーション & D&D 開発ルール

### Framer Motion (motion)

- **Layout Animation**: リストの並び替えには `layout` prop を使用する。
- **Feedback**: タップ時には `whileTap={{ scale: 0.95 }}` など、物理的なフィードバックを必ず入れる。

### 触感フィードバック (Haptics)

「物理的なカードを動かしている」感覚を強化するため、バイブレーションを使用する。 `navigator.vibrate` をラップしたユーティリティを使用すること。

- モード切替時: 短く振動
- ドラッグ開始/終了時: 明確に振動

### dnd-kit

- **ActivationConstraint**: ドラッグ開始の遅延（数ピクセルまたは長押し）を設定し、スクロール操作と競合しないようにする。
- **Overlay**: ドラッグ中のアイテムは、影を濃くし、少し拡大させる。

## 8. 画像生成・ファイル処理ルール

対象パス: `src/hooks/useBingoExport.ts`, `src/lib/image.ts`

### html-to-image 実装ルール

- **高解像度対応**: `pixelRatio` を 2 以上（推奨 3）に設定し、スマホでも綺麗に見える解像度で出力する。
- **フォントロード待機**: 画像生成前に `document.fonts.ready` 等でフォント読み込み完了を確認する。
- **CORS対策 (重要)**:
  - ユーザーアップロード画像や外部画像を表示する `img` タグには必ず `crossOrigin="anonymous"` を付与する。
  - Canvasが汚染（Tainted）されると保存に失敗するため、厳格に管理する。

```typescript
// 画像生成の基本パターン
const exportImage = async (ref: HTMLElement) => {
  try {
    setIsExporting(true);
    // フォント等のロード待ち
    await document.fonts.ready;
    const dataUrl = await toPng(ref, { pixelRatio: 3, cacheBust: true });
    // 保存処理...
  } catch (error) {
    console.error('Export failed', error);
    toast.error('画像の保存に失敗しました');
  } finally {
    setIsExporting(false);
  }
};
```

## 9. エラーハンドリングルール

### 3層構造の適応

- **Global (Route Level)**: `react-error-boundary` でアプリ全体をラップ。予期せぬクラッシュ時に「再読み込み」ボタンを表示。
- **Feature Level (Export/Input)**: 画像生成失敗などはトースト通知（Sonner等）でフィードバック。
- **Validation**: 文字数制限などはUI上でリアルタイムにフィードバック（赤字にする等）。

## 10. テスト開発ルール

対象パス: `src/**/*.test.ts`, `src/**/*.test.tsx`

### Vitest + Testing Library

- **AAAパターン** (Arrange, Act, Assert) を守る。
- **User-Centric**: 内部実装（Stateの値）ではなく、ユーザーに見える結果（テキスト描画、クラス付与）をテストする。

### テスト優先度

1. **Utility**: 文字サイズ計算ロジック等 (`src/lib`)
2. **Store Logic**: マスの入れ替え、完了判定ロジック
3. **Complex UI**: ビンゴボードのインタラクション

## 11. モバイルWeb UX開発ルール

### スクロールとジェスチャー制御

- **Overscroll Behavior**: プルダウン更新（Pull-to-refresh）がアプリのドラッグ操作と競合しないよう、body に `overscroll-behavior-y: none;` を適用する。
- **Touch Action**: ドラッグ可能な要素（スライダー等）には `touch-action: none;` を指定する。

### 仮想キーボード対策 (Virtual Keyboard)

- **Viewport Units**: 高さ指定には `100vh` ではなく `h-dvh` (Dynamic) または `h-svh` (Small) を使用する。
- **入力フォーム**: マス編集時の入力フォーム（Drawer等）は、キーボード表示時に隠れないよう、`vaul` 等の適切にハンドリングできるライブラリを使用する。
