### 3. リアクティブプログラミング

状態の変更を自動的に検知し、関連する UI を更新するリアクティブなアプローチも広く使用されています。

```javascript
// RxJSを使用した例
const count$ = new BehaviorSubject(0);

// 状態の更新
function increment() {
  count$.next(count$.value + 1);
}

// UIとの連携
count$.subscribe((count) => {
  document.getElementById("counter").textContent = count;
});

document.getElementById("increment").addEventListener("click", increment);
```
