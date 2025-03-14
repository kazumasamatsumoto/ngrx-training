import { createReducer, on } from '@ngrx/store';
import { EntityState, EntityAdapter, createEntityAdapter } from '@ngrx/entity';
import { Todo } from '../../models/todo.model';
import * as TodoActions from '../actions/todo.actions';

// EntityStateを使用してTodoの配列を管理
export interface TodoState extends EntityState<Todo> {
  loading: boolean;
  error: any;
}

// EntityAdapterを作成
export const adapter: EntityAdapter<Todo> = createEntityAdapter<Todo>();

// 初期状態を設定
export const initialState: TodoState = adapter.getInitialState({
  loading: false,
  error: null
});

// リデューサーを作成
export const todoReducer = createReducer(
  initialState,
  
  // Todoの読み込み
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
  
  // Todoの追加
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
  
  // Todoの切り替え（完了/未完了）
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
  
  // Todoの削除
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

// セレクター関数をエクスポート
export const {
  selectIds,
  selectEntities,
  selectAll,
  selectTotal,
} = adapter.getSelectors();
