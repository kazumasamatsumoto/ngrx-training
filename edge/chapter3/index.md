# Chapter 3: JavaScript のガベージコレクション

## 概要

このチャプターでは、JavaScript のガベージコレクション（GC）について学びます。ガベージコレクションは、プログラムが不要になったメモリを自動的に解放するプロセスです。JavaScript のメモリ管理の仕組み、ガベージコレクションのアルゴリズム、そしてメモリリークを防ぐためのベストプラクティスについて理解を深めましょう。

## ガベージコレクションとは

ガベージコレクションは、プログラムが使用しなくなったメモリ領域（ガベージ）を自動的に検出し、解放するプロセスです。JavaScript はガベージコレクション型の言語であり、開発者が明示的にメモリを解放する必要はありません。

### メモリライフサイクル

JavaScript におけるメモリのライフサイクルは以下の 3 つのステップで構成されています：

1. **メモリの割り当て**: 変数を宣言し、値を代入するとメモリが割り当てられます
2. **メモリの使用**: 変数の読み取りや書き込みを行うことでメモリを使用します
3. **メモリの解放**: 不要になったメモリをガベージコレクションによって解放します

## ガベージコレクションのアルゴリズム

JavaScript エンジン（V8 など）は、主に以下の 2 つのアルゴリズムを使用してガベージコレクションを実行します：

### 1. 参照カウンティング

参照カウンティングは、オブジェクトが持つ参照の数をカウントする単純なアルゴリズムです。

- オブジェクトが作成され、それへの参照が保存されると、参照カウントは 1 になります
- 同じオブジェクトへの別の参照が作成されると、参照カウントが増加します
- 参照が削除されると（例：変数に別の値を代入する）、参照カウントが減少します
- 参照カウントが 0 になると、そのオブジェクトはガベージコレクションの対象となります

```javascript
let obj = { name: "テスト" }; // objへの参照カウント: 1
let anotherRef = obj; // objへの参照カウント: 2
obj = null; // objへの参照カウント: 1
anotherRef = null; // objへの参照カウント: 0 -> ガベージコレクション対象
```

ただし、参照カウンティングには「循環参照」の問題があります。2 つのオブジェクトが互いを参照している場合、参照カウントは常に 1 以上になるため、ガベージコレクションの対象にならず、メモリリークが発生します。

```javascript
function createCycle() {
  let obj1 = {};
  let obj2 = {};

  obj1.ref = obj2; // obj1はobj2を参照
  obj2.ref = obj1; // obj2はobj1を参照

  return "循環参照が作成されました";
}

createCycle();
// 関数が終了しても、obj1とobj2は互いを参照しているため
// 参照カウントが0にならず、メモリリークが発生する可能性がある
```

### 2. マーク・アンド・スイープ

現代の JavaScript エンジンは、「マーク・アンド・スイープ」アルゴリズムを使用して循環参照の問題を解決しています。このアルゴリズムは以下のステップで動作します：

1. **ルート**からスタート: ガベージコレクタは「ルート」（グローバルオブジェクト、現在の関数のローカル変数など）から始めます
2. **マークフェーズ**: ルートから到達可能なすべてのオブジェクトを「マーク」します
3. **スイープフェーズ**: マークされていないオブジェクトをメモリから削除します

このアルゴリズムでは、オブジェクトが互いを参照していても、ルートからそれらに到達できなければ、ガベージコレクションの対象となります。

```javascript
function createCycle() {
  let obj1 = {};
  let obj2 = {};

  obj1.ref = obj2;
  obj2.ref = obj1;

  // 関数終了後、obj1とobj2はルートから到達不可能になる
}

createCycle();
// マーク・アンド・スイープアルゴリズムにより、
// obj1とobj2はガベージコレクションの対象となる
```

## V8 エンジンのガベージコレクション

Edge ブラウザで使用されている V8 エンジンは、効率的なガベージコレクションのために「世代別ガベージコレクション」を採用しています。

### 世代別ガベージコレクション

V8 エンジンは、オブジェクトを「若いオブジェクト」と「古いオブジェクト」に分類します：

1. **新世代（Young Generation）**: 新しく作成されたオブジェクトが配置される領域。この領域は小さく、頻繁にガベージコレクションが実行されます（マイナー GC）。
2. **旧世代（Old Generation）**: 新世代で一定期間生き残ったオブジェクトが昇格する領域。この領域は大きく、ガベージコレクションの頻度は低くなります（メジャー GC）。

この方式は、「多くのオブジェクトは作成後すぐに不要になる」という経験則に基づいています。

### スキャベンジャー（Scavenger）

V8 エンジンの新世代ガベージコレクションは「スキャベンジャー」と呼ばれるアルゴリズムを使用します。新世代のメモリは「From 空間」と「To 空間」の 2 つに分かれており、以下のステップで動作します：

1. 新しいオブジェクトは「From 空間」に割り当てられます
2. ガベージコレクション時に、生きているオブジェクトは「To 空間」にコピーされます
3. 「From 空間」は完全にクリアされます
4. 「From 空間」と「To 空間」の役割が入れ替わります
5. 複数回のガベージコレクションを生き残ったオブジェクトは旧世代に昇格します

### マーク・コンパクト（Mark-Compact）

V8 エンジンの旧世代ガベージコレクションは「マーク・コンパクト」アルゴリズムを使用します：

1. マークフェーズ: 生きているオブジェクトをマークします
2. コンパクトフェーズ: 生きているオブジェクトをメモリの一方に移動し、断片化を解消します

## ガベージコレクションの観察

JavaScript では、ガベージコレクションのタイミングを直接制御することはできませんが、Chrome DevTools を使用して観察することができます：

1. Chrome DevTools を開く（F12 キー）
2. Performance タブを選択
3. 記録を開始し、「Collect garbage」ボタンをクリックしてガベージコレクションを強制的に実行
4. 記録を停止して結果を分析

## メモリリークの防止

ガベージコレクションがあっても、メモリリークは発生する可能性があります。以下は一般的なメモリリークのパターンとその防止策です：

### 1. グローバル変数の過剰使用

グローバル変数はガベージコレクションの対象になりにくいため、必要以上に使用しないようにしましょう。

```javascript
// 悪い例
function createLargeArray() {
  largeArray = new Array(1000000); // グローバル変数（varキーワードなし）
}

// 良い例
function createLargeArray() {
  let largeArray = new Array(1000000); // ローカル変数
  // 関数終了後、largeArrayはガベージコレクションの対象になる
}
```

### 2. クロージャによる参照の保持

クロージャは外部変数への参照を保持するため、意図しないメモリリークの原因になることがあります。

```javascript
// メモリリークの可能性がある例
function createLargeDataWithTimer() {
  let largeData = new Array(1000000);

  setInterval(function () {
    // この関数はlargeDataへの参照を保持し続ける
    console.log(largeData.length);
  }, 1000);
}

// 改善例
function createTimerWithoutLeak() {
  let largeData = new Array(1000000);
  let length = largeData.length;

  // largeDataは不要になったので参照を削除
  largeData = null;

  setInterval(function () {
    // largeDataではなくlengthを使用
    console.log(length);
  }, 1000);
}
```

### 3. DOM 要素への参照

DOM ツリーから削除された要素への参照を保持し続けると、メモリリークが発生します。

```javascript
// メモリリークの可能性がある例
let elements = {
  button: document.getElementById("button"),
  container: document.getElementById("container"),
};

function removeButton() {
  // DOMからボタンを削除
  elements.button.parentNode.removeChild(elements.button);
  // しかし、elementsオブジェクトにはまだボタンへの参照が残っている
}

// 改善例
function removeButtonProperly() {
  // DOMからボタンを削除
  elements.button.parentNode.removeChild(elements.button);
  // 参照も削除
  elements.button = null;
}
```

### 4. イベントリスナーの未解除

要素を削除する際に、イベントリスナーを解除しないとメモリリークが発生する可能性があります。

```javascript
// メモリリークの可能性がある例
function setupButton() {
  let button = document.getElementById("button");

  button.addEventListener("click", function () {
    // 処理
  });

  // 後でボタンを削除
  button.parentNode.removeChild(button);
  // イベントリスナーは解除されていない
}

// 改善例
function setupButtonProperly() {
  let button = document.getElementById("button");

  let clickHandler = function () {
    // 処理
  };

  button.addEventListener("click", clickHandler);

  // 後でボタンとイベントリスナーを削除
  button.removeEventListener("click", clickHandler);
  button.parentNode.removeChild(button);
}
```

## 実践例: メモリリークの検出と修正

以下のコードは、メモリリークを検出して修正する方法を示しています：

```javascript
// メモリリークを引き起こす関数
function createMemoryLeak() {
  let leakyArray = [];

  // 10秒ごとに配列に大きなオブジェクトを追加
  let intervalId = setInterval(function () {
    let largeObject = new Array(1000000).fill("leak");
    leakyArray.push(largeObject);

    console.log(`メモリリーク: 配列サイズ = ${leakyArray.length}`);
  }, 10000);

  // リークを止める関数を返す
  return function stopLeak() {
    clearInterval(intervalId);
    leakyArray = null; // 参照を解放
    console.log("メモリリークを停止しました");
  };
}

// メモリリークを開始
let stopLeak = createMemoryLeak();

// 1分後にメモリリークを停止
setTimeout(function () {
  stopLeak();
}, 60000);
```

## 次のステップ

次のチャプターでは、Edge ブラウザでのメモリプロファイリングについて学びます。開発者ツールを使用してメモリ使用状況を分析し、メモリリークを検出する方法について理解を深めましょう。
