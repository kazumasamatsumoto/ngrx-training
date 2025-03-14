// Redux風のストア（Store）の実装例

// ストアの簡易実装
function createStore(reducer, initialState) {
  let state = initialState;
  const listeners = [];

  function getState() {
    return state;
  }

  function dispatch(action) {
    console.log(`アクションをディスパッチ: ${action.type}`);

    // リデューサーを使って新しい状態を計算
    const newState = reducer(state, action);

    // 状態が変わった場合のみリスナーに通知
    if (newState !== state) {
      console.log("状態が変更されました");
      state = newState;
      listeners.forEach((listener) => listener(state));
    } else {
      console.log("状態は変更されていません");
    }

    return action;
  }

  function subscribe(listener) {
    console.log("リスナーを登録しました");
    listeners.push(listener);

    // 登録解除関数を返す
    return () => {
      console.log("リスナーを解除しました");
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }

  // 初期状態を設定するためのダミーアクション
  dispatch({ type: "@@INIT" });

  return { getState, dispatch, subscribe };
}

// カウンターアプリケーションのリデューサー
function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, count: state.count + 1 };
    case "DECREMENT":
      return { ...state, count: state.count - 1 };
    case "ADD":
      return { ...state, count: state.count + action.payload };
    case "RESET":
      return { count: 0 };
    default:
      return state;
  }
}

// ストアを作成
const store = createStore(counterReducer, { count: 0 });

// UIを更新するリスナー
function updateUI(state) {
  console.log(`UIを更新: カウント = ${state.count}`);
}

// ログを記録するリスナー
function logState(state) {
  console.log(`ログ: 新しい状態 = ${JSON.stringify(state)}`);
}

// リスナーを登録
const unsubscribeUI = store.subscribe(updateUI);
const unsubscribeLog = store.subscribe(logState);

// アクションをディスパッチ
console.log("\n--- INCREMENT アクション ---");
store.dispatch({ type: "INCREMENT" });

console.log("\n--- INCREMENT アクション ---");
store.dispatch({ type: "INCREMENT" });

console.log("\n--- ADD アクション ---");
store.dispatch({ type: "ADD", payload: 5 });

// UIリスナーを解除
unsubscribeUI();

console.log("\n--- DECREMENT アクション（UIリスナー解除後） ---");
store.dispatch({ type: "DECREMENT" });

// 現在の状態を取得
console.log("\n--- 現在の状態 ---");
console.log(store.getState());

// すべてのリスナーを解除
unsubscribeLog();

console.log("\n--- RESET アクション（すべてのリスナー解除後） ---");
store.dispatch({ type: "RESET" });
