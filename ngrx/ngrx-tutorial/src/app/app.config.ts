import { ApplicationConfig, provideZoneChangeDetection, isDevMode } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { provideStoreDevtools } from '@ngrx/store-devtools';
import { provideRouterStore } from '@ngrx/router-store';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { reducers } from './store/reducers';
import { TodoEffects } from './store/effects/todo.effects';

/**
 * App Config - アプリケーション設定
 * 
 * このファイルは、Angular 16以降の新しいスタンドアロンコンポーネントアプローチで
 * アプリケーションの依存関係を設定します。
 * 
 * NgRxチュートリアルにおける役割:
 * - NgRxストアとエフェクトの設定
 * - 開発ツールの統合
 * - アプリケーション全体の依存関係の提供
 */

export const appConfig: ApplicationConfig = {
  providers: [
    // Angularのゾーン変更検出を設定（パフォーマンス最適化）
    provideZoneChangeDetection({ eventCoalescing: true }), 
    
    // ルーティングを設定
    provideRouter(routes),
    
    // HTTPクライアントを提供（APIリクエスト用）
    provideHttpClient(),
    
    /**
     * NgRx Storeを設定
     * 
     * NgRxチュートリアルでの意義:
     * - アプリケーション全体の状態管理
     * - リデューサーとメタリデューサーの登録
     */
    provideStore(reducers),
    
    /**
     * NgRx Effectsを設定
     * 
     * NgRxチュートリアルでの意義:
     * - 副作用（APIリクエストなど）の処理
     * - TodoEffectsクラスの登録
     */
    provideEffects([TodoEffects]),
    
    /**
     * NgRx DevToolsを設定
     * 
     * NgRxチュートリアルでの意義:
     * - 開発時のデバッグ支援
     * - 状態変更の履歴表示
     * - タイムトラベルデバッグ
     */
    provideStoreDevtools({
      maxAge: 25,              // 保存するアクションの最大数
      logOnly: !isDevMode(),   // 本番環境ではログのみ
      autoPause: true,         // フォーカスが外れたときに記録を一時停止
      trace: false,            // スタックトレースを無効化
      traceLimit: 75,          // スタックトレースの制限
    }),
    
    /**
     * NgRx Router Storeを設定
     * 
     * NgRxチュートリアルでの意義:
     * - ルーティング状態のStore内での同期
     * - ルーティングとStoreの統合
     */
    provideRouterStore(),
  ]
};
