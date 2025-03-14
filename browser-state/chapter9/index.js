/**
 * Chapter 9: セレクター（Selectors）
 *
 * このファイルでは、ReduxやNgRxで使用されるセレクターパターンの実装を示しています。
 * セレクターは、状態から必要なデータを抽出し、派生データを計算するための関数です。
 *
 * セレクターの主な利点:
 * 1. 関心の分離: UIコンポーネントは状態の構造を知る必要がない
 * 2. メモ化: 入力が変わらない限り、計算結果をキャッシュして再利用
 * 3. 再利用性: 複数のコンポーネントで同じデータアクセスロジックを共有
 * 4. テスト容易性: 純粋関数なのでテストが容易
 *
 * なぜセレクターが重要なのか？
 *
 * 【状態構造とUIの分離】
 * アプリケーションが成長するにつれて、状態の構造は変化することがあります。
 * セレクターを使用することで、状態の構造とUIコンポーネントを分離できます。
 * これにより、状態の構造が変更されても、セレクターだけを更新すれば良く、
 * UIコンポーネントを変更する必要がなくなります。
 *
 * 例えば、最初は `state.user.name` だったものが後に `state.profile.userName` に
 * 変更された場合、セレクターだけを更新すれば、UIコンポーネントはそのまま使えます。
 *
 * 【パフォーマンスの最適化】
 * 大規模なアプリケーションでは、状態から派生するデータの計算が複雑になることがあります。
 * 例えば、ユーザーリストをフィルタリングし、ソートし、ページネーションするなどの
 * 処理は計算コストが高くなります。
 *
 * メモ化されたセレクターを使用することで、入力（状態の関連部分）が変更されない限り、
 * これらの計算結果をキャッシュして再利用できます。これにより、特に以下の場合に
 * 大幅なパフォーマンス向上が見込めます：
 *
 * 1. UIの再レンダリングが頻繁に発生する場合
 * 2. 計算が複雑で時間がかかる場合
 * 3. 状態の一部だけが変更され、多くの部分が変更されない場合
 *
 * 【合成可能性と再利用性】
 * セレクターは他のセレクターと組み合わせて、より複雑なデータ変換を構築できます。
 * これにより、小さく再利用可能なセレクターを作成し、それらを組み合わせて
 * 複雑なデータ変換を実現できます。
 *
 * この合成可能性は、コードの再利用性を高め、DRY（Don't Repeat Yourself）原則に
 * 従ったコードベースを維持するのに役立ちます。
 */

// メモ化関数
// 前回と同じ引数で呼び出された場合、計算結果をキャッシュから返す
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
// 複数の入力セレクターの結果を組み合わせて新しい値を計算する
function createSelector(inputSelectors, resultFn) {
  // 入力セレクターの結果をキャッシュ
  const memoizedResultFn = memoize((...args) => {
    return resultFn(...args);
  });

  // 最終的なセレクター関数
  return function (state) {
    // 入力セレクターの結果を計算
    const inputValues = inputSelectors.map((selector) => selector(state));

    // 結果関数を実行（入力値が変わらなければキャッシュから結果を返す）
    return memoizedResultFn(...inputValues);
  };
}

// アプリケーションの状態
// 実際のアプリケーションでは、これはReduxストアやNgRxストアの状態になる
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

// 基本的なセレクター（入力セレクター）
// 状態から特定のデータを取得するだけの単純な関数
const getUsers = (state) => state.users;
const getFilters = (state) => state.filters;

// 複合セレクター（メモ化あり）
// 複数の入力セレクターの結果を組み合わせて新しい値を計算
const getFilteredUsers = createSelector(
  [getUsers, getFilters], // 入力セレクター
  (users, filters) => {
    // 結果関数
    console.log("フィルタリング処理を実行...");

    // ユーザーリストをフィルタリング
    return users.filter((user) => {
      // 年齢フィルター
      if (user.age < filters.minAge) return false;

      // アクティブユーザーフィルター
      if (filters.onlyActive && !user.active) return false;

      return true;
    });
  }
);

// 使用例と動作確認
console.log("--- フィルタリング（1回目） ---");
const filteredUsers1 = getFilteredUsers(state1);
console.log("フィルタリング結果:", filteredUsers1);

console.log("\n--- フィルタリング（2回目、同じ状態） ---");
const filteredUsers2 = getFilteredUsers(state1);
console.log("フィルタリング結果:", filteredUsers2);
// 2回目は同じ状態なので、キャッシュから結果が返される（計算は実行されない）

// 状態の一部を変更（フィルターは変更なし）
const state2 = {
  ...state1,
  otherData: "これは新しいデータです", // フィルタリングに関係ないデータ
};

console.log("\n--- フィルタリング（3回目、関係ない部分の変更） ---");
const filteredUsers3 = getFilteredUsers(state2);
console.log("フィルタリング結果:", filteredUsers3);
// 入力セレクターの結果が変わらないので、キャッシュから結果が返される

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
// フィルターが変わったので、再計算が実行される

/**
 * セレクターの重要なポイント:
 *
 * 1. 派生データ: 状態から計算される派生データを効率的に管理
 * 2. メモ化: 入力が変わらない限り、計算結果をキャッシュして再利用
 * 3. 構造共有: 状態の一部だけが変更された場合、変更されていない部分の参照は同じなので
 *    セレクターの入力が変わらなければ再計算は行われない
 * 4. 合成可能性: セレクターは他のセレクターを入力として使用できる（セレクターの合成）
 *
 * ReduxではReselectライブラリ、NgRxではcreateFeatureSelectorなどの関数を使用して
 * 同様のパターンを実装します。これらは内部的に同様のメモ化メカニズムを使用しています。
 */
