/**
 * Chapter 3: 状態の変更検知と比較
 *
 * このファイルでは、状態管理における2つの重要な概念を示しています：
 * 1. 参照による変更検知 - 状態の参照が変わったかどうかで変更を検知
 * 2. 値による比較 - オブジェクトの内容が同じかどうかを比較
 *
 * ReduxやNgRxでは、パフォーマンスのために参照による変更検知が使用されます。
 */

// 参照の変更検知
// この関数は、ReduxやNgRxの内部で使用されている変更検知の仕組みを簡略化したものです
function hasChanged(oldState, newState) {
  return oldState !== newState; // 参照が異なれば変更があったと判断
}

// テスト用の状態オブジェクト
const state1 = { count: 0 };
const state2 = { count: 0 }; // 内容は同じだが異なるオブジェクト（異なる参照）
const state3 = state1; // state1と同じ参照

// 参照による変更検知のテスト
console.log(hasChanged(state1, state2)); // true（異なる参照なので変更があったと判断）
console.log(hasChanged(state1, state3)); // false（同じ参照なので変更がないと判断）

// 簡易的なディープ比較
// 参照ではなく、オブジェクトの内容を比較する方法
function isEqual(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
  // 注意: これは簡易的な実装で、循環参照や関数を含むオブジェクトでは動作しません
  // 実際のアプリケーションでは、lodashのisEqualなどのライブラリを使用することが推奨されます
}

// ネストされたオブジェクトを含む状態
const state4 = { count: 0, user: { name: "Alice" } };
const state5 = { count: 0, user: { name: "Alice" } }; // 内容は同じだが異なるオブジェクト

// 参照比較と内容比較の違い
console.log(state4 === state5); // false（参照が異なる）
console.log(isEqual(state4, state5)); // true（内容が同じ）

// 注意: ReduxやNgRxでは、パフォーマンスのために参照比較が使用されますが、
// 時にはディープ比較が必要な場合もあります（例：メモ化されたセレクタの入力比較など）
