// セレクター（Selectors）の実装例

// メモ化関数
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

// createSelector関数（Reselectの簡易版）
function createSelector(inputSelectors, resultFn) {
  // 入力セレクターの結果をキャッシュ
  const memoizedResultFn = memoize((...args) => {
    return resultFn(...args);
  });

  // 最終的なセレクター関数
  return function (state) {
    // 入力セレクターの結果を計算
    const inputValues = inputSelectors.map((selector) => selector(state));

    // 結果関数を実行
    return memoizedResultFn(...inputValues);
  };
}

// アプリケーションの状態
const state1 = {
  users: [
    { id: 1, name: "田中", age: 28, active: true },
    { id: 2, name: "鈴木", age: 34, active: false },
    { id: 3, name: "佐藤", age: 22, active: true },
    { id: 4, name: "高橋", age: 41, active: true },
    { id: 5, name: "伊藤", age: 19, active: false },
  ],
  filters: {
    minAge: 20,
    onlyActive: true,
  },
};

// 基本的なセレクター
const getUsers = (state) => state.users;
const getFilters = (state) => state.filters;

// 複合セレクター（メモ化あり）
const getFilteredUsers = createSelector(
  [getUsers, getFilters],
  (users, filters) => {
    console.log("フィルタリング処理を実行...");

    return users.filter((user) => {
      // 年齢フィルター
      if (user.age < filters.minAge) return false;

      // アクティブユーザーフィルター
      if (filters.onlyActive && !user.active) return false;

      return true;
    });
  }
);

// 使用例
console.log("--- フィルタリング（1回目） ---");
const filteredUsers1 = getFilteredUsers(state1);
console.log("フィルタリング結果:", filteredUsers1);

console.log("\n--- フィルタリング（2回目、同じ状態） ---");
const filteredUsers2 = getFilteredUsers(state1);
console.log("フィルタリング結果:", filteredUsers2);

// 状態の一部を変更（フィルターは変更なし）
const state2 = {
  ...state1,
  otherData: "これは新しいデータです", // フィルタリングに関係ないデータ
};

console.log("\n--- フィルタリング（3回目、関係ない部分の変更） ---");
const filteredUsers3 = getFilteredUsers(state2);
console.log("フィルタリング結果:", filteredUsers3);

// フィルターを変更
const state3 = {
  ...state1,
  filters: {
    ...state1.filters,
    minAge: 30, // 最小年齢を変更
  },
};

console.log("\n--- フィルタリング（4回目、フィルター変更） ---");
const filteredUsers4 = getFilteredUsers(state3);
console.log("フィルタリング結果:", filteredUsers4);
