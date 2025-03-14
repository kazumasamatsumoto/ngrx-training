# Chapter 4: Edge ブラウザでのメモリプロファイリング

## 概要

このチャプターでは、Edge ブラウザの開発者ツールを使用してメモリプロファイリングを行う方法について学びます。メモリリークの検出、ヒープスナップショットの取得と分析、パフォーマンスプロファイルの記録など、実践的なテクニックを習得しましょう。

## 開発者ツールの概要

Edge ブラウザ（Chromium ベース）の開発者ツールには、メモリ使用状況を分析するための強力なツールが用意されています。主に以下の機能を使用します：

1. **メモリパネル**: ヒープスナップショットの取得、メモリ割り当ての記録、DOM リークの特定
2. **パフォーマンスパネル**: JavaScript の実行とメモリ使用状況の時系列分析
3. **JavaScript プロファイラー**: 関数呼び出しとメモリ割り当ての詳細な分析

## メモリパネルの使用方法

### ヒープスナップショットの取得

ヒープスナップショットは、特定の時点における JavaScript オブジェクトのメモリ使用状況を記録したものです。

1. F12 キーを押して開発者ツールを開く
2. 「Memory」タブを選択
3. 「Heap snapshot」を選択
4. 「Take snapshot」ボタンをクリック

ヒープスナップショットを取得すると、以下の情報が表示されます：

- **Constructor**: オブジェクトの型（Array、Object、String など）
- **Distance**: ルートからの参照距離
- **Shallow Size**: オブジェクト自体のサイズ
- **Retained Size**: オブジェクトとそれが保持している他のオブジェクトの合計サイズ

### メモリリークの検出

メモリリークを検出するための一般的な手順は以下の通りです：

1. 初期状態でヒープスナップショットを取得
2. 疑わしい操作を実行（例：ページの特定の機能を使用）
3. 操作後に 2 つ目のヒープスナップショットを取得
4. 「Comparison」ビューで 2 つのスナップショットを比較

```javascript
// メモリリークを検出するためのテスト手順
function testForMemoryLeaks() {
  console.log("ステップ1: 初期スナップショットを取得してください");

  // 疑わしい操作を実行
  for (let i = 0; i < 100; i++) {
    performSuspiciousOperation();
  }

  console.log("ステップ2: 2つ目のスナップショットを取得してください");

  // ガベージコレクションを促す
  for (let i = 0; i < 10; i++) {
    let obj = {};
    obj = null;
  }

  console.log("ステップ3: 3つ目のスナップショットを取得してください");
  console.log(
    "ステップ4: スナップショットを比較して、オブジェクト数が増え続けているか確認してください"
  );
}
```

### メモリ割り当ての記録

「Allocation instrumentation on timeline」を使用すると、時間経過に伴うメモリ割り当ての状況を記録できます。

1. 「Memory」タブを選択
2. 「Allocation instrumentation on timeline」を選択
3. 「Start」ボタンをクリック
4. アプリケーションを操作
5. 「Stop」ボタンをクリック

この記録では、時間経過に伴うメモリ割り当てのパターンを確認できます。急激なメモリ増加や、解放されないメモリの蓄積などを視覚的に把握できます。

## パフォーマンスパネルの使用方法

パフォーマンスパネルでは、JavaScript 実行とメモリ使用状況を時系列で分析できます。

1. 「Performance」タブを選択
2. 「Memory」チェックボックスをオン
3. 「Record」ボタンをクリック
4. アプリケーションを操作
5. 「Stop」ボタンをクリック

記録後、以下の情報を確認できます：

- **JS Heap**: JavaScript ヒープメモリの使用量の推移
- **Nodes**: DOM ノード数の推移
- **Documents**: ドキュメント数の推移
- **Listeners**: イベントリスナー数の推移

メモリ使用量が時間とともに増加し続ける場合は、メモリリークの可能性があります。

## 実践的なメモリプロファイリング

### 1. DOM リークの検出

DOM リークは、DOM ノードへの参照が残り続けることで発生するメモリリークです。

```javascript
// DOMリークの例
let detachedNodes = [];

function createAndStoreNodes() {
  const div = document.createElement("div");
  div.innerHTML = "<p>This is a detached DOM node</p>";

  // DOMツリーに追加せずに配列に保存
  detachedNodes.push(div);

  console.log(`保存されたノード数: ${detachedNodes.length}`);
}

// このボタンクリックでDOMリークが発生
document
  .getElementById("create-nodes")
  .addEventListener("click", createAndStoreNodes);
```

DOM リークを検出するには：

1. 「Memory」タブで「Heap snapshot」を選択
2. スナップショットを取得
3. フィルターボックスに「Detached」と入力
4. 切り離された DOM ノードを確認

### 2. クロージャリークの検出

クロージャによるメモリリークは、関数が不要になった変数への参照を保持し続けることで発生します。

```javascript
// クロージャリークの例
function setupLeakyTimer() {
  const largeData = new Array(1000000).fill("leak data");

  setInterval(function () {
    // この関数はlargeDataへの参照を保持し続ける
    console.log(`Large data length: ${largeData.length}`);
  }, 5000);
}

// このボタンクリックでクロージャリークが発生
document
  .getElementById("setup-timer")
  .addEventListener("click", setupLeakyTimer);
```

クロージャリークを検出するには：

1. 複数のヒープスナップショットを取得
2. 「Comparison」ビューでスナップショットを比較
3. 増加し続けているオブジェクトを確認

### 3. イベントリスナーリークの検出

イベントリスナーが適切に解除されないと、メモリリークが発生する可能性があります。

```javascript
// イベントリスナーリークの例
function addLeakyEventListener() {
  const button = document.createElement("button");
  button.textContent = "Click me";
  document.body.appendChild(button);

  const handleClick = function () {
    console.log("Button clicked");
  };

  button.addEventListener("click", handleClick);

  // ボタンを削除するが、イベントリスナーは解除しない
  document.body.removeChild(button);
  // button.removeEventListener('click', handleClick); // これが必要
}

// このボタンクリックでイベントリスナーリークが発生
document
  .getElementById("add-listener")
  .addEventListener("click", addLeakyEventListener);
```

イベントリスナーリークを検出するには：

1. 「Memory」タブで「Allocation instrumentation on timeline」を選択
2. 記録を開始
3. 疑わしい操作を実行
4. 記録を停止
5. イベントリスナーオブジェクトの増加を確認

## メモリ使用量の最適化テクニック

### 1. オブジェクトプール

頻繁に作成・破棄されるオブジェクトは、オブジェクトプールを使用して再利用することでメモリ割り当てのオーバーヘッドを削減できます。

```javascript
// オブジェクトプールの例
class ParticlePool {
  constructor(size) {
    this.pool = [];
    this.size = size;
    this.createPool();
  }

  createPool() {
    for (let i = 0; i < this.size; i++) {
      this.pool.push({
        x: 0,
        y: 0,
        speed: 0,
        isActive: false,
      });
    }
  }

  getParticle() {
    for (let i = 0; i < this.size; i++) {
      if (!this.pool[i].isActive) {
        this.pool[i].isActive = true;
        return this.pool[i];
      }
    }
    return null; // プールが空の場合
  }

  releaseParticle(particle) {
    particle.isActive = false;
  }
}

// 使用例
const particlePool = new ParticlePool(1000);
const particle = particlePool.getParticle();
// パーティクルを使用
particlePool.releaseParticle(particle);
```

### 2. 不要なデータの解放

不要になったデータは明示的に解放することで、ガベージコレクションを促進できます。

```javascript
// 不要なデータの解放例
function processLargeData(data) {
  const result = data.map((item) => item * 2);

  // 処理が終わったら元のデータへの参照を解放
  data = null;

  return result;
}

let largeArray = new Array(1000000).fill(1);
const processedData = processLargeData(largeArray);

// 処理済みデータも不要になったら解放
largeArray = null;
```

### 3. WeakMap と WeakSet の使用

`WeakMap`と`WeakSet`は、キーへの参照が弱い参照であるため、メモリリークを防ぐのに役立ちます。

```javascript
// WeakMapの例
const cache = new WeakMap();

function processElement(element) {
  if (cache.has(element)) {
    return cache.get(element);
  }

  const result = expensiveComputation(element);
  cache.set(element, result);
  return result;
}

// DOMノードが削除されると、自動的にキャッシュからも削除される
const div = document.createElement("div");
processElement(div);
div.parentNode.removeChild(div);
// divへの参照がなくなると、cacheからも自動的に削除される
```

## 次のステップ

次のチャプターでは、Edge ブラウザでのパフォーマンス最適化について学びます。JavaScript コードの実行速度を向上させ、メモリ使用量を削減するための実践的なテクニックについて理解を深めましょう。
