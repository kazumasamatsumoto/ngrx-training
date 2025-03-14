/**
 * メモリ管理と状態管理のデモアプリケーション
 */

document.addEventListener('DOMContentLoaded', () => {
    // 1. ミュータブル操作のデモ
    setupMutableDemo();
    
    // 2. イミュータブル操作のデモ
    setupImmutableDemo();
    
    // 3. 状態管理ライブラリのデモ
    setupStoreDemo();
});

// ミュータブル操作のデモセットアップ
function setupMutableDemo() {
    // 初期状態
    let state = { count: 0 };
    let address = generateMemoryAddress();
    
    // 表示を初期化
    updateMemoryDisplay('mutable-memory', state, 'mutable-address', address);
    addLog('mutable-log', '初期状態を設定しました', false);
    
    // カウントアップボタン
    document.getElementById('mutable-increment').addEventListener('click', () => {
        // ミュータブル操作：直接オブジェクトを変更
        const oldState = { ...state }; // 変更前の状態をコピー
        const oldAddress = address;
        
        // 直接変更（ミュータブル）
        state.count++;
        
        // 表示を更新
        updateMemoryDisplay('mutable-memory', state, 'mutable-address', address);
        
        // ログを追加
        const isChanged = !isSameContent(oldState, state);
        const addressChanged = oldAddress !== address;
        
        addLog(
            'mutable-log', 
            `カウントアップ: ${oldState.count} → ${state.count}`, 
            isChanged
        );
        addLog(
            'mutable-log', 
            `メモリアドレス: ${addressChanged ? '変更あり' : '変更なし'} (${address})`, 
            addressChanged
        );
    });
    
    // プロパティ追加ボタン
    document.getElementById('mutable-add-property').addEventListener('click', () => {
        // ミュータブル操作：直接オブジェクトを変更
        const oldState = { ...state }; // 変更前の状態をコピー
        const oldAddress = address;
        
        // 新しいプロパティを追加（ミュータブル）
        const timestamp = new Date().getTime();
        state.lastUpdated = timestamp;
        
        // 表示を更新
        updateMemoryDisplay('mutable-memory', state, 'mutable-address', address);
        
        // ログを追加
        const isChanged = !isSameContent(oldState, state);
        const addressChanged = oldAddress !== address;
        
        addLog(
            'mutable-log', 
            `プロパティ追加: lastUpdated = ${timestamp}`, 
            isChanged
        );
        addLog(
            'mutable-log', 
            `メモリアドレス: ${addressChanged ? '変更あり' : '変更なし'} (${address})`, 
            addressChanged
        );
    });
    
    // リセットボタン
    document.getElementById('mutable-reset').addEventListener('click', () => {
        // 変更前の状態をコピー
        const oldState = { ...state };
        const oldAddress = address;
        
        // 状態をリセット（ミュータブル）
        state = { count: 0 };
        address = generateMemoryAddress(); // 新しいオブジェクトなので新しいアドレス
        
        // 表示を更新
        updateMemoryDisplay('mutable-memory', state, 'mutable-address', address);
        
        // ログを追加
        const isChanged = !isSameContent(oldState, state);
        const addressChanged = oldAddress !== address;
        
        addLog(
            'mutable-log', 
            `状態をリセットしました`, 
            isChanged
        );
        addLog(
            'mutable-log', 
            `メモリアドレス: ${addressChanged ? '変更あり' : '変更なし'} (${address})`, 
            addressChanged
        );
    });
}

// イミュータブル操作のデモセットアップ
function setupImmutableDemo() {
    // 初期状態
    let state = { count: 0 };
    let address = generateMemoryAddress();
    
    // 表示を初期化
    updateMemoryDisplay('immutable-memory', state, 'immutable-address', address);
    addLog('immutable-log', '初期状態を設定しました', false);
    
    // カウントアップボタン
    document.getElementById('immutable-increment').addEventListener('click', () => {
        // イミュータブル操作：新しいオブジェクトを作成
        const oldState = state;
        const oldAddress = address;
        
        // 新しいオブジェクトを作成（イミュータブル）
        state = { ...state, count: state.count + 1 };
        address = generateMemoryAddress(); // 新しいオブジェクトなので新しいアドレス
        
        // 表示を更新
        updateMemoryDisplay('immutable-memory', state, 'immutable-address', address);
        
        // ログを追加
        const isChanged = !isSameContent(oldState, state);
        const addressChanged = oldAddress !== address;
        
        addLog(
            'immutable-log', 
            `カウントアップ: ${oldState.count} → ${state.count}`, 
            isChanged
        );
        addLog(
            'immutable-log', 
            `メモリアドレス: ${addressChanged ? '変更あり' : '変更なし'} (${address})`, 
            addressChanged
        );
    });
    
    // プロパティ追加ボタン
    document.getElementById('immutable-add-property').addEventListener('click', () => {
        // イミュータブル操作：新しいオブジェクトを作成
        const oldState = state;
        const oldAddress = address;
        
        // 新しいプロパティを追加（イミュータブル）
        const timestamp = new Date().getTime();
        state = { ...state, lastUpdated: timestamp };
        address = generateMemoryAddress(); // 新しいオブジェクトなので新しいアドレス
        
        // 表示を更新
        updateMemoryDisplay('immutable-memory', state, 'immutable-address', address);
        
        // ログを追加
        const isChanged = !isSameContent(oldState, state);
        const addressChanged = oldAddress !== address;
        
        addLog(
            'immutable-log', 
            `プロパティ追加: lastUpdated = ${timestamp}`, 
            isChanged
        );
        addLog(
            'immutable-log', 
            `メモリアドレス: ${addressChanged ? '変更あり' : '変更なし'} (${address})`, 
            addressChanged
        );
    });
    
    // リセットボタン
    document.getElementById('immutable-reset').addEventListener('click', () => {
        // 変更前の状態を保存
        const oldState = state;
        const oldAddress = address;
        
        // 状態をリセット（イミュータブル）
        state = { count: 0 };
        address = generateMemoryAddress(); // 新しいオブジェクトなので新しいアドレス
        
        // 表示を更新
        updateMemoryDisplay('immutable-memory', state, 'immutable-address', address);
        
        // ログを追加
        const isChanged = !isSameContent(oldState, state);
        const addressChanged = oldAddress !== address;
        
        addLog(
            'immutable-log', 
            `状態をリセットしました`, 
            isChanged
        );
        addLog(
            'immutable-log', 
            `メモリアドレス: ${addressChanged ? '変更あり' : '変更なし'} (${address})`, 
            addressChanged
        );
    });
}

// 状態管理ライブラリのデモセットアップ
function setupStoreDemo() {
    // ストアを作成
    const store = createStore(reducer, { count: 0 });
    
    // 表示を初期化
    updateMemoryDisplay('store-memory', store.getState(), 'store-address', store.getMemoryAddress());
    addLog('store-log', '初期状態を設定しました', false);
    
    // サブスクライバーを設定
    store.subscribe((state) => {
        // UI更新リスナー
        updateSubscriberDisplay('subscriber1', state);
    });
    
    store.subscribe((state) => {
        // ログリスナー
        updateSubscriberDisplay('subscriber2', state);
        addLog('store-log', `状態が更新されました: ${JSON.stringify(state)}`, true);
    });
    
    // カウントアップボタン
    document.getElementById('store-increment').addEventListener('click', () => {
        // アクションをディスパッチ
        const result = store.dispatch({ type: ActionTypes.INCREMENT });
        
        // 表示を更新
        updateMemoryDisplay('store-memory', store.getState(), 'store-address', store.getMemoryAddress());
        
        // ログを追加
        addLog(
            'store-log', 
            `アクション "${result.action.type}" をディスパッチしました`, 
            result.isChanged
        );
        addLog(
            'store-log', 
            `メモリアドレス: ${result.addressChanged ? '変更あり' : '変更なし'} (${store.getMemoryAddress()})`, 
            result.addressChanged
        );
    });
    
    // プロパティ追加ボタン
    document.getElementById('store-add-property').addEventListener('click', () => {
        // アクションをディスパッチ
        const timestamp = new Date().getTime();
        const result = store.dispatch({ 
            type: ActionTypes.ADD_PROPERTY,
            payload: {
                key: 'lastUpdated',
                value: timestamp
            }
        });
        
        // 表示を更新
        updateMemoryDisplay('store-memory', store.getState(), 'store-address', store.getMemoryAddress());
        
        // ログを追加
        addLog(
            'store-log', 
            `アクション "${result.action.type}" をディスパッチしました`, 
            result.isChanged
        );
        addLog(
            'store-log', 
            `メモリアドレス: ${result.addressChanged ? '変更あり' : '変更なし'} (${store.getMemoryAddress()})`, 
            result.addressChanged
        );
    });
    
    // リセットボタン
    document.getElementById('store-reset').addEventListener('click', () => {
        // アクションをディスパッチ
        const result = store.dispatch({ type: ActionTypes.RESET });
        
        // 表示を更新
        updateMemoryDisplay('store-memory', store.getState(), 'store-address', store.getMemoryAddress());
        
        // ログを追加
        addLog(
            'store-log', 
            `アクション "${result.action.type}" をディスパッチしました`, 
            result.isChanged
        );
        addLog(
            'store-log', 
            `メモリアドレス: ${result.addressChanged ? '変更あり' : '変更なし'} (${store.getMemoryAddress()})`, 
            result.addressChanged
        );
    });
}
