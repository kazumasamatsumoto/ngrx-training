// Reactコンポーネントの例（実際のReactは使用していません）

// ReactのuseStateフックの簡易的な実装
function useState(initialState) {
  let state = initialState;

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

// Reactのコンポーネントを模倣
function Counter({ initialCount = 0 }) {
  // コンポーネントの状態
  const [count, setCount] = useState(initialCount);

  // イベントハンドラー
  const increment = () => setCount(count + 1);
  const decrement = () => setCount(count - 1);
  const reset = () => setCount(initialCount);
  const incrementByFive = () => setCount((prevCount) => prevCount + 5);

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

// TodoListコンポーネント
function TodoList() {
  // 状態: TODOリスト
  const [todos, setTodos] = useState([
    { id: 1, text: "買い物に行く", completed: false },
    { id: 2, text: "報告書を書く", completed: true },
  ]);

  // 状態: 新しいTODOの入力値
  const [newTodo, setNewTodo] = useState("");

  // TODOを追加
  const addTodo = () => {
    if (newTodo.trim() === "") return;

    setTodos([...todos, { id: Date.now(), text: newTodo, completed: false }]);
    setNewTodo("");
  };

  // TODOの完了状態を切り替え
  const toggleTodo = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  // TODOを削除
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

// レンダリング関数（実際のReactのレンダリングを模倣）
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
