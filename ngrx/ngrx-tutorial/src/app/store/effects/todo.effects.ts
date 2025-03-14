import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { TodoService } from '../../services/todo.service';
import * as TodoActions from '../actions/todo.actions';

/**
 * TodoEffects - NgRx Effectsの実装
 * 
 * Effectsは、アクションに応じて副作用（APIリクエストなど）を処理するためのクラスです。
 * このクラスは、アクションをリッスンし、それに応じてサービスを呼び出し、
 * 結果に基づいて新しいアクションをディスパッチします。
 * 
 * NgRxチュートリアルにおける役割:
 * - アクションと副作用（APIリクエスト）の分離
 * - 非同期処理の宣言的な記述
 * - 成功/失敗のハンドリングパターンの実装
 */
@Injectable()
export class TodoEffects {
  private actions$ = inject(Actions);
  private todoService = inject(TodoService);

  /**
   * Todoの読み込みEffect
   * 
   * loadTodosアクションがディスパッチされたときに実行されます。
   * TodoServiceのgetTodosメソッドを呼び出し、結果に応じて
   * loadTodosSuccessまたはloadTodosFailureアクションをディスパッチします。
   * 
   * NgRxチュートリアルでの意義:
   * - switchMapを使用して、新しいリクエストが来たら前のリクエストをキャンセルする方法を示す
   *   （例：ユーザーが素早く複数回リロードボタンをクリックした場合）
   * - アプリケーション起動時のデータ取得パターンを示す
   */
  loadTodos$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TodoActions.loadTodos),
      switchMap(() => this.todoService.getTodos().pipe(
        map(todos => TodoActions.loadTodosSuccess({ todos })),
        catchError(error => of(TodoActions.loadTodosFailure({ error })))
      ))
    );
  });

  /**
   * Todoの追加Effect
   * 
   * addTodoアクションがディスパッチされたときに実行されます。
   * TodoServiceのaddTodoメソッドを呼び出し、結果に応じて
   * addTodoSuccessまたはaddTodoFailureアクションをディスパッチします。
   * 
   * NgRxチュートリアルでの意義:
   * - mergeMapを使用して、複数のリクエストを並行して処理する方法を示す
   *   （例：ユーザーが複数のTodoを素早く追加する場合）
   * - アクションからデータを取得してサービスに渡す方法を示す（action.title）
   */
  addTodo$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TodoActions.addTodo),
      mergeMap(action => this.todoService.addTodo(action.title).pipe(
        map(todo => TodoActions.addTodoSuccess({ todo })),
        catchError(error => of(TodoActions.addTodoFailure({ error })))
      ))
    );
  });

  /**
   * Todoの切り替えEffect
   * 
   * toggleTodoアクションがディスパッチされたときに実行されます。
   * TodoServiceのtoggleTodoメソッドを呼び出し、結果に応じて
   * toggleTodoSuccessまたはtoggleTodoFailureアクションをディスパッチします。
   * 
   * NgRxチュートリアルでの意義:
   * - ユーザーインタラクション（チェックボックスのクリック）からアクション、
   *   Effect、サービス呼び出し、Storeの更新までの流れを示す
   * - 特定のエンティティの更新パターンを示す
   */
  toggleTodo$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TodoActions.toggleTodo),
      mergeMap(action => this.todoService.toggleTodo(action.id).pipe(
        map(todo => TodoActions.toggleTodoSuccess({ todo })),
        catchError(error => of(TodoActions.toggleTodoFailure({ error })))
      ))
    );
  });

  /**
   * Todoの削除Effect
   * 
   * deleteTodoアクションがディスパッチされたときに実行されます。
   * TodoServiceのdeleteTodoメソッドを呼び出し、結果に応じて
   * deleteTodoSuccessまたはdeleteTodoFailureアクションをディスパッチします。
   * 
   * NgRxチュートリアルでの意義:
   * - 削除操作の結果として、エンティティ全体ではなくIDのみを返す方法を示す
   * - サービスからの応答を変換してアクションに渡す方法を示す
   *   (map(() => TodoActions.deleteTodoSuccess({ id: action.id })))
   */
  deleteTodo$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TodoActions.deleteTodo),
      mergeMap(action => this.todoService.deleteTodo(action.id).pipe(
        map(() => TodoActions.deleteTodoSuccess({ id: action.id })),
        catchError(error => of(TodoActions.deleteTodoFailure({ error })))
      ))
    );
  });
}
