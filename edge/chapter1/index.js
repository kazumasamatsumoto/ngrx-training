/**
 * Chapter 1: ブラウザのメモリ管理の基本
 *
 * このファイルでは、ブラウザのメモリ使用状況を監視する基本的な実装例を提供します。
 */

// メモリ使用状況を表示する関数
function displayMemoryUsage() {
  if (performance && performance.memory) {
    const memoryInfo = performance.memory;
    console.log(`
      総JSヒープサイズ: ${formatBytes(memoryInfo.totalJSHeapSize)}
      使用中のJSヒープサイズ: ${formatBytes(memoryInfo.usedJSHeapSize)}
      JSヒープサイズ上限: ${formatBytes(memoryInfo.jsHeapSizeLimit)}
      使用率: ${(
        (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) *
        100
      ).toFixed(2)}%
    `);

    // DOMに表示（HTMLに対応する要素がある場合）
    updateDOMDisplay(memoryInfo);
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

// DOMにメモリ情報を表示する関数
function updateDOMDisplay(memoryInfo) {
  const totalElement = document.getElementById("totalHeapSize");
  const usedElement = document.getElementById("usedHeapSize");
  const limitElement = document.getElementById("heapSizeLimit");
  const usageElement = document.getElementById("memoryUsage");

  if (totalElement) {
    totalElement.textContent = formatBytes(memoryInfo.totalJSHeapSize);
  }

  if (usedElement) {
    usedElement.textContent = formatBytes(memoryInfo.usedJSHeapSize);
  }

  if (limitElement) {
    limitElement.textContent = formatBytes(memoryInfo.jsHeapSizeLimit);
  }

  if (usageElement) {
    const usagePercent = (
      (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) *
      100
    ).toFixed(2);
    usageElement.textContent = `${usagePercent}%`;

    // メモリ使用率に応じて色を変更
    if (usagePercent > 80) {
      usageElement.style.color = "red";
    } else if (usagePercent > 60) {
      usageElement.style.color = "orange";
    } else {
      usageElement.style.color = "green";
    }
  }
}

// メモリ使用状況の履歴の最大長を設定
const maxHistoryLength = 50;

// メモリ使用状況の履歴を記録する関数
function recordMemoryUsage() {
  if (performance && performance.memory) {
    const memoryInfo = performance.memory;
    const timestamp = new Date().getTime();

    memoryHistory.push({
      timestamp,
      usedJSHeapSize: memoryInfo.usedJSHeapSize,
      totalJSHeapSize: memoryInfo.totalJSHeapSize,
    });

    // 履歴の長さを制限
    if (memoryHistory.length > maxHistoryLength) {
      memoryHistory.shift();
    }

    // コンソールに最新の記録を表示
    console.log(
      `[${new Date().toLocaleTimeString()}] メモリ使用量: ${formatBytes(
        memoryInfo.usedJSHeapSize
      )}`
    );
  }
}

// 大きなオブジェクトを作成する関数
function createLargeObject(sizeInMB) {
  // 指定したサイズ（MB）のArrayBufferを作成
  const bytes = sizeInMB * 1024 * 1024;
  const buffer = new ArrayBuffer(bytes);

  // Float64Array（倍精度浮動小数点数の配列）でバッファを埋める
  const array = new Float64Array(buffer);
  for (let i = 0; i < array.length; i++) {
    array[i] = Math.random(); // ランダムな値で埋める
  }

  console.log(`${sizeInMB}MBのオブジェクトを作成しました`);
  return array;
}

// メモリ使用状況の監視を開始
function startMemoryMonitoring(intervalMs = 1000) {
  // 既存の監視を停止
  stopMemoryMonitoring();

  // 新しい監視を開始
  console.log(`メモリ監視を開始しました（間隔: ${intervalMs}ms）`);
  memoryMonitorInterval = setInterval(() => {
    displayMemoryUsage();
    recordMemoryUsage();
  }, intervalMs);
}

function stopMemoryMonitoring() {
  if (memoryMonitorInterval) {
    clearInterval(memoryMonitorInterval);
    memoryMonitorInterval = null;
    console.log("メモリ監視を停止しました");
  }
}

// DOMが読み込まれたら実行
document.addEventListener("DOMContentLoaded", () => {
  console.log("Chapter 1: メモリ監視アプリケーションを初期化しています...");

  // 初期メモリ使用状況を表示
  displayMemoryUsage();

  // グラフを初期化
  initMemoryChart();

  // メモリ監視ボタンのイベントリスナーを設定
  const startButton = document.getElementById("startMonitoring");
  const stopButton = document.getElementById("stopMonitoring");
  const createObjectButton = document.getElementById("createObject");
  const clearHistoryButton = document.getElementById("clearHistory");
  const exportDataButton = document.getElementById("exportData");

  if (startButton) {
    startButton.addEventListener("click", () => startMemoryMonitoring());
  }

  if (stopButton) {
    stopButton.addEventListener("click", stopMemoryMonitoring);
  }

  if (createObjectButton) {
    createObjectButton.addEventListener("click", () => {
      // 10MBのオブジェクトを作成して変数に保存
      window.largeObject = createLargeObject(10);

      // メモリ使用状況を更新
      const memoryInfo = displayMemoryUsage();

      // 統計情報を更新
      displayMemoryStats();
    });
  }

  if (clearHistoryButton) {
    clearHistoryButton.addEventListener("click", () => {
      clearMemoryHistory();
      displayMemoryStats();
    });
  }

  if (exportDataButton) {
    exportDataButton.addEventListener("click", exportMemoryHistory);
  }

  // 定期的に統計情報を更新
  setInterval(() => {
    if (isMonitoring && memoryHistory.length > 0) {
      displayMemoryStats();
    }
  }, 2000);

  // ページ読み込み完了時のログ
  addLogEntry(
    "Chapter 1: ブラウザのメモリ管理の基本ページが読み込まれました",
    "info"
  );
  addLogEntry(
    "「メモリ監視開始」ボタンをクリックして監視を開始してください",
    "info"
  );
});

// Chapter 1固有の機能をここに追加
// 例: メモリ使用状況の詳細な解析など
