/**
 * Chapter 8: メモ化されたコンポーネント
 *
 * このファイルでは、ReactのmemoやAngularのChangeDetectionStrategy.OnPushに相当する
 * メモ化されたコンポーネントの簡易的な実装を示しています。
 *
 * コンポーネントのメモ化は、propsが変更されない限りコンポーネントの再レンダリングを
 * スキップすることで、パフォーマンスを向上させる技術です。
 *
 * これは、状態管理と組み合わせて使用されることが多く、ReduxやNgRxと連携して
 * 効率的なUIの更新を実現します。
 *
 * なぜコンポーネントのメモ化が重要なのか？
 *
 * 【不要な再レンダリングの防止】
 * 現代のUIフレームワークでは、状態が変更されると関連するコンポーネントが再レンダリング
 * されます。しかし、大規模なアプリケーションでは、状態の一部が変更されただけで
 * 多くのコンポーネントが不必要に再レンダリングされる可能性があります。
 *
 * 例えば、1000項目のリストがあり、そのうち1項目だけが変更された場合、
 * メモ化がなければ1000項目すべてが再レンダリングされる可能性があります。
 * これは明らかに非効率です。
 *
 * 【状態管理との連携】
 * ReduxやNgRxなどの状態管理ライブラリでは、イミュータブルな状態更新と参照比較を
 * 使用しています。これはコンポーネントのメモ化と非常に相性が良いです：
 *
 * 1. 状態の一部だけが変更された場合、その部分に依存するコンポーネントだけが
 *    再レンダリングされます。
 *
 * 2. 変更されていない部分に依存するコンポーネントは、propsの参照が同じままなので
 *    再レンダリングをスキップできます。
 *
 * 【ユーザー体験の向上】
 * 不要な再レンダリングを減らすことで、特に複雑なUIや大量のデータを扱う
 * アプリケーションでは、レスポンスの向上とスムーズな操作感を実現できます。
 * これは特にモバイルデバイスなど、計算リソースが限られた環境で重要です。
 *
 * 【開発者体験の向上】
 * メモ化されたコンポーネントを使用することで、パフォーマンスを意識しながらも
 * コンポーネントを小さく保ち、単一責任の原則に従った設計が可能になります。
 * これにより、コードの保守性と再利用性が向上します。
 */

// メモ化関数（React.memoの簡易版）
// この関数は、コンポーネント関数をラップして、propsが変更されない限り
// 前回の結果を再利用するようにします
function memoize(component) {
  let lastProps = null; // 前回のprops
  let lastResult = null; // 前回の結果

  // 新しい関数を返す（これがメモ化されたコンポーネント）
  return (props) => {
    // propsが前回と同じ参照であるか、または内容が同じであれば、キャッシュした結果を返す
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
// propsの内容が同じかどうかを再帰的に比較します
function isEqual(obj1, obj2) {
  // 同じ参照であれば、内容も同じ
  if (obj1 === obj2) return true;
  // どちらかがnullであれば、内容は異なる
  if (obj1 === null || obj2 === null) return false;
  // プリミティブ型の場合は、値を比較
  if (typeof obj1 !== "object" || typeof obj2 !== "object")
    return obj1 === obj2;

  // オブジェクトの場合は、キーの数と内容を比較
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  // すべてのキーについて、値が等しいかどうかを再帰的に確認
  return keys1.every((key) => {
    return keys2.includes(key) && isEqual(obj1[key], obj2[key]);
  });
}

// 通常のコンポーネント（高コストな処理を含む）
// このコンポーネントは、propsが変わらなくても毎回実行される
function ExpensiveComponent(props) {
  console.log("ExpensiveComponentの処理を実行...");

  // 高コストな処理をシミュレート
  let result = 0;
  for (let i = 0; i < 1000000; i++) {
    result += i * props.multiplier;
  }

  // 仮想DOMの構造を返す（実際のReactやAngularでは、JSXやテンプレートを使用）
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
// propsが変わらない限り、再計算されない
const MemoizedComponent = memoize(ExpensiveComponent);

// 使用例と性能比較
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
  multiplier: 3, // multiplierが変わった
  user: { name: "Alice" },
});
console.timeEnd("メモ化されたコンポーネント（3回目、異なるprops）");

// 同じオブジェクト参照を使用した例
// 参照の同一性を利用したメモ化の効率性を示す
const userBob = { name: "Bob" }; // 同じオブジェクト参照を使用
console.log("\n--- 同じオブジェクト参照を使用 ---");

console.time("メモ化されたコンポーネント（同じ参照、1回目）");
const memoResult4 = MemoizedComponent({ multiplier: 2, user: userBob });
console.timeEnd("メモ化されたコンポーネント（同じ参照、1回目）");

console.time("メモ化されたコンポーネント（同じ参照、2回目）");
const memoResult5 = MemoizedComponent({ multiplier: 2, user: userBob });
console.timeEnd("メモ化されたコンポーネント（同じ参照、2回目）");

/**
 * メモ化されたコンポーネントの重要なポイント:
 *
 * 1. パフォーマンス最適化: propsが変わらない限り、コンポーネントの再計算をスキップ
 * 2. 参照の同一性: オブジェクトの参照が同じであれば、内容の比較をスキップできる
 * 3. ディープ比較: 参照が異なっても内容が同じ場合は再計算をスキップできるが、
 *    ディープ比較自体もコストがかかるため、参照の同一性を保つことが重要
 *
 * ReduxやNgRxを使用する場合、状態の更新は常に新しいオブジェクトを返すため、
 * メモ化されたコンポーネントと組み合わせることで効率的なUI更新が可能になります。
 *
 * 実際のReactでは、React.memoやuseMemoを使用してコンポーネントをメモ化します。
 * Angularでは、ChangeDetectionStrategy.OnPushを使用して同様の最適化を行います。
 */
