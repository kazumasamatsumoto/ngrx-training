// リデューサー（Reducer）の実装例

// 初期状態
const initialState = {
  count: 0,
  user: null,
  todos: [],
  settings: {
    theme: "light",
    notifications: true,
  },
  loading: false,
  error: null,
};

// メインリデューサー
function rootReducer(state = initialState, action) {
  switch (action.type) {
    // カウンター関連
    case "INCREMENT":
      return { ...state, count: state.count + 1 };
    case "DECREMENT":
      return { ...state, count: state.count - 1 };
    case "ADD_NUMBER":
      return { ...state, count: state.count + action.payload };
    case "RESET_COUNT":
      return { ...state, count: 0 };

    // ユーザー関連
    case "SET_USER":
      return { ...state, user: action.payload };
    case "CLEAR_USER":
      return { ...state, user: null };

    // TODO関連
    case "ADD_TODO":
      return {
        ...state,
        todos: [
          ...state.todos,
          { id: Date.now(), text: action.payload, completed: false },
        ],
      };
    case "TOGGLE_TODO":
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };
    case "REMOVE_TODO":
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };

    // 設定関連
    case "CHANGE_THEME":
      return {
        ...state,
        settings: { ...state.settings, theme: action.payload },
      };
    case "TOGGLE_NOTIFICATIONS":
      return {
        ...state,
        settings: {
          ...state.settings,
          notifications: !state.settings.notifications,
        },
      };

    // API関連
    case "FETCH_DATA_START":
      return { ...state, loading: true, error: null };
    case "FETCH_DATA_SUCCESS":
      return { ...state, loading: false, [action.dataKey]: action.payload };
    case "FETCH_DATA_ERROR":
      return { ...state, loading: false, error: action.payload };

    // デフォルト
    default:
      return state;
  }
}

// 使用例
console.log("初期状態:");
let state = rootReducer(undefined, { type: "@@INIT" });
console.log(state);

console.log("\nカウンターを増加:");
state = rootReducer(state, { type: "INCREMENT" });
console.log(state);

console.log("\nユーザーを設定:");
state = rootReducer(state, {
  type: "SET_USER",
  payload: { id: 1, name: "山田太郎", email: "yamada@example.com" },
});
console.log(state);

console.log("\nTODOを追加:");
state = rootReducer(state, { type: "ADD_TODO", payload: "買い物に行く" });
state = rootReducer(state, { type: "ADD_TODO", payload: "報告書を書く" });
console.log(state);

console.log("\n最初のTODOを完了済みに変更:");
state = rootReducer(state, { type: "TOGGLE_TODO", payload: state.todos[0].id });
console.log(state);

console.log("\nテーマを変更:");
state = rootReducer(state, { type: "CHANGE_THEME", payload: "dark" });
console.log(state);

console.log("\nデータ取得開始:");
state = rootReducer(state, { type: "FETCH_DATA_START" });
console.log(state);

console.log("\nデータ取得成功:");
state = rootReducer(state, {
  type: "FETCH_DATA_SUCCESS",
  dataKey: "products",
  payload: [
    { id: 1, name: "商品A", price: 1000 },
    { id: 2, name: "商品B", price: 2000 },
  ],
});
console.log(state);
