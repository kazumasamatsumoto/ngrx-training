// 簡易的なディープ比較
function isEqual(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

const state1 = { count: 0, user: { name: "Alice" } };
const state2 = { count: 0, user: { name: "Alice" } }; // 内容は同じだが異なるオブジェクト

console.log(state1 === state2); // false（参照が異なる）
console.log(isEqual(state1, state2)); // true（内容が同じ）
