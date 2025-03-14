/**
 * メモリ管理と状態管理のためのユーティリティ関数
 */

// メモリアドレスを模擬的に生成する関数
function generateMemoryAddress() {
    // 実際のメモリアドレスではなく、ランダムな16進数文字列を生成
    return '0x' + Math.floor(Math.random() * 0xFFFFFF).toString(16).padStart(6, '0').toUpperCase();
}

// オブジェクトの内容を文字列化する関数
function stringifyObject(obj, indent = 2) {
    return JSON.stringify(obj, null, indent);
}

// 2つのオブジェクトが同じ参照を持つかチェックする関数
function isSameReference(obj1, obj2) {
    return obj1 === obj2;
}

// 2つのオブジェクトが同じ内容を持つかチェックする関数
function isSameContent(obj1, obj2) {
    return JSON.stringify(obj1) === JSON.stringify(obj2);
}

// ログエントリを作成する関数
function createLogEntry(message, isChanged = false) {
    const timestamp = new Date().toLocaleTimeString();
    const entry = document.createElement('div');
    entry.className = `log-entry ${isChanged ? 'changed' : 'unchanged'}`;
    entry.textContent = `[${timestamp}] ${message}`;
    return entry;
}

// メモリ表示を更新する関数
function updateMemoryDisplay(elementId, obj, addressElementId, address) {
    const memoryElement = document.getElementById(elementId);
    const addressElement = document.getElementById(addressElementId);
    
    // 内容を更新
    memoryElement.textContent = stringifyObject(obj);
    
    // アドレスを更新
    if (address) {
        addressElement.textContent = address;
    }
    
    // ハイライト効果を追加
    memoryElement.classList.add('highlight');
    addressElement.classList.add('highlight');
    
    // ハイライト効果を削除（アニメーション後）
    setTimeout(() => {
        memoryElement.classList.remove('highlight');
        addressElement.classList.remove('highlight');
    }, 1000);
}

// ログを追加する関数
function addLog(logElementId, message, isChanged = false) {
    const logElement = document.getElementById(logElementId);
    const entry = createLogEntry(message, isChanged);
    logElement.appendChild(entry);
    logElement.scrollTop = logElement.scrollHeight; // 自動スクロール
}

// サブスクライバー表示を更新する関数
function updateSubscriberDisplay(elementId, state) {
    const element = document.getElementById(elementId);
    if (element) {
        const stateElement = element.querySelector('.subscriber-state');
        if (stateElement) {
            stateElement.textContent = stringifyObject(state, 0);
            
            // ハイライト効果を追加
            stateElement.classList.add('highlight');
            
            // ハイライト効果を削除（アニメーション後）
            setTimeout(() => {
                stateElement.classList.remove('highlight');
            }, 1000);
        }
    }
}
