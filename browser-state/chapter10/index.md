## 状態管理ライブラリの内部実装

このデモアプリケーションの状態管理ライブラリは、Redux 風の実装になっています。以下に主要なコンポーネントの詳細を説明します：

### 1. ストア（Store）

状態を保持し、アクションのディスパッチを処理する中心的なオブジェクトです。

```javascript
// ストアの簡易実装
function createStore(reducer, initialState) {
  let state = initialState;
  const listeners = [];

  function getState() {
    return state;
  }

  function dispatch(action) {
    // リデューサーを使って新しい状態を計算
    const newState = reducer(state, action);

    // 状態が変わった場合のみリスナーに通知
    if (newState !== state) {
      state = newState;
      listeners.forEach((listener) => listener(state));
    }

    return action;
  }

  function subscribe(listener) {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      listeners.splice(index, 1);
    };
  }

  // 初期状態を設定するためのダミーアクション
  dispatch({ type: "@@INIT" });

  return { getState, dispatch, subscribe };
}
```
