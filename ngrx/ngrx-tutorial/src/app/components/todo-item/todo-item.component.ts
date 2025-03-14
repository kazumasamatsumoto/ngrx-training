import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo } from '../../models/todo.model';

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
  @Input() todo!: Todo;
  @Output() toggle = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();

  onToggle(): void {
    this.toggle.emit(this.todo.id);
  }

  onDelete(): void {
    this.delete.emit(this.todo.id);
  }
}
