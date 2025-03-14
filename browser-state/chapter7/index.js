/**
 * Chapter 7: メモ化（Memoization）
 *
 * このファイルでは、パフォーマンス最適化のための重要な技術である「メモ化」を示しています。
 * メモ化とは、関数の結果をキャッシュし、同じ入力に対して再計算を避ける技術です。
 *
 * ReduxやNgRxでは、セレクタ関数のメモ化によって、状態の派生データを効率的に計算します。
 * これにより、不要な再計算を避け、アプリケーションのパフォーマンスを向上させます。
 */

// 基本的なメモ化関数
// この関数は、任意の関数をメモ化（結果をキャッシュ）するためのヘルパー関数です
function memoize(fn) {
  const cache = new Map(); // 結果をキャッシュするためのMap

  // クロージャを返す
  return function (...args) {
    // 引数をキーとして使用するために文字列化
    const key = JSON.stringify(args);

    // キャッシュにヒットした場合は、計算せずに結果を返す
    if (cache.has(key)) {
      console.log(`キャッシュヒット: ${key}`);
      return cache.get(key);
    }

    // キャッシュミスの場合は、関数を実行して結果をキャッシュ
    console.log(`キャッシュミス: ${key} - 計算を実行`);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

// 計算コストの高い関数（例: フィボナッチ数列）
// この関数は再帰的に呼び出されるため、メモ化なしでは指数関数的に遅くなります
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2); // 再帰呼び出し
}

// メモ化されたフィボナッチ関数
// 同じnに対する計算結果をキャッシュすることで、計算量を大幅に削減
const memoizedFibonacci = memoize(function (n) {
  if (n <= 1) return n;
  return memoizedFibonacci(n - 1) + memoizedFibonacci(n - 2); // メモ化された関数を再帰呼び出し
});

// 実行例と性能比較
console.log("--- 通常のフィボナッチ関数 ---");
console.time("通常のフィボナッチ");
console.log(`fibonacci(10) = ${fibonacci(10)}`);
console.timeEnd("通常のフィボナッチ");

console.log("\n--- メモ化されたフィボナッチ関数（1回目） ---");
console.time("メモ化されたフィボナッチ（1回目）");
console.log(`memoizedFibonacci(10) = ${memoizedFibonacci(10)}`);
console.timeEnd("メモ化されたフィボナッチ（1回目）");

console.log("\n--- メモ化されたフィボナッチ関数（2回目） ---");
console.time("メモ化されたフィボナッチ（2回目）");
console.log(`memoizedFibonacci(10) = ${memoizedFibonacci(10)}`);
console.timeEnd("メモ化されたフィボナッチ（2回目）");

// 状態管理におけるメモ化の例
// これは、ReduxやNgRxのセレクタ関数に相当するものです
const expensiveCalculation = (state) => {
  console.log("高コストな計算を実行...");
  // 実際のアプリケーションでは、ここで複雑な計算を行う
  // 例: フィルタリング、ソート、集計など
  return state.numbers.reduce((sum, n) => sum + n, 0);
};

// 計算関数をメモ化
const memoizedCalculation = memoize(expensiveCalculation);

// 異なる状態オブジェクトでテスト
const state1 = { numbers: [1, 2, 3, 4, 5] };
const state2 = { numbers: [1, 2, 3, 4, 5] }; // 内容は同じだが異なるオブジェクト
const state3 = { numbers: [1, 2, 3, 4, 5, 6] }; // 異なる内容

console.log("\n--- 状態管理におけるメモ化の例 ---");
console.log("state1の合計:", memoizedCalculation(state1)); // 初回計算
console.log("state2の合計:", memoizedCalculation(state2)); // キャッシュから取得（同じ内容なので）
console.log("state3の合計:", memoizedCalculation(state3)); // 再計算（内容が異なるため）

/**
 * メモ化の重要なポイント:
 *
 * 1. パフォーマンス最適化: 同じ入力に対する再計算を避けることで、パフォーマンスを向上
 * 2. 参照の同一性: JSONシリアライズによるキャッシュキーの生成は、オブジェクトの内容が同じでも
 *    参照が異なる場合に別のキーとして扱われる可能性がある
 * 3. 副作用: メモ化は純粋関数（同じ入力に対して常に同じ出力を返し、副作用がない関数）に対してのみ有効
 * 4. メモリ使用量: キャッシュはメモリを消費するため、無限に大きくなる可能性がある場合は
 *    キャッシュサイズの制限やLRU（Least Recently Used）などの戦略が必要
 *
 * ReduxやNgRxでは、createSelectorやcreateFeatureSelectorなどの関数を使用して
 * メモ化されたセレクタを作成します。これらは内部的に同様のメモ化メカニズムを使用しています。
 */
