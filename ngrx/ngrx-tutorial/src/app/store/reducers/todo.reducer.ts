import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Todo } from '../../models/todo.model';
import * as TodoActions from '../actions/todo.actions';

/**
 * Todo Reducer - NgRx Reducerの実装
 * 
 * リデューサーは、現在の状態とアクションを受け取り、新しい状態を返す純粋な関数です。
 * このファイルでは、NgRx Entityを使用してTodoの配列を効率的に管理しています。
 * 
 * NgRxチュートリアルにおける役割:
 * - 状態の不変性を保持した更新方法
 * - NgRx Entityを使用したコレクション管理
 * - アクションに応じた状態の変更ロジック
 */

// EntityStateを使用してTodoの配列を管理
export interface TodoState extends EntityState<Todo> {
  loading: boolean;
  error: any;
}

/**
 * EntityAdapterを作成
 * 
 * EntityAdapterは、エンティティコレクションを管理するためのユーティリティを提供します。
 * IDをキーとして使用し、エンティティをオブジェクトとして保存することで、
 * 配列よりも効率的なCRUD操作を実現します。
 * 
 * NgRxチュートリアルでの意義:
 * - 大量のエンティティを効率的に管理する方法
 * - パフォーマンスを考慮したステート設計
 */
export const adapter: EntityAdapter<Todo> = createEntityAdapter<Todo>();

/**
 * 初期状態を設定
 * 
 * EntityStateは、エンティティコレクションに加えて、
 * アプリケーション固有の追加プロパティ（loading, error）を含みます。
 * 
 * NgRxチュートリアルでの意義:
 * - エンティティと関連メタデータの組み合わせ
 * - 読み込み状態とエラー状態の管理
 */
export const initialState: TodoState = adapter.getInitialState({
  loading: false,
  error: null
});

/**
 * リデューサーを作成
 * 
 * createReducer関数を使用して、各アクションに対する状態更新ロジックを定義します。
 * 各アクションタイプに対して、onメソッドを使用してハンドラーを登録します。
 * 
 * NgRxチュートリアルでの意義:
 * - 宣言的な状態更新パターン
 * - 不変性を保持した状態更新
 * - アクションタイプごとの明確な処理分離
 */
export const todoReducer = createReducer(
  initialState,
  
  /**
   * Todoの読み込み関連ハンドラー
   * 
   * NgRxチュートリアルでの意義:
   * - 読み込み開始時の状態更新（loading: true）
   * - 成功時のエンティティコレクション全体の置き換え（adapter.setAll）
   * - 失敗時のエラー状態の保存
   */
  on(TodoActions.loadTodos, state => ({
    ...state,
    loading: true,
    error: null
  })),
  on(TodoActions.loadTodosSuccess, (state, { todos }) => 
    adapter.setAll(todos, { ...state, loading: false })
  ),
  on(TodoActions.loadTodosFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  /**
   * Todoの追加関連ハンドラー
   * 
   * NgRxチュートリアルでの意義:
   * - 追加開始時の状態更新
   * - 成功時の単一エンティティの追加（adapter.addOne）
   * - 失敗時のエラー処理
   */
  on(TodoActions.addTodo, state => ({
    ...state,
    loading: true
  })),
  on(TodoActions.addTodoSuccess, (state, { todo }) => 
    adapter.addOne(todo, { ...state, loading: false })
  ),
  on(TodoActions.addTodoFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  /**
   * Todoの切り替え関連ハンドラー
   * 
   * NgRxチュートリアルでの意義:
   * - 更新開始時の状態更新
   * - 成功時の単一エンティティの更新（adapter.updateOne）
   * - 更新時のIDと変更内容の分離
   */
  on(TodoActions.toggleTodo, state => ({
    ...state,
    loading: true
  })),
  on(TodoActions.toggleTodoSuccess, (state, { todo }) => 
    adapter.updateOne(
      { id: todo.id, changes: todo },
      { ...state, loading: false }
    )
  ),
  on(TodoActions.toggleTodoFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  
  /**
   * Todoの削除関連ハンドラー
   * 
   * NgRxチュートリアルでの意義:
   * - 削除開始時の状態更新
   * - 成功時の単一エンティティの削除（adapter.removeOne）
   * - IDのみを使用した削除操作
   */
  on(TodoActions.deleteTodo, state => ({
    ...state,
    loading: true
  })),
  on(TodoActions.deleteTodoSuccess, (state, { id }) => 
    adapter.removeOne(id, { ...state, loading: false })
  ),
  on(TodoActions.deleteTodoFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  }))
);

/**
 * セレクター関数をエクスポート
 * 
 * EntityAdapterは、エンティティコレクションから情報を取得するための
 * 基本的なセレクター関数を提供します。
 * 
 * NgRxチュートリアルでの意義:
 * - エンティティコレクションからのデータ取得の標準化
 * - 再利用可能なセレクターの提供
 * - 複雑なセレクターの構築ブロック
 */
export const {
  selectIds,      // エンティティのIDの配列を選択
  selectEntities, // エンティティのIDをキーとするオブジェクトを選択
  selectAll,      // エンティティの配列を選択
  selectTotal,    // エンティティの総数を選択
} = adapter.getSelectors();
