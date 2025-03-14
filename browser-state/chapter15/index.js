// Reduxを使用した例（実際のReduxは使用していません）

// 簡易的なRedux実装
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

// アクションタイプ
const INCREMENT = "INCREMENT";
const DECREMENT = "DECREMENT";
const ADD = "ADD";
const RESET = "RESET";

// アクションクリエイター
const increment = () => ({ type: INCREMENT });
const decrement = () => ({ type: DECREMENT });
const add = (amount) => ({ type: ADD, payload: amount });
const reset = () => ({ type: RESET });

// リデューサー
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

// ストアを作成
const store = createStore(counterReducer, { count: 0 });

// UIを更新する関数
function render() {
  const state = store.getState();
  console.log(`UIを更新: カウント = ${state.count}`);

  // 実際のアプリケーションでは、ここでDOM要素を更新する
  // document.getElementById('counter').textContent = state.count;
}

// ストアをサブスクライブ
store.subscribe(render);

// 初期レンダリング
render();

// イベントハンドラー
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

// React-Reduxの connect 関数の簡易版
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

// Counterコンポーネント
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

// 状態をプロパティにマッピング
const mapStateToProps = (state) => ({
  count: state.count,
});

// ディスパッチ関数をプロパティにマッピング
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
