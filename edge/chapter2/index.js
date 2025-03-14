// JavaScriptのメモリモデルを実験するためのコード

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

// プリミティブ型とオブジェクト型のデモ
function memoryModelDemo() {
  clearLog();

  // プリミティブ型
  let num1 = 5;
  let num2 = num1;
  num1 = 10;

  addLogEntry("プリミティブ型:");
  addLogEntry(`num1: ${num1}, num2: ${num2}`);

  // オブジェクト型
  let obj1 = { value: 5 };
  let obj2 = obj1;
  obj1.value = 10;

  addLogEntry("オブジェクト型:");
  addLogEntry(`obj1.value: ${obj1.value}, obj2.value: ${obj2.value}`);

  // 新しいオブジェクトの割り当て
  obj1 = { value: 20 };

  addLogEntry("新しいオブジェクトの割り当て後:");
  addLogEntry(`obj1.value: ${obj1.value}, obj2.value: ${obj2.value}`);

  // メモリ使用状況を表示
  displayMemoryUsage();
}

// 関数引数のデモ
function functionArgumentsDemo() {
  clearLog();

  // プリミティブ型の引数
  function updateValue(x) {
    x = x + 1;
    addLogEntry(`関数内のx: ${x}`);
    return x;
  }

  let num = 5;
  addLogEntry(`元のnum: ${num}`);
  updateValue(num);
  addLogEntry(`関数呼び出し後のnum: ${num}`);

  // オブジェクト型の引数（プロパティ変更）
  function updateObject(obj) {
    obj.count = obj.count + 1;
    addLogEntry(`関数内のobj.count: ${obj.count}`);
    return obj;
  }

  let myObj = { count: 5 };
  addLogEntry(`元のmyObj.count: ${myObj.count}`);
  updateObject(myObj);
  addLogEntry(`関数呼び出し後のmyObj.count: ${myObj.count}`);

  // オブジェクト型の引数（新しいオブジェクト割り当て）
  function replaceObject(obj) {
    obj = { count: 100 };
    addLogEntry(`関数内の新しいobj.count: ${obj.count}`);
    return obj;
  }

  myObj = { count: 5 };
  addLogEntry(`元のmyObj.count: ${myObj.count}`);
  replaceObject(myObj);
  addLogEntry(`関数呼び出し後のmyObj.count: ${myObj.count}`);

  // メモリ使用状況を表示
  displayMemoryUsage();
}

// 配列のメモリ使用量デモ
function arrayMemoryDemo() {
  clearLog();

  // 初期メモリ使用量を記録
  const initialMemory = displayMemoryUsage();
  if (!initialMemory) return;

  addLogEntry("配列のメモリ使用量デモを開始します...");
  addLogEntry(`初期メモリ使用量: ${formatBytes(initialMemory.usedJSHeapSize)}`);

  // 小さな配列を作成
  const smallArray = new Array(1000).fill(0);
  const afterSmallArray = displayMemoryUsage();

  addLogEntry(
    `1,000要素の配列作成後: ${formatBytes(afterSmallArray.usedJSHeapSize)}`
  );
  addLogEntry(
    `差分: ${formatBytes(
      afterSmallArray.usedJSHeapSize - initialMemory.usedJSHeapSize
    )}`
  );

  // 中サイズの配列を作成
  const mediumArray = new Array(100000).fill(0);
  const afterMediumArray = displayMemoryUsage();

  addLogEntry(
    `100,000要素の配列作成後: ${formatBytes(afterMediumArray.usedJSHeapSize)}`
  );
  addLogEntry(
    `差分: ${formatBytes(
      afterMediumArray.usedJSHeapSize - afterSmallArray.usedJSHeapSize
    )}`
  );

  // 大きな配列を作成
  const largeArray = new Array(1000000).fill(0);
  const afterLargeArray = displayMemoryUsage();

  addLogEntry(
    `1,000,000要素の配列作成後: ${formatBytes(afterLargeArray.usedJSHeapSize)}`
  );
  addLogEntry(
    `差分: ${formatBytes(
      afterLargeArray.usedJSHeapSize - afterMediumArray.usedJSHeapSize
    )}`
  );

  // 配列をnullに設定してガベージコレクションを促す
  addLogEntry("配列をnullに設定してガベージコレクションを促します...");

  // 変数をnullに設定
  window.smallArray = smallArray;
  window.mediumArray = mediumArray;
  window.largeArray = largeArray;
}

// オブジェクトのメモリ使用量デモ
function objectMemoryDemo() {
  clearLog();

  // 初期メモリ使用量を記録
  const initialMemory = displayMemoryUsage();
  if (!initialMemory) return;

  addLogEntry("オブジェクトのメモリ使用量デモを開始します...");
  addLogEntry(`初期メモリ使用量: ${formatBytes(initialMemory.usedJSHeapSize)}`);

  // 小さなオブジェクトを作成
  const smallObject = {};
  for (let i = 0; i < 100; i++) {
    smallObject[`prop${i}`] = i;
  }
  const afterSmallObject = displayMemoryUsage();

  addLogEntry(
    `100プロパティのオブジェクト作成後: ${formatBytes(
      afterSmallObject.usedJSHeapSize
    )}`
  );
  addLogEntry(
    `差分: ${formatBytes(
      afterSmallObject.usedJSHeapSize - initialMemory.usedJSHeapSize
    )}`
  );

  // 中サイズのオブジェクトを作成
  const mediumObject = {};
  for (let i = 0; i < 1000; i++) {
    mediumObject[`prop${i}`] = i;
  }
  const afterMediumObject = displayMemoryUsage();

  addLogEntry(
    `1,000プロパティのオブジェクト作成後: ${formatBytes(
      afterMediumObject.usedJSHeapSize
    )}`
  );
  addLogEntry(
    `差分: ${formatBytes(
      afterMediumObject.usedJSHeapSize - afterSmallObject.usedJSHeapSize
    )}`
  );

  // 大きなオブジェクトを作成
  const largeObject = {};
  for (let i = 0; i < 10000; i++) {
    largeObject[`prop${i}`] = i;
  }
  const afterLargeObject = displayMemoryUsage();

  addLogEntry(
    `10,000プロパティのオブジェクト作成後: ${formatBytes(
      afterLargeObject.usedJSHeapSize
    )}`
  );
  addLogEntry(
    `差分: ${formatBytes(
      afterLargeObject.usedJSHeapSize - afterMediumObject.usedJSHeapSize
    )}`
  );

  // オブジェクトをグローバル変数に保存してガベージコレクションを防ぐ
  window.smallObject = smallObject;
  window.mediumObject = mediumObject;
  window.largeObject = largeObject;
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

// ページ読み込み時の初期化
document.addEventListener("DOMContentLoaded", function () {
  // 初期メモリ使用状況を表示
  displayMemoryUsage();

  // ボタンにイベントリスナーを設定
  document
    .getElementById("primitive-reference-demo")
    .addEventListener("click", memoryModelDemo);
  document
    .getElementById("function-arguments-demo")
    .addEventListener("click", functionArgumentsDemo);
  document
    .getElementById("array-memory-demo")
    .addEventListener("click", arrayMemoryDemo);
  document
    .getElementById("object-memory-demo")
    .addEventListener("click", objectMemoryDemo);

  // 定期的にメモリ使用状況を更新
  setInterval(displayMemoryUsage, 1000);
});
