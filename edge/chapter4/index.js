// Edgeブラウザでのメモリプロファイリングのデモ

// メモリ使用状況を表示する関数
function displayMemoryUsage() {
  if (!performance.memory) {
    console.log("このブラウザはperformance.memoryをサポートしていません。");
    document.getElementById("memory-info").textContent =
      "このブラウザはメモリ情報の取得をサポートしていません。Chromeブラウザを使用してください。";
    return null;
  }

  const memoryInfo = performance.memory;
  const usedJSHeapSize = memoryInfo.usedJSHeapSize;
  const totalJSHeapSize = memoryInfo.totalJSHeapSize;
  const jsHeapSizeLimit = memoryInfo.jsHeapSizeLimit;
  const usagePercentage = ((usedJSHeapSize / jsHeapSizeLimit) * 100).toFixed(2);

  const memoryData = {
    usedJSHeapSize,
    totalJSHeapSize,
    jsHeapSizeLimit,
    usagePercentage,
  };

  updateDOMDisplay(memoryData);
  return memoryData;
}

// メモリサイズをフォーマットする関数
function formatBytes(bytes, decimals = 2) {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

// DOMにメモリ情報を表示する関数
function updateDOMDisplay(memoryData) {
  if (!memoryData) return;

  document.getElementById("used-heap").textContent = formatBytes(
    memoryData.usedJSHeapSize
  );
  document.getElementById("total-heap").textContent = formatBytes(
    memoryData.totalJSHeapSize
  );
  document.getElementById("heap-limit").textContent = formatBytes(
    memoryData.jsHeapSizeLimit
  );
  document.getElementById("usage-percentage").textContent =
    memoryData.usagePercentage + "%";

  // メモリ使用率バーを更新
  const memoryBar = document.getElementById("memory-bar-fill");
  memoryBar.style.width = memoryData.usagePercentage + "%";

  // 使用率に応じて色を変更
  if (memoryData.usagePercentage > 80) {
    memoryBar.style.backgroundColor = "#ff4d4d"; // 赤
  } else if (memoryData.usagePercentage > 60) {
    memoryBar.style.backgroundColor = "#ffcc00"; // 黄
  } else {
    memoryBar.style.backgroundColor = "#4CAF50"; // 緑
  }
}

// メモリ使用量の履歴を保存する配列
let memoryHistory = [];

// メモリ使用量を記録する関数
function recordMemoryUsage() {
  const memoryData = displayMemoryUsage();
  if (!memoryData) return;

  const timestamp = new Date();
  memoryHistory.push({
    timestamp,
    usedJSHeapSize: memoryData.usedJSHeapSize,
    totalJSHeapSize: memoryData.totalJSHeapSize,
  });

  // 最大100件まで保存
  if (memoryHistory.length > 100) {
    memoryHistory.shift();
  }

  // ログに追加
  addLogEntry(
    `${timestamp.toLocaleTimeString()}: ${formatBytes(
      memoryData.usedJSHeapSize
    )} 使用中`
  );
}

// メモリ監視の間隔ID
let monitoringIntervalId = null;

// メモリ監視を開始する関数
function startMemoryMonitoring() {
  if (monitoringIntervalId) {
    addLogEntry("メモリ監視はすでに実行中です。");
    return;
  }

  addLogEntry("メモリ監視を開始しました。");
  memoryHistory = [];
  monitoringIntervalId = setInterval(recordMemoryUsage, 1000);

  // ボタンの状態を更新
  document.getElementById("start-monitoring").disabled = true;
  document.getElementById("stop-monitoring").disabled = false;
}

// メモリ監視を停止する関数
function stopMemoryMonitoring() {
  if (!monitoringIntervalId) {
    addLogEntry("メモリ監視は実行されていません。");
    return;
  }

  clearInterval(monitoringIntervalId);
  monitoringIntervalId = null;
  addLogEntry("メモリ監視を停止しました。");

  // ボタンの状態を更新
  document.getElementById("start-monitoring").disabled = false;
  document.getElementById("stop-monitoring").disabled = true;
}

// DOMリークのデモ
let detachedNodes = [];

function createDetachedNodes() {
  clearLog();
  addLogEntry("DOMリークのデモを開始します...");

  // 初期メモリ使用量を記録
  const initialMemory = displayMemoryUsage();
  if (!initialMemory) return;

  addLogEntry(`初期メモリ使用量: ${formatBytes(initialMemory.usedJSHeapSize)}`);

  // 切り離されたDOMノードを作成して保存
  const div = document.createElement("div");
  div.innerHTML = `<p>これは切り離されたDOMノードです (${
    detachedNodes.length + 1
  })</p>`;

  // DOMツリーに追加せずに配列に保存
  detachedNodes.push(div);

  // メモリ使用量を確認
  const afterCreationMemory = displayMemoryUsage();
  addLogEntry(
    `ノード作成後のメモリ使用量: ${formatBytes(
      afterCreationMemory.usedJSHeapSize
    )}`
  );
  addLogEntry(
    `差分: ${formatBytes(
      afterCreationMemory.usedJSHeapSize - initialMemory.usedJSHeapSize
    )}`
  );
  addLogEntry(`保存されたノード数: ${detachedNodes.length}`);
}

function clearDetachedNodes() {
  clearLog();
  addLogEntry("切り離されたDOMノードを解放します...");

  // 初期メモリ使用量を記録
  const initialMemory = displayMemoryUsage();
  if (!initialMemory) return;

  addLogEntry(`初期メモリ使用量: ${formatBytes(initialMemory.usedJSHeapSize)}`);
  addLogEntry(`解放前のノード数: ${detachedNodes.length}`);

  // 配列を空にして参照を解放
  detachedNodes = [];

  // ガベージコレクションを促す
  addLogEntry("ガベージコレクションを促します...");
  setTimeout(function () {
    // 少し時間を置いてからメモリ使用量を確認
    const afterGCMemory = displayMemoryUsage();
    addLogEntry(
      `ガベージコレクション後のメモリ使用量: ${formatBytes(
        afterGCMemory.usedJSHeapSize
      )}`
    );
    addLogEntry(
      `差分: ${formatBytes(
        afterGCMemory.usedJSHeapSize - initialMemory.usedJSHeapSize
      )}`
    );
    addLogEntry("切り離されたDOMノードを解放しました。");
  }, 1000);
}

// クロージャリークのデモ
let leakyTimerIds = [];

function setupLeakyTimer() {
  clearLog();
  addLogEntry("クロージャリークのデモを開始します...");

  // 初期メモリ使用量を記録
  const initialMemory = displayMemoryUsage();
  if (!initialMemory) return;

  addLogEntry(`初期メモリ使用量: ${formatBytes(initialMemory.usedJSHeapSize)}`);

  // 大きな配列を作成
  const largeData = new Array(100000).fill("leak data");

  // タイマーを設定
  const timerId = setInterval(function () {
    // この関数はlargeDataへの参照を保持し続ける
    addLogEntry(`タイマー実行: 配列サイズ = ${largeData.length}`);

    // メモリ使用量を確認
    const currentMemory = displayMemoryUsage();
    addLogEntry(
      `現在のメモリ使用量: ${formatBytes(currentMemory.usedJSHeapSize)}`
    );
  }, 5000);

  // タイマーIDを保存
  leakyTimerIds.push(timerId);

  // メモリ使用量を確認
  const afterSetupMemory = displayMemoryUsage();
  addLogEntry(
    `タイマー設定後のメモリ使用量: ${formatBytes(
      afterSetupMemory.usedJSHeapSize
    )}`
  );
  addLogEntry(
    `差分: ${formatBytes(
      afterSetupMemory.usedJSHeapSize - initialMemory.usedJSHeapSize
    )}`
  );
  addLogEntry(`アクティブなタイマー数: ${leakyTimerIds.length}`);
}

function clearLeakyTimers() {
  clearLog();
  addLogEntry("クロージャリークを解消します...");

  // 初期メモリ使用量を記録
  const initialMemory = displayMemoryUsage();
  if (!initialMemory) return;

  addLogEntry(`初期メモリ使用量: ${formatBytes(initialMemory.usedJSHeapSize)}`);
  addLogEntry(`解放前のタイマー数: ${leakyTimerIds.length}`);

  // すべてのタイマーをクリア
  leakyTimerIds.forEach((id) => clearInterval(id));
  leakyTimerIds = [];

  // ガベージコレクションを促す
  addLogEntry("ガベージコレクションを促します...");
  setTimeout(function () {
    // 少し時間を置いてからメモリ使用量を確認
    const afterGCMemory = displayMemoryUsage();
    addLogEntry(
      `ガベージコレクション後のメモリ使用量: ${formatBytes(
        afterGCMemory.usedJSHeapSize
      )}`
    );
    addLogEntry(
      `差分: ${formatBytes(
        afterGCMemory.usedJSHeapSize - initialMemory.usedJSHeapSize
      )}`
    );
    addLogEntry("クロージャリークを解消しました。");
  }, 1000);
}

// イベントリスナーリークのデモ
let buttonsWithListeners = [];

function addLeakyEventListener() {
  clearLog();
  addLogEntry("イベントリスナーリークのデモを開始します...");

  // 初期メモリ使用量を記録
  const initialMemory = displayMemoryUsage();
  if (!initialMemory) return;

  addLogEntry(`初期メモリ使用量: ${formatBytes(initialMemory.usedJSHeapSize)}`);

  // ボタンを作成
  const button = document.createElement("button");
  button.textContent = `Click me (${buttonsWithListeners.length + 1})`;
  button.style.display = "none"; // 画面には表示しない
  document.body.appendChild(button);

  // クリックハンドラを作成
  const handleClick = function () {
    console.log("Button clicked");
  };

  // イベントリスナーを追加
  button.addEventListener("click", handleClick);

  // ボタンを削除するが、イベントリスナーは解除しない
  document.body.removeChild(button);

  // 参照を保持
  buttonsWithListeners.push({ button, handleClick });

  // メモリ使用量を確認
  const afterCreationMemory = displayMemoryUsage();
  addLogEntry(
    `リスナー追加後のメモリ使用量: ${formatBytes(
      afterCreationMemory.usedJSHeapSize
    )}`
  );
  addLogEntry(
    `差分: ${formatBytes(
      afterCreationMemory.usedJSHeapSize - initialMemory.usedJSHeapSize
    )}`
  );
  addLogEntry(`保存されたボタン数: ${buttonsWithListeners.length}`);
}

function clearEventListeners() {
  clearLog();
  addLogEntry("イベントリスナーを解除します...");

  // 初期メモリ使用量を記録
  const initialMemory = displayMemoryUsage();
  if (!initialMemory) return;

  addLogEntry(`初期メモリ使用量: ${formatBytes(initialMemory.usedJSHeapSize)}`);
  addLogEntry(`解放前のボタン数: ${buttonsWithListeners.length}`);

  // すべてのイベントリスナーを解除
  buttonsWithListeners.forEach((item) => {
    item.button.removeEventListener("click", item.handleClick);
  });
  buttonsWithListeners = [];

  // ガベージコレクションを促す
  addLogEntry("ガベージコレクションを促します...");
  setTimeout(function () {
    // 少し時間を置いてからメモリ使用量を確認
    const afterGCMemory = displayMemoryUsage();
    addLogEntry(
      `ガベージコレクション後のメモリ使用量: ${formatBytes(
        afterGCMemory.usedJSHeapSize
      )}`
    );
    addLogEntry(
      `差分: ${formatBytes(
        afterGCMemory.usedJSHeapSize - initialMemory.usedJSHeapSize
      )}`
    );
    addLogEntry("イベントリスナーを解除しました。");
  }, 1000);
}

// オブジェクトプールのデモ
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

  getActiveCount() {
    return this.pool.filter((p) => p.isActive).length;
  }
}

let particlePool = null;
let withoutPoolArray = [];

function demoWithObjectPool() {
  clearLog();
  addLogEntry("オブジェクトプールのデモを開始します...");

  // 初期メモリ使用量を記録
  const initialMemory = displayMemoryUsage();
  if (!initialMemory) return;

  addLogEntry(`初期メモリ使用量: ${formatBytes(initialMemory.usedJSHeapSize)}`);

  // オブジェクトプールを作成
  particlePool = new ParticlePool(1000);

  // メモリ使用量を確認
  const afterPoolCreationMemory = displayMemoryUsage();
  addLogEntry(
    `プール作成後のメモリ使用量: ${formatBytes(
      afterPoolCreationMemory.usedJSHeapSize
    )}`
  );
  addLogEntry(
    `差分: ${formatBytes(
      afterPoolCreationMemory.usedJSHeapSize - initialMemory.usedJSHeapSize
    )}`
  );

  // オブジェクトプールを使用してパーティクルを取得・解放
  addLogEntry("オブジェクトプールからパーティクルを取得・解放します...");

  const startTime = performance.now();

  for (let i = 0; i < 10000; i++) {
    const particle = particlePool.getParticle();
    if (particle) {
      particle.x = Math.random() * 100;
      particle.y = Math.random() * 100;
      particle.speed = Math.random() * 5;

      // 一部のパーティクルは解放しない（アクティブなまま）
      if (i % 2 === 0) {
        particlePool.releaseParticle(particle);
      }
    }
  }

  const endTime = performance.now();

  // メモリ使用量を確認
  const afterUseMemory = displayMemoryUsage();
  addLogEntry(
    `パーティクル操作後のメモリ使用量: ${formatBytes(
      afterUseMemory.usedJSHeapSize
    )}`
  );
  addLogEntry(
    `差分: ${formatBytes(
      afterUseMemory.usedJSHeapSize - afterPoolCreationMemory.usedJSHeapSize
    )}`
  );
  addLogEntry(`アクティブなパーティクル数: ${particlePool.getActiveCount()}`);
  addLogEntry(`処理時間: ${(endTime - startTime).toFixed(2)}ms`);
}

function demoWithoutObjectPool() {
  clearLog();
  addLogEntry("オブジェクトプールなしのデモを開始します...");

  // 初期メモリ使用量を記録
  const initialMemory = displayMemoryUsage();
  if (!initialMemory) return;

  addLogEntry(`初期メモリ使用量: ${formatBytes(initialMemory.usedJSHeapSize)}`);

  // 配列をクリア
  withoutPoolArray = [];

  // メモリ使用量を確認
  const afterClearMemory = displayMemoryUsage();

  // オブジェクトプールを使わずにパーティクルを作成
  addLogEntry("オブジェクトプールなしでパーティクルを作成します...");

  const startTime = performance.now();

  for (let i = 0; i < 10000; i++) {
    const particle = {
      x: Math.random() * 100,
      y: Math.random() * 100,
      speed: Math.random() * 5,
      isActive: true,
    };

    // 一部のパーティクルは配列に保存
    if (i % 2 === 0) {
      withoutPoolArray.push(particle);
    }
  }

  const endTime = performance.now();

  // メモリ使用量を確認
  const afterUseMemory = displayMemoryUsage();
  addLogEntry(
    `パーティクル作成後のメモリ使用量: ${formatBytes(
      afterUseMemory.usedJSHeapSize
    )}`
  );
  addLogEntry(
    `差分: ${formatBytes(
      afterUseMemory.usedJSHeapSize - afterClearMemory.usedJSHeapSize
    )}`
  );
  addLogEntry(`保存されたパーティクル数: ${withoutPoolArray.length}`);
  addLogEntry(`処理時間: ${(endTime - startTime).toFixed(2)}ms`);
}

// WeakMapのデモ
let normalMap = new Map();
let weakMap = new WeakMap();
let elementsForWeakMapDemo = [];

function demoWithWeakMap() {
  clearLog();
  addLogEntry("WeakMapのデモを開始します...");

  // 初期メモリ使用量を記録
  const initialMemory = displayMemoryUsage();
  if (!initialMemory) return;

  addLogEntry(`初期メモリ使用量: ${formatBytes(initialMemory.usedJSHeapSize)}`);

  // 通常のMapとWeakMapを使用
  addLogEntry("通常のMapとWeakMapにオブジェクトを追加します...");

  // 要素を作成
  for (let i = 0; i < 100; i++) {
    const element = document.createElement("div");
    element.textContent = `Element ${i}`;

    // 計算結果をキャッシュ
    const expensiveResult = {
      value: `Result for element ${i}`,
      data: new Array(1000).fill(i),
    };

    // 通常のMapに追加
    normalMap.set(element, expensiveResult);

    // WeakMapに追加
    weakMap.set(element, expensiveResult);

    // 要素への参照を保持
    elementsForWeakMapDemo.push(element);
  }

  // メモリ使用量を確認
  const afterAdditionMemory = displayMemoryUsage();
  addLogEntry(
    `オブジェクト追加後のメモリ使用量: ${formatBytes(
      afterAdditionMemory.usedJSHeapSize
    )}`
  );
  addLogEntry(
    `差分: ${formatBytes(
      afterAdditionMemory.usedJSHeapSize - initialMemory.usedJSHeapSize
    )}`
  );
  addLogEntry(`通常のMapのサイズ: ${normalMap.size}`);
  addLogEntry(`要素配列のサイズ: ${elementsForWeakMapDemo.length}`);
  addLogEntry("注意: WeakMapはサイズを取得できません");
}

function clearWeakMapDemo() {
  clearLog();
  addLogEntry("WeakMapデモのクリーンアップを開始します...");

  // 初期メモリ使用量を記録
  const initialMemory = displayMemoryUsage();
  if (!initialMemory) return;

  addLogEntry(`初期メモリ使用量: ${formatBytes(initialMemory.usedJSHeapSize)}`);
  addLogEntry(`クリア前の通常のMapのサイズ: ${normalMap.size}`);
  addLogEntry(`クリア前の要素配列のサイズ: ${elementsForWeakMapDemo.length}`);

  // 要素への参照を解放
  elementsForWeakMapDemo = [];

  // ガベージコレクションを促す
  addLogEntry("ガベージコレクションを促します...");
  setTimeout(function () {
    // 少し時間を置いてからメモリ使用量を確認
    const afterGCMemory = displayMemoryUsage();
    addLogEntry(
      `ガベージコレクション後のメモリ使用量: ${formatBytes(
        afterGCMemory.usedJSHeapSize
      )}`
    );
    addLogEntry(
      `差分: ${formatBytes(
        afterGCMemory.usedJSHeapSize - initialMemory.usedJSHeapSize
      )}`
    );
    addLogEntry(`通常のMapのサイズ: ${normalMap.size}`);
    addLogEntry(
      "WeakMapのキーは自動的に解放されました（要素への参照がなくなったため）"
    );
    addLogEntry(
      "通常のMapはまだすべてのキーを保持しています（メモリリークの原因）"
    );
  }, 1000);
}

// ログをクリアする関数
function clearLog() {
  const logContainer = document.getElementById("log-container");
  logContainer.innerHTML = "";
}

// ログにエントリを追加する関数
function addLogEntry(message) {
  const logContainer = document.getElementById("log-container");
  const logEntry = document.createElement("div");
  logEntry.className = "log-entry";
  logEntry.textContent = message;
  logContainer.appendChild(logEntry);

  // 自動スクロール
  logContainer.scrollTop = logContainer.scrollHeight;
}

// 強制的にガベージコレクションを促す関数
function forceGarbageCollection() {
  addLogEntry("ガベージコレクションを促しています...");

  // 大量のオブジェクトを作成して破棄
  for (let i = 0; i < 10; i++) {
    let arr = new Array(1000000);
    arr = null;
  }

  // 少し時間を置いてからメモリ使用量を確認
  setTimeout(function () {
    const afterGCMemory = displayMemoryUsage();
    addLogEntry(
      `ガベージコレクション促進後のメモリ使用量: ${formatBytes(
        afterGCMemory.usedJSHeapSize
      )}`
    );
  }, 1000);
}

// ページ読み込み時の初期化
document.addEventListener("DOMContentLoaded", function () {
  // 初期メモリ使用状況を表示
  displayMemoryUsage();

  // ボタンにイベントリスナーを設定
  document
    .getElementById("start-monitoring")
    .addEventListener("click", startMemoryMonitoring);
  document
    .getElementById("stop-monitoring")
    .addEventListener("click", stopMemoryMonitoring);

  document
    .getElementById("create-detached-nodes")
    .addEventListener("click", createDetachedNodes);
  document
    .getElementById("clear-detached-nodes")
    .addEventListener("click", clearDetachedNodes);

  document
    .getElementById("setup-leaky-timer")
    .addEventListener("click", setupLeakyTimer);
  document
    .getElementById("clear-leaky-timers")
    .addEventListener("click", clearLeakyTimers);

  document
    .getElementById("add-leaky-listener")
    .addEventListener("click", addLeakyEventListener);
  document
    .getElementById("clear-event-listeners")
    .addEventListener("click", clearEventListeners);

  document
    .getElementById("demo-with-object-pool")
    .addEventListener("click", demoWithObjectPool);
  document
    .getElementById("demo-without-object-pool")
    .addEventListener("click", demoWithoutObjectPool);

  document
    .getElementById("demo-with-weak-map")
    .addEventListener("click", demoWithWeakMap);
  document
    .getElementById("clear-weak-map-demo")
    .addEventListener("click", clearWeakMapDemo);

  document
    .getElementById("force-gc")
    .addEventListener("click", forceGarbageCollection);

  // 定期的にメモリ使用状況を更新
  setInterval(displayMemoryUsage, 1000);
});
