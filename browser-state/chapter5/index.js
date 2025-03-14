// 構造共有の例
const state1 = {
  count: 0,
  user: { name: "Alice", age: 30 },
  settings: { theme: "dark", notifications: true },
};

// countだけを更新する場合、userとsettingsの参照は再利用される
const state2 = {
  ...state1,
  count: 1,
  // userとsettingsは同じ参照が使われる
};

console.log(state1.user === state2.user); // true（同じ参照）
console.log(state1.settings === state2.settings); // true（同じ参照）
