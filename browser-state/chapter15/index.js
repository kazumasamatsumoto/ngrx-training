/**
 * 第15章: Reduxパターンによる状態管理
 *
 * このファイルでは、Reduxライブラリを模倣した状態管理パターンを実装しています。
 * Reduxは予測可能な状態コンテナであり、アプリケーション全体の状態を単一のストアで管理します。
 *
 * Reduxの主要な概念:
 * 1. ストア (Store) - アプリケーションの状態を保持する単一のオブジェクト
 * 2. アクション (Action) - 状態変更を記述するプレーンなオブジェクト
 * 3. リデューサー (Reducer) - 現在の状態とアクションから新しい状態を計算する純粋関数
 * 4. ディスパッチ (Dispatch) - アクションをストアに送信する関数
 * 5. サブスクライブ (Subscribe) - 状態変更を監視する仕組み
 *
 * Reduxの3原則:
 * - 単一の信頼できる情報源 (Single source of truth) - アプリケーションの状態は単一のストアに格納
 * - 状態は読み取り専用 (State is read-only) - 状態を変更する唯一の方法はアクションをディスパッチすること
 * - 変更は純粋関数で行う (Changes are made with pure functions) - リデューサーは純粋関数であること
 *
 * このファイルでは、Reduxの基本的な実装と、React-Reduxの`connect`関数の簡易版も示しています。
 *
 * なぜReduxパターンが重要なのか？
 *
 * 【複雑な状態管理の簡素化】
 * 大規模なアプリケーションでは、状態管理が非常に複雑になります。多くのコンポーネントが
 * 同じ状態にアクセスし、更新する必要がある場合、コンポーネントベースの状態管理だけでは
 * 対応が難しくなります。Reduxは、アプリケーション全体の状態を単一のストアで管理することで、
 * この複雑さを軽減します。
 *
 * 【予測可能性と一貫性】
 * Reduxの厳格なデータフローと純粋関数によるリデューサーは、状態変更を予測可能で
 * 一貫性のあるものにします。これにより、バグの発生を減らし、デバッグを容易にします。
 * 特に、「いつ、どのように、なぜ状態が変更されたのか」を追跡しやすくなります。
 *
 * 【時間旅行デバッギング】
 * Reduxの不変性と明示的なアクションにより、状態の変更履歴を記録できます。
 * これにより、アプリケーションの状態を過去の任意の時点に戻す「時間旅行デバッギング」が
 * 可能になります。これは複雑なバグを特定する際に非常に強力なツールです。
 *
 * 【ミドルウェアによる拡張性】
 * Reduxのミドルウェア機能により、非同期処理、ログ記録、クラッシュレポートなどの
 * 機能を簡単に追加できます。これにより、アプリケーションの機能を段階的に拡張しながらも、
 * コアのデータフローを単純に保つことができます。
 *
 * 【テスト容易性】
 * Reduxのアーキテクチャは、テストを書きやすくします。リデューサーは純粋関数なので、
 * 入力と出力をテストするだけで済みます。また、アクションクリエイターやミドルウェアも
 * 独立してテストできます。
 *
 * 【開発ツールとエコシステム】
 * Reduxには豊富な開発ツールとエコシステムがあります。Redux DevToolsを使用すると、
 * 状態の変化をリアルタイムで監視し、デバッグできます。また、多くのミドルウェアや
 * ユーティリティライブラリが利用可能で、開発効率を向上させます。
 */

// Reduxを使用した例（実際のReduxは使用していません）

/**
 * Reduxストアを作成する関数
 * ストアはアプリケーションの状態を保持し、状態の更新と購読の仕組みを提供します
 *
 * @param {Function} reducer - 状態とアクションから新しい状態を計算する関数
 * @param {Object} initialState - ストアの初期状態
 * @returns {Object} - getState, dispatch, subscribeメソッドを持つストアオブジェクト
 */
function createStore(reducer, initialState) {
  let state = initialState;
  const listeners = [];

  /**
   * 現在の状態を取得する関数
   * @returns {Object} - 現在の状態
   */
  function getState() {
    return state;
  }

  /**
   * アクションをディスパッチして状態を更新する関数
   * リデューサーを呼び出して新しい状態を計算し、すべてのリスナーに通知します
   *
   * @param {Object} action - タイプとオプションのペイロードを持つアクションオブジェクト
   * @returns {Object} - ディスパッチされたアクション
   */
  function dispatch(action) {
    state = reducer(state, action);
    listeners.forEach((listener) => listener(state));
    return action;
  }

  /**
   * 状態変更を購読する関数
   * 状態が変更されるたびに呼び出されるリスナー関数を登録します
   *
   * @param {Function} listener - 状態変更時に呼び出される関数
   * @returns {Function} - 購読を解除するための関数
   */
  function subscribe(listener) {
    listeners.push(listener);
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

// アクションタイプ - アクションを識別するための定数
const INCREMENT = "INCREMENT";
const DECREMENT = "DECREMENT";
const ADD = "ADD";
const RESET = "RESET";

/**
 * アクションクリエイター - アクションオブジェクトを作成する関数
 * アクションの作成を抽象化し、再利用性を高めます
 */
const increment = () => ({ type: INCREMENT });
const decrement = () => ({ type: DECREMENT });
const add = (amount) => ({ type: ADD, payload: amount });
const reset = () => ({ type: RESET });

/**
 * カウンターリデューサー - 状態とアクションから新しい状態を計算する純粋関数
 *
 * @param {Object} state - 現在の状態、デフォルト値は { count: 0 }
 * @param {Object} action - ディスパッチされたアクション
 * @returns {Object} - 新しい状態
 */
const counterReducer = (state = { count: 0 }, action) => {
  switch (action.type) {
    case INCREMENT:
      return { ...state, count: state.count + 1 };
    case DECREMENT:
      return { ...state, count: state.count - 1 };
    case ADD:
      return { ...state, count: state.count + action.payload };
    case RESET:
      return { count: 0 };
    default:
      return state;
  }
};

// ストアを作成 - アプリケーションの状態を保持するオブジェクト
const store = createStore(counterReducer, { count: 0 });

/**
 * UIを更新する関数 - ストアの状態変更に応じてUIを更新
 * 実際のアプリケーションではDOMを直接操作するか、
 * Reactなどのライブラリを使用してUIを更新します
 */
function render() {
  const state = store.getState();
  console.log(`UIを更新: カウント = ${state.count}`);

  // 実際のアプリケーションでは、ここでDOM要素を更新する
  // document.getElementById('counter').textContent = state.count;
}

// ストアをサブスクライブ - 状態変更時にrender関数を呼び出す
store.subscribe(render);

// 初期レンダリング
render();

/**
 * イベントハンドラー - ユーザー操作に応じてアクションをディスパッチ
 * 実際のアプリケーションではボタンのクリックイベントなどに紐づけます
 */
function handleIncrement() {
  store.dispatch(increment());
}

function handleDecrement() {
  store.dispatch(decrement());
}

function handleAdd(amount) {
  store.dispatch(add(amount));
}

function handleReset() {
  store.dispatch(reset());
}

// ボタンクリックをシミュレート
console.log("\n--- ボタンクリックをシミュレート ---");
console.log("増加ボタンをクリック");
handleIncrement();

console.log("\n増加ボタンをクリック");
handleIncrement();

console.log("\n5追加ボタンをクリック");
handleAdd(5);

console.log("\n減少ボタンをクリック");
handleDecrement();

console.log("\nリセットボタンをクリック");
handleReset();

/**
 * React-Reduxの connect 関数の簡易版
 * コンポーネントをReduxストアに接続するための高階関数
 *
 * @param {Function} mapStateToProps - ストアの状態をコンポーネントのプロパティにマッピングする関数
 * @param {Function} mapDispatchToProps - ディスパッチ関数をコンポーネントのプロパティにマッピングする関数
 * @returns {Function} - コンポーネントをラップする関数
 */
function connect(mapStateToProps, mapDispatchToProps) {
  return function (Component) {
    return function (ownProps) {
      // ストアから状態を取得
      const state = store.getState();

      // 状態をプロパティにマッピング
      const stateProps = mapStateToProps(state);

      // ディスパッチ関数をプロパティにマッピング
      const dispatchProps = mapDispatchToProps(store.dispatch);

      // コンポーネントにプロパティを渡す
      return Component({
        ...ownProps,
        ...stateProps,
        ...dispatchProps,
      });
    };
  };
}

/**
 * Counterコンポーネント - 仮想DOMを返す関数コンポーネント
 * 実際のReactではJSXを使用します
 *
 * @param {Object} props - コンポーネントのプロパティ
 * @returns {Object} - 仮想DOMの表現
 */
function Counter(props) {
  return {
    type: "div",
    props: { className: "counter" },
    children: [
      {
        type: "h2",
        props: {},
        children: [`カウント: ${props.count}`],
      },
      {
        type: "div",
        props: { className: "buttons" },
        children: [
          {
            type: "button",
            props: { onClick: props.increment },
            children: ["増加"],
          },
          {
            type: "button",
            props: { onClick: props.decrement },
            children: ["減少"],
          },
          {
            type: "button",
            props: { onClick: props.reset },
            children: ["リセット"],
          },
        ],
      },
    ],
  };
}

/**
 * 状態をプロパティにマッピングする関数
 * ストアの状態からコンポーネントに必要なプロパティを抽出します
 *
 * @param {Object} state - ストアの状態
 * @returns {Object} - コンポーネントに渡すプロパティ
 */
const mapStateToProps = (state) => ({
  count: state.count,
});

/**
 * ディスパッチ関数をプロパティにマッピングする関数
 * アクションをディスパッチする関数をコンポーネントのプロパティとして提供します
 *
 * @param {Function} dispatch - ストアのディスパッチ関数
 * @returns {Object} - コンポーネントに渡すアクションディスパッチャー
 */
const mapDispatchToProps = (dispatch) => ({
  increment: () => dispatch(increment()),
  decrement: () => dispatch(decrement()),
  reset: () => dispatch(reset()),
});

// Counterコンポーネントをストアに接続
const ConnectedCounter = connect(mapStateToProps, mapDispatchToProps)(Counter);

// 接続されたコンポーネントをレンダリング
console.log("\n--- 接続されたコンポーネント ---");
const counterElement = ConnectedCounter({});
console.log(JSON.stringify(counterElement, null, 2));
