/**
 * Chapter 13: サブスクライバー（Subscriber）
 *
 * このファイルでは、ReduxやNgRxにおけるサブスクライバー（リスナー）の実装と使用方法を示しています。
 * サブスクライバーは、状態が変更されたときに通知を受け取り、それに応じた処理を行う関数です。
 *
 * サブスクライバーの主な用途:
 * 1. UIの更新: 状態変更に応じてUIを更新
 * 2. ログ記録: 状態変更をログに記録
 * 3. 永続化: 状態をローカルストレージなどに保存
 * 4. 分析: 状態変更を分析サービスに送信
 *
 * これにより、状態の変更を様々な方法で処理することができます。
 */

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

/**
 * サブスクライバーの重要なポイント:
 *
 * 1. 単一責任: 各サブスクライバーは特定の責任を持ち、それに集中するべき
 * 2. 登録解除: メモリリークを防ぐため、不要になったサブスクライバーは解除する
 * 3. パフォーマンス: サブスクライバー内の処理は軽量に保ち、重い処理は避ける
 * 4. 副作用: サブスクライバーは通常、副作用（UIの更新、データの保存など）を扱う場所
 *
 * ReduxやNgRxでは、サブスクライバーはコンポーネントやサービスで実装され、
 * ストアの状態変更を監視して適切な処理を行います。
 *
 * Reactでは、useSelector、connect、NgRxでは、Storeサービスのselect、
 * Angularでは、AsyncPipeなどを使用してサブスクライブします。
 */
