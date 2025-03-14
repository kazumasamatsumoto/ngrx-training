### 4. サブスクライバー（Subscriber）

状態変更を監視し、UI を更新するリスナー関数です。

```javascript
// サブスクライバーの例
store.subscribe((state) => {
  document.getElementById("counter").textContent = state.count;
});
```
