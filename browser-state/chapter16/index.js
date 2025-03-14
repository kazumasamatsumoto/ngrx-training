// RxJSを使用したリアクティブプログラミングの例（実際のRxJSは使用していません）

// BehaviorSubjectの簡易実装
class BehaviorSubject {
  constructor(initialValue) {
    this.value = initialValue;
    this.observers = [];
  }

  // 現在の値を取得
  getValue() {
    return this.value;
  }

  // 新しい値を発行
  next(value) {
    this.value = value;
    this.notifyObservers();
  }

  // オブザーバーを登録
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

  // すべてのオブザーバーに通知
  notifyObservers() {
    this.observers.forEach((observer) => observer(this.value));
  }
}

// カウンターの状態
const count$ = new BehaviorSubject(0);

// 派生した状態（カウントの2倍）
function map(source$, transformFn) {
  const result$ = new BehaviorSubject(transformFn(source$.getValue()));

  source$.subscribe((value) => {
    result$.next(transformFn(value));
  });

  return result$;
}

const doubleCount$ = map(count$, (count) => count * 2);

// 複数のストリームを組み合わせる
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

// カウントとその2倍の値を組み合わせる
const combined$ = combineLatest(
  [count$, doubleCount$],
  (count, doubleCount) => ({ count, doubleCount })
);

// フィルタリング
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

// 偶数のカウントのみを通過させる
const evenCount$ = filter(count$, (count) => count % 2 === 0);

// UIを更新する関数
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

// ストリームをサブスクライブ
console.log("--- ストリームをサブスクライブ ---");
const subscription1 = count$.subscribe(updateUI);
const subscription2 = doubleCount$.subscribe(updateDoubleUI);
const subscription3 = combined$.subscribe(updateCombinedUI);
const subscription4 = evenCount$.subscribe(updateEvenUI);

// カウントを更新
console.log("\n--- カウントを1に更新 ---");
count$.next(1);

console.log("\n--- カウントを2に更新 ---");
count$.next(2);

console.log("\n--- カウントを3に更新 ---");
count$.next(3);

// 一部のサブスクリプションを解除
console.log("\n--- doubleCountのサブスクリプションを解除 ---");
subscription2();

console.log(
  "\n--- カウントを4に更新（doubleCountのサブスクリプション解除後） ---"
);
count$.next(4);

// すべてのサブスクリプションを解除
console.log("\n--- すべてのサブスクリプションを解除 ---");
subscription1();
subscription3();
subscription4();

console.log("\n--- カウントを5に更新（すべてのサブスクリプション解除後） ---");
count$.next(5);
console.log(`最終状態: カウント = ${count$.getValue()}`);
