import { createFeatureSelector, createSelector } from '@ngrx/store';
import * as fromTodo from '../reducers/todo.reducer';
import { AppState } from '../reducers';

// Todoの状態を選択するセレクター
export const selectTodoState = createFeatureSelector<AppState, fromTodo.TodoState>('todos');

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
