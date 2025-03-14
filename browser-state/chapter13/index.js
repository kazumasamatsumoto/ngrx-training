// サブスクライバー（Subscriber）の実装例

// 簡易的なストア実装
function createStore(reducer, initialState) {
  let state = initialState;
  const listeners = [];

  function getState() {
    return state;
  }

  function dispatch(action) {
    state = reducer(state, action);
    listeners.forEach((listener) => listener(state));
    return action;
  }

  function subscribe(listener) {
    listeners.push(listener);

    // 登録解除関数を返す
    return function unsubscribe() {
      const index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    };
  }

  // 初期状態を設定
  dispatch({ type: "@@INIT" });

  return { getState, dispatch, subscribe };
}

// 簡単なリデューサー
function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, count: state.count + 1 };
    case "DECREMENT":
      return { ...state, count: state.count - 1 };
    default:
      return state;
  }
}

// ストアを作成
const store = createStore(counterReducer, { count: 0 });

// サブスクライバー（リスナー）の例

// 1. UIを更新するサブスクライバー
const uiSubscriber = (state) => {
  console.log(`UI更新: カウント = ${state.count}`);
  // 実際のアプリケーションでは、ここでDOM要素を更新する
  // document.getElementById('counter').textContent = state.count;
};

// 2. ログを記録するサブスクライバー
const logSubscriber = (state) => {
  console.log(`ログ: 状態が変更されました - ${JSON.stringify(state)}`);
};

// 3. ローカルストレージに保存するサブスクライバー
const storageSubscriber = (state) => {
  console.log(`ストレージ: 状態を保存します - ${JSON.stringify(state)}`);
  // 実際のアプリケーションでは、ここでローカルストレージに保存する
  // localStorage.setItem('appState', JSON.stringify(state));
};

// 4. 分析データを送信するサブスクライバー
const analyticsSubscriber = (state) => {
  console.log(`分析: イベント送信 - カウント変更 ${state.count}`);
  // 実際のアプリケーションでは、ここで分析サービスにデータを送信する
  // analytics.track('count_changed', { value: state.count });
};

// サブスクライバーを登録
console.log("--- サブスクライバーを登録 ---");
const unsubscribeUI = store.subscribe(uiSubscriber);
const unsubscribeLog = store.subscribe(logSubscriber);
const unsubscribeStorage = store.subscribe(storageSubscriber);
const unsubscribeAnalytics = store.subscribe(analyticsSubscriber);

// アクションをディスパッチ
console.log("\n--- INCREMENT アクション ---");
store.dispatch({ type: "INCREMENT" });

// 一部のサブスクライバーを解除
console.log("\n--- 分析サブスクライバーを解除 ---");
unsubscribeAnalytics();

console.log("\n--- INCREMENT アクション（分析サブスクライバー解除後） ---");
store.dispatch({ type: "INCREMENT" });

// すべてのサブスクライバーを解除
console.log("\n--- すべてのサブスクライバーを解除 ---");
unsubscribeUI();
unsubscribeLog();
unsubscribeStorage();

console.log("\n--- INCREMENT アクション（すべてのサブスクライバー解除後） ---");
store.dispatch({ type: "INCREMENT" });
console.log(`最終状態: カウント = ${store.getState().count}`);
