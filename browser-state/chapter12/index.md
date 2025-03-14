### 3. アクション（Action）

状態変更の意図を表すオブジェクトです。通常、`type`プロパティと任意のデータを持ちます。

```javascript
// アクションの例
const incrementAction = { type: "INCREMENT" };
const addPropertyAction = {
  type: "ADD_PROPERTY",
  payload: { key: "lastUpdated", value: Date.now() },
};
```
