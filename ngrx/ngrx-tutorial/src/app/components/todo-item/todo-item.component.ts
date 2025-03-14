import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo } from '../../models/todo.model';

/**
 * TodoItemComponent - 個別のTodoアイテムを表示するコンポーネント
 * 
 * このコンポーネントは、単一のTodoアイテムを表示し、
 * ユーザーがTodoの完了状態を切り替えたり、Todoを削除したりするための
 * インタラクションを提供します。
 * 
 * NgRxチュートリアルにおける役割:
 * - 表示と状態管理の分離
 * - 親コンポーネントとの通信パターン
 * - イベント駆動型のインタラクション
 */

@Component({
  selector: 'app-todo-item',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="todo-item" [class.completed]="todo.completed">
      <div class="todo-content">
        <input
          type="checkbox"
          [checked]="todo.completed"
          (change)="onToggle()"
        />
        <span class="todo-title">{{ todo.title }}</span>
      </div>
      <button class="delete-btn" (click)="onDelete()">削除</button>
    </div>
  `,
  styles: [`
    .todo-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      margin-bottom: 10px;
      background-color: #f9f9f9;
      border-radius: 4px;
      box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    }
    
    .todo-content {
      display: flex;
      align-items: center;
    }
    
    .todo-title {
      margin-left: 10px;
      font-size: 16px;
    }
    
    .completed .todo-title {
      text-decoration: line-through;
      color: #999;
    }
    
    .delete-btn {
      background-color: #ff4d4d;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 5px 10px;
      cursor: pointer;
    }
    
    .delete-btn:hover {
      background-color: #ff3333;
    }
    
    input[type="checkbox"] {
      width: 18px;
      height: 18px;
      cursor: pointer;
    }
  `]
})
export class TodoItemComponent {
  /**
   * 入力プロパティ
   * 
   * 親コンポーネント（TodoListComponent）から渡されるTodoオブジェクト。
   * 
   * NgRxチュートリアルでの意義:
   * - コンポーネント間のデータ受け渡し
   * - 単一方向のデータフロー
   * - プレゼンテーションコンポーネントパターン
   */
  @Input() todo!: Todo;
  
  /**
   * 出力イベント
   * 
   * ユーザーアクションに応じて親コンポーネントに通知するためのイベント。
   * 
   * NgRxチュートリアルでの意義:
   * - コンポーネント間の通信
   * - イベント駆動型アーキテクチャ
   * - 関心の分離（このコンポーネントはStoreを直接操作しない）
   */
  @Output() toggle = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();

  /**
   * Todoの切り替えハンドラー
   * 
   * チェックボックスがクリックされたときに呼び出され、
   * 親コンポーネントにTodoのIDを通知します。
   * 
   * NgRxチュートリアルでの意義:
   * - ユーザーインタラクションのハンドリング
   * - イベントの発行
   * - 親コンポーネントへの通知
   */
  onToggle(): void {
    this.toggle.emit(this.todo.id);
  }

  /**
   * Todoの削除ハンドラー
   * 
   * 削除ボタンがクリックされたときに呼び出され、
   * 親コンポーネントにTodoのIDを通知します。
   * 
   * NgRxチュートリアルでの意義:
   * - ユーザーインタラクションのハンドリング
   * - イベントの発行
   * - 親コンポーネントへの通知
   */
  onDelete(): void {
    this.delete.emit(this.todo.id);
  }
}
