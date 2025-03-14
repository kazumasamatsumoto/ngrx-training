以下に、それぞれの `@ngrx` パッケージの基本的な機能を解説します。

---

## 1. **@ngrx/store**

`@ngrx/store` は、Redux に基づいた状態管理ライブラリです。  
アプリケーションの状態を `store` に一元化し、アクションを用いて状態の変更を行います。  
変更は **純粋関数 (reducer)** によって行われ、 **不変性 (immutability)** を保証します。

- **アクション (Action)**: 状態の変更を表すオブジェクト
- **リデューサー (Reducer)**: アクションに応じて新しい状態を生成する関数
- **セレクター (Selector)**: 状態を取得し、必要なデータを取り出す関数

---

## 2. **@ngrx/effects**

`@ngrx/effects` は、非同期処理 (API 呼び出しなど) を `store` の外部で管理するためのライブラリです。  
副作用 (Effect) を用いて、アクションに応じた非同期処理を実行し、新しいアクションを dispatch します。

- **RxJS の `switchMap`, `mergeMap`, `catchError` などを活用**
- **API リクエスト後に `store` を更新**
- **副作用をコンポーネントから分離して管理**

---

## 3. **@ngrx/router-store**

`@ngrx/router-store` は、Angular の `RouterModule` と `@ngrx/store` を統合するライブラリです。  
ルーターの状態 (`ActivatedRouteSnapshot` など) を `store` に保存し、アプリの状態管理と連携できます。

- **ルート変更を `store` に反映**
- **セレクターで現在のルート情報を取得**
- **アクションを dispatch してプログラム的にルーティング可能**

---

## 4. **@ngrx/entity**

`@ngrx/entity` は、**エンティティ管理 (データのコレクション)** を効率的に扱うためのライブラリです。  
配列ベースではなく **辞書構造 (entity map)** でデータを管理するため、検索や更新が高速になります。

- **`EntityAdapter` を利用してエンティティを管理**
- **CRUD 操作を簡単に実装**
- **ソート・フィルタリングを効率化**

---

## 5. **@ngrx/signals**

`@ngrx/signals` は、Angular の **Signals** と統合された `NgRx` の状態管理ライブラリです。  
従来の `store` に代わる **リアクティブな状態管理** を提供します。

- **RxJS なしで `store` のような管理が可能**
- **変更の検知が高速で最適化される**
- **Angular Signals のパワーを活用**

---

## 6. **@ngrx/component-store**

`@ngrx/component-store` は、**コンポーネントごとの状態管理** を提供するライブラリです。  
`@ngrx/store` とは異なり、アプリ全体ではなく **ローカルな状態** を管理するのに適しています。

- **コンポーネント単位の状態管理**
- **`setState`, `patchState`, `select` で状態を更新**
- **RxJS に対応している**

---

## 7. **@ngrx/operators**

`@ngrx/operators` は、`@ngrx/effects` などで使用する **カスタム RxJS 演算子** を提供します。

- **アクションのフィルタリング (`ofType`)**
- **ストアの状態をマージする演算子**
- **よりシンプルにエフェクトを記述可能**

---

## 8. **@ngrx/data**

`@ngrx/data` は、**エンティティデータの取得・管理を簡素化** するためのライブラリです。  
REST API との連携を自動化し、データの取得・保存を効率化できます。

- **エンティティごとの `EntityCollectionService` を提供**
- **デフォルトで CRUD 操作を実装**
- **カスタム API コールやキャッシュ管理も可能**

---

## 9. **@ngrx/component**

`@ngrx/component` は、`NgRx` のコンポーネント向けのユーティリティライブラリです。  
**`PushPipe` や `LetDirective`** を提供し、パフォーマンスを向上させます。

- **`PushPipe`: `async` パイプの代替でパフォーマンス向上**
- **`LetDirective`: 状態の変更をより効率的に反映**
- **RxJS とシームレスに統合**

---

## 10. **@ngrx/store-devtools**

`@ngrx/store-devtools` は、開発時に `@ngrx/store` の状態を可視化し、デバッグを容易にするツールです。  
Chrome の Redux DevTools と統合できます。

- **アクションの履歴を確認**
- **状態のタイムトラベル (過去の状態に戻せる)**
- **Redux DevTools との統合**

---

## 11. **@ngrx/schematics**

`@ngrx/schematics` は、**`ng generate` コマンドを使って NgRx のコードを自動生成** するツールです。  
開発の効率化を目的としています。

- **アクション・リデューサー・エフェクトのテンプレートを自動生成**
- **コマンド例:**
  ```sh
  ng generate @ngrx/schematics:store State --module app.module.ts
  ```
- **標準的な構成を簡単に作成**

---

## 12. **@ngrx/eslint-plugin**

`@ngrx/eslint-plugin` は、`@ngrx` を適切に利用するための ESLint ルールを提供します。  
コードの品質を維持し、バグの発生を防ぎます。

- **不要な `store` の subscribe を防止**
- **`@ngrx/store` のベストプラクティスを適用**
- **ルールセットを簡単に適用可能**

---

これらのパッケージを組み合わせることで、**スケーラブルで保守しやすい Angular アプリケーション** を構築できます。
