# Chapter 1: ブラウザのメモリ管理の基本

## 概要

このチャプターでは、Edge ブラウザにおけるメモリ管理の基本的な仕組みについて学びます。ブラウザのメモリ構造、JavaScript エンジン（V8）のメモリ管理、およびメモリ制限について理解することは、効率的な Web アプリケーション開発の基礎となります。

## ブラウザのメモリ構造

Edge ブラウザ（Chromium ベース）は、Google の V8 JavaScript エンジンを使用しています。V8 エンジンのメモリは主に以下の領域に分かれています：

### 1. ヒープメモリ

オブジェクトやデータ構造を格納する動的メモリ領域です。ヒープメモリはさらに以下のように分類されます：

- **若いオブジェクト領域（New Space/Nursery）**：新しく作成されたオブジェクトが最初に配置される領域。この領域は小さく、ガベージコレクションが頻繁に行われます。
- **古いオブジェクト領域（Old Space）**：若いオブジェクト領域で生き残ったオブジェクトが移動される領域。この領域は大きく、ガベージコレクションの頻度は低くなります。
- **大きなオブジェクト領域（Large Object Space）**：サイズの大きなオブジェクト（通常は 1MB 以上）が格納される特別な領域。

### 2. スタックメモリ

関数呼び出しやローカル変数を管理するための領域です。スタックは後入れ先出し（LIFO: Last In, First Out）の構造を持ち、関数が呼び出されるとスタックフレームが積まれ、関数が終了するとそのフレームが取り除かれます。

## メモリ制限

ブラウザには、単一のタブやウェブページが使用できるメモリ量に制限があります。この制限はブラウザやデバイスによって異なりますが、一般的には以下の方法で確認できます：

```javascript
// ブラウザのメモリ制限を確認（Chromeベースのブラウザのみ）
console.log(performance.memory.jsHeapSizeLimit);
```

この制限を超えると、ブラウザはタブをクラッシュさせたり、「Aw, Snap!」などのエラーを表示したりすることがあります。

## メモリ使用状況の監視

ブラウザのメモリ使用状況は、開発者ツール（DevTools）を使用して監視できます。

### 1. パフォーマンスパネル

パフォーマンスパネルでは、時間経過に伴うメモリ使用量の変化を記録できます。

1. F12 キーを押して開発者ツールを開く
2. 「Performance」タブを選択
3. 記録ボタン（●）をクリックして記録を開始
4. アプリケーションを操作
5. 停止ボタン（■）をクリックして記録を終了
6. メモリグラフを確認

### 2. メモリパネル

メモリパネルでは、ヒープスナップショットを取得して詳細なメモリ使用状況を分析できます。

1. F12 キーを押して開発者ツールを開く
2. 「Memory」タブを選択
3. 「Heap snapshot」を選択
4. 「Take snapshot」ボタンをクリック
5. スナップショットを分析

## 実践例

以下のコードを使用して、ブラウザのメモリ使用状況を監視する簡単な例を試してみましょう：

```javascript
// メモリ使用状況を表示する関数
function displayMemoryUsage() {
  if (performance && performance.memory) {
    const memoryInfo = performance.memory;
    console.log(`
      総JSヒープサイズ: ${formatBytes(memoryInfo.totalJSHeapSize)}
      使用中のJSヒープサイズ: ${formatBytes(memoryInfo.usedJSHeapSize)}
      JSヒープサイズ上限: ${formatBytes(memoryInfo.jsHeapSizeLimit)}
    `);
  } else {
    console.log("このブラウザではperformance.memoryがサポートされていません");
  }
}

// バイト数を人間が読みやすい形式に変換する関数
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return (
    parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + " " + sizes[i]
  );
}

// 定期的にメモリ使用状況を表示
setInterval(displayMemoryUsage, 1000);
```

## 次のステップ

次のチャプターでは、JavaScript のメモリモデルについて詳しく学び、値型（プリミティブ型）とオブジェクト型（参照型）の違いや、参照の仕組みについて理解を深めます。
