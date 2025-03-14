/**
 * ブラウザメモリ管理ユーティリティ
 * 
 * このファイルはブラウザのメモリ使用状況を監視・表示するための
 * ユーティリティ関数を提供します。
 */

class MemoryUtils {
  constructor() {
    // シミュレーション用の初期メモリ情報
    this.memoryInfo = {
      jsHeapSizeLimit: 4 * 1024 * 1024 * 1024, // 4GB
      totalJSHeapSize: 100 * 1024 * 1024,      // 初期値100MB
      usedJSHeapSize: 10 * 1024 * 1024         // 初期値10MB
    };
    
    this.memoryHistory = [];
    this.maxHistoryLength = 50;
    this.updateInterval = null;
    
    // 前回の値を保存するためのオブジェクト
    this._prevValues = {};
    
    // シミュレーション用のメモリ使用量（MB単位）
    this._simulatedMemoryUsage = 10; // 初期値10MB
    
    // 各操作のメモリ使用履歴
    this._memoryOperations = [];
  }

  /**
   * 現在のメモリ使用状況を取得（シミュレーション）
   */
  getMemoryInfo() {
    // シミュレーションされたメモリ使用量（バイト単位）
    const usedJSHeapSize = this._simulatedMemoryUsage * 1024 * 1024;
    
    // 合計ヒープサイズは使用量の1.2倍（最大でヒープサイズ上限まで）
    const totalJSHeapSize = Math.min(usedJSHeapSize * 1.2, this.memoryInfo.jsHeapSizeLimit);
    
    // メモリ情報を更新
    this.memoryInfo = {
      jsHeapSizeLimit: 4 * 1024 * 1024 * 1024, // 4GB
      totalJSHeapSize: totalJSHeapSize,
      usedJSHeapSize: usedJSHeapSize
    };
    
    return this.memoryInfo;
  }

  /**
   * メモリ使用量を人間が読みやすい形式に変換
   */
  formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
  }

  /**
   * メモリ使用状況を表示要素に更新
   */
  updateMemoryDisplay(elementId) {
    const memInfo = this.getMemoryInfo();
    const element = document.getElementById(elementId);
    
    if (element) {
      // 前回の値を保存して変化を表示
      const prevValue = this._prevValues[elementId] || 0;
      this._prevValues[elementId] = memInfo.usedJSHeapSize;
      
      const diff = memInfo.usedJSHeapSize - prevValue;
      let diffText = '';
      
      if (Math.abs(diff) > 1024 * 1024) { // 1MB以上の変化があった場合のみ表示
        if (diff > 0) {
          diffText = ` (+${this.formatBytes(diff)})`;
        } else if (diff < 0) {
          diffText = ` (-${this.formatBytes(Math.abs(diff))})`;
        }
      }
      
      element.textContent = `メモリ使用量: ${this.formatBytes(memInfo.usedJSHeapSize)} / ${this.formatBytes(memInfo.jsHeapSizeLimit)}${diffText}`;
    }
    
    return memInfo;
  }

  /**
   * メモリ使用状況の履歴を記録
   */
  recordMemoryUsage() {
    const memInfo = this.getMemoryInfo();
    const timestamp = new Date().getTime();
    
    this.memoryHistory.push({
      timestamp,
      usedJSHeapSize: memInfo.usedJSHeapSize,
      totalJSHeapSize: memInfo.totalJSHeapSize
    });
    
    // 履歴の長さを制限
    if (this.memoryHistory.length > this.maxHistoryLength) {
      this.memoryHistory.shift();
    }
    
    return this.memoryHistory;
  }

  /**
   * メモリ使用状況のグラフ表示を更新
   */
  updateMemoryChart() {
    const memInfo = this.getMemoryInfo();
    const memoryBar = document.getElementById('memoryBar');
    const memoryDetails = document.getElementById('memoryDetails');
    
    if (memoryBar && memInfo.jsHeapSizeLimit > 0) {
      // メモリ使用率をパーセンテージで表示
      const usagePercent = (memInfo.usedJSHeapSize / memInfo.jsHeapSizeLimit) * 100;
      memoryBar.style.width = `${Math.min(usagePercent, 100)}%`;
      
      // 使用率に応じて色を変更
      if (usagePercent > 80) {
        memoryBar.style.backgroundColor = '#e74c3c'; // 赤 (危険)
      } else if (usagePercent > 60) {
        memoryBar.style.backgroundColor = '#f39c12'; // オレンジ (警告)
      } else {
        memoryBar.style.backgroundColor = '#3498db'; // 青 (正常)
      }
    }
    
    if (memoryDetails) {
      // 前回の値との差分を計算
      const prevTotal = this._prevValues['total'] || 0;
      this._prevValues['total'] = memInfo.usedJSHeapSize;
      
      const diff = memInfo.usedJSHeapSize - prevTotal;
      let diffText = '';
      
      if (Math.abs(diff) > 1024 * 1024) { // 1MB以上の変化があった場合のみ表示
        if (diff > 0) {
          diffText = `\n前回から変化: +${this.formatBytes(diff)} 増加`;
        } else if (diff < 0) {
          diffText = `\n前回から変化: -${this.formatBytes(Math.abs(diff))} 減少`;
        }
      }
      
      // 操作履歴を表示
      let operationsText = '';
      if (this._memoryOperations.length > 0) {
        operationsText = '\n\n最近の操作:';
        const recentOps = this._memoryOperations.slice(-3); // 最新の3つの操作を表示
        recentOps.forEach(op => {
          operationsText += `\n- ${op}`;
        });
      }
      
      memoryDetails.textContent = `
使用中のJSヒープサイズ: ${this.formatBytes(memInfo.usedJSHeapSize)}
合計JSヒープサイズ: ${this.formatBytes(memInfo.totalJSHeapSize)}
JSヒープサイズ上限: ${this.formatBytes(memInfo.jsHeapSizeLimit)}
使用率: ${((memInfo.usedJSHeapSize / memInfo.jsHeapSizeLimit) * 100).toFixed(2)}%${diffText}${operationsText}
      `;
    }
  }

  /**
   * 定期的なメモリ監視を開始
   */
  startMemoryMonitoring(intervalMs = 1000) {
    // 既存の監視を停止
    this.stopMemoryMonitoring();
    
    // 新しい監視を開始
    this.updateInterval = setInterval(() => {
      // メモリリーク実験中は少しずつメモリ使用量を増加させる
      if (window.leakInterval) {
        this._simulatedMemoryUsage += 2; // 2MB増加
        this.addMemoryOperation('メモリリーク: +2MB');
      }
      
      this.recordMemoryUsage();
      this.updateMemoryChart();
    }, intervalMs);
  }

  /**
   * メモリ監視を停止
   */
  stopMemoryMonitoring() {
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
  }
  
  /**
   * 操作履歴に追加
   */
  addMemoryOperation(operation) {
    const timestamp = new Date().toLocaleTimeString();
    this._memoryOperations.push(`${timestamp} - ${operation}`);
    
    // 履歴の長さを制限
    if (this._memoryOperations.length > 10) {
      this._memoryOperations.shift();
    }
  }
  
  /**
   * シミュレーションでメモリを消費する
   * @param {number} mbSize 消費するメモリサイズ（MB単位）
   */
  allocateMemory(mbSize) {
    // シミュレーションされたメモリ使用量を増加
    this._simulatedMemoryUsage += mbSize;
    
    // 操作履歴に追加
    this.addMemoryOperation(`メモリ確保: +${mbSize}MB`);
    
    console.log(`${mbSize}MBのメモリを確保しました（シミュレーション）`);
    
    // メモリ使用量を更新
    this.updateMemoryDisplay('memoryUsage');
    this.updateMemoryDisplay('leakMemoryUsage');
    this.updateMemoryDisplay('gcMemoryUsage');
    this.updateMemoryChart();
    
    return mbSize;
  }
  
  /**
   * シミュレーションでメモリを解放する
   * @param {number} percent 解放する割合（0-100）
   */
  freeMemory(percent = 100) {
    const originalUsage = this._simulatedMemoryUsage;
    
    if (percent >= 100) {
      // 基本値（10MB）まで減少
      const releasedAmount = this._simulatedMemoryUsage - 10;
      this._simulatedMemoryUsage = 10;
      
      // 操作履歴に追加
      this.addMemoryOperation(`メモリ解放: -${releasedAmount}MB (全解放)`);
      
      console.log(`${releasedAmount}MBのメモリを解放しました（シミュレーション）`);
    } else {
      // 指定された割合のメモリを解放
      const releaseAmount = Math.floor((this._simulatedMemoryUsage - 10) * (percent / 100));
      this._simulatedMemoryUsage -= releaseAmount;
      
      // 操作履歴に追加
      this.addMemoryOperation(`メモリ解放: -${releaseAmount}MB (${percent}%)`);
      
      console.log(`${releaseAmount}MBのメモリを解放しました（シミュレーション）`);
    }
    
    // メモリ使用量を更新
    this.updateMemoryDisplay('memoryUsage');
    this.updateMemoryDisplay('leakMemoryUsage');
    this.updateMemoryDisplay('gcMemoryUsage');
    this.updateMemoryChart();
    
    return originalUsage - this._simulatedMemoryUsage;
  }
}

// グローバルインスタンスを作成
const memoryUtils = new MemoryUtils();
