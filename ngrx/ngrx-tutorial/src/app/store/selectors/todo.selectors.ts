import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromTodo from '../reducers/todo.reducer';
import { AppState } from '../reducers';

/**
 * Todo Selectors - NgRx Selectorsの実装
 * 
 * セレクターは、ステートから必要なデータを取得するための関数です。
 * メモ化（計算結果のキャッシュ）を活用して、パフォーマンスを向上させます。
 * 
 * NgRxチュートリアルにおける役割:
 * - 状態の読み取り方法の標準化
 * - 複雑なデータ変換の抽象化
 * - コンポーネントとステート構造の分離
 */

// Todoの状態を選択するセレクター
export const selectTodoState = createFeatureSelector<fromTodo.TodoState>('todos');

/**
 * メタデータセレクター
 * 
 * これらのセレクターは、Todoエンティティではなく、
 * 関連するメタデータ（読み込み状態、エラー）を取得します。
 * 
 * NgRxチュートリアルでの意義:
 * - UI状態の管理（ローディングインジケータの表示など）
 * - エラーハンドリングのためのデータ取得
 */
// 読み込み中の状態を選択するセレクター
export const selectTodosLoading = createSelector(
  selectTodoState,
  state => state.loading
);

// エラー状態を選択するセレクター
export const selectTodosError = createSelector(
  selectTodoState,
  state => state.error
);

/**
 * 基本エンティティセレクター
 * 
 * これらのセレクターは、EntityAdapterが提供する基本セレクターを
 * アプリケーションのステート構造に合わせて拡張します。
 * 
 * NgRxチュートリアルでの意義:
 * - EntityAdapterのセレクターの再利用
 * - 基本的なエンティティ取得パターン
 */
// すべてのTodoを選択するセレクター
export const selectAllTodos = createSelector(
  selectTodoState,
  fromTodo.selectAll
);

// Todoの総数を選択するセレクター
export const selectTodoCount = createSelector(
  selectTodoState,
  fromTodo.selectTotal
);

/**
 * 派生セレクター
 * 
 * これらのセレクターは、基本セレクターを組み合わせて、
 * アプリケーション固有のデータ変換を行います。
 * 
 * NgRxチュートリアルでの意義:
 * - セレクターの合成による複雑なデータ取得
 * - ビジネスロジックのカプセル化
 * - コンポーネントからのデータ変換ロジックの分離
 */
// 完了したTodoを選択するセレクター
export const selectCompletedTodos = createSelector(
  selectAllTodos,
  todos => todos.filter(todo => todo.completed)
);

// 未完了のTodoを選択するセレクター
export const selectActiveTodos = createSelector(
  selectAllTodos,
  todos => todos.filter(todo => !todo.completed)
);

// 完了したTodoの数を選択するセレクター
export const selectCompletedTodoCount = createSelector(
  selectCompletedTodos,
  todos => todos.length
);

// 未完了のTodoの数を選択するセレクター
export const selectActiveTodoCount = createSelector(
  selectActiveTodos,
  todos => todos.length
);
