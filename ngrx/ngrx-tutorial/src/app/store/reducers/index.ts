import { isDevMode } from '@angular/core';
import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import * as fromTodo from './todo.reducer';

/**
 * Root Reducer - NgRxのルートリデューサー
 * 
 * このファイルは、アプリケーション全体の状態構造を定義し、
 * 各機能領域のリデューサーを組み合わせます。
 * 
 * NgRxチュートリアルにおける役割:
 * - アプリケーション全体の状態構造の定義
 * - 複数の機能リデューサーの統合
 * - メタリデューサーの設定（開発モードでのデバッグなど）
 */

// アプリケーション全体の状態を定義
export interface AppState {
  todos: fromTodo.TodoState;
}

/**
 * ルートリデューサーを定義
 * 
 * ActionReducerMapは、状態のキーとそれに対応するリデューサーのマッピングです。
 * 各機能領域のリデューサーをここで組み合わせます。
 * 
 * NgRxチュートリアルでの意義:
 * - 機能モジュールごとのリデューサーの分離
 * - スケーラブルな状態管理アーキテクチャ
 */
export const reducers: ActionReducerMap<AppState> = {
  todos: fromTodo.todoReducer,
};

/**
 * メタリデューサーを定義
 * 
 * メタリデューサーは、通常のリデューサーをラップして追加の機能を提供します。
 * 例えば、ロギング、状態の永続化、開発ツールとの統合などに使用されます。
 * 
 * NgRxチュートリアルでの意義:
 * - 開発モードと本番モードの区別
 * - リデューサーの拡張メカニズム
 * - クロスカッティングな関心事の分離
 */
export const metaReducers: MetaReducer<AppState>[] = isDevMode() ? [] : [];
