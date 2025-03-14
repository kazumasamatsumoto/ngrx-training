// 参照の変更検知
function hasChanged(oldState, newState) {
  return oldState !== newState; // 参照が異なれば変更があったと判断
}

const state1 = { count: 0 };
const state2 = { count: 0 }; // 内容は同じだが異なるオブジェクト
const state3 = state1; // 同じ参照

console.log(hasChanged(state1, state2)); // true（異なる参照）
console.log(hasChanged(state1, state3)); // false（同じ参照）


// 簡易的なディープ比較
function isEqual(obj1, obj2) {
  return JSON.stringify(obj1) === JSON.stringify(obj2);
}

const state4 = { count: 0, user: { name: "Alice" } };
const state5 = { count: 0, user: { name: "Alice" } }; // 内容は同じだが異なるオブジェクト

console.log(state4 === state5); // false（参照が異なる）
console.log(isEqual(state4, state5)); // true（内容が同じ）
