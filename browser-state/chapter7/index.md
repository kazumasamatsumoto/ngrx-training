## メモ化（Memoization）

メモ化は、同じ入力に対して同じ出力を返す関数の結果をキャッシュする最適化技術です。計算コストの高い処理を何度も実行することを避け、パフォーマンスを向上させることができます。

JavaScript の状態管理において、メモ化は以下のような場面で特に有効です：

1. **派生データの計算**: 元の状態から計算される派生データ（フィルタリングされたリスト、集計値など）
2. **コンポーネントの再レンダリング防止**: 入力プロパティが変わっていない場合にコンポーネントの再レンダリングを避ける

メモ化の基本的な実装は、入力値をキーとして結果をキャッシュするマップを使用します。同じ入力が与えられた場合、計算を再実行せずにキャッシュから結果を返します。

```javascript
// 基本的なメモ化関数
function memoize(fn) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}
```
