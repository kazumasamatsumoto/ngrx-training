/**
 * Chapter 10: ストア（Store）の実装
 *
 * このファイルでは、NgRxの中核となるストア（Store）の簡易的な実装を示しています。
 * ストアは、アプリケーションの状態を保持し、状態の更新と通知を管理する中央リポジトリです。
 *
 * ストアの主な責務:
 * 1. 状態の保持: アプリケーションの状態を単一のオブジェクトとして保持
 * 2. 状態の更新: アクションをディスパッチして状態を更新
 * 3. 変更通知: 状態が変更されたときにObservableを通じて通知
 * 4. 状態の取得: 現在の状態を取得するためのSelectorを提供
 *
 * なぜストアが重要なのか？
 *
 * 【単一の信頼できる情報源（Single Source of Truth）】
 * 従来のアプリケーションでは、状態が複数の場所に分散していることがよくありました。
 * これにより、状態の同期や整合性の維持が難しくなり、バグの原因となっていました。
 *
 * ストアは、アプリケーション全体の状態を単一の場所に集約することで、この問題を解決します。
 * これにより：
 * 1. 状態の追跡が容易になる（どこで何が変更されたかが明確）
 * 2. デバッグが簡単になる（状態の変化を時系列で追跡できる）
 * 3. データの整合性が保証される（競合する更新を避けられる）
 *
 * 【リアクティブな状態管理】
 * NgRxはRxJSのObservableを使用して状態の変更を通知します。
 * これにより、UIは状態の変更に自動的に反応し、常に最新の状態を表示できます。
 * 
 * Angularのテンプレートでは、非同期パイプ（async pipe）を使用して
 * Observableを簡単にバインドできます：
 * ```html
 * <div>{{ count$ | async }}</div>
 * ```
 *
 * 【状態の分離】
 * ストアパターンでは、状態の管理ロジックとUIロジックが明確に分離されます。
 * これにより、それぞれを独立してテストでき、コードの保守性が向上します。
 */

//==============================================================================
// RxJSの簡易実装（実際のコードでは本物のRxJSを使用します）
//==============================================================================

// BehaviorSubject: 最新の値を保持し、新しいサブスクライバーに通知するObservable
class BehaviorSubject {
  constructor(initialValue) {
    this.value = initialValue;
    this.observers = [];
  }

  // 新しい値を設定し、すべてのオブザーバーに通知
  next(value) {
    this.value = value;
    this.observers.forEach(observer => observer(value));
  }

  // 現在の値を取得
  getValue() {
    return this.value;
  }

  // オブザーバーを登録し、現在の値を通知
  subscribe(observer) {
    // 関数として扱う
    const callback = typeof observer === 'function' ? observer : value => observer.next(value);
    this.observers.push(callback);
    callback(this.value); // 初期値を通知
    
    // サブスクリプションを解除するための関数を返す
    return {
      unsubscribe: () => {
        const index = this.observers.indexOf(callback);
        if (index !== -1) {
          this.observers.splice(index, 1);
        }
      }
    };
  }

  // オペレーターを適用するためのpipeメソッド
  pipe(operator1, operator2) {
    // 簡略化のため、最大2つのオペレーターのみサポート
    const result = operator1(this);
    return operator2 ? operator2(result) : result;
  }
}

// Observable: 値の流れを表現するクラス
class Observable {
  constructor(subscribeFn) {
    this.subscribeFn = subscribeFn;
  }

  // オブザーバーを登録
  subscribe(observer) {
    return this.subscribeFn(observer);
  }

  // オペレーターを適用するためのpipeメソッド
  pipe(operator1, operator2) {
    const result = operator1(this);
    return operator2 ? operator2(result) : result;
  }
}

// map: 値を変換するオペレーター
function map(project) {
  return (source) => {
    return new Observable(observer => {
      const subscription = source.subscribe(value => {
        const projected = project(value);
        if (typeof observer === 'function') {
          observer(projected);
        } else {
          observer.next(projected);
        }
      });
      return subscription;
    });
  };
}

// distinctUntilChanged: 値が変わったときだけ通知するオペレーター
function distinctUntilChanged() {
  return (source) => {
    return new Observable(observer => {
      let lastValue;
      let firstValue = true;
      
      const subscription = source.subscribe(value => {
        if (firstValue || value !== lastValue) {
          firstValue = false;
          lastValue = value;
          if (typeof observer === 'function') {
            observer(value);
          } else {
            observer.next(value);
          }
        }
      });
      
      return subscription;
    });
  };
}

//==============================================================================
// NgRx風のストア実装
//==============================================================================

// ストアクラス: 状態を保持し、更新と通知を管理
class Store {
  constructor(initialState) {
    // 状態を保持するBehaviorSubject
    this.state$ = new BehaviorSubject(initialState);
  }

  // 状態を取得するためのObservableを返す
  // 実際のNgRxでは、コンポーネントで以下のように使用します：
  // this.count$ = this.store.select(state => state.count);
  // <div>{{ count$ | async }}</div>
  select(selectorFn) {
    return this.state$.pipe(
      map(selectorFn),
      distinctUntilChanged()
    );
  }

  // 現在の状態を取得
  getState() {
    return this.state$.getValue();
  }

  // 状態を更新
  // 実際のNgRxでは、アクションをディスパッチして状態を更新します
  setState(newState) {
    console.log("状態を更新:", newState);
    this.state$.next(newState);
  }
}

//==============================================================================
// ストアの使用例
//==============================================================================

// 初期状態
const initialState = { count: 0 };

// ストアを作成
const store = new Store(initialState);

// UIを更新する関数（Angularコンポーネントの役割）
function updateUI(count) {
  console.log(`UIを更新: カウント = ${count}`);
  // 実際のアプリケーションでは、ここでDOMを更新するなどの処理を行う
}

// ログを記録する関数
function logState(state) {
  console.log(`ログ: 新しい状態 = ${JSON.stringify(state)}`);
  // 実際のアプリケーションでは、ここでログサーバーに送信するなどの処理を行う
}

// 状態の変更を監視（Observableのサブスクリプション）
console.log("--- サブスクリプションの登録 ---");
const countSubscription = store.select(state => state.count).subscribe(updateUI);
const stateSubscription = store.select(state => state).subscribe(logState);

// 状態を更新
console.log("\n--- カウントを1に更新 ---");
store.setState({ count: 1 });

console.log("\n--- カウントを2に更新 ---");
store.setState({ count: 2 });

console.log("\n--- カウントを7に更新 ---");
store.setState({ count: 7 });

// UIの更新を停止（サブスクリプションの解除）
console.log("\n--- UIサブスクリプションを解除 ---");
countSubscription.unsubscribe();

console.log("\n--- カウントを6に更新（UIサブスクリプション解除後） ---");
store.setState({ count: 6 });

// 現在の状態を取得
console.log("\n--- 現在の状態 ---");
console.log(store.getState());

// すべてのサブスクリプションを解除
console.log("\n--- すべてのサブスクリプションを解除 ---");
stateSubscription.unsubscribe();

console.log("\n--- カウントを0に更新（すべてのサブスクリプション解除後） ---");
store.setState({ count: 0 });

/**
 * NgRxストアの重要なポイント:
 *
 * 1. 単一の状態ツリー: アプリケーションの状態は単一のオブジェクトとして保持される
 * 2. 読み取り専用の状態: 状態は直接変更できず、アクションをディスパッチすることでのみ変更可能
 * 3. リアクティブプログラミング: RxJSのObservableを使用して状態の変更を監視し、UIを更新
 * 4. セレクター: 状態から特定のデータを取得するための関数
 * 5. サブスクリプション管理: コンポーネントのライフサイクルに合わせてサブスクリプションを解除
 *
 * 実際のNgRxでは、アクションとリデューサーを使用して状態を更新します。
 * アクションは「何が起きたか」を表し、リデューサーは「状態をどう変更するか」を定義します。
 * これらの詳細については、次のチャプター（Chapter 11: リデューサー）で説明します。
 */
