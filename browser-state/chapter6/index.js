/**
 * Chapter 6: Angularの変更検知（Change Detection）の仕組み
 *
 * このファイルでは、Angularで使われている変更検知メカニズムの
 * 基本的な概念と実装例を紹介します。
 *
 * Angularの変更検知とは何か？
 * 簡単に言うと、アプリケーションの状態（データ）が変わったときに
 * それを検出して画面（DOM）を更新する仕組みです。
 *
 * Angularの変更検知の働き方:
 * 1. イベント発生（ユーザー操作、タイマー、HTTPレスポンスなど）
 * 2. Zone.jsがイベントをトラップし、Angularに通知
 * 3. コンポーネントツリーの検査（変更検知）の開始
 * 4. 変更があったコンポーネントのビューを更新
 *
 * なぜAngularの変更検知が効率的か？
 *
 * 【Zone.jsとの連携】
 * AngularはZone.jsというライブラリを使って非同期イベントを
 * 監視しています。これにより、データが変わる可能性のあるタイミングを
 * 正確に把握し、必要なときだけ変更検知を実行します。
 *
 * 【単方向データフロー】
 * データは常に親から子へと流れるため、変更が発生したコンポーネントから
 * その子コンポーネントのみをチェックすればよく、無駄な検査を減らせます。
 *
 * 【OnPushモード】
 * デフォルトではすべてのイベント後に検査しますが、OnPushモードを使うと
 * 入力プロパティが変わった時だけ検査するようになり、さらに効率化できます。
 *
 * Angularの変更検知のメリット：
 * 1. 予測可能なデータフロー
 * 2. より細かな変更検知の制御が可能
 * 3. 大規模アプリケーションでのパフォーマンス最適化
 *
 * 【NgRxとの相性】
 * NgRxなどの状態管理ライブラリと組み合わせると、
 * イミュータブルなデータフローにより変更検知がさらに効率化されます。
 *
 * 例えるなら、NgRxは「状態変更の一元管理システム」、
 * Angularの変更検知は「その変更に基づいて必要な部分だけを更新する仕組み」
 * という関係です。この組み合わせで、複雑なアプリでもスムーズな操作感を
 * 実現できます。
 */

// 簡易的なコンポーネントクラス
class Component {
  constructor(name, state = {}) {
    this.name = name;
    this.state = state;
    this.children = [];
    this.changeDetectionStrategy = "Default"; // 'Default' または 'OnPush'
    this.inputs = {}; // 親からの入力プロパティ
  }

  // 子コンポーネントを追加
  addChild(component) {
    this.children.push(component);
    return this;
  }

  // OnPush変更検知戦略を設定
  setOnPush() {
    this.changeDetectionStrategy = "OnPush";
    return this;
  }

  // 入力プロパティを設定（親コンポーネントから）
  setInput(name, value) {
    const oldValue = this.inputs[name];
    this.inputs[name] = value;

    // 値が変わったかどうかチェック（参照比較）
    return oldValue !== value;
  }

  // コンポーネントのビューを更新（実際のDOM更新をシミュレート）
  updateView() {
    console.log(`コンポーネント「${this.name}」のビューを更新`);
  }
}

// Angularの変更検知機能を簡略化したクラス
class ChangeDetector {
  constructor(rootComponent) {
    this.rootComponent = rootComponent;
    this.dirtyComponents = new Set(); // 更新が必要なコンポーネント
  }

  // 変更検知のサイクルを開始
  detectChanges() {
    console.log("--- 変更検知サイクル開始 ---");
    this._detectChangesInComponent(this.rootComponent);
    console.log("--- 変更検知サイクル終了 ---");
  }

  // 特定のコンポーネントとその子を検査
  _detectChangesInComponent(component) {
    console.log(`${component.name}の変更を検出中...`);

    // OnPushモードの場合、入力プロパティが変わっていない限りスキップ
    if (
      component.changeDetectionStrategy === "OnPush" &&
      !this.dirtyComponents.has(component)
    ) {
      console.log(`${component.name}はOnPushモードで変更なし - スキップ`);
      return;
    }

    // コンポーネントのビューを更新
    component.updateView();

    // このコンポーネントの処理が終わったのでリストから削除
    this.dirtyComponents.delete(component);

    // 子コンポーネントも再帰的に検査
    for (const child of component.children) {
      this._detectChangesInComponent(child);
    }
  }

  // コンポーネントを「変更あり」としてマーク
  markForCheck(component) {
    this.dirtyComponents.add(component);
    console.log(`${component.name}に変更あり - 次回の検知サイクルでチェック`);
  }
}

// Zone.jsの動作を簡略化したシミュレーション
class NgZone {
  constructor(changeDetector) {
    this.changeDetector = changeDetector;
  }

  // イベントをトラップして変更検知を実行
  run(callback) {
    console.log("NgZone: イベント検出");
    callback();
    console.log("NgZone: 変更検知サイクルをトリガー");
    this.changeDetector.detectChanges();
  }
}

// 使用例 - コンポーネント階層の作成
const appComponent = new Component("AppComponent", { title: "Angularアプリ" });
const counterComponent = new Component("CounterComponent", { count: 0 });
const displayComponent = new Component("DisplayComponent").setOnPush();
const buttonComponent = new Component("ButtonComponent");

// コンポーネント階層の構築
appComponent.addChild(counterComponent);
counterComponent.addChild(displayComponent);
counterComponent.addChild(buttonComponent);

// 変更検知器とNgZoneのセットアップ
const changeDetector = new ChangeDetector(appComponent);
const ngZone = new NgZone(changeDetector);

// 初期変更検知サイクル
changeDetector.detectChanges();

// ユーザーのクリックイベントをシミュレート
console.log("\n--- ボタンクリックイベント ---");
ngZone.run(() => {
  // カウンターの状態を更新
  counterComponent.state.count++;
  console.log(`カウント更新: ${counterComponent.state.count}`);

  // 入力プロパティの変更（OnPushコンポーネント用）
  const inputChanged = displayComponent.setInput(
    "count",
    counterComponent.state.count
  );

  // 入力が変わったらOnPushコンポーネントをマーク
  if (inputChanged) {
    changeDetector.markForCheck(displayComponent);
  }
});

// OnPushモードの最適化例
console.log("\n--- OnPushの最適化例 ---");
ngZone.run(() => {
  // 値は変更せず、同じ値を再設定（参照は変わらない）
  displayComponent.setInput("count", counterComponent.state.count);
  console.log("同じ値を設定 - OnPushコンポーネントは更新されません");
});

/**
 * Angularの変更検知のメリットまとめ:
 * 1. 精度: Zone.jsによって非同期イベントを確実に検出
 * 2. 効率性: OnPushモードでパフォーマンスを最適化可能
 * 3. 制御性: 変更検知の流れを細かく制御できる
 *
 * NgRxとの組み合わせ方:
 * 1. Storeからのデータは常にイミュータブル（不変）
 * 2. コンポーネントはOnPushモードで設定
 * 3. Selectorで必要なデータだけを取得し、不要な更新を防止
 *
 * これにより、大規模なAngularアプリケーションでも高いパフォーマンスを
 * 維持することができます。
 */
