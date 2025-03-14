// アクション（Action）の実装例

// 基本的なアクション
const incrementAction = { type: "INCREMENT" };
const decrementAction = { type: "DECREMENT" };
const resetAction = { type: "RESET" };

// ペイロードを持つアクション
const addNumberAction = {
  type: "ADD_NUMBER",
  payload: 5,
};

const setUserAction = {
  type: "SET_USER",
  payload: {
    id: 1,
    name: "山田太郎",
    email: "yamada@example.com",
  },
};

// メタデータを持つアクション
const fetchDataAction = {
  type: "FETCH_DATA",
  payload: { users: [{ id: 1, name: "山田" }] },
  meta: {
    timestamp: Date.now(),
    source: "API",
    requestId: "abc123",
  },
};

// エラーアクション
const errorAction = {
  type: "API_ERROR",
  error: true,
  payload: new Error("ネットワークエラーが発生しました"),
};

// アクションクリエイター（関数）
function addTodo(text) {
  return {
    type: "ADD_TODO",
    payload: {
      id: Date.now(),
      text,
      completed: false,
    },
  };
}

function toggleTodo(id) {
  return {
    type: "TOGGLE_TODO",
    payload: id,
  };
}

function removeTodo(id) {
  return {
    type: "REMOVE_TODO",
    payload: id,
  };
}

// 非同期アクションクリエイター（Redux Thunkスタイル）
function fetchUsers() {
  // 実際のアプリケーションではdispatchが引数として渡される
  return function (dispatch) {
    // 開始アクションをディスパッチ
    dispatch({ type: "FETCH_USERS_START" });

    // APIリクエスト（ここではシミュレーション）
    setTimeout(() => {
      try {
        // 成功時
        const users = [
          { id: 1, name: "田中" },
          { id: 2, name: "鈴木" },
        ];
        dispatch({
          type: "FETCH_USERS_SUCCESS",
          payload: users,
        });
      } catch (error) {
        // エラー時
        dispatch({
          type: "FETCH_USERS_ERROR",
          error: true,
          payload: error,
        });
      }
    }, 1000);
  };
}

// アクションの使用例（実際のReduxストアがあれば）
console.log("基本的なアクション:");
console.log(incrementAction);
console.log(decrementAction);
console.log(resetAction);

console.log("\nペイロードを持つアクション:");
console.log(addNumberAction);
console.log(setUserAction);

console.log("\nメタデータを持つアクション:");
console.log(fetchDataAction);

console.log("\nエラーアクション:");
console.log(errorAction);

console.log("\nアクションクリエイターで生成したアクション:");
console.log(addTodo("買い物に行く"));
console.log(toggleTodo(123));
console.log(removeTodo(456));

console.log("\n非同期アクションクリエイター:");
console.log(fetchUsers.toString());
console.log("※実際の実行には Redux Thunk ミドルウェアが必要です");
