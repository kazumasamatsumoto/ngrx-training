/**
 * Chapter 11: リデューサー（Reducer）
 *
 * このファイルでは、ReduxやNgRxの中核となるリデューサーの実装を示しています。
 * リデューサーは、現在の状態とアクションを受け取り、新しい状態を返す純粋関数です。
 *
 * リデューサーの特徴:
 * 1. 純粋関数: 同じ入力に対して常に同じ出力を返し、副作用がない
 * 2. イミュータブル: 状態を直接変更せず、新しい状態オブジェクトを返す
 * 3. 予測可能: アクションタイプに基づいて状態を更新する明確なロジック
 * 4. 合成可能: 複雑な状態ツリーを管理するために、小さなリデューサーに分割可能
 *
 * なぜリデューサーが重要なのか？
 *
 * 【予測可能性と信頼性】
 * リデューサーは純粋関数として実装されるため、同じ入力（状態とアクション）に対して
 * 常に同じ出力（新しい状態）を返します。これにより、アプリケーションの動作が
 * 予測可能になり、バグの発生を減らすことができます。
 *
 * 副作用（APIコール、タイマー、ランダム値の生成など）がリデューサー内に存在しないため、
 * テストが容易になり、アプリケーションの信頼性が向上します。
 *
 * 【デバッグの容易さ】
 * リデューサーは、アクションと前の状態から新しい状態への変換を明示的に行います。
 * これにより、状態の変化を追跡しやすくなり、「なぜこの状態になったのか」を
 * 理解しやすくなります。
 *
 * また、すべての状態変更が一箇所（リデューサー）で行われるため、デバッグツールで
 * 状態の変化を時系列で追跡することが容易になります。これは「時間旅行デバッギング」
 * と呼ばれる強力なデバッグ手法を可能にします。
 *
 * 【スケーラビリティ】
 * リデューサーは「合成可能」という特性を持っています。つまり、大きな状態ツリーを
 * 管理するために、小さなリデューサーに分割し、それらを組み合わせることができます。
 *
 * これにより、アプリケーションが成長しても状態管理の複雑さを制御できます。
 * 各リデューサーは状態の特定の部分だけを担当するため、コードの理解と保守が容易になります。
 *
 * 【テスト容易性】
 * リデューサーは入力と出力が明確な純粋関数であるため、テストが非常に簡単です。
 * モックやスタブが不要で、単純に入力（状態とアクション）を与えて、
 * 期待される出力（新しい状態）をアサートするだけでテストできます。
 */

// 初期状態
// アプリケーションの初期状態を定義
const initialState = {
  count: 0, // カウンター値
  user: null, // ログインユーザー情報
  todos: [], // TODOリスト
  settings: {
    // アプリケーション設定
    theme: "light", // テーマ（light/dark）
    notifications: true, // 通知設定
  },
  loading: false, // データ読み込み中フラグ
  error: null, // エラー情報
};

// メインリデューサー
// すべてのアクションを処理する単一のリデューサー
function rootReducer(state = initialState, action) {
  switch (action.type) {
    // カウンター関連のアクション
    case "INCREMENT":
      // カウントを1増やす
      return { ...state, count: state.count + 1 };
    case "DECREMENT":
      // カウントを1減らす
      return { ...state, count: state.count - 1 };
    case "ADD_NUMBER":
      // カウントを指定した値だけ増やす
      return { ...state, count: state.count + action.payload };
    case "RESET_COUNT":
      // カウントを0にリセット
      return { ...state, count: 0 };

    // ユーザー関連のアクション
    case "SET_USER":
      // ユーザー情報を設定
      return { ...state, user: action.payload };
    case "CLEAR_USER":
      // ユーザー情報をクリア
      return { ...state, user: null };

    // TODO関連のアクション
    case "ADD_TODO":
      // 新しいTODOを追加
      return {
        ...state,
        todos: [
          ...state.todos,
          { id: Date.now(), text: action.payload, completed: false },
        ],
      };
    case "TOGGLE_TODO":
      // 指定したTODOの完了状態を切り替え
      return {
        ...state,
        todos: state.todos.map((todo) =>
          todo.id === action.payload
            ? { ...todo, completed: !todo.completed }
            : todo
        ),
      };
    case "REMOVE_TODO":
      // 指定したTODOを削除
      return {
        ...state,
        todos: state.todos.filter((todo) => todo.id !== action.payload),
      };

    // 設定関連のアクション
    case "CHANGE_THEME":
      // テーマを変更
      return {
        ...state,
        settings: { ...state.settings, theme: action.payload },
      };
    case "TOGGLE_NOTIFICATIONS":
      // 通知設定を切り替え
      return {
        ...state,
        settings: {
          ...state.settings,
          notifications: !state.settings.notifications,
        },
      };

    // API関連のアクション
    case "FETCH_DATA_START":
      // データ取得開始
      return { ...state, loading: true, error: null };
    case "FETCH_DATA_SUCCESS":
      // データ取得成功
      return { ...state, loading: false, [action.dataKey]: action.payload };
    case "FETCH_DATA_ERROR":
      // データ取得エラー
      return { ...state, loading: false, error: action.payload };

    // デフォルト
    default:
      // 未知のアクションタイプの場合は状態を変更しない
      return state;
  }
}

// 使用例
// リデューサーを使って状態を更新する例
console.log("初期状態:");
let state = rootReducer(undefined, { type: "@@INIT" }); // 初期状態を取得
console.log(state);

console.log("\nカウンターを増加:");
state = rootReducer(state, { type: "INCREMENT" }); // カウントを1増やす
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

/**
 * リデューサーの重要なポイント:
 *
 * 1. スイッチ文: 一般的にリデューサーはswitch文を使ってアクションタイプごとに処理を分岐
 * 2. イミュータビリティ: スプレッド構文（...）を使って、状態を直接変更せず新しいオブジェクトを作成
 * 3. 構造共有: 変更されない部分のオブジェクトは再利用される
 * 4. 単一責任: 実際のアプリケーションでは、状態の各部分を担当する小さなリデューサーに分割することが一般的
 *
 * 実際のReduxやNgRxでは、combineReducersやcreateReducerなどの関数を使用して、
 * 複数のリデューサーを組み合わせることができます。これにより、大規模なアプリケーションでも
 * 状態管理を整理しやすくなります。
 */
