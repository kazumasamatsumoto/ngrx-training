// メモ化の実装例

// 基本的なメモ化関数
function memoize(fn) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      console.log(`キャッシュヒット: ${key}`);
      return cache.get(key);
    }

    console.log(`キャッシュミス: ${key} - 計算を実行`);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

// 計算コストの高い関数（例: フィボナッチ数列）
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// メモ化されたフィボナッチ関数
const memoizedFibonacci = memoize(function (n) {
  if (n <= 1) return n;
  return memoizedFibonacci(n - 1) + memoizedFibonacci(n - 2);
});

// 実行例
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
const expensiveCalculation = (state) => {
  console.log("高コストな計算を実行...");
  // 実際のアプリケーションでは、ここで複雑な計算を行う
  return state.numbers.reduce((sum, n) => sum + n, 0);
};

const memoizedCalculation = memoize(expensiveCalculation);

// 状態の例
const state1 = { numbers: [1, 2, 3, 4, 5] };
const state2 = { numbers: [1, 2, 3, 4, 5] }; // 内容は同じだが異なるオブジェクト
const state3 = { numbers: [1, 2, 3, 4, 5, 6] }; // 異なる内容

console.log("\n--- 状態管理におけるメモ化の例 ---");
console.log("state1の合計:", memoizedCalculation(state1));
console.log("state2の合計:", memoizedCalculation(state2)); // キャッシュから取得
console.log("state3の合計:", memoizedCalculation(state3)); // 再計算
