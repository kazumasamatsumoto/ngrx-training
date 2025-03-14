import { isDevMode } from '@angular/core';
import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import * as fromTodo from './todo.reducer';

// アプリケーション全体の状態を定義
export interface AppState {
  todos: fromTodo.TodoState;
}

// ルートリデューサーを定義
export const reducers: ActionReducerMap<AppState> = {
  todos: fromTodo.todoReducer,
};

// メタリデューサーを定義（開発モードでのデバッグなど）
export const metaReducers: MetaReducer<AppState>[] = isDevMode() ? [] : [];
