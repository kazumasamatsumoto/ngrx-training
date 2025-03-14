/**
 * Chapter 12: アクション（Action）
 *
 * このファイルでは、ReduxやNgRxで使用されるアクションの実装を示しています。
 * アクションは、状態の変更を表すプレーンなJavaScriptオブジェクトです。
 * 
 * 【アクションとは何か？】
 * アクションは、アプリケーション内で「何が起きたか」を表現するオブジェクトです。
 * Redux/NgRxのフローにおいて、状態（State）を変更する唯一の方法はアクションをディスパッチ
 * （発行）することです。アクションはイベントのようなものと考えることができます。
 *
 * アクションの特徴:
 * 1. type プロパティ: アクションの種類を識別する文字列。必須プロパティで、通常は大文字と
 *    アンダースコアを使用した定数として定義されます（例: 'INCREMENT', 'ADD_TODO'）。
 * 2. payload: アクションに関連するデータ（オプション）。状態の更新に必要な情報を含みます。
 *    例えば、新しいTODOを追加する場合はTODOの内容、ユーザー情報を設定する場合はユーザーオブジェクトなど。
 * 3. meta: アクションに関するメタデータ（オプション）。ペイロードには含めたくないが、
 *    アクションに関連する追加情報（タイムスタンプ、リクエストID、ソース情報など）を格納します。
 * 4. error: エラーを表すフラグ（オプション）。trueの場合、このアクションがエラーを表すことを示します。
 *    通常、エラーアクションのpayloadにはエラーオブジェクトが含まれます。
 *
 * アクションは「何が起きたか」を表現するだけで、「どのように状態を変更するか」は
 * リデューサーの責務です。この明確な責任分担がRedux/NgRxアーキテクチャの強みの一つです。
 *
 * なぜアクションが重要なのか？
 *
 * 【明示的な状態変更の意図】
 * アクションは、アプリケーション内で「何が起きたか」を明示的に表現します。
 * これにより、状態変更の意図が明確になり、コードの可読性と理解しやすさが向上します。
 * 
 * 例えば、直接state.count++のように状態を変更するのではなく、{ type: 'INCREMENT' }という
 * アクションをディスパッチすることで、「カウントを増やす意図がある」ことを明示します。
 *
 * 例えば、「ユーザーがログインした」「商品がカートに追加された」「データの読み込みが
 * 開始された」など、アプリケーション内のイベントがアクションとして明示的に表現されます。
 *
 * 【イベントソーシング】
 * アクションは、アプリケーションの「イベント履歴」として機能します。
 * すべての状態変更がアクションとして記録されるため、アプリケーションの状態変化の
 * 完全な履歴を追跡できます。これは「イベントソーシング」と呼ばれるパターンの基盤です。
 *
 * この履歴を利用することで、デバッグが容易になり、「時間旅行デバッギング」や
 * 状態の再現が可能になります。また、アナリティクスやログ記録にも活用できます。
 * 
 * Redux DevToolsなどのツールを使用すると、ディスパッチされたアクションの履歴を確認し、
 * 特定の時点の状態に戻ることができます。これにより、バグの再現や状態変化の追跡が容易になります。
 *
 * 【関心の分離】
 * アクションは「何が起きたか」だけを表現し、「どのように状態を変更するか」は
 * リデューサーの責務です。この分離により、コードの責務が明確になり、
 * テストや保守が容易になります。
 * 
 * この分離により、アクションとリデューサーを個別にテストできます。アクションクリエイターは
 * 正しいアクションオブジェクトを生成するか、リデューサーは特定のアクションに対して正しく
 * 状態を更新するか、といった単体テストが書きやすくなります。
 *
 * 【シリアライズ可能性】
 * アクションはプレーンなJavaScriptオブジェクトであり、シリアライズ可能です。
 * これにより、アクションをネットワーク経由で送信したり、ストレージに保存したり、
 * デバッグツールで表示したりすることが容易になります。
 * 
 * シリアライズ可能であることは、状態の永続化や、サーバーとクライアント間での状態の同期、
 * 時間旅行デバッギングなどの機能を実現する上で重要です。そのため、アクションには関数や
 * シンボル、Promiseなどのシリアライズできないデータを含めるべきではありません。
 *
 * 【ミドルウェアとの連携】
 * アクションは、ミドルウェア（非同期処理、ログ記録、分析など）と連携するための
 * 統一されたインターフェースを提供します。ミドルウェアはアクションをインターセプトして
 * 処理できるため、アプリケーションの機能を拡張しやすくなります。
 * 
 * 例えば、Redux ThunkやNgRx Effectsを使用すると、アクションに応じて非同期処理を実行し、
 * その結果に基づいて新たなアクションをディスパッチすることができます。また、ログミドルウェアを
 * 使用すると、すべてのアクションをログに記録することができます。
 */

// 基本的なアクション
// 最もシンプルなアクションは、typeプロパティだけを持つオブジェクト
const incrementAction = { type: "INCREMENT" }; // カウントを増やす
const decrementAction = { type: "DECREMENT" }; // カウントを減らす
const resetAction = { type: "RESET" }; // カウントをリセット

/**
 * 【基本的なアクションの解説】
 * 
 * 上記の3つのアクションは、カウンター機能に関連する最もシンプルなアクションの例です。
 * これらはtypeプロパティのみを持ち、追加のデータ（ペイロード）を必要としません。
 * 
 * incrementAction: カウンターの値を1増やすことを表します。
 * decrementAction: カウンターの値を1減らすことを表します。
 * resetAction: カウンターの値を初期値（通常は0）にリセットすることを表します。
 * 
 * これらのアクションは、ユーザーがUIのボタンをクリックした時などにディスパッチされます。
 * 例えば、「+」ボタンがクリックされたらincrementActionを、「-」ボタンがクリックされたら
 * decrementActionを、「リセット」ボタンがクリックされたらresetActionをディスパッチします。
 * 
 * リデューサーは、これらのアクションのtypeに基づいて、状態をどのように更新するかを決定します。
 * 例えば：
 * 
 * function counterReducer(state = 0, action) {
 *   switch (action.type) {
 *     case 'INCREMENT':
 *       return state + 1;
 *     case 'DECREMENT':
 *       return state - 1;
 *     case 'RESET':
 *       return 0;
 *     default:
 *       return state;
 *   }
 * }
 */

// ペイロードを持つアクション
// 追加のデータを含むアクション
const addNumberAction = {
  type: "ADD_NUMBER", // アクションタイプ
  payload: 5, // 追加する数値（ペイロード）
};

const setUserAction = {
  type: "SET_USER", // アクションタイプ
  payload: {
    id: 1,
    name: "山田太郎",
    email: "yamada@example.com",
  }, // ユーザー情報（ペイロード）
};

/**
 * 【ペイロードを持つアクションの解説】
 * 
 * 多くの場合、アクションは単に「何が起きたか」だけでなく、「どのようなデータと共に起きたか」
 * という情報も含める必要があります。この追加データを「ペイロード」と呼びます。
 * 
 * addNumberAction: 
 * - typeプロパティ 'ADD_NUMBER' は「数値を追加する」という操作を表します
 * - payloadプロパティには追加する数値 5 が含まれています
 * - このアクションがディスパッチされると、リデューサーは現在の状態にこの数値を加算します
 * - 例えば、ユーザーが「5を追加」ボタンをクリックした場合などに使用されます
 * 
 * setUserAction:
 * - typeプロパティ 'SET_USER' は「ユーザー情報を設定する」という操作を表します
 * - payloadプロパティには、設定するユーザーの詳細情報（id, name, email）が含まれています
 * - このアクションがディスパッチされると、リデューサーは状態のユーザー情報をこの新しい情報で置き換えます
 * - 例えば、ユーザーがログインした後や、プロフィール情報が更新された後などに使用されます
 * 
 * リデューサーでの処理例：
 * 
 * function counterReducer(state = 0, action) {
 *   switch (action.type) {
 *     // ...他のケース
 *     case 'ADD_NUMBER':
 *       return state + action.payload; // payloadの値を加算
 *     default:
 *       return state;
 *   }
 * }
 * 
 * function userReducer(state = null, action) {
 *   switch (action.type) {
 *     case 'SET_USER':
 *       return action.payload; // payloadのユーザー情報で状態を置き換え
 *     default:
 *       return state;
 *   }
 * }
 */

// メタデータを持つアクション
// アクション自体に関する情報を含むアクション
const fetchDataAction = {
  type: "FETCH_DATA", // アクションタイプ
  payload: { users: [{ id: 1, name: "山田" }] }, // 取得したデータ（ペイロード）
  meta: {
    timestamp: Date.now(), // アクションが作成された時刻
    source: "API", // データの出所
    requestId: "abc123", // リクエストの識別子
  }, // メタデータ
};

/**
 * 【メタデータを持つアクションの解説】
 * 
 * アクションには、ペイロード（主要データ）とは別に、アクション自体に関する情報を
 * 「メタデータ」として含めることができます。メタデータは、アクションの処理方法に影響を
 * 与えることなく、アクションに関する追加情報を提供します。
 * 
 * fetchDataAction:
 * - typeプロパティ 'FETCH_DATA' は「データを取得した」という操作を表します
 * - payloadプロパティには取得したユーザーデータが含まれています
 * - metaプロパティには以下の情報が含まれています：
 *   - timestamp: アクションが作成された時刻（デバッグやログ記録に有用）
 *   - source: データの出所（この場合は "API"）
 *   - requestId: リクエストの識別子（複数のリクエストを追跡する場合に有用）
 * 
 * メタデータの用途：
 * 1. ログ記録: アクションがいつ、どこから発生したかを記録
 * 2. デバッグ: 問題追跡のための追加情報を提供
 * 3. ミドルウェア処理: 特定のミドルウェアがメタデータに基づいて処理を行う
 * 4. 分析: ユーザー行動や操作のパターンを分析
 * 
 * 例えば、ログミドルウェアはメタデータのタイムスタンプを使用してアクションの発生時刻を記録したり、
 * キャッシュミドルウェアはrequestIdを使用して重複リクエストを防いだりすることができます。
 * 
 * リデューサーは通常、metaプロパティを直接使用しませんが、ミドルウェアやエフェクトでは
 * このメタデータを活用して高度な処理を行うことができます。
 */

// エラーアクション
// エラーを表すアクション
const errorAction = {
  type: "API_ERROR", // アクションタイプ
  error: true, // これがエラーアクションであることを示すフラグ
  payload: new Error("ネットワークエラーが発生しました"), // エラーオブジェクト（ペイロード）
};

/**
 * 【エラーアクションの解説】
 * 
 * アプリケーションでは、成功だけでなくエラーも処理する必要があります。
 * エラーアクションは、何らかの操作が失敗したことを表すための特殊なアクションです。
 * 
 * errorAction:
 * - typeプロパティ 'API_ERROR' はAPIリクエスト中にエラーが発生したことを表します
 * - errorプロパティが true に設定されており、これがエラーアクションであることを示します
 * - payloadプロパティにはエラーオブジェクトが含まれており、エラーの詳細情報を提供します
 * 
 * エラーアクションの処理：
 * 1. リデューサーでは、エラー状態を設定してUIにエラーを表示できるようにします
 * 2. ミドルウェアでは、エラーをログに記録したり、リトライ処理を行ったりします
 * 3. UIコンポーネントでは、エラーメッセージを表示してユーザーに通知します
 * 
 * リデューサーでの処理例：
 * 
 * function apiReducer(state = { data: null, loading: false, error: null }, action) {
 *   switch (action.type) {
 *     case 'API_REQUEST':
 *       return { ...state, loading: true, error: null };
 *     case 'API_SUCCESS':
 *       return { ...state, loading: false, data: action.payload, error: null };
 *     case 'API_ERROR':
 *       return { ...state, loading: false, error: action.payload.message };
 *     default:
 *       return state;
 *   }
 * }
 * 
 * エラーアクションを使用することで、アプリケーション全体でエラー処理を統一的に行うことができ、
 * ユーザー体験の向上やデバッグの容易さにつながります。
 */

// アクションクリエイター（関数）
// アクションオブジェクトを作成する関数
// これにより、アクションの作成を抽象化し、再利用可能にする
function addTodo(text) {
  return {
    type: "ADD_TODO",
    payload: {
      id: Date.now(), // 一意のID（現在のタイムスタンプ）
      text, // TODOのテキスト
      completed: false, // 初期状態は未完了
    },
  };
}

function toggleTodo(id) {
  return {
    type: "TOGGLE_TODO",
    payload: id, // 切り替えるTODOのID
  };
}

function removeTodo(id) {
  return {
    type: "REMOVE_TODO",
    payload: id, // 削除するTODOのID
  };
}

/**
 * 【アクションクリエイターの解説】
 * 
 * アクションクリエイターは、アクションオブジェクトを作成する関数です。
 * アクションクリエイターを使用する主な理由は以下の通りです：
 * 
 * 1. コードの再利用性: 同じアクションを複数の場所でディスパッチする場合、
 *    毎回アクションオブジェクトを手動で作成する代わりに、アクションクリエイターを呼び出すだけで済みます。
 * 
 * 2. カプセル化: アクションの内部構造をカプセル化し、アクションを使用するコードから
 *    その詳細を隠蔽します。将来アクションの構造が変わっても、アクションクリエイターの
 *    実装だけを変更すれば、それを使用するコードは変更不要です。
 * 
 * 3. 型安全性: TypeScriptなどの型システムと組み合わせると、アクションクリエイターは
 *    型安全なアクションの作成を保証します。
 * 
 * 上記の例では、TODOリストに関連する3つのアクションクリエイターを定義しています：
 * 
 * addTodo(text):
 * - 新しいTODOアイテムを追加するアクションを作成します
 * - 引数としてTODOのテキストを受け取ります
 * - 返されるアクションには、一意のID、テキスト、完了状態（初期値はfalse）を含むペイロードがあります
 * - 使用例: dispatch(addTodo('買い物に行く'));
 * 
 * toggleTodo(id):
 * - 特定のTODOアイテムの完了状態を切り替えるアクションを作成します
 * - 引数としてTODOのIDを受け取ります
 * - 返されるアクションには、切り替えるTODOのIDをペイロードとして含みます
 * - 使用例: dispatch(toggleTodo(123));
 * 
 * removeTodo(id):
 * - 特定のTODOアイテムを削除するアクションを作成します
 * - 引数としてTODOのIDを受け取ります
 * - 返されるアクションには、削除するTODOのIDをペイロードとして含みます
 * - 使用例: dispatch(removeTodo(456));
 * 
 * NgRxでは、createActionという関数を使用してアクションクリエイターを定義することが一般的です：
 * 
 * export const addTodo = createAction(
 *   '[Todo] Add Todo',
 *   props<{ text: string }>()
 * );
 * 
 * export const toggleTodo = createAction(
 *   '[Todo] Toggle Todo',
 *   props<{ id: number }>()
 * );
 * 
 * export const removeTodo = createAction(
 *   '[Todo] Remove Todo',
 *   props<{ id: number }>()
 * );
 */

// 非同期アクションクリエイター（Redux Thunkスタイル）
// 非同期処理を含むアクションクリエイター
// Redux Thunkミドルウェアを使用すると、関数を返すアクションクリエイターを作成できる
function fetchUsers() {
  // 実際のアプリケーションではdispatchが引数として渡される
  return function (dispatch) {
    // 開始アクションをディスパッチ
    dispatch({ type: "FETCH_USERS_START" });

    // APIリクエスト（ここではシミュレーション）
    setTimeout(() => {
      try {
        // 成功時
        const users = [
          { id: 1, name: "田中" },
          { id: 2, name: "鈴木" },
        ];
        dispatch({
          type: "FETCH_USERS_SUCCESS",
          payload: users,
        });
      } catch (error) {
        // エラー時
        dispatch({
          type: "FETCH_USERS_ERROR",
          error: true,
          payload: error,
        });
      }
    }, 1000);
  };
}

/**
 * 【非同期アクションクリエイターの解説】
 * 
 * 多くのアプリケーションでは、APIリクエストやタイマーなどの非同期処理を扱う必要があります。
 * 通常のアクションは同期的なオブジェクトですが、非同期処理を扱うためには特別な仕組みが必要です。
 * 
 * Redux Thunkは、この問題を解決するための一般的なミドルウェアです。Thunkを使用すると、
 * アクションクリエイターはオブジェクトの代わりに関数を返すことができます。
 * 
 * fetchUsers関数の詳細解説：
 * 
 * 1. 関数を返す関数：
 *    fetchUsersは、dispatchを引数として受け取る別の関数を返します。
 *    この内部関数は、Redux Thunkミドルウェアによって実行され、dispatchメソッドが渡されます。
 * 
 * 2. 非同期フロー制御：
 *    - まず、FETCH_USERS_STARTアクションをディスパッチして、データ取得の開始を通知します。
 *      これにより、UIでローディングインジケーターを表示するなどの処理が可能になります。
 *    
 *    - 次に、setTimeout（実際のアプリケーションではfetchやaxiosなどを使用）で
 *      非同期処理をシミュレーションしています。
 *    
 *    - 処理が成功すると、FETCH_USERS_SUCCESSアクションをディスパッチし、
 *      取得したユーザーデータをペイロードとして渡します。
 *    
 *    - エラーが発生した場合は、FETCH_USERS_ERRORアクションをディスパッチし、
 *      エラー情報をペイロードとして渡します。
 * 
 * 3. 状態管理：
 *    この一連のアクションにより、アプリケーションの状態を以下のように管理できます：
 *    - 読み込み中（loading: true）
 *    - 成功時（data: users, loading: false）
 *    - エラー時（error: errorMessage, loading: false）
 * 
 * NgRxでの非同期処理：
 * NgRxでは、Effectsを使用して非同期処理を扱います。例えば：
 * 
 * @Injectable()
 * export class UserEffects {
 *   loadUsers$ = createEffect(() => 
 *     this.actions$.pipe(
 *       ofType('[Users] Load Users'),
 *       mergeMap(() => 
 *         this.userService.getUsers().pipe(
 *           map(users => ({ type: '[Users] Load Success', payload: users })),
 *           catchError(error => of({ type: '[Users] Load Failure', error }))
 *         )
 *       )
 *     )
 *   );
 *   
 *   constructor(
 *     private actions$: Actions,
 *     private userService: UserService
 *   ) {}
 * }
 * 
 * Redux ThunkとNgRx Effectsの違い：
 * - Redux Thunk: アクションクリエイターが関数を返し、その関数内で複数のアクションをディスパッチ
 * - NgRx Effects: アクションをリッスンし、副作用（APIリクエストなど）を実行して新しいアクションを返す
 * 
 * どちらのアプローチも、非同期処理の結果に基づいて状態を更新するという同じ目的を達成します。
 */

// アクションの使用例（実際のReduxストアがあれば）
console.log("基本的なアクション:");
console.log(incrementAction);
console.log(decrementAction);
console.log(resetAction);

console.log("\nペイロードを持つアクション:");
console.log(addNumberAction);
console.log(setUserAction);

console.log("\nメタデータを持つアクション:");
console.log(fetchDataAction);

console.log("\nエラーアクション:");
console.log(errorAction);

console.log("\nアクションクリエイターで生成したアクション:");
console.log(addTodo("買い物に行く"));
console.log(toggleTodo(123));
console.log(removeTodo(456));

console.log("\n非同期アクションクリエイター:");
console.log(fetchUsers.toString());
console.log("※実際の実行には Redux Thunk ミドルウェアが必要です");

/**
 * アクションの重要なポイント:
 *
 * 1. シリアライズ可能: アクションは通常、シリアライズ可能なオブジェクトであるべき
 *    （関数やシンボルなどを含まない）
 *    
 *    シリアライズ可能なアクションを使用することで、Redux DevToolsなどのデバッグツールが
 *    正常に機能し、状態の永続化や時間旅行デバッギングが可能になります。
 *    
 *    例外: Redux Thunkを使用する場合、アクションクリエイターは関数を返しますが、
 *    これはミドルウェアによって処理され、最終的にディスパッチされるのは
 *    シリアライズ可能なアクションオブジェクトです。
 *
 * 2. 命名規則: アクションタイプには通常、大文字とアンダースコアを使用する
 *    （例: ADD_TODO, FETCH_USERS_SUCCESS）
 *    
 *    NgRxでは、'[Domain] Event Description'という形式が推奨されています。
 *    例: '[Auth] Login Success', '[Todo List] Add Item'
 *    
 *    この命名規則により、アクションの発生源（ドメイン）とイベントの種類が明確になり、
 *    デバッグやログ分析が容易になります。
 *
 * 3. アクションクリエイター: 実際のアプリケーションでは、アクションオブジェクトを
 *    直接作成するのではなく、アクションクリエイター関数を使用することが一般的
 *    
 *    アクションクリエイターを使用する利点：
 *    - コードの再利用性の向上
 *    - タイプミスの防止（文字列リテラルの代わりに関数呼び出し）
 *    - TypeScriptと組み合わせた場合の型安全性
 *    - アクション構造の変更が容易（一箇所の変更で全体に反映）
 *    
 *    NgRxでは、createAction関数を使用してタイプセーフなアクションクリエイターを作成します。
 *
 * 4. 非同期アクション: 非同期処理を扱うには、Redux ThunkやRedux Saga、NgRx Effectsなどの
 *    ミドルウェアやエフェクトを使用する
 *    
 *    これらのライブラリは、非同期処理（APIリクエスト、タイマー、WebSocketなど）を
 *    Reduxのフローに統合するための異なるアプローチを提供します：
 *    
 *    - Redux Thunk: 最もシンプルなアプローチ。関数を返すアクションクリエイターを使用。
 *    - Redux Saga: ジェネレーター関数を使用して複雑な非同期フローを宣言的に記述。
 *    - NgRx Effects: RxJSのObservableを使用して副作用を処理。
 *    
 *    選択するライブラリは、アプリケーションの複雑さと要件によって異なります。
 *
 * 5. アクションの粒度: アクションは適切な粒度で設計する
 *    
 *    - 細かすぎるアクション: 多数のアクションが発生し、コードが複雑になる可能性
 *    - 粗すぎるアクション: 1つのアクションで多くの状態が変更され、予測可能性が低下
 *    
 *    適切な粒度は、「1つのユーザーインタラクションまたはシステムイベントに対して
 *    1つのアクション」を目安にすると良いでしょう。
 *
 * ReduxやNgRxでは、アクションはイベントとして扱われ、「何が起きたか」を表現します。
 * これにより、状態の変更が予測可能になり、デバッグやテストが容易になります。
 * 
 * アクションを適切に設計することで、アプリケーションの動作を理解しやすくなり、
 * 保守性と拡張性が向上します。また、アクションの履歴を見るだけで、アプリケーションで
 * 何が起きたかを時系列で追跡できるようになります。
 */
