/**
 * 第15章: NgRxによる状態管理
 *
 * このファイルでは、NgRxライブラリを模倣した状態管理パターンを実装しています。
 * NgRxはAngularアプリケーション向けのリアクティブな状態管理ライブラリであり、
 * ReduxパターンとRxJSを組み合わせたものです。
 *
 * NgRxの主要な概念:
 * 1. ストア (Store) - アプリケーションの状態を保持するRxJSのBehaviorSubject
 * 2. アクション (Action) - 状態変更を記述するプレーンなオブジェクト
 * 3. リデューサー (Reducer) - 現在の状態とアクションから新しい状態を計算する純粋関数
 * 4. セレクター (Selector) - 状態の特定の部分を取得するための関数
 * 5. エフェクト (Effect) - 副作用（APIリクエストなど）を処理するためのサービス
 * 6. ファサード (Facade) - コンポーネントとストアの間の抽象化レイヤー
 *
 * NgRxの特徴:
 * - リアクティブ - RxJSを使用した非同期処理と状態管理
 * - イミュータブル - 状態は直接変更されず、新しい状態オブジェクトが生成される
 * - 予測可能 - 単一方向のデータフローと純粋関数による状態変更
 * - 開発ツール - Redux DevToolsとの統合による強力なデバッグ機能
 *
 * このファイルでは、NgRxの基本的な実装と、コンポーネントとの連携方法を示しています。
 *
 * なぜNgRxが重要なのか？
 *
 * 【複雑な状態管理の簡素化】
 * 大規模なAngularアプリケーションでは、状態管理が非常に複雑になります。多くのコンポーネントが
 * 同じ状態にアクセスし、更新する必要がある場合、コンポーネントベースの状態管理やサービスだけでは
 * 対応が難しくなります。NgRxは、アプリケーション全体の状態を単一のストアで管理することで、
 * この複雑さを軽減します。
 *
 * 【リアクティブプログラミングとの統合】
 * NgRxはRxJSを基盤としており、Angularのリアクティブな特性と自然に統合されます。
 * これにより、非同期処理や複雑なデータフローを宣言的に記述できます。
 * Observableベースの状態管理により、変更の検出と伝播が効率的に行われます。
 *
 * 【開発者体験の向上】
 * NgRxは、Redux DevToolsとの統合により、状態の変化を時系列で追跡し、デバッグする
 * 強力なツールを提供します。これにより、「時間旅行デバッギング」が可能になり、
 * 複雑なバグの特定と修正が容易になります。
 *
 * 【テスト容易性】
 * NgRxのアーキテクチャは、テストを書きやすくします。リデューサーは純粋関数なので、
 * 入力と出力をテストするだけで済みます。エフェクトもRxJSのテスト機能を使用して
 * 効果的にテストできます。また、ファサードパターンを使用することで、
 * コンポーネントのテストも簡素化されます。
 *
 * 【スケーラビリティと保守性】
 * NgRxは、アプリケーションの成長に合わせてスケールするように設計されています。
 * 機能モジュールごとに状態を分割し、必要に応じて結合することができます。
 * また、明確な構造とパターンにより、新しい開発者がプロジェクトに参加しやすくなります。
 *
 * 【副作用の管理】
 * NgRxのエフェクトは、APIリクエスト、WebSocketの通信、ローカルストレージの操作などの
 * 副作用を宣言的に管理するための強力な仕組みを提供します。これにより、
 * ビジネスロジックとUI層を明確に分離できます。
 */

// NgRxを使用した例（実際のNgRxは使用していません）

/**
 * アクションの定義
 * NgRxでは、アクションはTypeScriptのクラスとして定義されることが多い
 */
class Action {
  constructor(type, payload = null) {
    this.type = type;
    if (payload !== null) {
      this.payload = payload;
    }
  }
}

// アクションタイプの定義
const ActionTypes = {
  INCREMENT: "[Counter] Increment",
  DECREMENT: "[Counter] Decrement",
  ADD: "[Counter] Add",
  RESET: "[Counter] Reset",
  LOAD_TODOS: "[Todo] Load Todos",
  LOAD_TODOS_SUCCESS: "[Todo] Load Todos Success",
  LOAD_TODOS_FAILURE: "[Todo] Load Todos Failure",
  ADD_TODO: "[Todo] Add Todo",
  TOGGLE_TODO: "[Todo] Toggle Todo",
  REMOVE_TODO: "[Todo] Remove Todo",
};

/**
 * アクションクリエイター
 * アクションオブジェクトを作成する関数
 */
const CounterActions = {
  increment: () => new Action(ActionTypes.INCREMENT),
  decrement: () => new Action(ActionTypes.DECREMENT),
  add: (amount) => new Action(ActionTypes.ADD, amount),
  reset: () => new Action(ActionTypes.RESET),
};

const TodoActions = {
  loadTodos: () => new Action(ActionTypes.LOAD_TODOS),
  loadTodosSuccess: (todos) =>
    new Action(ActionTypes.LOAD_TODOS_SUCCESS, todos),
  loadTodosFailure: (error) =>
    new Action(ActionTypes.LOAD_TODOS_FAILURE, error),
  addTodo: (text) => new Action(ActionTypes.ADD_TODO, text),
  toggleTodo: (id) => new Action(ActionTypes.TOGGLE_TODO, id),
  removeTodo: (id) => new Action(ActionTypes.REMOVE_TODO, id),
};

/**
 * 状態インターフェース
 * TypeScriptでは通常、状態の型を定義する
 */
// interface AppState {
//   counter: CounterState;
//   todos: TodoState;
// }

// interface CounterState {
//   count: number;
// }

// interface TodoState {
//   todos: Todo[];
//   loading: boolean;
//   error: any;
// }

// interface Todo {
//   id: number;
//   text: string;
//   completed: boolean;
// }

/**
 * 初期状態
 */
const initialCounterState = {
  count: 0,
};

const initialTodoState = {
  todos: [],
  loading: false,
  error: null,
};

const initialAppState = {
  counter: initialCounterState,
  todos: initialTodoState,
};

/**
 * リデューサー
 * 現在の状態とアクションから新しい状態を計算する純粋関数
 */
function counterReducer(state = initialCounterState, action) {
  switch (action.type) {
    case ActionTypes.INCREMENT:
      return { ...state, count: state.count + 1 };
    case ActionTypes.DECREMENT:
      return { ...state, count: state.count - 1 };
    case ActionTypes.ADD:
      return { ...state, count: state.count + action.payload };
    case ActionTypes.RESET:
      return { ...initialCounterState };
    default:
      return state;
  }
}

function todoReducer(state = initialTodoState, action) {
  switch (action.type) {
    case ActionTypes.LOAD_TODOS:
      return { ...state, loading: true };
    case ActionTypes.LOAD_TODOS_SUCCESS:
      return { ...state, loading: false, todos: action.payload };
    case ActionTypes.LOAD_TODOS_FAILURE:
      return { ...state, loading: false, error: action.payload };
    case ActionTypes.ADD_TODO:
      const newTodo = {
        id: Date.now(),
        text: action.payload,
        completed: false,
      };
      return { ...state, todos: [...state.todos, newTodo] };
    case ActionTypes.TOGGLE_TODO:
      const updatedTodos = state.todos.map((todo) =>
        todo.id === action.payload
          ? { ...todo, completed: !todo.completed }
          : todo
      );
      return { ...state, todos: updatedTodos };
    case ActionTypes.REMOVE_TODO:
      const filteredTodos = state.todos.filter(
        (todo) => todo.id !== action.payload
      );
      return { ...state, todos: filteredTodos };
    default:
      return state;
  }
}

/**
 * メタリデューサー
 * 複数のリデューサーを組み合わせる関数
 */
function combineReducers(reducers) {
  return function (state = {}, action) {
    const nextState = {};
    let hasChanged = false;

    for (const key in reducers) {
      const reducer = reducers[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }

    return hasChanged ? nextState : state;
  };
}

// ルートリデューサー
const rootReducer = combineReducers({
  counter: counterReducer,
  todos: todoReducer,
});

/**
 * BehaviorSubjectの簡易実装
 * NgRxのStoreはRxJSのBehaviorSubjectをベースにしている
 */
class BehaviorSubject {
  constructor(initialValue) {
    this.value = initialValue;
    this.observers = [];
  }

  getValue() {
    return this.value;
  }

  next(value) {
    this.value = value;
    this.observers.forEach((observer) => observer(value));
  }

  subscribe(observer) {
    this.observers.push(observer);
    observer(this.value);

    return () => {
      const index = this.observers.indexOf(observer);
      if (index !== -1) {
        this.observers.splice(index, 1);
      }
    };
  }
}

/**
 * NgRxストアの簡易実装
 */
class Store extends BehaviorSubject {
  constructor(reducer, initialState) {
    super(initialState);
    this.reducer = reducer;
  }

  dispatch(action) {
    const currentState = this.getValue();
    const nextState = this.reducer(currentState, action);
    this.next(nextState);
    return action;
  }

  select(selectorFn) {
    const source$ = new BehaviorSubject(selectorFn(this.getValue()));

    this.subscribe((state) => {
      source$.next(selectorFn(state));
    });

    return source$;
  }
}

// ストアの作成
const store = new Store(rootReducer, initialAppState);

/**
 * セレクター
 * 状態の特定の部分を取得するための関数
 */
const Selectors = {
  selectCount: (state) => state.counter.count,
  selectTodos: (state) => state.todos.todos,
  selectLoading: (state) => state.todos.loading,
  selectError: (state) => state.todos.error,
  selectCompletedTodos: (state) =>
    state.todos.todos.filter((todo) => todo.completed),
  selectIncompleteTodos: (state) =>
    state.todos.todos.filter((todo) => !todo.completed),
};

/**
 * エフェクトの簡易実装
 * 実際のNgRxでは、@Effectデコレータを使用する
 */
class TodoEffects {
  constructor(actions$, todoService, store) {
    this.actions$ = actions$;
    this.todoService = todoService;
    this.store = store;

    // エフェクトの初期化
    this.initEffects();
  }

  initEffects() {
    // loadTodosエフェクト
    this.actions$.subscribe((action) => {
      if (action.type === ActionTypes.LOAD_TODOS) {
        // APIリクエストをシミュレート
        console.log("エフェクト: TODOの読み込みを開始");
        setTimeout(() => {
          try {
            const todos = [
              { id: 1, text: "NgRxを学ぶ", completed: false },
              { id: 2, text: "Angularアプリを作成する", completed: true },
            ];
            this.store.dispatch(TodoActions.loadTodosSuccess(todos));
          } catch (error) {
            this.store.dispatch(TodoActions.loadTodosFailure(error));
          }
        }, 1000);
      }
    });
  }
}

/**
 * アクションストリームの簡易実装
 */
class Actions extends BehaviorSubject {
  constructor() {
    super({ type: "@@INIT" });
  }

  // 特定のアクションタイプをフィルタリングするメソッド
  ofType(actionType) {
    const source$ = new BehaviorSubject(null);

    this.subscribe((action) => {
      if (action.type === actionType) {
        source$.next(action);
      }
    });

    return source$;
  }
}

// アクションストリームの作成
const actions$ = new Actions();

// ストアのディスパッチをオーバーライドして、アクションストリームに通知
const originalDispatch = store.dispatch;
store.dispatch = function (action) {
  const result = originalDispatch.call(store, action);
  actions$.next(action);
  return result;
};

/**
 * 模擬的なTodoサービス
 */
class TodoService {
  getTodos() {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          { id: 1, text: "NgRxを学ぶ", completed: false },
          { id: 2, text: "Angularアプリを作成する", completed: true },
        ]);
      }, 1000);
    });
  }
}

// サービスとエフェクトの初期化
const todoService = new TodoService();
const todoEffects = new TodoEffects(actions$, todoService, store);

/**
 * ファサードパターンの実装
 * コンポーネントとストアの間の抽象化レイヤー
 */
class CounterFacade {
  constructor(store) {
    this.store = store;
    this.count$ = store.select(Selectors.selectCount);
  }

  increment() {
    this.store.dispatch(CounterActions.increment());
  }

  decrement() {
    this.store.dispatch(CounterActions.decrement());
  }

  add(amount) {
    this.store.dispatch(CounterActions.add(amount));
  }

  reset() {
    this.store.dispatch(CounterActions.reset());
  }
}

class TodoFacade {
  constructor(store) {
    this.store = store;
    this.todos$ = store.select(Selectors.selectTodos);
    this.loading$ = store.select(Selectors.selectLoading);
    this.error$ = store.select(Selectors.selectError);
    this.completedTodos$ = store.select(Selectors.selectCompletedTodos);
    this.incompleteTodos$ = store.select(Selectors.selectIncompleteTodos);
  }

  loadTodos() {
    this.store.dispatch(TodoActions.loadTodos());
  }

  addTodo(text) {
    this.store.dispatch(TodoActions.addTodo(text));
  }

  toggleTodo(id) {
    this.store.dispatch(TodoActions.toggleTodo(id));
  }

  removeTodo(id) {
    this.store.dispatch(TodoActions.removeTodo(id));
  }
}

// ファサードの作成
const counterFacade = new CounterFacade(store);
const todoFacade = new TodoFacade(store);

/**
 * Angularコンポーネントの模擬実装
 */
class CounterComponent {
  constructor(counterFacade) {
    this.counterFacade = counterFacade;
    this.count = 0;

    // 状態の購読
    this.subscription = this.counterFacade.count$.subscribe((count) => {
      this.count = count;
      this.render();
    });
  }

  // UIイベントハンドラー
  increment() {
    this.counterFacade.increment();
  }

  decrement() {
    this.counterFacade.decrement();
  }

  reset() {
    this.counterFacade.reset();
  }

  // UIの更新
  render() {
    console.log(`カウンターコンポーネント: カウント = ${this.count}`);
  }

  // コンポーネントの破棄
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription();
    }
  }
}

class TodoListComponent {
  constructor(todoFacade) {
    this.todoFacade = todoFacade;
    this.todos = [];
    this.loading = false;
    this.error = null;
    this.newTodo = "";

    // 状態の購読
    this.todosSubscription = this.todoFacade.todos$.subscribe((todos) => {
      this.todos = todos;
      this.render();
    });

    this.loadingSubscription = this.todoFacade.loading$.subscribe((loading) => {
      this.loading = loading;
      this.render();
    });

    this.errorSubscription = this.todoFacade.error$.subscribe((error) => {
      this.error = error;
      if (error) {
        console.error("エラー:", error);
      }
    });
  }

  // ライフサイクルフック
  ngOnInit() {
    this.todoFacade.loadTodos();
  }

  // UIイベントハンドラー
  addTodo() {
    if (this.newTodo.trim() === "") return;
    this.todoFacade.addTodo(this.newTodo);
    this.newTodo = "";
  }

  toggleTodo(id) {
    this.todoFacade.toggleTodo(id);
  }

  removeTodo(id) {
    this.todoFacade.removeTodo(id);
  }

  // UIの更新
  render() {
    console.log(`TODOリストコンポーネント: 読み込み中 = ${this.loading}`);
    if (!this.loading) {
      console.log("TODOリスト:", this.todos);
    }
  }

  // コンポーネントの破棄
  ngOnDestroy() {
    if (this.todosSubscription) this.todosSubscription();
    if (this.loadingSubscription) this.loadingSubscription();
    if (this.errorSubscription) this.errorSubscription();
  }
}

// コンポーネントの作成と使用
console.log("--- NgRxを使用したカウンターコンポーネント ---");
const counterComponent = new CounterComponent(counterFacade);

console.log("\n--- カウンターの操作 ---");
counterComponent.increment();
counterComponent.increment();
counterComponent.decrement();
counterComponent.reset();

console.log("\n--- NgRxを使用したTODOリストコンポーネント ---");
const todoListComponent = new TodoListComponent(todoFacade);

// ngOnInitを手動で呼び出し
todoListComponent.ngOnInit();

// 非同期処理の完了を待つ
setTimeout(() => {
  console.log("\n--- TODOの操作 ---");
  todoListComponent.addTodo("Angularのテストを書く");
  todoListComponent.toggleTodo(1);

  // 状態の最終確認
  console.log("\n--- 最終状態 ---");
  console.log(
    "カウンター状態:",
    store.select(Selectors.selectCount).getValue()
  );
  console.log("TODO状態:", store.select(Selectors.selectTodos).getValue());

  // コンポーネントの破棄
  counterComponent.ngOnDestroy();
  todoListComponent.ngOnDestroy();
}, 2000);
