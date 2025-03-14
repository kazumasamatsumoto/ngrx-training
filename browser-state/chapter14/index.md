## 実際のアプリケーションでの応用

このデモアプリケーションで学んだ概念は、実際のアプリケーション開発でどのように応用されるのでしょうか？

### 1. コンポーネントベースの UI

現代のフロントエンドフレームワーク（React、Angular、Vue.js）では、UI をコンポーネントに分割し、各コンポーネントが自身の状態を管理します。

```javascript
// Reactコンポーネントの例
function Counter({ initialCount = 0 }) {
  // コンポーネントの状態
  const [count, setCount] = React.useState(initialCount);

  // イミュータブルな状態更新
  const increment = () => setCount(count + 1);

  return (
    <div>
      <p>Count: {count}</p>
      <button onClick={increment}>Increment</button>
    </div>
  );
}
```
