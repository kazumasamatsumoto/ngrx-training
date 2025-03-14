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
