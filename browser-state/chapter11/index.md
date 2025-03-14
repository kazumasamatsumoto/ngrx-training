### 2. リデューサー（Reducer）

現在の状態とアクションから新しい状態を計算する純粋関数です。

```javascript
// リデューサーの例
function reducer(state = { count: 0 }, action) {
  switch (action.type) {
    case "INCREMENT":
      return { ...state, count: state.count + 1 };
    case "ADD_PROPERTY":
      return { ...state, [action.payload.key]: action.payload.value };
    case "RESET":
      return { count: 0 };
    default:
      return state;
  }
}
```
