import { Injectable, inject } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, mergeMap, switchMap } from 'rxjs/operators';
import { TodoService } from '../../services/todo.service';
import * as TodoActions from '../actions/todo.actions';

@Injectable()
export class TodoEffects {
  private actions$ = inject(Actions);
  private todoService = inject(TodoService);

  loadTodos$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TodoActions.loadTodos),
      switchMap(() => this.todoService.getTodos().pipe(
        map(todos => TodoActions.loadTodosSuccess({ todos })),
        catchError(error => of(TodoActions.loadTodosFailure({ error })))
      ))
    );
  });

  addTodo$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TodoActions.addTodo),
      mergeMap(action => this.todoService.addTodo(action.title).pipe(
        map(todo => TodoActions.addTodoSuccess({ todo })),
        catchError(error => of(TodoActions.addTodoFailure({ error })))
      ))
    );
  });

  toggleTodo$ = createEffect(() => {
    return this.actions$.pipe(
      ofType(TodoActions.toggleTodo),
      mergeMap(action => this.todoService.toggleTodo(action.id).pipe(
        map(todo => TodoActions.toggleTodoSuccess({ todo })),
        catchError(error => of(TodoActions.toggleTodoFailure({ error })))
      ))
    );
  });

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
