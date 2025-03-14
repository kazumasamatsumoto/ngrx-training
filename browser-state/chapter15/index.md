### 2. グローバル状態管理

アプリケーション全体で共有される状態は、状態管理ライブラリ（Redux、NgRx、Vuex）を使用して管理されます。

```javascript
// Reduxを使用した例
// アクション
const increment = () => ({ type: "INCREMENT" });

// リデューサー
const counterReducer = (state = { count: 0 }, action) => {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, count: state.count + 1 };
    default:
      return state;
  }
};

// ストア
const store = createStore(counterReducer);

// UIとの連携
function render() {
  document.getElementById("counter").textContent = store.getState().count;
}

store.subscribe(render);
document.getElementById("increment").addEventListener("click", () => {
  store.dispatch(increment());
});
```
