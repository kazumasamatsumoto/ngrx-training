/**
 * Chapter 10: NgRxによるストア（Store）の実装
 *
 * このファイルでは、Angularアプリケーションの状態管理ライブラリであるNgRxの
 * 概念と実装方法を示しています。
 */

//==============================================================================
// 第1部: NgRxの概念と実際のAngularプロジェクトでの使用例（解説）
//==============================================================================

/**
 * NgRxとは？
 * 
 * NgRxは、Angularアプリケーションのための状態管理ライブラリです。
 * ReduxパターンとRxJSのリアクティブプログラミングを組み合わせて、
 * 予測可能な方法でアプリケーションの状態を管理します。
 * 
 * 【NgRxの主要コンポーネント】
 * 
 * 1. Store: アプリケーションの状態を保持する中央リポジトリ
 * 2. Actions: 状態変更の意図を表すオブジェクト
 * 3. Reducers: 現在の状態とアクションから新しい状態を生成する純粋関数
 * 4. Selectors: 状態から特定のデータを取得する関数
 * 5. Effects: 副作用（APIリクエストなど）を処理するためのサービス
 * 
 * 【実際のAngularプロジェクトでのNgRxの導入手順】
 * 
 * 1. NgRxのインストール:
 *    $ npm install @ngrx/store @ngrx/effects @ngrx/entity @ngrx/store-devtools
 * 
 * 2. AppModuleへの登録:
 *    ```typescript
 *    import { StoreModule } from '@ngrx/store';
 *    import { EffectsModule } from '@ngrx/effects';
 *    import { StoreDevtoolsModule } from '@ngrx/store-devtools';
 *    import { reducers, metaReducers } from './reducers';
 *    import { AppEffects } from './app.effects';
 *    
 *    @NgModule({
 *      imports: [
 *        StoreModule.forRoot(reducers, { metaReducers }),
 *        EffectsModule.forRoot([AppEffects]),
 *        StoreDevtoolsModule.instrument({
 *          maxAge: 25, // 最大25アクションまで履歴を保存
 *          logOnly: environment.production
 *        })
 *      ]
 *    })
 *    export class AppModule { }
 *    ```
 */

/**
 * 【具体的なTODOアプリケーションの例】
 * 
 * 以下では、TODOアプリケーションを例に、NgRxの各要素がどのように連携するかを
 * 具体的に示します。
 * 
 * 1. State（状態）: TODOアプリケーションの状態
 * src/app/store/todo.state.ts
 * ```typescript
 * export interface Todo {
 *   id: number;
 *   text: string;
 *   completed: boolean;
 * }
 * 
 * export interface TodoState {
 *   todos: Todo[];
 *   loading: boolean;
 *   error: string | null;
 * }
 * 
 * export const initialTodoState: TodoState = {
 *   todos: [],
 *   loading: false,
 *   error: null
 * };
 * ```
 * 
 * 2. Actions（アクション）: ユーザー操作や外部イベントを表現
 * src/app/store/todo.actions.ts
 * ```typescript
 * import { createAction, props } from '@ngrx/store';
 * import { Todo } from './todo.state';
 * 
 * // TODOの読み込み
 * export const loadTodos = createAction('[Todo] Load Todos');
 * export const loadTodosSuccess = createAction(
 *   '[Todo] Load Todos Success',
 *   props<{ todos: Todo[] }>()
 * );
 * export const loadTodosFailure = createAction(
 *   '[Todo] Load Todos Failure',
 *   props<{ error: string }>()
 * );
 * 
 * // TODOの追加
 * export const addTodo = createAction(
 *   '[Todo] Add Todo',
 *   props<{ text: string }>()
 * );
 * 
 * // TODOの完了状態の切り替え
 * export const toggleTodo = createAction(
 *   '[Todo] Toggle Todo',
 *   props<{ id: number }>()
 * );
 * 
 * // TODOの削除
 * export const deleteTodo = createAction(
 *   '[Todo] Delete Todo',
 *   props<{ id: number }>()
 * );
 * ```
 * 
 * 3. Reducers（リデューサー）: 状態の更新ロジック
 * src/app/store/todo.reducer.ts
 * ```typescript
 * import { createReducer, on } from '@ngrx/store';
 * import * as TodoActions from './todo.actions';
 * import { initialTodoState } from './todo.state';
 * 
 * export const todoReducer = createReducer(
 *   initialTodoState,
 *   
 *   // TODOの読み込み開始
 *   on(TodoActions.loadTodos, state => ({
 *     ...state,
 *     loading: true,
 *     error: null
 *   })),
 *   
 *   // TODOの読み込み成功
 *   on(TodoActions.loadTodosSuccess, (state, { todos }) => ({
 *     ...state,
 *     todos,
 *     loading: false
 *   })),
 *   
 *   // TODOの完了状態の切り替え
 *   on(TodoActions.toggleTodo, (state, { id }) => ({
 *     ...state,
 *     todos: state.todos.map(todo =>
 *       todo.id === id ? { ...todo, completed: !todo.completed } : todo
 *     )
 *   }))
 * );
 * ```
 * 
 * 4. Selectors（セレクター）: 状態から必要なデータを取得
 * src/app/store/todo.selectors.ts
 * ```typescript
 * import { createFeatureSelector, createSelector } from '@ngrx/store';
 * import { TodoState } from './todo.state';
 * 
 * // 'todos'という名前で登録されたフィーチャーステートを取得
 * export const selectTodoState = createFeatureSelector<TodoState>('todos');
 * 
 * // すべてのTODOを取得
 * export const selectAllTodos = createSelector(
 *   selectTodoState,
 *   state => state.todos
 * );
 * 
 * // 完了したTODOのみを取得
 * export const selectCompletedTodos = createSelector(
 *   selectAllTodos,
 *   todos => todos.filter(todo => todo.completed)
 * );
 * ```
 * 
 * 5. Effects（エフェクト）: 副作用（APIリクエストなど）の処理
 * src/app/store/todo.effects.ts
 * ```typescript
 * import { Injectable } from '@angular/core';
 * import { Actions, createEffect, ofType } from '@ngrx/effects';
 * import { of } from 'rxjs';
 * import { catchError, map, mergeMap } from 'rxjs/operators';
 * import { TodoService } from '../services/todo.service';
 * import * as TodoActions from './todo.actions';
 * 
 * @Injectable()
 * export class TodoEffects {
 *   constructor(
 *     private actions$: Actions,
 *     private todoService: TodoService
 *   ) {}
 * 
 *   // TODOの読み込み
 *   loadTodos$ = createEffect(() =>
 *     this.actions$.pipe(
 *       ofType(TodoActions.loadTodos),
 *       mergeMap(() =>
 *         this.todoService.getTodos().pipe(
 *           map(todos => TodoActions.loadTodosSuccess({ todos })),
 *           catchError(error => of(TodoActions.loadTodosFailure({ error: error.message })))
 *         )
 *       )
 *     )
 *   );
 * }
 * ```
 * 
 * 6. コンポーネントでのNgRxの使用例
 * src/app/components/todo-list/todo-list.component.ts
 * ```typescript
 * import { Component, OnInit } from '@angular/core';
 * import { Store } from '@ngrx/store';
 * import { Observable } from 'rxjs';
 * import { Todo } from '../../store/todo.state';
 * import * as TodoActions from '../../store/todo.actions';
 * import * as TodoSelectors from '../../store/todo.selectors';
 * 
 * @Component({
 *   selector: 'app-todo-list',
 *   template: `
 *     <div *ngIf="loading$ | async">読み込み中...</div>
 *     <div *ngIf="error$ | async as error" class="error">{{ error }}</div>
 *     
 *     <input #todoInput placeholder="新しいTODOを入力" />
 *     <button (click)="addTodo(todoInput.value); todoInput.value = ''">追加</button>
 *     
 *     <ul>
 *       <li *ngFor="let todo of todos$ | async">
 *         <input type="checkbox" [checked]="todo.completed" (change)="toggleTodo(todo.id)" />
 *         <span [class.completed]="todo.completed">{{ todo.text }}</span>
 *         <button (click)="deleteTodo(todo.id)">削除</button>
 *       </li>
 *     </ul>
 *   `
 * })
 * export class TodoListComponent implements OnInit {
 *   todos$: Observable<Todo[]>;
 *   loading$: Observable<boolean>;
 *   error$: Observable<string | null>;
 *   
 *   constructor(private store: Store) {
 *     // セレクターを使って状態を監視
 *     this.todos$ = this.store.select(TodoSelectors.selectAllTodos);
 *     this.loading$ = this.store.select(TodoSelectors.selectTodosLoading);
 *     this.error$ = this.store.select(TodoSelectors.selectTodosError);
 *   }
 *   
 *   ngOnInit() {
 *     // コンポーネント初期化時にTODOを読み込む
 *     this.store.dispatch(TodoActions.loadTodos());
 *   }
 *   
 *   // 新しいTODOを追加
 *   addTodo(text: string) {
 *     if (text.trim()) {
 *       this.store.dispatch(TodoActions.addTodo({ text }));
 *     }
 *   }
 * }
 * ```
 */

//==============================================================================
// 第2部: 実行可能なサンプルコード（カウンターアプリケーション）
//==============================================================================

// RxJSの簡易実装
class BehaviorSubject {
  constructor(initialValue) {
    this.value = initialValue;
    this.observers = [];
  }

  next(value) {
    this.value = value;
    this.observers.forEach(observer => observer(value));
  }

  getValue() {
    return this.value;
  }

  subscribe(observer) {
    // 関数として扱う
    const callback = typeof observer === 'function' ? observer : value => observer.next(value);
    this.observers.push(callback);
    callback(this.value); // 初期値を通知
    
    return {
      unsubscribe: () => {
        const index = this.observers.indexOf(callback);
        if (index !== -1) {
          this.observers.splice(index, 1);
        }
      }
    };
  }

  // 簡略化したpipe実装
  pipe(operator1, operator2) {
    // 簡略化のため、最大2つのオペレーターのみサポート
    const result = operator1(this);
    return operator2 ? operator2(result) : result;
  }
}

class Observable {
  constructor(subscribeFn) {
    this.subscribeFn = subscribeFn;
  }

  subscribe(observer) {
    return this.subscribeFn(observer);
  }

  pipe(operator1, operator2) {
    const result = operator1(this);
    return operator2 ? operator2(result) : result;
  }
}

// RxJSのオペレーター
function map(project) {
  return (source) => {
    return new Observable(observer => {
      const subscription = source.subscribe(value => {
        const projected = project(value);
        if (typeof observer === 'function') {
          observer(projected);
        } else {
          observer.next(projected);
        }
      });
      return subscription;
    });
  };
}

function distinctUntilChanged() {
  return (source) => {
    return new Observable(observer => {
      let lastValue;
      let firstValue = true;
      
      const subscription = source.subscribe(value => {
        if (firstValue || value !== lastValue) {
          firstValue = false;
          lastValue = value;
          if (typeof observer === 'function') {
            observer(value);
          } else {
            observer.next(value);
          }
        }
      });
      
      return subscription;
    });
  };
}

// 1. State（状態）
const initialState = { count: 0 };

// 2. Actions（アクション）
const ActionTypes = {
  INCREMENT: '[Counter] Increment',
  DECREMENT: '[Counter] Decrement',
  ADD: '[Counter] Add',
  RESET: '[Counter] Reset',
};

const CounterActions = {
  increment: () => ({ type: ActionTypes.INCREMENT }),
  decrement: () => ({ type: ActionTypes.DECREMENT }),
  add: (amount) => ({ type: ActionTypes.ADD, payload: { amount } }),
  reset: () => ({ type: ActionTypes.RESET }),
};

// 3. Reducer（リデューサー）
function counterReducer(state = initialState, action) {
  switch (action.type) {
    case ActionTypes.INCREMENT:
      return { ...state, count: state.count + 1 };
    case ActionTypes.DECREMENT:
      return { ...state, count: state.count - 1 };
    case ActionTypes.ADD:
      return { ...state, count: state.count + action.payload.amount };
    case ActionTypes.RESET:
      return { count: 0 };
    default:
      return state;
  }
}

// 4. Selectors（セレクター）
const Selectors = {
  selectCount: (state) => state.count,
};

// 5. Store（ストア）
class SimpleStore {
  constructor(reducer, initialState) {
    this.reducer = reducer;
    this.state$ = new BehaviorSubject(initialState);
    this.dispatch({ type: '@@INIT' }); // 初期化アクション
  }

  select(selectorFn) {
    return this.state$.pipe(
      map(selectorFn),
      distinctUntilChanged()
    );
  }

  getState() {
    return this.state$.getValue();
  }

  dispatch(action) {
    console.log(`アクションをディスパッチ: ${action.type}`);
    
    const currentState = this.getState();
    const newState = this.reducer(currentState, action);
    
    if (newState !== currentState) {
      console.log("状態が変更されました");
      this.state$.next(newState);
    } else {
      console.log("状態は変更されていません");
    }
    
    return action;
  }
}

//==============================================================================
// 第3部: サンプルコードの実行
//==============================================================================

// ストアを作成
const store = new SimpleStore(counterReducer, initialState);

// UIを更新する関数（Angularコンポーネントの役割）
function updateUI(count) {
  console.log(`UIを更新: カウント = ${count}`);
}

// ログを記録する関数
function logState(state) {
  console.log(`ログ: 新しい状態 = ${JSON.stringify(state)}`);
}

// 状態の変更を監視（Observableのサブスクリプション）
const countSubscription = store.select(Selectors.selectCount).subscribe(updateUI);
const stateSubscription = store.select(state => state).subscribe(logState);

// アクションをディスパッチして状態を更新
console.log("\n--- INCREMENT アクション ---");
store.dispatch(CounterActions.increment()); // カウントを1増やす

console.log("\n--- INCREMENT アクション ---");
store.dispatch(CounterActions.increment()); // カウントをさらに1増やす

console.log("\n--- ADD アクション ---");
store.dispatch(CounterActions.add(5)); // カウントを5増やす

// UIの更新を停止（サブスクリプションの解除）
countSubscription.unsubscribe();

console.log("\n--- DECREMENT アクション（UIサブスクリプション解除後） ---");
store.dispatch(CounterActions.decrement()); // カウントを1減らす（UIは更新されない）

// 現在の状態を取得
console.log("\n--- 現在の状態 ---");
console.log(store.getState());

// すべてのサブスクリプションを解除
stateSubscription.unsubscribe();

console.log("\n--- RESET アクション（すべてのサブスクリプション解除後） ---");
store.dispatch(CounterActions.reset()); // カウントを0にリセット（リスナーは呼び出されない）

/**
 * NgRxの重要なポイント:
 *
 * 1. 単一の状態ツリー: アプリケーションの状態は単一のオブジェクトとして保持される
 * 2. 読み取り専用の状態: 状態は直接変更できず、アクションをディスパッチすることでのみ変更可能
 * 3. 純粋なリデューサー: 状態の更新は、前の状態とアクションを受け取り、新しい状態を返す純粋関数で行われる
 * 4. 単方向データフロー: アクション → リデューサー → 状態更新 → Observableの通知 という一方向のデータフロー
 * 5. リアクティブプログラミング: RxJSのObservableを使用して状態の変更を監視し、UIを更新
 * 6. 型安全性: TypeScriptを使用して、アクション、リデューサー、セレクターなどの型安全性を確保
 * 7. エフェクト: 副作用（APIリクエストなど）を処理するための専用の仕組み
 */
