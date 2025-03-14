/**
 * Chapter 12: アクション（Action）
 *
 * このファイルでは、ReduxやNgRxで使用されるアクションの実装を示しています。
 * アクションは、状態の変更を表すプレーンなJavaScriptオブジェクトです。
 *
 * アクションの特徴:
 * 1. type プロパティ: アクションの種類を識別する文字列
 * 2. payload: アクションに関連するデータ（オプション）
 * 3. meta: アクションに関するメタデータ（オプション）
 * 4. error: エラーを表すフラグ（オプション）
 *
 * アクションは「何が起きたか」を表現するだけで、「どのように状態を変更するか」は
 * リデューサーの責務です。
 */

// 基本的なアクション
// 最もシンプルなアクションは、typeプロパティだけを持つオブジェクト
const incrementAction = { type: "INCREMENT" }; // カウントを増やす
const decrementAction = { type: "DECREMENT" }; // カウントを減らす
const resetAction = { type: "RESET" }; // カウントをリセット

// ペイロードを持つアクション
// 追加のデータを含むアクション
const addNumberAction = {
  type: "ADD_NUMBER", // アクションタイプ
  payload: 5, // 追加する数値（ペイロード）
};

const setUserAction = {
  type: "SET_USER", // アクションタイプ
  payload: {
    id: 1,
    name: "山田太郎",
    email: "yamada@example.com",
  }, // ユーザー情報（ペイロード）
};

// メタデータを持つアクション
// アクション自体に関する情報を含むアクション
const fetchDataAction = {
  type: "FETCH_DATA", // アクションタイプ
  payload: { users: [{ id: 1, name: "山田" }] }, // 取得したデータ（ペイロード）
  meta: {
    timestamp: Date.now(), // アクションが作成された時刻
    source: "API", // データの出所
    requestId: "abc123", // リクエストの識別子
  }, // メタデータ
};

// エラーアクション
// エラーを表すアクション
const errorAction = {
  type: "API_ERROR", // アクションタイプ
  error: true, // これがエラーアクションであることを示すフラグ
  payload: new Error("ネットワークエラーが発生しました"), // エラーオブジェクト（ペイロード）
};

// アクションクリエイター（関数）
// アクションオブジェクトを作成する関数
// これにより、アクションの作成を抽象化し、再利用可能にする
function addTodo(text) {
  return {
    type: "ADD_TODO",
    payload: {
      id: Date.now(), // 一意のID（現在のタイムスタンプ）
      text, // TODOのテキスト
      completed: false, // 初期状態は未完了
    },
  };
}

function toggleTodo(id) {
  return {
    type: "TOGGLE_TODO",
    payload: id, // 切り替えるTODOのID
  };
}

function removeTodo(id) {
  return {
    type: "REMOVE_TODO",
    payload: id, // 削除するTODOのID
  };
}

// 非同期アクションクリエイター（Redux Thunkスタイル）
// 非同期処理を含むアクションクリエイター
// Redux Thunkミドルウェアを使用すると、関数を返すアクションクリエイターを作成できる
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

/**
 * アクションの重要なポイント:
 *
 * 1. シリアライズ可能: アクションは通常、シリアライズ可能なオブジェクトであるべき
 *    （関数やシンボルなどを含まない）
 * 2. 命名規則: アクションタイプには通常、大文字とアンダースコアを使用する
 *    （例: ADD_TODO, FETCH_USERS_SUCCESS）
 * 3. アクションクリエイター: 実際のアプリケーションでは、アクションオブジェクトを
 *    直接作成するのではなく、アクションクリエイター関数を使用することが一般的
 * 4. 非同期アクション: 非同期処理を扱うには、Redux ThunkやRedux Saga、NgRx Effectsなどの
 *    ミドルウェアやエフェクトを使用する
 *
 * ReduxやNgRxでは、アクションはイベントとして扱われ、「何が起きたか」を表現します。
 * これにより、状態の変更が予測可能になり、デバッグやテストが容易になります。
 */
