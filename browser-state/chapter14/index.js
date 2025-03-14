/**
 * 第14章: コンポーネントベースの状態管理（Angular）
 *
 * このファイルでは、Angularのようなコンポーネントベースのフレームワークにおける状態管理の基本概念を示しています。
 * 実際のAngularは使用せず、その動作を模倣しています。
 *
 * Angularコンポーネントベースの状態管理の特徴:
 * 1. コンポーネント状態 - 各コンポーネントが独自の状態を管理
 * 2. 入力と出力 - @Input()と@Output()によるデータとイベントの受け渡し
 * 3. サービス - 複数のコンポーネント間で状態を共有するためのサービス
 * 4. 変更検知 - 状態変更時の自動UI更新
 *
 * このアプローチの利点:
 * - カプセル化 - コンポーネントが自身の状態を管理
 * - 再利用性 - 状態を持つコンポーネントを複数の場所で使用可能
 * - テスト容易性 - 独立したコンポーネントは単体テストが容易
 * - 依存性注入 - サービスを通じた状態の共有と管理
 *
 * 課題:
 * - 状態の共有 - 複数のコンポーネント間での状態共有が複雑になる場合がある
 * - 深いコンポーネントツリー - 入力と出力のバケツリレー問題が発生する可能性
 * - 複雑な状態ロジック - 大規模アプリケーションでは管理が難しくなる
 *
 * これらの課題に対処するために、NgRxなどのグローバル状態管理ライブラリが使用されます。
 *
 * なぜコンポーネントベースの状態管理が重要なのか？
 *
 * 【モジュール性と再利用性】
 * コンポーネントベースの状態管理により、UIを独立した再利用可能なコンポーネントに
 * 分割できます。各コンポーネントが自身の状態を管理することで、他のコンポーネントに
 * 依存せずに機能することができます。これにより、コンポーネントライブラリの構築や
 * コンポーネントの再利用が容易になります。
 *
 * 【関心の分離】
 * 各コンポーネントが自身の状態だけを管理することで、関心の分離が実現します。
 * これにより、コードの理解、保守、テストが容易になります。例えば、フォームコンポーネントは
 * フォームの状態だけを管理し、リストコンポーネントはリストの状態だけを管理します。
 *
 * 【段階的な複雑性】
 * コンポーネントベースの状態管理は、小規模なアプリケーションから始めて、
 * 必要に応じて複雑さを増していくことができます。最初はローカル状態だけで十分な
 * 場合が多く、アプリケーションが成長するにつれて、より高度な状態管理パターン
 * （NgRxなど）を導入できます。
 *
 * 【パフォーマンスの最適化】
 * 状態がコンポーネントレベルで管理されることで、状態変更の影響範囲が
 * 限定されます。これにより、状態が変更されたときに再レンダリングされる
 * コンポーネントの数を最小限に抑えることができ、パフォーマンスが向上します。
 *
 * 【開発者体験の向上】
 * コンポーネントベースの状態管理は、直感的で理解しやすいモデルを提供します。
 * 特に新しい開発者にとって、コンポーネントと状態の関係を理解しやすく、
 * 学習曲線が緩やかになります。
 *
 * 【グローバル状態管理との補完関係】
 * コンポーネントベースの状態管理は、グローバル状態管理（NgRxなど）と
 * 競合するものではなく、補完するものです。適切に組み合わせることで、
 * ローカルな関心事はコンポーネント内で、アプリケーション全体の関心事は
 * グローバルストアで管理するという、バランスの取れた設計が可能になります。
 */

// Angularコンポーネントの例（実際のAngularは使用していません）

/**
 * Angularのコンポーネント状態の簡易的な実装
 * 実際のAngularでは@Componentデコレータを使用します
 */
class Component {
  constructor(config) {
    this.selector = config.selector;
    this.template = config.template;
    this.inputs = {};
    this.outputs = {};
  }

  // 変更検知をトリガーするメソッド
  detectChanges() {
    console.log(`${this.selector}コンポーネントの変更を検知しました`);
    this.render();
  }

  // テンプレートをレンダリングするメソッド
  render() {
    console.log(`${this.selector}コンポーネントをレンダリングしました`);
    // 実際のAngularではDOMを更新する
  }
}

/**
 * カウンターコンポーネント
 * 数値の増減を管理する単純なコンポーネント
 */
class CounterComponent extends Component {
  constructor() {
    super({
      selector: "app-counter",
      template: `
        <div class="counter">
          <h2>カウント: {{ count }}</h2>
          <div class="buttons">
            <button (click)="increment()">増加</button>
            <button (click)="decrement()">減少</button>
            <button (click)="reset()">リセット</button>
          </div>
        </div>
      `,
    });

    // コンポーネントの状態
    this.count = 0;
  }

  // イベントハンドラー - ユーザー操作に応じて状態を更新
  increment() {
    this.count++;
    this.detectChanges();
  }

  decrement() {
    this.count--;
    this.detectChanges();
  }

  reset() {
    this.count = 0;
    this.detectChanges();
  }
}

/**
 * TODOリストコンポーネント
 * TODOアイテムの追加、切り替え、削除機能を持つコンポーネント
 */
class TodoListComponent extends Component {
  constructor() {
    super({
      selector: "app-todo-list",
      template: `
        <div class="todo-list">
          <h2>TODOリスト</h2>
          <div class="add-todo">
            <input type="text" [(ngModel)]="newTodo" />
            <button (click)="addTodo()">追加</button>
          </div>
          <ul>
            <li *ngFor="let todo of todos" [class.completed]="todo.completed">
              <span (click)="toggleTodo(todo.id)">{{ todo.text }}</span>
              <button (click)="removeTodo(todo.id)">削除</button>
            </li>
          </ul>
        </div>
      `,
    });

    // コンポーネントの状態
    this.todos = [
      { id: 1, text: "買い物に行く", completed: false },
      { id: 2, text: "報告書を書く", completed: true },
    ];
    this.newTodo = "";
  }

  // TODOを追加するメソッド
  addTodo() {
    if (this.newTodo.trim() === "") return;

    this.todos = [
      ...this.todos,
      { id: Date.now(), text: this.newTodo, completed: false },
    ];
    this.newTodo = "";
    this.detectChanges();
  }

  // TODOの完了状態を切り替えるメソッド
  toggleTodo(id) {
    this.todos = this.todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    this.detectChanges();
  }

  // TODOを削除するメソッド
  removeTodo(id) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.detectChanges();
  }
}

/**
 * 親子コンポーネント間の通信例
 */
class TodoItemComponent extends Component {
  constructor() {
    super({
      selector: "app-todo-item",
      template: `
        <li [class.completed]="todo.completed">
          <span (click)="onToggle()">{{ todo.text }}</span>
          <button (click)="onRemove()">削除</button>
        </li>
      `,
    });

    // 入力プロパティ
    this.todo = null;

    // 出力イベント
    this.toggle = new EventEmitter();
    this.remove = new EventEmitter();
  }

  // イベントハンドラー
  onToggle() {
    this.toggle.emit(this.todo.id);
  }

  onRemove() {
    this.remove.emit(this.todo.id);
  }
}

/**
 * イベントエミッターの簡易実装
 */
class EventEmitter {
  constructor() {
    this.listeners = [];
  }

  // イベントを発行
  emit(value) {
    this.listeners.forEach((listener) => listener(value));
  }

  // リスナーを登録
  subscribe(listener) {
    this.listeners.push(listener);

    // 登録解除関数を返す
    return () => {
      const index = this.listeners.indexOf(listener);
      if (index !== -1) {
        this.listeners.splice(index, 1);
      }
    };
  }
}

/**
 * 共有状態を管理するサービス
 * 複数のコンポーネント間で状態を共有するためのサービス
 */
class TodoService {
  constructor() {
    this.todos = [
      { id: 1, text: "買い物に行く", completed: false },
      { id: 2, text: "報告書を書く", completed: true },
    ];
    this.todosChanged = new EventEmitter();
  }

  // すべてのTODOを取得
  getTodos() {
    return [...this.todos];
  }

  // TODOを追加
  addTodo(text) {
    if (text.trim() === "") return;

    this.todos = [...this.todos, { id: Date.now(), text, completed: false }];
    this.todosChanged.emit(this.todos);
  }

  // TODOの完了状態を切り替え
  toggleTodo(id) {
    this.todos = this.todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    this.todosChanged.emit(this.todos);
  }

  // TODOを削除
  removeTodo(id) {
    this.todos = this.todos.filter((todo) => todo.id !== id);
    this.todosChanged.emit(this.todos);
  }
}

/**
 * サービスを使用するコンポーネント
 */
class TodoAppComponent extends Component {
  constructor(todoService) {
    super({
      selector: "app-todo",
      template: `
        <div class="todo-app">
          <h1>TODOアプリ</h1>
          <div class="add-todo">
            <input type="text" [(ngModel)]="newTodo" />
            <button (click)="addTodo()">追加</button>
          </div>
          <app-todo-list [todos]="todos"></app-todo-list>
        </div>
      `,
    });

    // 依存性注入されたサービス
    this.todoService = todoService;

    // コンポーネントの状態
    this.todos = this.todoService.getTodos();
    this.newTodo = "";

    // サービスの変更を購読
    this.subscription = this.todoService.todosChanged.subscribe((todos) => {
      this.todos = todos;
      this.detectChanges();
    });
  }

  // TODOを追加
  addTodo() {
    this.todoService.addTodo(this.newTodo);
    this.newTodo = "";
  }

  // コンポーネントの破棄時に購読を解除
  ngOnDestroy() {
    if (this.subscription) {
      this.subscription();
    }
  }
}

// コンポーネントとサービスの使用例
console.log("--- カウンターコンポーネント ---");
const counterComponent = new CounterComponent();
counterComponent.increment();
counterComponent.increment();
counterComponent.decrement();

console.log("\n--- TODOリストコンポーネント ---");
const todoListComponent = new TodoListComponent();
todoListComponent.addTodo("NgRxを学ぶ");
todoListComponent.toggleTodo(1);

console.log("\n--- サービスを使用したTODOアプリ ---");
const todoService = new TodoService();
const todoAppComponent = new TodoAppComponent(todoService);
todoService.addTodo("Angularアプリを作成する");
todoService.toggleTodo(2);
