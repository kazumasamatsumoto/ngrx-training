/**
 * 共通JavaScript関数
 * Edgeでのメモリ管理とパフォーマンスチェックのためのユーティリティ
 */

// グローバル変数
const MEMORY_HISTORY_MAX_LENGTH = 100;
let memoryHistory = [];
let memoryMonitorInterval = null;
let isMonitoring = false;
let tutorialStep = 0;
let tutorialSteps = [];
let chart = null;

// ブラウザ情報を取得
const browserInfo = {
  name: getBrowserName(),
  version: getBrowserVersion(),
  isChromiumBased: isChromiumBased(),
  supportsMemoryAPI:
    typeof performance !== "undefined" && "memory" in performance,
  timestamp: new Date().toISOString(),
};

// ブラウザ名を取得
function getBrowserName() {
  const userAgent = navigator.userAgent;

  if (userAgent.indexOf("Edge") > -1) return "Microsoft Edge (Legacy)";
  if (userAgent.indexOf("Edg") > -1) return "Microsoft Edge (Chromium)";
  if (userAgent.indexOf("Chrome") > -1) return "Google Chrome";
  if (userAgent.indexOf("Safari") > -1) return "Safari";
  if (userAgent.indexOf("Firefox") > -1) return "Firefox";
  if (userAgent.indexOf("MSIE") > -1 || userAgent.indexOf("Trident") > -1)
    return "Internet Explorer";

  return "Unknown Browser";
}

// ブラウザバージョンを取得
function getBrowserVersion() {
  const userAgent = navigator.userAgent;
  let match;

  if (userAgent.indexOf("Edg") > -1) {
    match = userAgent.match(/Edg\/([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/);
  } else if (userAgent.indexOf("Chrome") > -1) {
    match = userAgent.match(/Chrome\/([0-9]+\.[0-9]+\.[0-9]+\.[0-9]+)/);
  } else if (userAgent.indexOf("Firefox") > -1) {
    match = userAgent.match(/Firefox\/([0-9]+\.[0-9]+)/);
  } else if (userAgent.indexOf("Safari") > -1) {
    match = userAgent.match(/Version\/([0-9]+\.[0-9]+\.[0-9]+)/);
  }

  return match ? match[1] : "Unknown";
}

// Chromiumベースのブラウザかどうか
function isChromiumBased() {
  return (
    navigator.userAgent.indexOf("Chrome") > -1 ||
    navigator.userAgent.indexOf("Edg") > -1
  );
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

// メモリ使用状況を取得する関数
function getMemoryInfo() {
  if (!browserInfo.supportsMemoryAPI) {
    return {
      totalJSHeapSize: 0,
      usedJSHeapSize: 0,
      jsHeapSizeLimit: 0,
      timestamp: new Date(),
      supported: false,
    };
  }

  const memoryInfo = performance.memory;
  return {
    totalJSHeapSize: memoryInfo.totalJSHeapSize,
    usedJSHeapSize: memoryInfo.usedJSHeapSize,
    jsHeapSizeLimit: memoryInfo.jsHeapSizeLimit,
    timestamp: new Date(),
    supported: true,
  };
}

// メモリ使用状況を表示する関数
function displayMemoryUsage() {
  const memoryInfo = getMemoryInfo();

  if (!memoryInfo.supported) {
    addLogEntry(
      "このブラウザではperformance.memoryがサポートされていません",
      "error"
    );
    return memoryInfo;
  }

  // DOMに表示
  updateDOMDisplay(memoryInfo);

  // 履歴に追加
  addMemoryHistory(memoryInfo);

  // グラフを更新（存在する場合）
  if (typeof updateMemoryChart === "function" && chart) {
    updateMemoryChart();
  }

  return memoryInfo;
}

// DOMにメモリ情報を表示する関数
function updateDOMDisplay(memoryInfo) {
  if (!memoryInfo.supported) {
    const elements = [
      "totalHeapSize",
      "usedHeapSize",
      "heapSizeLimit",
      "memoryUsage",
    ];

    elements.forEach((id) => {
      const element = document.getElementById(id);
      if (element) {
        element.textContent = "未対応";
        element.classList.add("unsupported");
      }
    });

    return;
  }

  // 各要素を更新
  updateElementText("totalHeapSize", formatBytes(memoryInfo.totalJSHeapSize));
  updateElementText("usedHeapSize", formatBytes(memoryInfo.usedJSHeapSize));
  updateElementText("heapSizeLimit", formatBytes(memoryInfo.jsHeapSizeLimit));

  // 使用率を計算して表示
  const usagePercent = (
    (memoryInfo.usedJSHeapSize / memoryInfo.jsHeapSizeLimit) *
    100
  ).toFixed(2);
  updateElementText("memoryUsage", `${usagePercent}%`);

  // タイムスタンプを更新
  updateElementText(
    "lastUpdated",
    `最終更新: ${memoryInfo.timestamp.toLocaleTimeString()}`
  );

  // メモリバーを更新
  updateMemoryBar(parseFloat(usagePercent));
}

// 要素のテキストを更新するヘルパー関数
function updateElementText(id, text) {
  const element = document.getElementById(id);
  if (element) {
    element.textContent = text;
  }
}

// メモリバーを更新する関数
function updateMemoryBar(usedPercent) {
  const memoryBar = document.getElementById("memoryBarDisplay");
  const memoryBarLabel = document.getElementById("memoryBarLabel");

  if (memoryBar) {
    memoryBar.style.width = `${Math.min(usedPercent, 100)}%`;

    // 使用率に応じて色を変更
    if (usedPercent > 80) {
      memoryBar.style.backgroundColor = "var(--danger-color)";
    } else if (usedPercent > 60) {
      memoryBar.style.backgroundColor = "var(--warning-color)";
    } else {
      memoryBar.style.backgroundColor = "var(--primary-color)";
    }
  }

  if (memoryBarLabel) {
    memoryBarLabel.textContent = `${usedPercent}%`;
  }
}

// メモリ使用状況の履歴を記録する関数
function addMemoryHistory(memoryInfo) {
  if (!memoryInfo.supported) return;

  memoryHistory.push({
    timestamp: memoryInfo.timestamp,
    usedJSHeapSize: memoryInfo.usedJSHeapSize,
    totalJSHeapSize: memoryInfo.totalJSHeapSize,
    jsHeapSizeLimit: memoryInfo.jsHeapSizeLimit,
  });

  // 履歴の長さを制限
  if (memoryHistory.length > MEMORY_HISTORY_MAX_LENGTH) {
    memoryHistory.shift();
  }
}

// メモリ監視を開始する関数
function startMemoryMonitoring(intervalMs = 1000) {
  // 既存の監視を停止
  stopMemoryMonitoring();

  // 新しい監視を開始
  isMonitoring = true;
  updateMonitoringStatus(true);
  addLogEntry(`メモリ監視を開始しました（間隔: ${intervalMs}ms）`, "success");

  // 初回実行
  const initialMemoryInfo = displayMemoryUsage();

  // 定期的に実行
  memoryMonitorInterval = setInterval(() => {
    displayMemoryUsage();
  }, intervalMs);

  return initialMemoryInfo;
}

// メモリ監視を停止する関数
function stopMemoryMonitoring() {
  if (memoryMonitorInterval) {
    clearInterval(memoryMonitorInterval);
    memoryMonitorInterval = null;
    isMonitoring = false;
    updateMonitoringStatus(false);
    addLogEntry("メモリ監視を停止しました", "warning");
  }
}

// 監視状態を更新する関数
function updateMonitoringStatus(isActive) {
  const statusIndicator = document.getElementById("monitoringStatus");
  const statusText = document.getElementById("monitoringStatusText");

  if (statusIndicator) {
    statusIndicator.className = isActive
      ? "status-indicator active"
      : "status-indicator inactive";
  }

  if (statusText) {
    statusText.textContent = isActive ? "監視中" : "停止中";
    statusText.className = isActive ? "status-active" : "status-inactive";
  }
}

// ログにエントリを追加する関数
function addLogEntry(message, type = "info") {
  const logContainer = document.getElementById("memoryLog");
  if (!logContainer) return;

  const logEntry = document.createElement("div");
  logEntry.className = `log-entry ${type}`;
  logEntry.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
  logContainer.appendChild(logEntry);
  logContainer.scrollTop = logContainer.scrollHeight;
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

  addLogEntry(`${sizeInMB}MBのオブジェクトを作成しました`, "warning");
  return array;
}

// チュートリアルを初期化する関数
function initTutorial(steps) {
  tutorialSteps = steps;
  tutorialStep = 0;

  const tutorialContainer = document.getElementById("tutorialContainer");
  if (!tutorialContainer) return;

  // 初期ステップを表示
  showTutorialStep(0);

  // イベントリスナーを設定
  const nextButton = document.getElementById("tutorialNext");
  const prevButton = document.getElementById("tutorialPrev");
  const closeButton = document.getElementById("tutorialClose");

  if (nextButton) {
    nextButton.addEventListener("click", () => {
      showTutorialStep(tutorialStep + 1);
    });
  }

  if (prevButton) {
    prevButton.addEventListener("click", () => {
      showTutorialStep(tutorialStep - 1);
    });
  }

  if (closeButton) {
    closeButton.addEventListener("click", () => {
      tutorialContainer.classList.add("hidden");
    });
  }
}

// チュートリアルステップを表示する関数
function showTutorialStep(stepIndex) {
  if (stepIndex < 0 || stepIndex >= tutorialSteps.length) return;

  tutorialStep = stepIndex;
  const step = tutorialSteps[stepIndex];

  const tutorialTitle = document.getElementById("tutorialTitle");
  const tutorialContent = document.getElementById("tutorialContent");
  const prevButton = document.getElementById("tutorialPrev");
  const nextButton = document.getElementById("tutorialNext");

  if (tutorialTitle) tutorialTitle.textContent = step.title;
  if (tutorialContent) tutorialContent.textContent = step.content;

  if (prevButton) {
    prevButton.disabled = stepIndex === 0;
  }

  if (nextButton) {
    nextButton.disabled = stepIndex === tutorialSteps.length - 1;
    nextButton.textContent =
      stepIndex === tutorialSteps.length - 1 ? "完了" : "次へ";
  }

  // ハイライト要素があれば
  if (step.highlightElement) {
    const element = document.getElementById(step.highlightElement);
    if (element) {
      element.classList.add("pulse");

      // 他の要素のハイライトを削除
      document.querySelectorAll(".pulse").forEach((el) => {
        if (el.id !== step.highlightElement) {
          el.classList.remove("pulse");
        }
      });
    }
  }
}

// ページ読み込み時の共通初期化
document.addEventListener("DOMContentLoaded", () => {
  // ブラウザ情報を表示
  const browserNameElement = document.getElementById("browserName");
  const browserVersionElement = document.getElementById("browserVersion");

  if (browserNameElement) {
    browserNameElement.textContent = browserInfo.name;
  }

  if (browserVersionElement) {
    browserVersionElement.textContent = browserInfo.version;
  }

  // メモリAPIのサポート状況を表示
  const memoryApiSupportElement = document.getElementById("memoryApiSupport");
  if (memoryApiSupportElement) {
    if (browserInfo.supportsMemoryAPI) {
      memoryApiSupportElement.textContent = "サポート";
      memoryApiSupportElement.className = "supported";
    } else {
      memoryApiSupportElement.textContent = "未サポート";
      memoryApiSupportElement.className = "unsupported";
      addLogEntry(
        "このブラウザではperformance.memoryがサポートされていません。Chromiumベースのブラウザ（Chrome、Edge）を使用してください。",
        "error"
      );
    }
  }

  // 初期メモリ使用状況を表示
  displayMemoryUsage();
});
