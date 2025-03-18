/**
 * このファイルは NgRx を使用した状態管理におけるアクションの定義ファイルです。アクションは Redux パターンにおいて、アプリケーション内で発生するイベントを表現するものです。

このファイルでは Todo アプリケーションに関連する以下の操作のアクションが定義されています：

1. **Todo の読み込み関連**:
   - `loadTodos`: Todo リストの読み込みを開始
   - `loadTodosSuccess`: 読み込み成功時（Todo の配列を受け取る）
   - `loadTodosFailure`: 読み込み失敗時（エラー情報を受け取る）

2. **Todo の追加関連**:
   - `addTodo`: 新しい Todo の追加を開始（タイトルを受け取る）
   - `addTodoSuccess`: 追加成功時（作成された Todo を受け取る）
   - `addTodoFailure`: 追加失敗時（エラー情報を受け取る）

3. **Todo の切り替え関連**:
   - `toggleTodo`: Todo の完了状態切り替えを開始（ID を指定）
   - `toggleTodoSuccess`: 切り替え成功時（更新された Todo を受け取る）
   - `toggleTodoFailure`: 切り替え失敗時（エラー情報を受け取る）

4. **Todo の削除関連**:
   - `deleteTodo`: Todo の削除を開始（ID を指定）
   - `deleteTodoSuccess`: 削除成功時（削除された Todo の ID を受け取る）
   - `deleteTodoFailure`: 削除失敗時（エラー情報を受け取る）

各アクションは非同期操作を考慮して、開始・成功・失敗の3つの状態を持つパターンで実装されています。これにより、アプリケーションの状態変更が予測可能で追跡可能になります。

 */

import { createAction, props } from '@ngrx/store';
import { Todo } from '../../models/todo.model';

/**
 * Todo Actions - NgRx Actionsの実装
 * 
 * アクションは、アプリケーション内で発生するイベントを表します。
 * これらのアクションは、コンポーネントからディスパッチされ、
 * リデューサーとエフェクトによって処理されます。
 * 
 * NgRxチュートリアルにおける役割:
 * - イベント駆動型アーキテクチャの基盤
 * - 明示的な状態変更の契約
 * - デバッグ可能な履歴の作成
 */

// アクションタイプの定義
/**
 * Todoの読み込み関連アクション
 * 
 * これらのアクションは、Todoリストの初期読み込みに関連しています。
 * 
 * NgRxチュートリアルでの意義:
 * - 非同期処理の3つの状態（開始、成功、失敗）を表現
 * - アプリケーション起動時のデータフェッチパターン
 */
export const loadTodos = createAction('[Todo] Load Todos');
export const loadTodosSuccess = createAction(
  '[Todo] Load Todos Success',
  props<{ todos: Todo[] }>()
);
export const loadTodosFailure = createAction(
  '[Todo] Load Todos Failure',
  props<{ error: any }>()
);

/**
 * Todoの追加関連アクション
 * 
 * これらのアクションは、新しいTodoの追加に関連しています。
 * 
 * NgRxチュートリアルでの意義:
 * - ユーザー入力からアクションへの変換
 * - 入力データ（title）の受け渡し
 * - 作成されたエンティティ（todo）の受け取り
 */
export const addTodo = createAction(
  '[Todo] Add Todo',
  props<{ title: string }>()
);
export const addTodoSuccess = createAction(
  '[Todo] Add Todo Success',
  props<{ todo: Todo }>()
);
export const addTodoFailure = createAction(
  '[Todo] Add Todo Failure',
  props<{ error: any }>()
);

/**
 * Todoの切り替え関連アクション
 * 
 * これらのアクションは、Todoの完了状態の切り替えに関連しています。
 * 
 * NgRxチュートリアルでの意義:
 * - 特定のエンティティの更新パターン
 * - IDによるエンティティの特定
 * - 更新されたエンティティ全体の受け取り
 */
export const toggleTodo = createAction(
  '[Todo] Toggle Todo',
  props<{ id: number }>()
);
export const toggleTodoSuccess = createAction(
  '[Todo] Toggle Todo Success',
  props<{ todo: Todo }>()
);
export const toggleTodoFailure = createAction(
  '[Todo] Toggle Todo Failure',
  props<{ error: any }>()
);

/**
 * Todoの削除関連アクション
 * 
 * これらのアクションは、Todoの削除に関連しています。
 * 
 * NgRxチュートリアルでの意義:
 * - エンティティの削除パターン
 * - 削除成功時にはエンティティ全体ではなくIDのみを返す
 * - 削除操作のエラーハンドリング
 */
export const deleteTodo = createAction(
  '[Todo] Delete Todo',
  props<{ id: number }>()
);
export const deleteTodoSuccess = createAction(
  '[Todo] Delete Todo Success',
  props<{ id: number }>()
);
export const deleteTodoFailure = createAction(
  '[Todo] Delete Todo Failure',
  props<{ error: any }>()
);
