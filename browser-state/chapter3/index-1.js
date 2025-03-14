// 参照の変更検知
function hasChanged(oldState, newState) {
  return oldState !== newState; // 参照が異なれば変更があったと判断
}

const state1 = { count: 0 };
const state2 = { count: 0 }; // 内容は同じだが異なるオブジェクト
const state3 = state1; // 同じ参照

console.log(hasChanged(state1, state2)); // true（異なる参照）
console.log(hasChanged(state1, state3)); // false（同じ参照）
