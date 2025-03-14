/**
 * メモリ使用状況のグラフ表示機能
 * Chart.jsを使用してメモリ使用状況をリアルタイムでグラフ表示します
 */

// グラフの設定
const chartConfig = {
  type: "line",
  data: {
    labels: [],
    datasets: [
      {
        label: "使用中のJSヒープサイズ",
        backgroundColor: "rgba(52, 152, 219, 0.2)",
        borderColor: "rgba(52, 152, 219, 1)",
        borderWidth: 2,
        pointRadius: 1,
        pointHoverRadius: 5,
        data: [],
        fill: true,
      },
      {
        label: "総JSヒープサイズ",
        backgroundColor: "rgba(46, 204, 113, 0.2)",
        borderColor: "rgba(46, 204, 113, 1)",
        borderWidth: 2,
        pointRadius: 1,
        pointHoverRadius: 5,
        data: [],
        fill: true,
      },
    ],
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 500,
    },
    scales: {
      x: {
        display: true,
        title: {
          display: true,
          text: "時間",
        },
      },
      y: {
        display: true,
        title: {
          display: true,
          text: "メモリ使用量 (MB)",
        },
        ticks: {
          callback: function (value) {
            return (value / (1024 * 1024)).toFixed(2) + " MB";
          },
        },
      },
    },
    plugins: {
      tooltip: {
        callbacks: {
          label: function (context) {
            const label = context.dataset.label || "";
            const value = context.parsed.y;
            return label + ": " + formatBytes(value);
          },
        },
      },
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "メモリ使用状況の推移",
      },
    },
    interaction: {
      intersect: false,
      mode: "index",
    },
  },
};

// グラフを初期化する関数
function initMemoryChart() {
  const chartCanvas = document.getElementById("memoryChart");
  if (!chartCanvas) return null;

  // Chart.jsが読み込まれているか確認
  if (typeof Chart === "undefined") {
    console.error("Chart.jsが読み込まれていません");
    return null;
  }

  // 既存のチャートを破棄
  if (chart) {
    chart.destroy();
  }

  // 新しいチャートを作成
  chart = new Chart(chartCanvas, chartConfig);
  return chart;
}

// グラフを更新する関数
function updateMemoryChart() {
  if (!chart || memoryHistory.length === 0) return;

  // データを更新
  const labels = memoryHistory.map((entry) => {
    const time = entry.timestamp;
    return time.toLocaleTimeString();
  });

  const usedData = memoryHistory.map((entry) => entry.usedJSHeapSize);
  const totalData = memoryHistory.map((entry) => entry.totalJSHeapSize);

  chart.data.labels = labels;
  chart.data.datasets[0].data = usedData;
  chart.data.datasets[1].data = totalData;

  // グラフを更新
  chart.update();
}

// メモリ使用状況の統計情報を計算する関数
function calculateMemoryStats() {
  if (memoryHistory.length === 0) return null;

  const usedHeapSizes = memoryHistory.map((entry) => entry.usedJSHeapSize);

  // 最小値、最大値、平均値を計算
  const min = Math.min(...usedHeapSizes);
  const max = Math.max(...usedHeapSizes);
  const avg =
    usedHeapSizes.reduce((sum, val) => sum + val, 0) / usedHeapSizes.length;

  // 直近の変化率を計算（最新と1つ前の差）
  let changeRate = 0;
  if (memoryHistory.length >= 2) {
    const latest = usedHeapSizes[usedHeapSizes.length - 1];
    const previous = usedHeapSizes[usedHeapSizes.length - 2];
    changeRate = ((latest - previous) / previous) * 100;
  }

  return {
    min,
    max,
    avg,
    changeRate,
    current: usedHeapSizes[usedHeapSizes.length - 1],
    samples: memoryHistory.length,
  };
}

// 統計情報を表示する関数
function displayMemoryStats() {
  const stats = calculateMemoryStats();
  if (!stats) return;

  // 統計情報を表示
  updateElementText("memoryMin", formatBytes(stats.min));
  updateElementText("memoryMax", formatBytes(stats.max));
  updateElementText("memoryAvg", formatBytes(stats.avg));

  // 変化率を表示
  const changeRateElement = document.getElementById("memoryChangeRate");
  if (changeRateElement) {
    const formattedRate = stats.changeRate.toFixed(2) + "%";
    changeRateElement.textContent = formattedRate;

    // 変化率に応じて色を変更
    if (stats.changeRate > 10) {
      changeRateElement.className = "memory-value warning";
    } else if (stats.changeRate < -10) {
      changeRateElement.className = "memory-value success";
    } else {
      changeRateElement.className = "memory-value";
    }
  }

  // サンプル数を表示
  updateElementText("memorySamples", stats.samples.toString());
}

// メモリ使用状況の履歴をクリアする関数
function clearMemoryHistory() {
  // 配列を空にする（再代入ではなく）
  memoryHistory.length = 0;

  // グラフを更新
  if (chart) {
    chart.data.labels = [];
    chart.data.datasets.forEach((dataset) => {
      dataset.data = [];
    });
    chart.update();
  }

  addLogEntry("メモリ履歴をクリアしました", "warning");
}

// メモリ使用状況の履歴をエクスポートする関数
function exportMemoryHistory() {
  if (memoryHistory.length === 0) {
    addLogEntry("エクスポートするデータがありません", "error");
    return;
  }

  // JSONデータを作成
  const exportData = {
    browser: browserInfo,
    timestamp: new Date().toISOString(),
    history: memoryHistory,
  };

  // JSONデータをBlobに変換
  const jsonData = JSON.stringify(exportData, null, 2);
  const blob = new Blob([jsonData], { type: "application/json" });

  // ダウンロードリンクを作成
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `memory-history-${new Date()
    .toISOString()
    .replace(/:/g, "-")}.json`;
  document.body.appendChild(a);
  a.click();

  // クリーンアップ
  setTimeout(() => {
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }, 0);

  addLogEntry("メモリ履歴をエクスポートしました", "success");
}
