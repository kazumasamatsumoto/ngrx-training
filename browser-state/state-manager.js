/**
 * シンプルな状態管理ライブラリの実装
 */

// 状態管理クラス
class StateManager {
    constructor(initialState = {}) {
        this._state = initialState;
        this._listeners = [];
        this._memoryAddress = generateMemoryAddress();
        this._history = [];
    }

    // 現在の状態を取得
    getState() {
        return this._state;
    }

    // メモリアドレスを取得
    getMemoryAddress() {
        return this._memoryAddress;
    }

    // 状態を更新（イミュータブル方式）
    setState(newState) {
        const oldState = this._state;
        const oldAddress = this._memoryAddress;
        
        // 新しい状態オブジェクトを作成（イミュータブル）
        this._state = { ...this._state, ...newState };
        
        // 状態が実際に変更された場合のみ、新しいメモリアドレスを生成
        if (!isSameContent(oldState, this._state)) {
            this._memoryAddress = generateMemoryAddress();
            
            // 履歴に追加
            this._history.push({
                oldState,
                newState: this._state,
                oldAddress,
                newAddress: this._memoryAddress,
                timestamp: new Date()
            });
            
            // リスナーに通知
            this._notifyListeners();
        }
        
        return {
            isChanged: !isSameContent(oldState, this._state),
            addressChanged: this._memoryAddress !== oldAddress
        };
    }

    // リスナーを登録
    subscribe(listener) {
        this._listeners.push(listener);
        
        // 登録解除関数を返す
        return () => {
            const index = this._listeners.indexOf(listener);
            if (index !== -1) {
                this._listeners.splice(index, 1);
            }
        };
    }

    // 全リスナーに通知
    _notifyListeners() {
        this._listeners.forEach(listener => {
            listener(this._state);
        });
    }

    // 状態をリセット
    resetState(initialState = {}) {
        const oldState = this._state;
        const oldAddress = this._memoryAddress;
        
        this._state = initialState;
        this._memoryAddress = generateMemoryAddress();
        
        // 履歴に追加
        this._history.push({
            oldState,
            newState: this._state,
            oldAddress,
            newAddress: this._memoryAddress,
            timestamp: new Date(),
            action: 'RESET'
        });
        
        // リスナーに通知
        this._notifyListeners();
        
        return {
            isChanged: true,
            addressChanged: true
        };
    }

    // 履歴を取得
    getHistory() {
        return this._history;
    }
}

// アクションタイプの定義
const ActionTypes = {
    INCREMENT: 'INCREMENT',
    ADD_PROPERTY: 'ADD_PROPERTY',
    RESET: 'RESET'
};

// リデューサー関数
function reducer(state, action) {
    switch (action.type) {
        case ActionTypes.INCREMENT:
            return {
                ...state,
                count: state.count + 1
            };
        case ActionTypes.ADD_PROPERTY:
            return {
                ...state,
                [action.payload.key]: action.payload.value
            };
        case ActionTypes.RESET:
            return { count: 0 };
        default:
            return state;
    }
}

// ストアの作成
function createStore(reducer, initialState = { count: 0 }) {
    const stateManager = new StateManager(initialState);
    
    // ディスパッチ関数
    function dispatch(action) {
        const newState = reducer(stateManager.getState(), action);
        const result = stateManager.setState(newState);
        return {
            ...result,
            action
        };
    }
    
    return {
        getState: stateManager.getState.bind(stateManager),
        dispatch,
        subscribe: stateManager.subscribe.bind(stateManager),
        getMemoryAddress: stateManager.getMemoryAddress.bind(stateManager),
        getHistory: stateManager.getHistory.bind(stateManager)
    };
}
