/**
 * チュートリアル機能
 * 初めてのユーザーに操作方法を説明するためのチュートリアル
 */

// チュートリアルのステップ定義
const tutorialStepsCommon = [
  {
    title: "Edgeメモリ管理ツールへようこそ",
    content:
      "このツールを使って、Edgeブラウザのメモリ使用状況を監視し、パフォーマンスの問題を特定できます。このチュートリアルでは基本的な使い方を説明します。",
    highlightElement: null,
  },
  {
    title: "ブラウザ情報",
    content:
      "まず、あなたが使用しているブラウザの情報が表示されています。Chromiumベースのブラウザ（EdgeやChrome）でのみメモリAPIが利用可能です。",
    highlightElement: "browserInfo",
  },
  {
    title: "メモリ監視の開始",
    content:
      "「メモリ監視開始」ボタンをクリックすると、リアルタイムでメモリ使用状況の監視が始まります。",
    highlightElement: "startMonitoring",
  },
  {
    title: "メモリ使用状況",
    content:
      "メモリバーとメモリ情報パネルには、現在のメモリ使用状況が表示されます。使用率が高くなると色が変わります。",
    highlightElement: "memoryBarDisplay",
  },
  {
    title: "メモリグラフ",
    content:
      "グラフには時間経過に伴うメモリ使用状況の変化が表示されます。傾向を把握するのに役立ちます。",
    highlightElement: "memoryChart",
  },
  {
    title: "テスト機能",
    content:
      "「10MBオブジェクト作成」ボタンをクリックすると、メモリ使用量の変化をテストできます。",
    highlightElement: "createObject",
  },
  {
    title: "ログ",
    content: "ログパネルには、メモリ監視の状態や重要なイベントが記録されます。",
    highlightElement: "memoryLog",
  },
  {
    title: "チュートリアル完了",
    content:
      "これで基本的な使い方の説明は終わりです。さらに詳しい情報は各チャプターの説明をご覧ください。",
    highlightElement: null,
  },
];

// チャプター1のチュートリアルステップ
const tutorialStepsChapter1 = [
  ...tutorialStepsCommon,
  {
    title: "Chapter 1: ブラウザのメモリ管理の基本",
    content:
      "このチャプターでは、ブラウザのメモリ管理の基本概念と、JavaScriptのメモリ使用状況を監視する方法を学びます。",
    highlightElement: null,
  },
];

// チャプター2のチュートリアルステップ
const tutorialStepsChapter2 = [
  ...tutorialStepsCommon,
  {
    title: "Chapter 2: メモリリークの検出",
    content:
      "このチャプターでは、メモリリークの検出方法と、一般的なメモリリークのパターンについて学びます。",
    highlightElement: null,
  },
  {
    title: "メモリリークのテスト",
    content:
      "「メモリリーク生成」ボタンをクリックすると、典型的なメモリリークのパターンをシミュレートできます。",
    highlightElement: "createLeak",
  },
];

// チャプター3のチュートリアルステップ
const tutorialStepsChapter3 = [
  ...tutorialStepsCommon,
  {
    title: "Chapter 3: パフォーマンス分析",
    content:
      "このチャプターでは、パフォーマンスの問題を特定し、分析するための高度なツールと手法を学びます。",
    highlightElement: null,
  },
  {
    title: "パフォーマンステスト",
    content:
      "「パフォーマンステスト実行」ボタンをクリックすると、様々なパフォーマンスシナリオをテストできます。",
    highlightElement: "runPerformanceTest",
  },
  {
    title: "統計情報",
    content:
      "統計情報パネルには、メモリ使用状況の統計データが表示されます。異常値を特定するのに役立ちます。",
    highlightElement: "memoryStats",
  },
];

// チャプター4のチュートリアルステップ
const tutorialStepsChapter4 = [
  ...tutorialStepsCommon,
  {
    title: "Chapter 4: 高度なメモリ最適化",
    content:
      "このチャプターでは、Webアプリケーションのメモリ使用量を最適化するための高度な手法を学びます。",
    highlightElement: null,
  },
  {
    title: "最適化テスト",
    content:
      "「最適化前/後の比較」ボタンをクリックすると、最適化の効果を比較できます。",
    highlightElement: "compareOptimization",
  },
  {
    title: "メモリプロファイル",
    content:
      "「メモリプロファイル取得」ボタンをクリックすると、詳細なメモリプロファイルを取得できます。",
    highlightElement: "captureMemoryProfile",
  },
];

// チュートリアルを表示するかどうかを決定する関数
function shouldShowTutorial() {
  // ローカルストレージからチュートリアル表示済みフラグを取得
  const tutorialShown = localStorage.getItem("tutorialShown");

  // チュートリアルが表示済みでなければ表示する
  return tutorialShown !== "true";
}

// チュートリアルを表示済みとしてマークする関数
function markTutorialAsShown() {
  localStorage.setItem("tutorialShown", "true");
}

// チュートリアルをリセットする関数
function resetTutorial() {
  localStorage.removeItem("tutorialShown");
  addLogEntry(
    "チュートリアルをリセットしました。次回ページ読み込み時に表示されます。",
    "info"
  );
}

// 現在のページに応じたチュートリアルステップを取得する関数
function getTutorialStepsForCurrentPage() {
  const path = window.location.pathname;

  if (path.includes("chapter1")) {
    return tutorialStepsChapter1;
  } else if (path.includes("chapter2")) {
    return tutorialStepsChapter2;
  } else if (path.includes("chapter3")) {
    return tutorialStepsChapter3;
  } else if (path.includes("chapter4")) {
    return tutorialStepsChapter4;
  } else {
    return tutorialStepsCommon;
  }
}

// チュートリアルを初期化する関数
function setupTutorial() {
  // チュートリアルを表示すべきか確認
  if (!shouldShowTutorial()) return;

  // 現在のページに応じたチュートリアルステップを取得
  const steps = getTutorialStepsForCurrentPage();

  // チュートリアルを初期化
  initTutorial(steps);

  // チュートリアルコンテナを表示
  const tutorialContainer = document.getElementById("tutorialContainer");
  if (tutorialContainer) {
    tutorialContainer.classList.remove("hidden");
  }

  // チュートリアルを表示済みとしてマーク
  markTutorialAsShown();
}

// ページ読み込み時にチュートリアルをセットアップ
document.addEventListener("DOMContentLoaded", () => {
  setupTutorial();

  // チュートリアルリセットボタンのイベントリスナーを設定
  const resetTutorialButton = document.getElementById("resetTutorial");
  if (resetTutorialButton) {
    resetTutorialButton.addEventListener("click", resetTutorial);
  }
});
