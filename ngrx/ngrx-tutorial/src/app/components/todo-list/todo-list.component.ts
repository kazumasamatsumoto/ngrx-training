import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Todo } from '../../models/todo.model';
import { AppState } from '../../store/reducers';
import * as TodoActions from '../../store/actions/todo.actions';
import * as fromTodo from '../../store/selectors/todo.selectors';
import { TodoItemComponent } from '../todo-item/todo-item.component';
import { TodoFormComponent } from '../todo-form/todo-form.component';

@Component({
  selector: 'app-todo-list',
  standalone: true,
  imports: [CommonModule, TodoItemComponent, TodoFormComponent],
  template: `
    <div class="todo-container">
      <h1>NgRx Todo アプリケーション</h1>
      
      <app-todo-form></app-todo-form>
      
      <div class="status-bar">
        <p>
          <span *ngIf="loading$ | async">読み込み中...</span>
          <span *ngIf="!(loading$ | async)">
            {{ activeCount$ | async }} 個の未完了タスク / 合計 {{ totalCount$ | async }} 個
          </span>
        </p>
      </div>
      
      <div class="todo-list" *ngIf="!(loading$ | async) || (todos$ | async)?.length">
        <app-todo-item
          *ngFor="let todo of todos$ | async"
          [todo]="todo"
          (toggle)="onToggle($event)"
          (delete)="onDelete($event)"
        ></app-todo-item>
      </div>
      
      <div class="error" *ngIf="error$ | async as error">
        <p>エラーが発生しました: {{ error }}</p>
      </div>
    </div>
  `,
  styles: [`
    .todo-container {
      max-width: 600px;
      margin: 0 auto;
      padding: 20px;
      font-family: Arial, sans-serif;
    }
    
    h1 {
      color: #333;
      text-align: center;
      margin-bottom: 20px;
    }
    
    .status-bar {
      display: flex;
      justify-content: space-between;
      margin: 20px 0;
      color: #666;
    }
    
    .todo-list {
      margin-top: 20px;
    }
    
    .error {
      color: red;
      margin-top: 20px;
      padding: 10px;
      background-color: #ffeeee;
      border-radius: 4px;
    }
  `]
})
export class TodoListComponent implements OnInit {
  todos$: Observable<Todo[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  totalCount$: Observable<number>;
  activeCount$: Observable<number>;
  completedCount$: Observable<number>;

  constructor(private store: Store<AppState>) {
    this.todos$ = this.store.select(fromTodo.selectAllTodos);
    this.loading$ = this.store.select(fromTodo.selectTodosLoading);
    this.error$ = this.store.select(fromTodo.selectTodosError);
    this.totalCount$ = this.store.select(fromTodo.selectTodoCount);
    this.activeCount$ = this.store.select(fromTodo.selectActiveTodoCount);
    this.completedCount$ = this.store.select(fromTodo.selectCompletedTodoCount);
  }

  ngOnInit(): void {
    this.store.dispatch(TodoActions.loadTodos());
  }

  onToggle(id: number): void {
    this.store.dispatch(TodoActions.toggleTodo({ id }));
  }

  onDelete(id: number): void {
    this.store.dispatch(TodoActions.deleteTodo({ id }));
  }
}
