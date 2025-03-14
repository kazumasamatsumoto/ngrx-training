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
 * NgRxにおけるセレクターとは？ - 具体例で理解する
 * 
 * セレクターは「ストアから必要なデータだけを取り出す関数」です。
 * 
 * 【具体例：ECサイトのショッピングカート】
 * 
 * 例えば、ECサイトのアプリを作っていて、以下のような状態があるとします：
 * 
 * ```
 * {
 *   products: [
 *     { id: 1, name: "Tシャツ", price: 2000, stock: 10 },
 *     { id: 2, name: "ジーンズ", price: 6000, stock: 5 },
 *     { id: 3, name: "帽子", price: 1500, stock: 8 }
 *   ],
 *   cart: [
 *     { productId: 1, quantity: 2 },
 *     { productId: 3, quantity: 1 }
 *   ],
 *   user: {
 *     id: "user123",
 *     name: "田中太郎",
 *     isPremiumMember: true
 *   }
 * }
 * ```
 * 
 * この状態から「カートに入っている商品の情報（名前、価格、数量）」を取得したいとします。
 * 
 * セレクターなしでコンポーネントから直接取得しようとすると：
 * 
 * ```typescript
 * // コンポーネント内で毎回このような計算が必要
 * const cartItems = this.state.cart.map(item => {
 *   const product = this.state.products.find(p => p.id === item.productId);
 *   return {
 *     name: product.name,
 *     price: product.price,
 *     quantity: item.quantity,
 *     subtotal: product.price * item.quantity
 *   };
 * });
 * ```
 * 
 * セレクターを使うと：
 * 
 * ```typescript
 * // セレクターの定義（一度だけ書けばよい）
 * export const selectCartItems = createSelector(
 *   state => state.products,
 *   state => state.cart,
 *   (products, cart) => cart.map(item => {
 *     const product = products.find(p => p.id === item.productId);
 *     return {
 *       name: product.name,
 *       price: product.price,
 *       quantity: item.quantity,
 *       subtotal: product.price * item.quantity
 *     };
 *   })
 * );
 * 
 * // コンポーネントでの使用（シンプル！）
 * @Component({...})
 * export class CartComponent {
 *   cartItems$ = this.store.select(selectCartItems);
 *   
 *   constructor(private store: Store) {}
 * }
 * ```
 * 
 * HTML側も簡単に：
 * ```html
 * <div *ngFor="let item of cartItems$ | async">
 *   {{ item.name }} - {{ item.price }}円 × {{ item.quantity }}個 = {{ item.subtotal }}円
 * </div>
 * ```
 * 
 * このように、セレクターを使うと：
 * 1. データ取得ロジックを一箇所にまとめられる（DRY原則）
 * 2. コンポーネントがシンプルになる
 * 3. 同じデータが必要な別のコンポーネントでも再利用できる
 * 4. 状態の構造が変わっても、セレクターだけ修正すればOK
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
 * メモ化の仕組み - 具体例で理解する
 * 
 * メモ化とは「同じ計算を何度もしないで、結果を覚えておく」技術です。
 * 
 * 【具体例：レストランの注文計算】
 * 
 * レストランで、あるテーブルの注文合計を計算する関数があるとします：
 * 
 * ```javascript
 * // メモ化なしの関数
 * function calculateTotal(tableOrders) {
 *   console.log("注文合計を計算中...");
 *   // 時間のかかる計算（税金、割引などを含む）
 *   let total = 0;
 *   for (const order of tableOrders) {
 *     total += order.price * order.quantity;
 *     // 割引計算
 *     if (order.quantity > 3) {
 *       total -= order.price * 0.1;
 *     }
 *   }
 *   // 税金を追加
 *   total = total * 1.1;
 *   return total;
 * }
 * ```
 * 
 * この関数を何度も呼び出すと、同じ注文内容でも毎回計算します：
 * 
 * ```javascript
 * const table1Orders = [
 *   { item: "ラーメン", price: 800, quantity: 2 },
 *   { item: "餃子", price: 500, quantity: 1 }
 * ];
 * 
 * calculateTotal(table1Orders); // 計算実行
 * calculateTotal(table1Orders); // 同じ内容なのに再計算
 * calculateTotal(table1Orders); // また再計算...
 * ```
 * 
 * メモ化を使うと：
 * 
 * ```javascript
 * // メモ化された関数
 * const memoizedCalculateTotal = memoize(calculateTotal);
 * 
 * memoizedCalculateTotal(table1Orders); // 計算実行
 * memoizedCalculateTotal(table1Orders); // キャッシュから即座に結果を返す
 * memoizedCalculateTotal(table1Orders); // キャッシュから即座に結果を返す
 * 
 * // 注文内容が変わった場合
 * const updatedOrders = [
 *   { item: "ラーメン", price: 800, quantity: 2 },
 *   { item: "餃子", price: 500, quantity: 2 } // 餃子が1→2に変更
 * ];
 * 
 * memoizedCalculateTotal(updatedOrders); // 新しい内容なので計算実行
 * ```
 * 
 * NgRxのセレクターも同じ原理で動作します。例えば「カート内の合計金額」を計算するセレクターは、
 * カートの内容が変わらなければ再計算せず、前回の結果をそのまま返します。
 * これにより、特に大きなリストや複雑な計算を含むアプリでパフォーマンスが向上します。
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
 * createSelectorの動作 - 料理の例で理解する
 * 
 * createSelectorは「材料（入力セレクター）から料理（結果）を作る」ようなものです。
 * 
 * 【具体例：料理の準備】
 * 
 * 例えば、カレーライスを作る工程を考えてみましょう：
 * 
 * ```javascript
 * // 材料を取り出す関数（入力セレクター）
 * const getRice = (kitchen) => kitchen.rice;
 * const getVegetables = (kitchen) => kitchen.vegetables;
 * const getMeat = (kitchen) => kitchen.meat;
 * const getSpices = (kitchen) => kitchen.spices;
 * 
 * // カレーを作る関数（複合セレクター）
 * const makeCurry = createSelector(
 *   getVegetables,
 *   getMeat,
 *   getSpices,
 *   (vegetables, meat, spices) => {
 *     console.log("カレーを調理中...");
 *     // 野菜を切る
 *     const choppedVegetables = chopVegetables(vegetables);
 *     // 肉を炒める
 *     const cookedMeat = cookMeat(meat);
 *     // スパイスを混ぜる
 *     const curryRoux = mixSpices(spices);
 *     // すべてを組み合わせる
 *     return makeCurrySauce(choppedVegetables, cookedMeat, curryRoux);
 *   }
 * );
 * 
 * // カレーライスを作る関数（さらに複合的なセレクター）
 * const makeCurryRice = createSelector(
 *   getRice,
 *   makeCurry,
 *   (rice, curry) => {
 *     console.log("カレーライスを盛り付け中...");
 *     return { rice: cookRice(rice), curry: curry };
 *   }
 * );
 * ```
 * 
 * この例では：
 * 1. 個別の材料を取得する単純なセレクター（getRice, getVegetables, ...）
 * 2. それらを組み合わせてカレーを作る複合セレクター（makeCurry）
 * 3. さらにご飯とカレーを組み合わせる高次のセレクター（makeCurryRice）
 * 
 * 重要なポイント：
 * - 材料（入力）が変わらなければ、調理（計算）は再実行されません
 * - 例えば、肉と野菜が同じなら、スパイスだけ変えても一部の処理だけ再実行
 * - 複数のセレクターを組み合わせて、より複雑なデータ変換を構築できる
 * 
 * 実際のNgRxアプリケーションでの例：
 * 
 * ```typescript
 * // 基本的なセレクター
 * export const selectProducts = (state: AppState) => state.products;
 * export const selectCart = (state: AppState) => state.cart;
 * export const selectUser = (state: AppState) => state.user;
 * 
 * // カート内の商品詳細を取得するセレクター
 * export const selectCartItems = createSelector(
 *   selectProducts,
 *   selectCart,
 *   (products, cart) => {
 *     return cart.map(item => {
 *       const product = products.find(p => p.id === item.productId);
 *       return {
 *         ...product,
 *         quantity: item.quantity,
 *         subtotal: product.price * item.quantity
 *       };
 *     });
 *   }
 * );
 * 
 * // 合計金額を計算するセレクター
 * export const selectCartTotal = createSelector(
 *   selectCartItems,
 *   (items) => items.reduce((total, item) => total + item.subtotal, 0)
 * );
 * 
 * // 割引後の最終金額を計算するセレクター
 * export const selectFinalTotal = createSelector(
 *   selectCartTotal,
 *   selectUser,
 *   (total, user) => {
 *     // プレミアム会員は10%割引
 *     if (user.isPremiumMember) {
 *       return total * 0.9;
 *     }
 *     return total;
 *   }
 * );
 * ```
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
 * 入力セレクターの役割 - 図書館の例で理解する
 * 
 * 入力セレクターは「大きな図書館から特定の本棚だけを指定する」ようなものです。
 * 
 * 【具体例：図書館】
 * 
 * 図書館（アプリの状態）には様々な本棚があります：
 * - 小説の本棚
 * - 科学書の本棚
 * - 歴史書の本棚
 * - 雑誌の本棚
 * 
 * 入力セレクターは、この大きな図書館から特定の本棚だけを指定します：
 * 
 * ```typescript
 * // 図書館全体（アプリの状態）
 * interface Library {
 *   fiction: Book[];
 *   science: Book[];
 *   history: Book[];
 *   magazines: Magazine[];
 * }
 * 
 * // 入力セレクター（特定の本棚を指定）
 * const selectFictionBooks = (library: Library) => library.fiction;
 * const selectScienceBooks = (library: Library) => library.science;
 * const selectHistoryBooks = (library: Library) => library.history;
 * const selectMagazines = (library: Library) => library.magazines;
 * ```
 * 
 * これらの入力セレクターを使って、より複雑な検索ができます：
 * 
 * ```typescript
 * // 特定のジャンルの本を検索するセレクター
 * const selectFantasyBooks = createSelector(
 *   selectFictionBooks,
 *   (fictionBooks) => fictionBooks.filter(book => book.genre === 'fantasy')
 * );
 * 
 * // 複数の本棚から特定の著者の本を検索するセレクター
 * const selectBooksByAuthor = (authorName: string) => createSelector(
 *   selectFictionBooks,
 *   selectScienceBooks,
 *   selectHistoryBooks,
 *   (fiction, science, history) => {
 *     const allBooks = [...fiction, ...science, ...history];
 *     return allBooks.filter(book => book.author === authorName);
 *   }
 * );
 * ```
 * 
 * 重要なポイント：
 * - 図書館の配置（状態の構造）が変わっても、入力セレクターだけ更新すれば良い
 * - 例えば、小説と科学書が合併して「一般書籍」になっても、selectFictionBooksセレクターだけ
 *   変更すれば、それを使用するすべてのセレクターは自動的に正しく動作する
 * 
 * 実際のNgRxアプリケーションでの例：
 * 
 * ```typescript
 * // 機能状態を選択するFeatureSelector
 * export const selectProductsState = createFeatureSelector<AppState, ProductsState>('products');
 * export const selectCartState = createFeatureSelector<AppState, CartState>('cart');
 * export const selectUserState = createFeatureSelector<AppState, UserState>('user');
 * 
 * // 基本的なセレクター
 * export const selectAllProducts = createSelector(
 *   selectProductsState,
 *   (state) => state.items
 * );
 * 
 * export const selectCartItems = createSelector(
 *   selectCartState,
 *   (state) => state.items
 * );
 * ```
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
 * 複合セレクターの役割と利点 - レストランの例で理解する
 * 
 * 複合セレクターは「材料から料理を作るシェフ」のようなものです。
 * 
 * 【具体例：レストランのメニュー作成】
 * 
 * レストランでは、在庫の食材（状態）から様々なメニュー（派生データ）を作ります：
 * 
 * ```typescript
 * // レストランの状態
 * interface Restaurant {
 *   ingredients: {
 *     vegetables: string[];
 *     meats: string[];
 *     spices: string[];
 *   };
 *   chefs: {
 *     available: number;
 *     specialties: string[];
 *   };
 *   customers: {
 *     currentCount: number;
 *     preferences: string[];
 *   };
 * }
 * 
 * // 入力セレクター
 * const selectIngredients = (state: Restaurant) => state.ingredients;
 * const selectChefs = (state: Restaurant) => state.chefs;
 * const selectCustomers = (state: Restaurant) => state.customers;
 * 
 * // 複合セレクター：今日提供できるメニュー
 * const selectAvailableMenuItems = createSelector(
 *   selectIngredients,
 *   selectChefs,
 *   (ingredients, chefs) => {
 *     const menuItems = [];
 *     
 *     // 野菜と肉があればサラダを提供可能
 *     if (ingredients.vegetables.length >= 3) {
 *       menuItems.push({ name: 'ミックスサラダ', price: 800, type: 'appetizer' });
 *     }
 *     
 *     // 肉と特定のスパイスがあればステーキを提供可能
 *     if (ingredients.meats.includes('beef') && ingredients.spices.includes('pepper')) {
 *       menuItems.push({ name: 'ビーフステーキ', price: 2500, type: 'main' });
 *     }
 *     
 *     // イタリア料理のシェフがいればパスタを提供可能
 *     if (chefs.specialties.includes('italian')) {
 *       menuItems.push({ name: 'パスタ', price: 1200, type: 'main' });
 *     }
 *     
 *     return menuItems;
 *   }
 * );
 * 
 * // さらに複合的なセレクター：お客さんの好みに合わせたおすすめメニュー
 * const selectRecommendedMenuItems = createSelector(
 *   selectAvailableMenuItems,
 *   selectCustomers,
 *   (menuItems, customers) => {
 *     // お客さんの好みに基づいてメニューをフィルタリング
 *     return menuItems.filter(item => 
 *       customers.preferences.includes(item.type)
 *     );
 *   }
 * );
 * ```
 * 
 * この例では：
 * 1. 基本的な材料や情報を取得する入力セレクター
 * 2. それらを組み合わせて「提供可能なメニュー」を作る複合セレクター
 * 3. さらに「お客さんの好み」も考慮した「おすすめメニュー」を作る高次の複合セレクター
 * 
 * 複合セレクターの具体的な利点：
 * 
 * 1. 再利用性：一度作ったセレクターは複数の場所で使える
 *    - 例：「提供可能なメニュー」セレクターはメニュー表示画面でもキッチン管理画面でも使える
 * 
 * 2. パフォーマンス：材料が変わらなければ再計算しない
 *    - 例：野菜の在庫が変わっても、シェフの情報が同じなら一部の計算だけ再実行
 * 
 * 3. 関心の分離：それぞれのセレクターが一つの責任だけを持つ
 *    - 例：「提供可能なメニュー」と「お客さんの好み」は別々のセレクターで管理
 * 
 * 4. テスト容易性：純粋関数なので入力と出力だけをテストすればOK
 *    - 例：「野菜3種類、肉2種類、イタリア料理シェフあり」という入力に対して
 *      「サラダ、ステーキ、パスタ」というメニューが返ってくることをテスト
 */

/**
 * NgRxにおける複合セレクターの実践例 - 具体的なユースケース
 * 
 * 【具体例：Todoアプリ】
 * 
 * Todoアプリで、タスクのフィルタリングと統計情報を表示する例を考えてみましょう：
 * 
 * ```typescript
 * // アプリの状態
 * interface AppState {
 *   todos: {
 *     items: Todo[];
 *     filter: {
 *       status: 'all' | 'active' | 'completed';
 *       priority: 'all' | 'high' | 'medium' | 'low';
 *     };
 *   };
 * }
 * 
 * // 入力セレクター
 * export const selectTodos = (state: AppState) => state.todos.items;
 * export const selectFilter = (state: AppState) => state.todos.filter;
 * 
 * // フィルタリングされたTodoを取得するセレクター
 * export const selectFilteredTodos = createSelector(
 *   selectTodos,
 *   selectFilter,
 *   (todos, filter) => {
 *     return todos.filter(todo => {
 *       // ステータスでフィルタリング
 *       if (filter.status === 'active' && todo.completed) return false;
 *       if (filter.status === 'completed' && !todo.completed) return false;
 *       
 *       // 優先度でフィルタリング
 *       if (filter.priority !== 'all' && todo.priority !== filter.priority) return false;
 *       
 *       return true;
 *     });
 *   }
 * );
 * ```
 * 
 * このセレクターをコンポーネントで使用する例：
 * 
 * ```typescript
 * @Component({
 *   selector: 'app-todo-list',
 *   template: `
 *     <div *ngFor="let todo of filteredTodos$ | async">
 *       <input type="checkbox" [checked]="todo.completed" (change)="toggleTodo(todo.id)">
 *       <span [class.completed]="todo.completed">{{ todo.title }}</span>
 *       <span class="priority priority-{{ todo.priority }}">{{ todo.priority }}</span>
 *     </div>
 *   `,
 *   changeDetection: ChangeDetectionStrategy.OnPush
 * })
 * export class TodoListComponent {
 *   filteredTodos$ = this.store.select(selectFilteredTodos);
 *   
 *   constructor(private store: Store<AppState>) {}
 *   
 *   toggleTodo(id: number) {
 *     this.store.dispatch(toggleTodo({ id }));
 *   }
 * }
 * ```
 * 
 * 統計情報を表示するセレクターの例：
 * 
 * ```typescript
 * // 完了したタスクの数を計算するセレクター
 * export const selectCompletedCount = createSelector(
 *   selectTodos,
 *   (todos) => todos.filter(todo => todo.completed).length
 * );
 * 
 * // 残りのタスクの数を計算するセレクター
 * export const selectRemainingCount = createSelector(
 *   selectTodos,
 *   (todos) => todos.filter(todo => !todo.completed).length
 * );
 * 
 * // 優先度ごとのタスク数を計算するセレクター
 * export const selectPriorityCounts = createSelector(
 *   selectTodos,
 *   (todos) => {
 *     return {
 *       high: todos.filter(todo => todo.priority === 'high').length,
 *       medium: todos.filter(todo => todo.priority === 'medium').length,
 *       low: todos.filter(todo => todo.priority === 'low').length
 *     };
 *   }
 * );
 * 
 * // ダッシュボード用の統計情報を計算するセレクター
 * export const selectTodoStats = createSelector(
 *   selectCompletedCount,
 *   selectRemainingCount,
 *   selectPriorityCounts,
 *   (completed, remaining, priorityCounts) => ({
 *     completed,
 *     remaining,
 *     total: completed + remaining,
 *     percentComplete: completed / (completed + remaining) * 100,
 *     priorityCounts
 *   })
 * );
 * ```
 * 
 * ダッシュボードコンポーネントでの使用例：
 * 
 * ```typescript
 * @Component({
 *   selector: 'app-todo-stats',
 *   template: `
 *     <div *ngIf="todoStats$ | async as stats">
 *       <div class="progress-bar" [style.width.%]="stats.percentComplete"></div>
 *       <div>完了: {{ stats.completed }} / {{ stats.total }} ({{ stats.percentComplete | number:'1.0-0' }}%)</div>
 *       <div>残り: {{ stats.remaining }}</div>
 *       <div class="priorities">
 *         <span class="priority high">高: {{ stats.priorityCounts.high }}</span>
 *         <span class="priority medium">中: {{ stats.priorityCounts.medium }}</span>
 *         <span class="priority low">低: {{ stats.priorityCounts.low }}</span>
 *       </div>
 *     </div>
 *   `,
 *   changeDetection: ChangeDetectionStrategy.OnPush
 * })
 * export class TodoStatsComponent {
 *   todoStats$ = this.store.select(selectTodoStats);
 *   
 *   constructor(private store: Store<AppState>) {}
 * }
 * ```
 * 
 * この例では：
 * 1. 基本的なセレクター（selectTodos, selectFilter）が状態から直接データを取得
 * 2. 複合セレクター（selectFilteredTodos）がフィルタリングロジックを実装
 * 3. さらに高度な複合セレクター（selectTodoStats）が統計情報を計算
 * 4. コンポーネントは単純にセレクターを使用するだけで、複雑なロジックを気にする必要がない
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
