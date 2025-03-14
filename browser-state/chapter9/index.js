/**
 * Chapter 9: セレクター（Selectors）
 *
 * このファイルでは、NgRxで使用されるセレクターパターンの実装を示しています。
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

// ============================================================================
// セレクターの基本概念と実装
// ============================================================================

/**
 * NgRxにおけるセレクターとは？
 *
 * NgRxのセレクターは、ストア内の状態から特定のデータを取得する関数です。
 * 例えば、以下のようなAngularアプリケーションの状態があるとします：
 *
 * interface AppState {
 *   users: User[];
 *   currentUserId: number;
 *   settings: Settings;
 * }
 *
 * この状態から現在のユーザーを取得するセレクターは次のようになります：
 *
 * export const selectCurrentUser = createSelector(
 *   (state: AppState) => state.users,
 *   (state: AppState) => state.currentUserId,
 *   (users, currentUserId) => users.find(user => user.id === currentUserId)
 * );
 *
 * Angularコンポーネントでは、このセレクターを使って以下のように状態を取得します：
 *
 * @Component({...})
 * export class UserProfileComponent {
 *   currentUser$ = this.store.select(selectCurrentUser);
 *
 *   constructor(private store: Store<AppState>) {}
 * }
 *
 * セレクターを使うことで、コンポーネントは状態の構造を知る必要がなく、
 * 必要なデータだけを取得できます。
 */

// メモ化関数
// 前回と同じ引数で呼び出された場合、計算結果をキャッシュから返す
function memoize(fn) {
  const cache = new Map();

  return function (...args) {
    // 引数をキーとして使用するために文字列化
    const key = JSON.stringify(args);

    // キャッシュにヒットした場合はキャッシュから結果を返す
    if (cache.has(key)) {
      console.log(`キャッシュヒット: ${key}`);
      return cache.get(key);
    }

    // キャッシュミスの場合は計算を実行し、結果をキャッシュに保存
    console.log(`キャッシュミス: ${key} - 計算を実行`);
    const result = fn(...args);
    cache.set(key, result);
    return result;
  };
}

/**
 * NgRxにおけるメモ化の仕組み
 *
 * NgRxのセレクターは内部的にメモ化を使用して、パフォーマンスを最適化しています。
 * メモ化とは、関数の結果をキャッシュして、同じ入力に対して再計算を避ける最適化技術です。
 *
 * 上記のmemoize関数はNgRxの内部実装を簡略化したものです。実際のNgRxでは、
 * より洗練されたメモ化の実装が使用されています。
 *
 * NgRxのメモ化の特徴：
 *
 * 1. プロジェクター関数のメモ化：セレクターの結果を計算する関数（プロジェクター）をメモ化
 * 2. 入力セレクターの結果に基づくメモ化：状態全体ではなく、入力セレクターの結果に基づいてメモ化
 * 3. LRUキャッシュ：最近使用されたN個の結果のみをキャッシュ（メモリ使用量の最適化）
 * 4. 参照の同一性チェック：オブジェクトの内容ではなく、参照の同一性に基づいてキャッシュヒットを判断
 *
 * これらの最適化により、NgRxのセレクターは大規模なアプリケーションでも効率的に動作します。
 */

// createSelector関数（NgRxの簡易版）
// 複数の入力セレクターの結果を組み合わせて新しい値を計算する
function createSelector(inputSelectors, resultFn) {
  // 結果関数をメモ化
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

/**
 * NgRxのcreateSelector関数の内部動作
 *
 * NgRxのcreateSelector関数は、複数の入力セレクターと結果関数（プロジェクター）を
 * 組み合わせて新しいセレクターを作成します。その動作を詳しく説明します：
 *
 * 1. 入力セレクター：状態から特定のデータを取得する関数の配列
 * 2. プロジェクター関数：入力セレクターの結果を引数として受け取り、最終的な結果を計算する関数
 *
 * createSelectorの処理フロー：
 *
 * 1. プロジェクター関数をメモ化します（同じ入力に対して再計算を避けるため）
 * 2. 新しいセレクター関数を返します。この関数は：
 *    a. 各入力セレクターを実行して中間結果を取得
 *    b. これらの中間結果を引数としてメモ化されたプロジェクター関数を呼び出す
 *
 * NgRxのセレクターの特徴：
 *
 * - 型安全性：TypeScriptの型システムを活用して、型安全なセレクターを作成できる
 * - 合成可能性：セレクターを他のセレクターと組み合わせて、より複雑なセレクターを作成できる
 * - デバッグ容易性：@ngrx/store-devtoolsと連携して、セレクターの実行と結果を追跡できる
 * - テスト容易性：純粋関数なので、単体テストが容易
 *
 * 実際のNgRxアプリケーションでは、以下のようにセレクターを定義します：
 *
 * // 特定の機能の状態を選択するためのFeatureSelector
 * export const selectUserState = createFeatureSelector<AppState, UserState>('users');
 *
 * // 基本的なセレクター
 * export const selectAllUsers = createSelector(
 *   selectUserState,
 *   (state: UserState) => state.users
 * );
 *
 * export const selectCurrentUserId = createSelector(
 *   selectUserState,
 *   (state: UserState) => state.currentUserId
 * );
 *
 * // 複合セレクター
 * export const selectCurrentUser = createSelector(
 *   selectAllUsers,
 *   selectCurrentUserId,
 *   (users, currentUserId) => users.find(user => user.id === currentUserId)
 * );
 */

// ============================================================================
// セレクターの実際の使用例
// ============================================================================

// アプリケーションの状態
// 実際のNgRxアプリケーションでは、これはストアの状態になる
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

/**
 * NgRxにおける入力セレクターの役割
 *
 * 入力セレクターは、状態の特定の部分を取得する単純な関数です。
 * NgRxでは、これらは通常、createFeatureSelectorを使用して作成されるか、
 * 単純な関数として定義されます。
 *
 * 入力セレクターの例：
 * - selectUsers: 状態からユーザーリストを取得
 * - selectFilters: 状態からフィルター条件を取得
 * - selectCurrentUserId: 状態から現在のユーザーIDを取得
 *
 * 入力セレクターは、状態の構造が変更された場合に更新が必要な唯一の場所です。
 * 例えば、ユーザーリストの保存場所が変更された場合、selectUsersセレクターだけを
 * 更新すれば、それを使用するすべての複合セレクターは自動的に正しく動作します。
 *
 * NgRxの実際の実装例：
 *
 * // 機能状態を選択するFeatureSelector
 * export const selectUserFeature = createFeatureSelector<AppState, UserState>('users');
 *
 * // 基本的なセレクター
 * export const selectAllUsers = createSelector(
 *   selectUserFeature,
 *   (state: UserState) => state.entities
 * );
 */

// 複合セレクター（メモ化あり）
// 複数の入力セレクターの結果を組み合わせて新しい値を計算
const getFilteredUsers = createSelector(
  [getUsers, getFilters], // 入力セレクター
  (users, filters) => {
    // 結果関数（プロジェクター）
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

/**
 * NgRxにおける複合セレクターの役割と利点
 *
 * 複合セレクターは、入力セレクターの結果を組み合わせて新しい値を計算します。
 * NgRxでは、createSelector関数を使用して作成され、自動的にメモ化されます。
 *
 * 複合セレクターの例：
 * - selectFilteredUsers: ユーザーリストとフィルター条件を組み合わせてフィルタリングされたリストを取得
 * - selectCurrentUser: ユーザーリストと現在のユーザーIDを組み合わせて現在のユーザーを取得
 * - selectTotalActiveUsers: ユーザーリストからアクティブなユーザーの数を計算
 *
 * 複合セレクターの利点：
 * 1. 再利用性: 複数のコンポーネントで同じデータアクセスロジックを共有できる
 * 2. パフォーマンス: メモ化により、入力が変わらない限り再計算を避けられる
 * 3. テスト容易性: 純粋関数なのでテストが容易
 * 4. 合成可能性: 他のセレクターを入力として使用できる（セレクターの合成）
 *
 * NgRxの実際の実装例：
 *
 * // フィルター条件を選択するセレクター
 * export const selectUserFilters = createSelector(
 *   selectUserFeature,
 *   (state: UserState) => state.filters
 * );
 *
 * // フィルタリングされたユーザーを選択するセレクター
 * export const selectFilteredUsers = createSelector(
 *   selectAllUsers,
 *   selectUserFilters,
 *   (users, filters) => {
 *     return users.filter(user => {
 *       if (filters.minAge && user.age < filters.minAge) return false;
 *       if (filters.onlyActive && !user.active) return false;
 *       return true;
 *     });
 *   }
 * );
 */

// セレクターの合成の例
// 既存のセレクターを入力として使用して新しいセレクターを作成
const getActiveUserCount = createSelector(
  [getFilteredUsers], // 既存の複合セレクターを入力として使用
  (filteredUsers) => {
    console.log("アクティブユーザー数を計算...");
    return filteredUsers.length;
  }
);

/**
 * NgRxにおけるセレクターの合成（Composition）
 *
 * NgRxのセレクターの強力な機能の一つは、他のセレクターを入力として使用できることです。
 * これにより、小さなセレクターを組み合わせて複雑なデータ変換を構築できます。
 *
 * 上記の例では、getActiveUserCountセレクターはgetFilteredUsersセレクターを
 * 入力として使用しています。これにより：
 *
 * 1. コードの再利用: フィルタリングロジックを複製する必要がない
 * 2. パフォーマンスの連鎖: getFilteredUsersがキャッシュから結果を返す場合、
 *    getActiveUserCountも効率的に計算される
 * 3. 関心の分離: 各セレクターは単一の責任を持つ
 *
 * NgRxの実際の実装例：
 *
 * // アクティブなユーザーの数を計算するセレクター
 * export const selectActiveUserCount = createSelector(
 *   selectFilteredUsers,
 *   (users) => users.filter(user => user.active).length
 * );
 *
 * // 平均年齢を計算するセレクター
 * export const selectAverageAge = createSelector(
 *   selectFilteredUsers,
 *   (users) => {
 *     if (users.length === 0) return 0;
 *     const totalAge = users.reduce((sum, user) => sum + user.age, 0);
 *     return totalAge / users.length;
 *   }
 * );
 *
 * // ダッシュボード用のデータを計算するセレクター
 * export const selectDashboardData = createSelector(
 *   selectFilteredUsers,
 *   selectActiveUserCount,
 *   selectAverageAge,
 *   (users, activeCount, averageAge) => ({
 *     totalUsers: users.length,
 *     activeUsers: activeCount,
 *     averageAge: averageAge,
 *     youngestUser: [...users].sort((a, b) => a.age - b.age)[0],
 *     oldestUser: [...users].sort((a, b) => b.age - a.age)[0]
 *   })
 * );
 */

// 使用例と動作確認
console.log("--- フィルタリング（1回目） ---");
const filteredUsers1 = getFilteredUsers(state1);
console.log("フィルタリング結果:", filteredUsers1);

console.log("\n--- フィルタリング（2回目、同じ状態） ---");
const filteredUsers2 = getFilteredUsers(state1);
console.log("フィルタリング結果:", filteredUsers2);
// 2回目は同じ状態なので、キャッシュから結果が返される（計算は実行されない）

// アクティブユーザー数を計算
console.log("\n--- アクティブユーザー数（1回目） ---");
const activeUserCount1 = getActiveUserCount(state1);
console.log("アクティブユーザー数:", activeUserCount1);

console.log("\n--- アクティブユーザー数（2回目、同じ状態） ---");
const activeUserCount2 = getActiveUserCount(state1);
console.log("アクティブユーザー数:", activeUserCount2);
// キャッシュから結果が返される

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

// ユーザーリストを変更
const state4 = {
  ...state1,
  users: [
    ...state1.users,
    { id: 6, name: "山田", age: 31, active: true }, // 新しいユーザーを追加
  ],
};

console.log("\n--- フィルタリング（5回目、ユーザーリスト変更） ---");
const filteredUsers5 = getFilteredUsers(state4);
console.log("フィルタリング結果:", filteredUsers5);
// ユーザーリストが変わったので、再計算が実行される

/**
 * セレクターの重要なポイント:
 *
 * 1. 派生データ: 状態から計算される派生データを効率的に管理
 * 2. メモ化: 入力が変わらない限り、計算結果をキャッシュして再利用
 * 3. 構造共有: 状態の一部だけが変更された場合、変更されていない部分の参照は同じなので
 *    セレクターの入力が変わらなければ再計算は行われない
 * 4. 合成可能性: セレクターは他のセレクターを入力として使用できる（セレクターの合成）
 *
 * NgRxではcreateSelector、createFeatureSelector、createSelectorFactory
 * などの関数を使用してこのパターンを実装します。これらは内部的に効率的な
 * メモ化メカニズムを使用しています。
 *
 * セレクターは、前のチャプターで学んだOnPush変更検知と組み合わせることで、
 * 特に効果的です。状態の変更が必要なコンポーネントだけを再レンダリングすることで、
 * アプリケーション全体のパフォーマンスを大幅に向上させることができます。
 *
 * 次のチャプターでは、これらのパターンを組み合わせたストア（Store）の実装を見ていきます。
 */
