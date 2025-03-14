// メモ化されたコンポーネントの実装例

// メモ化関数（React.memoの簡易版）
function memoize(component) {
  let lastProps = null;
  let lastResult = null;

  return (props) => {
    // propsが前回と同じ参照であれば、キャッシュした結果を返す
    if (lastProps === props || isEqual(lastProps, props)) {
      console.log("コンポーネントの再計算をスキップ（メモ化ヒット）");
      return lastResult;
    }

    // propsが変わっていれば、コンポーネントを再計算
    console.log("コンポーネントを再計算（メモ化ミス）");
    lastProps = props;
    lastResult = component(props);
    return lastResult;
  };
}

// 簡易的なディープ比較関数
function isEqual(obj1, obj2) {
  if (obj1 === obj2) return true;
  if (obj1 === null || obj2 === null) return false;
  if (typeof obj1 !== "object" || typeof obj2 !== "object")
    return obj1 === obj2;

  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  return keys1.every((key) => {
    return keys2.includes(key) && isEqual(obj1[key], obj2[key]);
  });
}

// 通常のコンポーネント（高コストな処理を含む）
function ExpensiveComponent(props) {
  console.log("ExpensiveComponentの処理を実行...");

  // 高コストな処理をシミュレート
  let result = 0;
  for (let i = 0; i < 1000000; i++) {
    result += i * props.multiplier;
  }

  return {
    type: "div",
    props: { className: "expensive-component" },
    children: [
      {
        type: "h2",
        props: {},
        children: [`結果: ${result}`],
      },
      {
        type: "p",
        props: {},
        children: [`ユーザー: ${props.user.name}`],
      },
    ],
  };
}

// メモ化されたコンポーネント
const MemoizedComponent = memoize(ExpensiveComponent);

// 使用例
console.log("--- 通常のコンポーネント ---");
console.time("通常のコンポーネント（1回目）");
const result1 = ExpensiveComponent({ multiplier: 2, user: { name: "Alice" } });
console.timeEnd("通常のコンポーネント（1回目）");

console.time("通常のコンポーネント（2回目、同じprops）");
const result2 = ExpensiveComponent({ multiplier: 2, user: { name: "Alice" } });
console.timeEnd("通常のコンポーネント（2回目、同じprops）");

console.log("\n--- メモ化されたコンポーネント ---");
console.time("メモ化されたコンポーネント（1回目）");
const memoResult1 = MemoizedComponent({
  multiplier: 2,
  user: { name: "Alice" },
});
console.timeEnd("メモ化されたコンポーネント（1回目）");

console.time("メモ化されたコンポーネント（2回目、同じprops）");
const memoResult2 = MemoizedComponent({
  multiplier: 2,
  user: { name: "Alice" },
});
console.timeEnd("メモ化されたコンポーネント（2回目、同じprops）");

console.time("メモ化されたコンポーネント（3回目、異なるprops）");
const memoResult3 = MemoizedComponent({
  multiplier: 3,
  user: { name: "Alice" },
});
console.timeEnd("メモ化されたコンポーネント（3回目、異なるprops）");

// 同じオブジェクト参照を使用した例
const userBob = { name: "Bob" };
console.log("\n--- 同じオブジェクト参照を使用 ---");

console.time("メモ化されたコンポーネント（同じ参照、1回目）");
const memoResult4 = MemoizedComponent({ multiplier: 2, user: userBob });
console.timeEnd("メモ化されたコンポーネント（同じ参照、1回目）");

console.time("メモ化されたコンポーネント（同じ参照、2回目）");
const memoResult5 = MemoizedComponent({ multiplier: 2, user: userBob });
console.timeEnd("メモ化されたコンポーネント（同じ参照、2回目）");
