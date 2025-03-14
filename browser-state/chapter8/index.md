### 2. メモ化（Memoization）

同じ入力に対して同じ出力を返す関数の結果をキャッシュする技術です。状態が変更されていない場合、再計算を避けることができます。

```javascript
// メモ化の例（React.memoの簡易版）
function memoize(component) {
  let lastProps = null;
  let lastResult = null;

  return (props) => {
    // propsが前回と同じ参照であれば、キャッシュした結果を返す
    if (lastProps === props) {
      return lastResult;
    }

    // propsが変わっていれば、コンポーネントを再計算
    lastProps = props;
    lastResult = component(props);
    return lastResult;
  };
}
```
