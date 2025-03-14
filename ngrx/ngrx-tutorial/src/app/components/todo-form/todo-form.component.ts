import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/reducers';
import * as TodoActions from '../../store/actions/todo.actions';

/**
 * TodoFormComponent - 新しいTodoを追加するためのフォームコンポーネント
 * 
 * このコンポーネントは、ユーザーが新しいTodoを入力して追加するための
 * フォームを提供します。
 * 
 * NgRxチュートリアルにおける役割:
 * - ユーザー入力からアクションへの変換
 * - フォーム処理とStore操作の統合
 * - コンポーネントからのアクションディスパッチ
 */

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="todo-form">
      <input
        type="text"
        [(ngModel)]="todoTitle"
        placeholder="新しいタスクを入力..."
        (keyup.enter)="addTodo()"
      />
      <button (click)="addTodo()" [disabled]="!todoTitle.trim()">追加</button>
    </div>
  `,
  styles: [`
    .todo-form {
      display: flex;
      margin-bottom: 20px;
    }
    
    input {
      flex: 1;
      padding: 10px;
      font-size: 16px;
      border: 1px solid #ddd;
      border-radius: 4px 0 0 4px;
    }
    
    button {
      padding: 10px 15px;
      background-color: #4caf50;
      color: white;
      border: none;
      border-radius: 0 4px 4px 0;
      cursor: pointer;
    }
    
    button:hover {
      background-color: #45a049;
    }
    
    button:disabled {
      background-color: #cccccc;
      cursor: not-allowed;
    }
  `]
})
export class TodoFormComponent {
  /**
   * フォーム入力値
   * 
   * ユーザーが入力したTodoのタイトルを保持します。
   * 
   * NgRxチュートリアルでの意義:
   * - ローカルコンポーネント状態の管理
   * - 双方向データバインディング（[(ngModel)]）の使用
   */
  todoTitle = '';

  /**
   * コンストラクタ
   * 
   * NgRxストアを注入します。
   * 
   * NgRxチュートリアルでの意義:
   * - 依存性注入を通じたStoreへのアクセス
   * - コンポーネントとStoreの接続
   */
  constructor(private store: Store<AppState>) {}

  /**
   * Todoの追加ハンドラー
   * 
   * フォームが送信されたときに呼び出され、
   * 入力されたタイトルを使用してaddTodoアクションをディスパッチします。
   * 
   * NgRxチュートリアルでの意義:
   * - ユーザー入力の検証（空白チェック）
   * - アクションのディスパッチ
   * - フォーム送信後の状態リセット
   */
  addTodo(): void {
    if (this.todoTitle.trim()) {
      this.store.dispatch(TodoActions.addTodo({ title: this.todoTitle.trim() }));
      this.todoTitle = '';
    }
  }
}
