/**
 * 第14章: コンポーネントベースの状態管理
 *
 * このファイルでは、Reactのようなコンポーネントベースのフレームワークにおける状態管理の基本概念を示しています。
 * 実際のReactは使用せず、その動作を模倣しています。
 *
 * コンポーネントベースの状態管理の特徴:
 * 1. ローカル状態 - 各コンポーネントが独自の状態を管理
 * 2. 単方向データフロー - 親から子へのデータの流れ
 * 3. イベントハンドラー - ユーザー操作に応じた状態更新
 * 4. 再レンダリング - 状態変更時の自動UI更新
 *
 * このアプローチの利点:
 * - カプセル化 - コンポーネントが自身の状態を管理
 * - 再利用性 - 状態を持つコンポーネントを複数の場所で使用可能
 * - テスト容易性 - 独立したコンポーネントは単体テストが容易
 *
 * 課題:
 * - 状態の共有 - 複数のコンポーネント間での状態共有が複雑になる場合がある
 * - 深いコンポーネントツリー - props drilling問題が発生する可能性
 * - 複雑な状態ロジック - 大規模アプリケーションでは管理が難しくなる
 *
 * これらの課題に対処するために、Reduxなどのグローバル状態管理ライブラリや
 * Reactの Context APIなどが使用されます。
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
 * （Reduxなど）を導入できます。
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
 * コンポーネントベースの状態管理は、グローバル状態管理（ReduxやNgRxなど）と
 * 競合するものではなく、補完するものです。適切に組み合わせることで、
 * ローカルな関心事はコンポーネント内で、アプリケーション全体の関心事は
 * グローバルストアで管理するという、バランスの取れた設計が可能になります。
 */

// Reactコンポーネントの例（実際のReactは使用していません）

/**
 * ReactのuseStateフックの簡易的な実装
 * フックは関数コンポーネント内で状態を使用するためのReactの機能
 *
 * @param {any} initialState - 状態の初期値
 * @returns {Array} - [現在の状態, 状態を更新する関数]
 */
function useState(initialState) {
  let state = initialState;

  /**
   * 状態を更新する関数
   * 新しい状態値または現在の状態を引数に取る関数を受け取る
   *
   * @param {any|Function} newState - 新しい状態値または状態更新関数
   */
  function setState(newState) {
    if (typeof newState === "function") {
      state = newState(state);
    } else {
      state = newState;
    }

    // 実際のReactでは、ここでコンポーネントの再レンダリングがトリガーされる
    console.log(`状態が更新されました: ${JSON.stringify(state)}`);
    render();
  }

  return [state, setState];
}

/**
 * カウンターコンポーネント
 * 数値の増減を管理する単純なコンポーネント
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @param {number} props.initialCount - カウンターの初期値
 * @returns {Object} - 仮想DOMの表現
 */
function Counter({ initialCount = 0 }) {
  // コンポーネントの状態
  const [count, setCount] = useState(initialCount);

  // イベントハンドラー - ユーザー操作に応じて状態を更新
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(initialCount);
  const incrementByFive = () => setCount((prevCount) => prevCount + 5); // 関数形式の更新

  // 仮想DOMの返却（実際のReactではJSXを使用）
  return {
    type: "div",
    props: { className: "counter" },
    children: [
      {
        type: "h2",
        props: {},
        children: [`カウント: ${count}`],
      },
      {
        type: "div",
        props: { className: "buttons" },
        children: [
          {
            type: "button",
            props: { onClick: increment },
            children: ["増加"],
          },
          {
            type: "button",
            props: { onClick: decrement },
            children: ["減少"],
          },
          {
            type: "button",
            props: { onClick: reset },
            children: ["リセット"],
          },
          {
            type: "button",
            props: { onClick: incrementByFive },
            children: ["5増加"],
          },
        ],
      },
    ],
  };
}

/**
 * TODOリストコンポーネント
 * TODOアイテムの追加、切り替え、削除機能を持つコンポーネント
 * 複数の状態を管理する例を示しています
 *
 * @returns {Object} - 仮想DOMの表現
 */
function TodoList() {
  // 状態: TODOリスト
  const [todos, setTodos] = useState([
    { id: 1, text: "買い物に行く", completed: false },
    { id: 2, text: "報告書を書く", completed: true },
  ]);

  // 状態: 新しいTODOの入力値
  const [newTodo, setNewTodo] = useState("");

  /**
   * TODOを追加するイベントハンドラー
   * 空の入力は無視し、新しいTODOをリストに追加
   */
  const addTodo = () => {
    if (newTodo.trim() === "") return;

    setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
    setNewTodo("");
  };

  /**
   * TODOの完了状態を切り替えるイベントハンドラー
   *
   * @param {number} id - 切り替えるTODOのID
   */
  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  /**
   * TODOを削除するイベントハンドラー
   *
   * @param {number} id - 削除するTODOのID
   */
  const removeTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  // 仮想DOMの返却
  return {
    type: "div",
    props: { className: "todo-list" },
    children: [
      {
        type: "h2",
        props: {},
        children: ["TODOリスト"],
      },
      {
        type: "div",
        props: { className: "add-todo" },
        children: [
          {
            type: "input",
            props: {
              type: "text",
              value: newTodo,
              onChange: (e) => setNewTodo(e.target.value),
            },
            children: [],
          },
          {
            type: "button",
            props: { onClick: addTodo },
            children: ["追加"],
          },
        ],
      },
      {
        type: "ul",
        props: {},
        children: todos.map((todo) => ({
          type: "li",
          props: {
            key: todo.id,
            style: { textDecoration: todo.completed ? "line-through" : "none" },
          },
          children: [
            {
              type: "span",
              props: { onClick: () => toggleTodo(todo.id) },
              children: [todo.text],
            },
            {
              type: "button",
              props: { onClick: () => removeTodo(todo.id) },
              children: ["削除"],
            },
          ],
        })),
      },
    ],
  };
}

/**
 * レンダリング関数
 * 実際のReactのレンダリングプロセスを模倣
 * 状態が変更されるたびに呼び出される
 */
function render() {
  console.log("コンポーネントがレンダリングされました");
  // 実際のアプリケーションでは、ここでDOMを更新する
}

// コンポーネントの使用例
console.log("--- Counterコンポーネント ---");
const counterComponent = Counter({ initialCount: 0 });
console.log(JSON.stringify(counterComponent, null, 2));

console.log("\n--- TodoListコンポーネント ---");
const todoListComponent = TodoList();
console.log(JSON.stringify(todoListComponent, null, 2));
