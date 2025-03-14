/**
 * Chapter 8: 変更検知戦略を最適化したコンポーネント
 *
 * このファイルでは、AngularのChangeDetectionStrategy.OnPushに相当する
 * 最適化された変更検知の簡易的な実装を示しています。
 *
 * ChangeDetectionStrategy.OnPushは、入力プロパティの参照が変更された場合にのみ
 * コンポーネントの再レンダリングを行うことで、パフォーマンスを向上させる技術です。
 *
 * これは、状態管理と組み合わせて使用されることが多く、NgRxと連携して
 * 効率的なUIの更新を実現します。
 *
 * なぜChangeDetectionStrategy.OnPushが重要なのか？
 *
 * 【不要な変更検知の防止】
 * Angularのデフォルトの変更検知戦略（ChangeDetectionStrategy.Default）では、
 * イベントが発生するたびにアプリケーション全体の変更検知が実行されます。
 * 大規模なアプリケーションでは、これが不必要なパフォーマンスのオーバーヘッドを
 * 引き起こす可能性があります。
 *
 * 例えば、1000項目のリストがあり、そのうち1項目だけが変更された場合、
 * デフォルトの変更検知では1000項目すべてが再評価される可能性があります。
 * これは明らかに非効率です。
 *
 * 【状態管理との連携】
 * NgRxなどの状態管理ライブラリでは、イミュータブルな状態更新と参照比較を
 * 使用しています。これはOnPush変更検知と非常に相性が良いです：
 *
 * 1. 状態の一部だけが変更された場合、その部分に依存するコンポーネントだけが
 *    再レンダリングされます。
 *
 * 2. 変更されていない部分に依存するコンポーネントは、入力プロパティの参照が同じままなので
 *    変更検知をスキップできます。
 *
 * 【ユーザー体験の向上】
 * 不要な変更検知を減らすことで、特に複雑なUIや大量のデータを扱う
 * アプリケーションでは、レスポンスの向上とスムーズな操作感を実現できます。
 * これは特にモバイルデバイスなど、計算リソースが限られた環境で重要です。
 *
 * 【開発者体験の向上】
 * OnPush変更検知を使用することで、パフォーマンスを意識しながらも
 * コンポーネントを小さく保ち、単一責任の原則に従った設計が可能になります。
 * これにより、コードの保守性と再利用性が向上します。
 */

// Angularの変更検知戦略を模倣した簡易的な実装
const ChangeDetectionStrategy = {
  Default: 'Default', // デフォルト：すべてのイベント後に変更検知を実行
  OnPush: 'OnPush'    // OnPush：入力プロパティの参照が変更された場合のみ変更検知を実行
};

// コンポーネントクラス（Angularコンポーネントの簡易版）
class Component {
  constructor(config = {}) {
    this.inputs = {}; // 入力プロパティ
    this.changeDetectionStrategy = config.changeDetectionStrategy || ChangeDetectionStrategy.Default;
    this.changeDetectorRef = new ChangeDetectorRef(this);
  }

  // 入力プロパティを設定するメソッド（@Inputデコレータに相当）
  setInputs(inputs) {
    const shouldDetectChanges = this.shouldDetectChanges(inputs);
    this.inputs = { ...inputs }; // 新しい入力を設定

    if (shouldDetectChanges) {
      this.detectChanges();
    }
  }

  // 変更検知が必要かどうかを判断するメソッド
  shouldDetectChanges(newInputs) {
    // Defaultの場合は常に変更検知を実行
    if (this.changeDetectionStrategy === ChangeDetectionStrategy.Default) {
      return true;
    }

    // OnPushの場合は入力プロパティの参照が変更された場合のみ変更検知を実行
    if (!this.inputs || !newInputs) return true;

    // 入力プロパティの参照が変更されたかどうかをチェック
    return !isEqual(this.inputs, newInputs);
  }

  // 変更検知を実行するメソッド
  detectChanges() {
    console.log('変更検知を実行中...');
    this.render();
  }

  // レンダリングを実行するメソッド（テンプレートのレンダリングに相当）
  render() {
    console.log('コンポーネントをレンダリング中...');
    // 実際のレンダリングロジックはここに実装
  }
}

// 変更検知参照（ChangeDetectorRef）の簡易実装
class ChangeDetectorRef {
  constructor(component) {
    this.component = component;
    this.detached = false;
  }

  // 変更検知を明示的に実行するメソッド
  detectChanges() {
    if (!this.detached) {
      this.component.detectChanges();
    }
  }

  // 変更検知を切り離すメソッド
  detach() {
    this.detached = true;
  }

  // 変更検知を再接続するメソッド
  reattach() {
    this.detached = false;
  }

  // コンポーネントを変更検知対象としてマークするメソッド
  markForCheck() {
    // 実際のAngularでは、このコンポーネントとその親を次の変更検知サイクルで確認するようにマーク
    console.log('コンポーネントを次の変更検知サイクルでチェックするようにマーク');
  }
}

// 簡易的なディープ比較関数
// オブジェクトの内容が同じかどうかを再帰的に比較します
function isEqual(obj1, obj2) {
  // 同じ参照であれば、内容も同じ
  if (obj1 === obj2) return true;
  // どちらかがnullであれば、内容は異なる
  if (obj1 === null || obj2 === null) return false;
  // プリミティブ型の場合は、値を比較
  if (typeof obj1 !== "object" || typeof obj2 !== "object")
    return obj1 === obj2;

  // オブジェクトの場合は、キーの数と内容を比較
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) return false;

  // すべてのキーについて、値が等しいかどうかを再帰的に確認
  return keys1.every((key) => {
    return keys2.includes(key) && isEqual(obj1[key], obj2[key]);
  });
}

// 高コストな処理を含むコンポーネント
class ExpensiveComponent extends Component {
  constructor() {
    // OnPush変更検知戦略を使用
    super({ changeDetectionStrategy: ChangeDetectionStrategy.OnPush });
  }

  // レンダリングメソッドをオーバーライド
  render() {
    console.log("ExpensiveComponentの処理を実行...");

    // 高コストな処理をシミュレート
    let result = 0;
    const multiplier = this.inputs.multiplier || 1;
    for (let i = 0; i < 1000000; i++) {
      result += i * multiplier;
    }

    console.log(`結果: ${result}`);
    console.log(`ユーザー: ${this.inputs.user ? this.inputs.user.name : 'なし'}`);

    // 実際のAngularでは、ここでDOMを更新
    return {
      type: "div",
      props: { className: "expensive-component" },
      children: [
        {
          type: "h2",
          props: {},
          children: [`結果: ${result}`],
        },
        {
          type: "p",
          props: {},
          children: [`ユーザー: ${this.inputs.user ? this.inputs.user.name : 'なし'}`],
        },
      ],
    };
  }
}

// デフォルト変更検知戦略を使用するコンポーネント（比較用）
class DefaultComponent extends Component {
  constructor() {
    // デフォルト変更検知戦略を使用
    super({ changeDetectionStrategy: ChangeDetectionStrategy.Default });
  }

  // レンダリングメソッドをオーバーライド
  render() {
    console.log("DefaultComponentの処理を実行...");

    // 高コストな処理をシミュレート
    let result = 0;
    const multiplier = this.inputs.multiplier || 1;
    for (let i = 0; i < 1000000; i++) {
      result += i * multiplier;
    }

    console.log(`結果: ${result}`);
    console.log(`ユーザー: ${this.inputs.user ? this.inputs.user.name : 'なし'}`);

    return {
      type: "div",
      props: { className: "default-component" },
      children: [
        {
          type: "h2",
          props: {},
          children: [`結果: ${result}`],
        },
        {
          type: "p",
          props: {},
          children: [`ユーザー: ${this.inputs.user ? this.inputs.user.name : 'なし'}`],
        },
      ],
    };
  }
}

// 使用例と性能比較
console.log("--- デフォルト変更検知戦略 ---");
const defaultComponent = new DefaultComponent();

console.time("デフォルトコンポーネント（1回目）");
defaultComponent.setInputs({ multiplier: 2, user: { name: "Alice" } });
console.timeEnd("デフォルトコンポーネント（1回目）");

console.time("デフォルトコンポーネント（2回目、同じ入力）");
defaultComponent.setInputs({ multiplier: 2, user: { name: "Alice" } });
console.timeEnd("デフォルトコンポーネント（2回目、同じ入力）");

console.log("\n--- OnPush変更検知戦略 ---");
const expensiveComponent = new ExpensiveComponent();

console.time("OnPushコンポーネント（1回目）");
expensiveComponent.setInputs({ multiplier: 2, user: { name: "Alice" } });
console.timeEnd("OnPushコンポーネント（1回目）");

console.time("OnPushコンポーネント（2回目、同じ入力）");
expensiveComponent.setInputs({ multiplier: 2, user: { name: "Alice" } });
console.timeEnd("OnPushコンポーネント（2回目、同じ入力）");

console.time("OnPushコンポーネント（3回目、異なる入力）");
expensiveComponent.setInputs({ multiplier: 3, user: { name: "Alice" } });
console.timeEnd("OnPushコンポーネント（3回目、異なる入力）");

// 同じオブジェクト参照を使用した例
const userBob = { name: "Bob" }; // 同じオブジェクト参照を使用
console.log("\n--- 同じオブジェクト参照を使用 ---");

console.time("OnPushコンポーネント（同じ参照、1回目）");
expensiveComponent.setInputs({ multiplier: 2, user: userBob });
console.timeEnd("OnPushコンポーネント（同じ参照、1回目）");

console.time("OnPushコンポーネント（同じ参照、2回目）");
expensiveComponent.setInputs({ multiplier: 2, user: userBob });
console.timeEnd("OnPushコンポーネント（同じ参照、2回目）");

// イベントハンドラのシミュレーション
console.log("\n--- イベントハンドラのシミュレーション ---");
console.log("OnPushコンポーネントでイベントが発生した場合");
console.time("イベントハンドラ実行");
// イベントハンドラ内で明示的に変更検知を実行
expensiveComponent.changeDetectorRef.detectChanges();
console.timeEnd("イベントハンドラ実行");

/**
 * ChangeDetectionStrategy.OnPushの重要なポイント:
 *
 * 1. パフォーマンス最適化: 入力プロパティの参照が変更された場合にのみ変更検知を実行
 * 2. 参照の同一性: オブジェクトの参照が同じであれば、変更検知をスキップできる
 * 3. イミュータビリティ: 状態を変更する際は新しいオブジェクトを作成することが重要
 * 4. イベントハンドラ: コンポーネント内でイベントが発生した場合は変更検知が実行される
 * 5. AsyncPipe: AsyncPipeを使用すると、新しい値が来たときに自動的に変更検知が実行される
 * 6. 明示的な変更検知: ChangeDetectorRef.markForCheck()を使用して明示的に変更検知を実行できる
 *
 * 実際のAngularでは、コンポーネントに@Component装飾子を使用して変更検知戦略を指定します:
 *
 * @Component({
 *   selector: 'app-expensive',
 *   templateUrl: './expensive.component.html',
 *   changeDetection: ChangeDetectionStrategy.OnPush
 * })
 * export class ExpensiveComponent {
 *   @Input() multiplier: number;
 *   @Input() user: { name: string };
 *
 *   constructor(private cdr: ChangeDetectorRef) {}
 *
 *   // 明示的に変更検知を実行する例
 *   forceUpdate() {
 *     this.cdr.markForCheck();
 *   }
 * }
 *
 * NgRxを使用する場合、ストアからのデータは常に新しいオブジェクトとして提供されるため、
 * OnPush変更検知と組み合わせることで効率的なUI更新が可能になります。
 */
