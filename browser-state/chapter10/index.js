/**
 * Chapter 10: ストア（Store）の実装
 *
 * このファイルでは、ReduxやNgRxの中核となるストア（Store）の簡易的な実装を示しています。
 * ストアは、アプリケーションの状態を保持し、状態の更新と通知を管理する中央リポジトリです。
 *
 * ストアの主な責務:
 * 1. 状態の保持: アプリケーションの状態を単一のオブジェクトとして保持
 * 2. 状態の更新: リデューサー関数を使用して状態を更新
 * 3. 変更通知: 状態が変更されたときにリスナーに通知
 * 4. 状態の取得: 現在の状態を取得するためのインターフェースを提供
 */

// Redux風のストア（Store）の実装例

// ストアの簡易実装
// Redux風のストアを作成する関数
function createStore(reducer, initialState) {
  let state = initialState; // 現在の状態
  const listeners = []; // 状態変更時に通知するリスナーのリスト

  // 現在の状態を取得する関数
  function getState() {
    return state;
  }

  // アクションをディスパッチして状態を更新する関数
  function dispatch(action) {
    console.log(`アクションをディスパッチ: ${action.type}`);

    // リデューサーを使って新しい状態を計算
    const newState = reducer(state, action);

    // 状態が変わった場合のみリスナーに通知（参照の比較）
    if (newState !== state) {
      console.log("状態が変更されました");
      state = newState; // 状態を更新
      listeners.forEach((listener) => listener(state)); // すべてのリスナーに通知
    } else {
      console.log("状態は変更されていません");
    }

    return action; // ディスパッチされたアクションを返す（ミドルウェア対応のため）
  }

  // 状態変更時に呼び出されるリスナーを登録する関数
  function subscribe(listener) {
    console.log("リスナーを登録しました");
    listeners.push(listener);

    // 登録解除関数を返す（クリーンアップのため）
    return () => {
      console.log("リスナーを解除しました");
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }

  // 初期状態を設定するためのダミーアクション
  // これにより、ストア作成時に初期状態が設定される
  dispatch({ type: "@@INIT" });

  // ストアのパブリックAPI
  return { getState, dispatch, subscribe };
}

// カウンターアプリケーションのリデューサー
// 状態とアクションを受け取り、新しい状態を返す純粋関数
function counterReducer(state = { count: 0 }, action) {
  switch (action.type) {
    case "INCREMENT":
      // カウントを1増やす
      return { ...state, count: state.count + 1 };
    case "DECREMENT":
      // カウントを1減らす
      return { ...state, count: state.count - 1 };
    case "ADD":
      // カウントを指定した値だけ増やす
      return { ...state, count: state.count + action.payload };
    case "RESET":
      // カウントを0にリセット
      return { count: 0 };
    default:
      // 未知のアクションタイプの場合は状態を変更しない
      return state;
  }
}

// ストアを作成
const store = createStore(counterReducer, { count: 0 });

// UIを更新するリスナー
// 状態が変更されるたびに呼び出され、UIを更新する
function updateUI(state) {
  console.log(`UIを更新: カウント = ${state.count}`);
  // 実際のアプリケーションでは、ここでDOMを更新するなどの処理を行う
}

// ログを記録するリスナー
// 状態が変更されるたびに呼び出され、ログを記録する
function logState(state) {
  console.log(`ログ: 新しい状態 = ${JSON.stringify(state)}`);
  // 実際のアプリケーションでは、ここでログサーバーに送信するなどの処理を行う
}

// リスナーを登録
const unsubscribeUI = store.subscribe(updateUI);
const unsubscribeLog = store.subscribe(logState);

// アクションをディスパッチして状態を更新
console.log("\n--- INCREMENT アクション ---");
store.dispatch({ type: "INCREMENT" }); // カウントを1増やす

console.log("\n--- INCREMENT アクション ---");
store.dispatch({ type: "INCREMENT" }); // カウントをさらに1増やす

console.log("\n--- ADD アクション ---");
store.dispatch({ type: "ADD", payload: 5 }); // カウントを5増やす

// UIリスナーを解除（UIの更新を停止）
unsubscribeUI();

console.log("\n--- DECREMENT アクション（UIリスナー解除後） ---");
store.dispatch({ type: "DECREMENT" }); // カウントを1減らす（UIは更新されない）

// 現在の状態を取得
console.log("\n--- 現在の状態 ---");
console.log(store.getState());

// すべてのリスナーを解除
unsubscribeLog();

console.log("\n--- RESET アクション（すべてのリスナー解除後） ---");
store.dispatch({ type: "RESET" }); // カウントを0にリセット（リスナーは呼び出されない）

/**
 * ストアの重要なポイント:
 *
 * 1. 単一の状態ツリー: アプリケーションの状態は単一のオブジェクトとして保持される
 * 2. 読み取り専用の状態: 状態は直接変更できず、アクションをディスパッチすることでのみ変更可能
 * 3. 純粋なリデューサー: 状態の更新は、前の状態とアクションを受け取り、新しい状態を返す純粋関数で行われる
 * 4. 単方向データフロー: アクション → リデューサー → 状態更新 → リスナー通知 という一方向のデータフロー
 *
 * これらの原則により、状態の変更が予測可能になり、デバッグやテストが容易になります。
 * ReduxやNgRxでは、この基本的な仕組みに加えて、ミドルウェア、エンハンサー、メタリデューサーなどの
 * 拡張機能が提供されています。
 */
