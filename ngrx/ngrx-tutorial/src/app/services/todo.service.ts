import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Todo } from '../models/todo.model';

/**
 * TodoService - データアクセス層
 * 
 * このサービスはTodoデータの操作を担当します。実際のアプリケーションでは、
 * HTTPリクエストを使用してバックエンドAPIと通信しますが、このチュートリアルでは
 * モックデータとRxJSのofとdelayを使用してAPIリクエストをシミュレートしています。
 * 
 * NgRxチュートリアルにおける役割:
 * - Effectsがアクションに応じて呼び出すサービスとして機能
 * - 非同期操作（API呼び出し）をシミュレート
 * - ビジネスロジックとデータアクセスをコンポーネントから分離
 */
@Injectable({
  providedIn: 'root'
})
export class TodoService {
  // モックデータ - 実際のアプリではAPIから取得するデータを模倣
  private todos: Todo[] = [
    { id: 1, title: 'NgRx Storeを学ぶ', completed: false },
    { id: 2, title: 'NgRx Effectsを理解する', completed: false },
    { id: 3, title: 'NgRx Entityを使いこなす', completed: false }
  ];
  
  // 次のID（新しいTodoを追加する際に使用）
  private nextId = 4;

  constructor() {}

  /**
   * すべてのTodoを取得
   * 
   * 実際のアプリケーションでは、HTTPクライアントを使用してAPIからデータを取得します。
   * このチュートリアルでは、RxJSのofオペレータを使用して同期データを非同期ストリームに変換し、
   * delayオペレータで実際のネットワークリクエストの遅延をシミュレートしています。
   * 
   * NgRxチュートリアルでの意義:
   * - loadTodos Effectから呼び出され、データフェッチの非同期性を示す
   * - 取得したデータはloadTodosSuccess アクションを通じてStoreに保存される
   */
  getTodos(): Observable<Todo[]> {
    // APIリクエストをシミュレート（遅延を追加）
    return of([...this.todos]).pipe(delay(500));
  }

  /**
   * 新しいTodoを追加
   * 
   * @param title 新しいTodoのタイトル
   * 
   * 実際のアプリケーションでは、HTTPクライアントを使用してAPIにPOSTリクエストを送信します。
   * このメソッドは、addTodo Effectから呼び出され、成功するとaddTodoSuccess アクションが
   * ディスパッチされ、Storeが更新されます。
   * 
   * NgRxチュートリアルでの意義:
   * - ユーザー操作（フォーム送信）からアクション、Effect、サービス呼び出しの流れを示す
   * - 非同期操作の結果をStoreに反映する方法を示す
   */
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

  /**
   * Todoの完了状態を切り替え
   * 
   * @param id 切り替えるTodoのID
   * 
   * 実際のアプリケーションでは、HTTPクライアントを使用してAPIにPUTリクエストを送信します。
   * このメソッドは、toggleTodo Effectから呼び出され、Todoの状態を更新します。
   * 
   * NgRxチュートリアルでの意義:
   * - 状態更新の不変性を示す（新しいオブジェクトを作成して更新）
   * - ユーザーインタラクション→アクション→Effect→サービス→Storeの流れを示す
   * - 特定のエンティティの更新方法を示す
   */
  toggleTodo(id: number): Observable<Todo> {
    // 対象のTodoを検索
    const index = this.todos.findIndex(t => t.id === id);
    
    if (index === -1) {
      throw new Error(`Todo with id ${id} not found`);
    }
    
    // 完了状態を反転（不変性を保持するため、新しいオブジェクトを作成）
    const updatedTodo = {
      ...this.todos[index],
      completed: !this.todos[index].completed
    };
    
    // 配列内のTodoを更新
    this.todos[index] = updatedTodo;
    
    // APIリクエストをシミュレート
    return of(updatedTodo).pipe(delay(500));
  }

  /**
   * Todoを削除
   * 
   * @param id 削除するTodoのID
   * 
   * 実際のアプリケーションでは、HTTPクライアントを使用してAPIにDELETEリクエストを送信します。
   * このメソッドは、deleteTodo Effectから呼び出され、Todoを削除します。
   * 
   * NgRxチュートリアルでの意義:
   * - エンティティの削除操作を示す
   * - 削除操作の結果として、IDのみを返す（削除されたエンティティ全体ではなく）
   * - 削除後のStore更新の流れを示す
   */
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
