/**
 * 第16章: リアクティブプログラミングによる状態管理
 *
 * このファイルでは、RxJSライブラリを模倣したリアクティブプログラミングの実装を示しています。
 * リアクティブプログラミングは、データストリームと変更の伝播に焦点を当てたプログラミングパラダイムです。
 *
 * リアクティブプログラミングの主要な概念:
 * 1. オブザーバブル (Observable) - 時間とともに値を発行するデータストリーム
 * 2. オブザーバー (Observer) - オブザーバブルからの値を受け取るコールバック関数
 * 3. サブスクリプション (Subscription) - オブザーバブルの購読を表し、解除するための手段を提供
 * 4. オペレーター (Operator) - ストリームを変換、結合、フィルタリングするための関数
 * 5. サブジェクト (Subject) - オブザーバブルであり、オブザーバーでもあるオブジェクト
 *
 * リアクティブプログラミングの利点:
 * - 宣言的 - データフローを宣言的に記述できる
 * - 非同期処理 - 非同期イベントを統一的に扱える
 * - 合成可能性 - ストリームを組み合わせて複雑なデータフローを構築できる
 * - 状態管理 - 状態の変更と伝播を効率的に管理できる
 *
 * このファイルでは、BehaviorSubjectの簡易実装と、map、combineLatest、filterなどの
 * 基本的なオペレーターを実装しています。これらを使用して、リアクティブな状態管理の
 * 基本的なパターンを示しています。
 */

// RxJSを使用したリアクティブプログラミングの例（実際のRxJSは使用していません）

/**
 * BehaviorSubjectの簡易実装
 * BehaviorSubjectは現在の値を保持し、新しい購読者に即座に最新の値を通知します
 *
 * @class BehaviorSubject
 */
class BehaviorSubject {
  /**
   * BehaviorSubjectを初期値で作成
   *
   * @param {any} initialValue - 初期値
   */
  constructor(initialValue) {
    this.value = initialValue;
    this.observers = [];
  }

  /**
   * 現在の値を取得
   *
   * @returns {any} - 現在の値
   */
  getValue() {
    return this.value;
  }

  /**
   * 新しい値を発行し、すべてのオブザーバーに通知
   *
   * @param {any} value - 発行する新しい値
   */
  next(value) {
    this.value = value;
    this.notifyObservers();
  }

  /**
   * オブザーバーを登録し、現在の値を即座に通知
   *
   * @param {Function} observer - 値を受け取るコールバック関数
   * @returns {Function} - 購読を解除するための関数
   */
  subscribe(observer) {
    this.observers.push(observer);

    // 購読時に現在の値を即座に通知
    observer(this.value);

    // 登録解除関数を返す
    return () => {
      const index = this.observers.indexOf(observer);
      if (index !== -1) {
        this.observers.splice(index, 1);
      }
    };
  }

  /**
   * すべてのオブザーバーに現在の値を通知
   */
  notifyObservers() {
    this.observers.forEach((observer) => observer(this.value));
  }
}

// カウンターの状態 - 基本となるBehaviorSubject
const count$ = new BehaviorSubject(0);

/**
 * mapオペレーター - ソースストリームの各値を変換する
 *
 * @param {BehaviorSubject} source$ - 元のストリーム
 * @param {Function} transformFn - 値を変換する関数
 * @returns {BehaviorSubject} - 変換された値を発行する新しいストリーム
 */
function map(source$, transformFn) {
  const result$ = new BehaviorSubject(transformFn(source$.getValue()));

  source$.subscribe((value) => {
    result$.next(transformFn(value));
  });

  return result$;
}

// カウントの2倍の値を発行するストリーム
const doubleCount$ = map(count$, (count) => count * 2);

/**
 * combineLatestオペレーター - 複数のストリームの最新値を組み合わせる
 *
 * @param {Array<BehaviorSubject>} streams - 組み合わせるストリームの配列
 * @param {Function} combineFn - 値を組み合わせる関数
 * @returns {BehaviorSubject} - 組み合わせた値を発行する新しいストリーム
 */
function combineLatest(streams, combineFn) {
  const values = streams.map((stream) => stream.getValue());
  const result$ = new BehaviorSubject(combineFn(...values));

  streams.forEach((stream, index) => {
    stream.subscribe((value) => {
      values[index] = value;
      result$.next(combineFn(...values));
    });
  });

  return result$;
}

// カウントとその2倍の値を組み合わせるストリーム
const combined$ = combineLatest(
  [count$, doubleCount$],
  (count, doubleCount) => ({ count, doubleCount })
);

/**
 * filterオペレーター - 条件に一致する値のみを通過させる
 *
 * @param {BehaviorSubject} source$ - 元のストリーム
 * @param {Function} predicateFn - フィルター条件を判定する関数
 * @returns {BehaviorSubject} - フィルターされた値を発行する新しいストリーム
 */
function filter(source$, predicateFn) {
  const initialValue = source$.getValue();
  const result$ = new BehaviorSubject(
    predicateFn(initialValue) ? initialValue : null
  );

  source$.subscribe((value) => {
    if (predicateFn(value)) {
      result$.next(value);
    }
  });

  return result$;
}

// 偶数のカウントのみを通過させるストリーム
const evenCount$ = filter(count$, (count) => count % 2 === 0);

/**
 * UIを更新する関数群
 * 実際のアプリケーションでは、DOMを更新するか、
 * フレームワークのコンポーネントを更新します
 */
function updateUI(count) {
  console.log(`UIを更新: カウント = ${count}`);
}

function updateDoubleUI(doubleCount) {
  console.log(`UIを更新: 2倍のカウント = ${doubleCount}`);
}

function updateCombinedUI(combined) {
  console.log(`UIを更新: 組み合わせ = ${JSON.stringify(combined)}`);
}

function updateEvenUI(evenCount) {
  if (evenCount !== null) {
    console.log(`UIを更新: 偶数のカウント = ${evenCount}`);
  }
}

// ストリームをサブスクライブ - 各ストリームの値が変更されるたびにUIを更新
console.log("--- ストリームをサブスクライブ ---");
const subscription1 = count$.subscribe(updateUI);
const subscription2 = doubleCount$.subscribe(updateDoubleUI);
const subscription3 = combined$.subscribe(updateCombinedUI);
const subscription4 = evenCount$.subscribe(updateEvenUI);

// カウントを更新 - 関連するすべてのストリームが自動的に更新される
console.log("\n--- カウントを1に更新 ---");
count$.next(1);

console.log("\n--- カウントを2に更新 ---");
count$.next(2);

console.log("\n--- カウントを3に更新 ---");
count$.next(3);

// 一部のサブスクリプションを解除 - 特定のUIの更新を停止
console.log("\n--- doubleCountのサブスクリプションを解除 ---");
subscription2();

console.log(
  "\n--- カウントを4に更新（doubleCountのサブスクリプション解除後） ---"
);
count$.next(4);

// すべてのサブスクリプションを解除 - すべてのUIの更新を停止
console.log("\n--- すべてのサブスクリプションを解除 ---");
subscription1();
subscription3();
subscription4();

console.log("\n--- カウントを5に更新（すべてのサブスクリプション解除後） ---");
count$.next(5);
console.log(`最終状態: カウント = ${count$.getValue()}`);
