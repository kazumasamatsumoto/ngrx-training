// JavaScriptのガベージコレクションを実験するためのコード

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
// common.jsですでに宣言されているため削除
// let memoryHistory = [];

// メモリ使用量を記録する関数
function recordMemoryUsage() {
  const memoryData = displayMemoryUsage();
  if (!memoryData) return;

  const timestamp = new Date();
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

// 参照カウンティングのデモ
function referenceCountingDemo() {
  clearLog();
  addLogEntry("参照カウンティングのデモを開始します...");

  // 初期メモリ使用量を記録
  const initialMemory = displayMemoryUsage();
  if (!initialMemory) return;

  addLogEntry(`初期メモリ使用量: ${formatBytes(initialMemory.usedJSHeapSize)}`);

  // オブジェクトを作成
  addLogEntry("オブジェクトを作成します...");
  let obj = new Array(1000000).fill("test");

  // メモリ使用量を確認
  const afterCreationMemory = displayMemoryUsage();
  addLogEntry(
    `オブジェクト作成後のメモリ使用量: ${formatBytes(
      afterCreationMemory.usedJSHeapSize
    )}`
  );
  addLogEntry(
    `差分: ${formatBytes(
      afterCreationMemory.usedJSHeapSize - initialMemory.usedJSHeapSize
    )}`
  );

  // 参照を追加
  addLogEntry("参照を追加します...");
  let anotherRef = obj;

  // 参照を削除
  addLogEntry("最初の参照を削除します...");
  obj = null;

  // メモリ使用量を確認
  const afterFirstNullMemory = displayMemoryUsage();
  addLogEntry(
    `最初の参照削除後のメモリ使用量: ${formatBytes(
      afterFirstNullMemory.usedJSHeapSize
    )}`
  );

  // 2つ目の参照も削除
  addLogEntry("2つ目の参照も削除します...");
  anotherRef = null;

  // メモリ使用量を確認
  const afterSecondNullMemory = displayMemoryUsage();
  addLogEntry(
    `2つ目の参照削除後のメモリ使用量: ${formatBytes(
      afterSecondNullMemory.usedJSHeapSize
    )}`
  );
  addLogEntry(
    `差分: ${formatBytes(
      afterSecondNullMemory.usedJSHeapSize - afterFirstNullMemory.usedJSHeapSize
    )}`
  );

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
      `初期状態との差分: ${formatBytes(
        afterGCMemory.usedJSHeapSize - initialMemory.usedJSHeapSize
      )}`
    );
  }, 1000);
}

// 循環参照のデモ
function cyclicReferenceDemo() {
  clearLog();
  addLogEntry("循環参照のデモを開始します...");

  // 初期メモリ使用量を記録
  const initialMemory = displayMemoryUsage();
  if (!initialMemory) return;

  addLogEntry(`初期メモリ使用量: ${formatBytes(initialMemory.usedJSHeapSize)}`);

  // 循環参照を作成する関数
  function createCyclicReference() {
    addLogEntry("循環参照を作成します...");

    let obj1 = new Array(500000).fill("obj1");
    let obj2 = new Array(500000).fill("obj2");

    // 循環参照を作成
    obj1.ref = obj2;
    obj2.ref = obj1;

    // マーク・アンド・スイープアルゴリズムのおかげで、obj1とobj2はガベージコレクションの対象になる
  }

  // 循環参照を作成
  createCyclicReference();

  // メモリ使用量を確認
  const afterCreationMemory = displayMemoryUsage();
  addLogEntry(
    `循環参照作成後のメモリ使用量: ${formatBytes(
      afterCreationMemory.usedJSHeapSize
    )}`
  );
  addLogEntry(
    `差分: ${formatBytes(
      afterCreationMemory.usedJSHeapSize - initialMemory.usedJSHeapSize
    )}`
  );

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
      `初期状態との差分: ${formatBytes(
        afterGCMemory.usedJSHeapSize - initialMemory.usedJSHeapSize
      )}`
    );
  }, 1000);
}

// メモリリークのデモ
let leakyArray = null;
let leakIntervalId = null;

function startMemoryLeak() {
  if (leakIntervalId) {
    addLogEntry("メモリリークはすでに実行中です。");
    return;
  }

  clearLog();
  addLogEntry("メモリリークのデモを開始します...");

  // 初期メモリ使用量を記録
  const initialMemory = displayMemoryUsage();
  if (!initialMemory) return;

  addLogEntry(`初期メモリ使用量: ${formatBytes(initialMemory.usedJSHeapSize)}`);

  // メモリリークを作成
  leakyArray = [];

  // 定期的に配列に大きなオブジェクトを追加
  leakIntervalId = setInterval(function () {
    let largeObject = new Array(100000).fill("leak");
    leakyArray.push(largeObject);

    const currentMemory = displayMemoryUsage();
    addLogEntry(
      `メモリリーク: 配列サイズ = ${
        leakyArray.length
      }, メモリ使用量 = ${formatBytes(currentMemory.usedJSHeapSize)}`
    );
  }, 1000);

  // ボタンの状態を更新
  document.getElementById("start-leak").disabled = true;
  document.getElementById("stop-leak").disabled = false;
}

function stopMemoryLeak() {
  if (!leakIntervalId) {
    addLogEntry("メモリリークは実行されていません。");
    return;
  }

  // インターバルを停止
  clearInterval(leakIntervalId);
  leakIntervalId = null;

  // メモリ使用量を確認
  const beforeCleanupMemory = displayMemoryUsage();
  addLogEntry(
    `リーク停止前のメモリ使用量: ${formatBytes(
      beforeCleanupMemory.usedJSHeapSize
    )}`
  );

  // 参照を解放
  addLogEntry("参照を解放します...");
  leakyArray = null;

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
      `リーク停止前との差分: ${formatBytes(
        afterGCMemory.usedJSHeapSize - beforeCleanupMemory.usedJSHeapSize
      )}`
    );
    addLogEntry("メモリリークを停止しました。");
  }, 1000);

  // ボタンの状態を更新
  document.getElementById("start-leak").disabled = false;
  document.getElementById("stop-leak").disabled = true;
}

// クロージャによるメモリリークのデモ
let closureLeakStopFunction = null;

function startClosureLeak() {
  if (closureLeakStopFunction) {
    addLogEntry("クロージャによるメモリリークはすでに実行中です。");
    return;
  }

  clearLog();
  addLogEntry("クロージャによるメモリリークのデモを開始します...");

  // 初期メモリ使用量を記録
  const initialMemory = displayMemoryUsage();
  if (!initialMemory) return;

  addLogEntry(`初期メモリ使用量: ${formatBytes(initialMemory.usedJSHeapSize)}`);

  // クロージャによるメモリリークを作成する関数
  function createClosureLeak() {
    // 大きな配列を作成
    let largeData = new Array(1000000).fill("closure-leak");

    // 定期的にlargeDataの長さをログに出力するタイマーを設定
    let intervalId = setInterval(function () {
      // この関数はlargeDataへの参照を保持し続ける
      const currentMemory = displayMemoryUsage();
      addLogEntry(
        `クロージャリーク: 配列サイズ = ${
          largeData.length
        }, メモリ使用量 = ${formatBytes(currentMemory.usedJSHeapSize)}`
      );
    }, 1000);

    // リークを止める関数を返す
    return function stopLeak() {
      clearInterval(intervalId);
      // largeDataへの参照を解放
      largeData = null;

      const afterCleanupMemory = displayMemoryUsage();
      addLogEntry(
        `クロージャリーク停止後のメモリ使用量: ${formatBytes(
          afterCleanupMemory.usedJSHeapSize
        )}`
      );

      // ガベージコレクションを促す
      setTimeout(function () {
        const afterGCMemory = displayMemoryUsage();
        addLogEntry(
          `ガベージコレクション後のメモリ使用量: ${formatBytes(
            afterGCMemory.usedJSHeapSize
          )}`
        );
        addLogEntry("クロージャによるメモリリークを停止しました。");
      }, 1000);
    };
  }

  // クロージャリークを開始し、停止関数を保存
  closureLeakStopFunction = createClosureLeak();

  // ボタンの状態を更新
  document.getElementById("start-closure-leak").disabled = true;
  document.getElementById("stop-closure-leak").disabled = false;
}

function stopClosureLeak() {
  if (!closureLeakStopFunction) {
    addLogEntry("クロージャによるメモリリークは実行されていません。");
    return;
  }

  // 停止関数を呼び出す
  closureLeakStopFunction();
  closureLeakStopFunction = null;

  // ボタンの状態を更新
  document.getElementById("start-closure-leak").disabled = false;
  document.getElementById("stop-closure-leak").disabled = true;
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
// 注意: これは実際にGCを強制するものではなく、GCが実行される可能性を高めるだけ
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
    .getElementById("reference-counting-demo")
    .addEventListener("click", referenceCountingDemo);
  document
    .getElementById("cyclic-reference-demo")
    .addEventListener("click", cyclicReferenceDemo);
  document
    .getElementById("start-leak")
    .addEventListener("click", startMemoryLeak);
  document
    .getElementById("stop-leak")
    .addEventListener("click", stopMemoryLeak);
  document
    .getElementById("start-closure-leak")
    .addEventListener("click", startClosureLeak);
  document
    .getElementById("stop-closure-leak")
    .addEventListener("click", stopClosureLeak);
  document
    .getElementById("force-gc")
    .addEventListener("click", forceGarbageCollection);
  document
    .getElementById("start-monitoring")
    .addEventListener("click", startMemoryMonitoring);
  document
    .getElementById("stop-monitoring")
    .addEventListener("click", stopMemoryMonitoring);

  // 定期的にメモリ使用状況を更新
  setInterval(displayMemoryUsage, 1000);
});
