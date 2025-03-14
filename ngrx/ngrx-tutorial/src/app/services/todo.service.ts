import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Todo } from '../models/todo.model';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  // モックデータ
  private todos: Todo[] = [
    { id: 1, title: 'NgRx Storeを学ぶ', completed: false },
    { id: 2, title: 'NgRx Effectsを理解する', completed: false },
    { id: 3, title: 'NgRx Entityを使いこなす', completed: false }
  ];
  
  // 次のID（新しいTodoを追加する際に使用）
  private nextId = 4;

  constructor(private http: HttpClient) {}

  // すべてのTodoを取得
  getTodos(): Observable<Todo[]> {
    // APIリクエストをシミュレート（遅延を追加）
    return of([...this.todos]).pipe(delay(500));
  }

  // 新しいTodoを追加
  addTodo(title: string): Observable<Todo> {
    const newTodo: Todo = {
      id: this.nextId++,
      title,
      completed: false
    };
    
    // 新しいTodoをモックデータに追加
    this.todos.push(newTodo);
    
    // APIリクエストをシミュレート
    return of(newTodo).pipe(delay(500));
  }

  // Todoの完了状態を切り替え
  toggleTodo(id: number): Observable<Todo> {
    // 対象のTodoを検索
    const todo = this.todos.find(t => t.id === id);
    
    if (!todo) {
      throw new Error(`Todo with id ${id} not found`);
    }
    
    // 完了状態を反転
    todo.completed = !todo.completed;
    
    // APIリクエストをシミュレート
    return of({...todo}).pipe(delay(500));
  }

  // Todoを削除
  deleteTodo(id: number): Observable<number> {
    // 対象のTodoのインデックスを検索
    const index = this.todos.findIndex(t => t.id === id);
    
    if (index === -1) {
      throw new Error(`Todo with id ${id} not found`);
    }
    
    // Todoを削除
    this.todos.splice(index, 1);
    
    // APIリクエストをシミュレート
    return of(id).pipe(delay(500));
  }
}
