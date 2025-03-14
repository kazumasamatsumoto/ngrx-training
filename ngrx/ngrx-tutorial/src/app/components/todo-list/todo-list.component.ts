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

/**
 * TodoListComponent - メインコンポーネント
 * 
 * このコンポーネントは、Todoアプリケーションのメインビューを提供します。
 * NgRxストアからデータを取得し、子コンポーネントにデータを渡します。
 * 
 * NgRxチュートリアルにおける役割:
 * - Storeとコンポーネントの接続方法を示す
 * - セレクターを使用したデータ取得
 * - アクションのディスパッチによるイベント処理
 * - 宣言的なUIパターン（非同期パイプの使用など）
 */

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
  /**
   * Observableプロパティ
   * 
   * これらのプロパティは、NgRxストアからのデータストリームを保持します。
   * Observableを使用することで、データの変更を自動的に検出し、UIを更新できます。
   * 
   * NgRxチュートリアルでの意義:
   * - リアクティブプログラミングパターン
   * - ストアからのデータ購読
   * - 非同期データフローの管理
   */
  todos$: Observable<Todo[]>;
  loading$: Observable<boolean>;
  error$: Observable<any>;
  totalCount$: Observable<number>;
  activeCount$: Observable<number>;
  completedCount$: Observable<number>;

  /**
   * コンストラクタ
   * 
   * NgRxストアを注入し、セレクターを使用してデータを取得します。
   * 
   * NgRxチュートリアルでの意義:
   * - 依存性注入を通じたStoreへのアクセス
   * - セレクターを使用したデータ取得
   * - コンポーネント初期化時のストア接続
   */
  constructor(private store: Store<AppState>) {
    this.todos$ = this.store.select(fromTodo.selectAllTodos);
    this.loading$ = this.store.select(fromTodo.selectTodosLoading);
    this.error$ = this.store.select(fromTodo.selectTodosError);
    this.totalCount$ = this.store.select(fromTodo.selectTodoCount);
    this.activeCount$ = this.store.select(fromTodo.selectActiveTodoCount);
    this.completedCount$ = this.store.select(fromTodo.selectCompletedTodoCount);
  }

  /**
   * 初期化ライフサイクルフック
   * 
   * コンポーネントの初期化時に、Todoデータの読み込みアクションをディスパッチします。
   * 
   * NgRxチュートリアルでの意義:
   * - コンポーネントライフサイクルとアクションディスパッチの統合
   * - アプリケーション起動時のデータ取得パターン
   */
  ngOnInit(): void {
    this.store.dispatch(TodoActions.loadTodos());
  }

  /**
   * Todoの切り替えハンドラー
   * 
   * 子コンポーネントからのイベントを処理し、対応するアクションをディスパッチします。
   * 
   * NgRxチュートリアルでの意義:
   * - コンポーネント間の通信パターン
   * - ユーザーインタラクションからアクションへの変換
   */
  onToggle(id: number): void {
    this.store.dispatch(TodoActions.toggleTodo({ id }));
  }

  /**
   * Todoの削除ハンドラー
   * 
   * 子コンポーネントからのイベントを処理し、対応するアクションをディスパッチします。
   * 
   * NgRxチュートリアルでの意義:
   * - イベント処理とアクションディスパッチの分離
   * - 単一方向のデータフロー
   */
  onDelete(id: number): void {
    this.store.dispatch(TodoActions.deleteTodo({ id }));
  }
}
