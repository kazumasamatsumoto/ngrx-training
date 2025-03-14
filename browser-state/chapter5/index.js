/**
 * Chapter 5: 構造共有（Structural Sharing）
 *
 * このファイルでは、イミュータブルな状態更新における「構造共有」の概念を示しています。
 * 構造共有とは、状態の一部だけを更新する際に、変更されない部分の参照を再利用することです。
 * これにより、メモリ効率とパフォーマンスが向上します。
 *
 * ReduxやNgRxでは、この原則を活用して効率的な状態更新を実現しています。
 */

// 複数のプロパティを持つ複雑な状態オブジェクト
const state1 = {
  count: 0,
  user: { name: "Alice", age: 30 },
  settings: { theme: "dark", notifications: true },
};

// countだけを更新する場合、userとsettingsの参照は再利用される
const state2 = {
  ...state1, // state1のすべてのプロパティをコピー
  count: 1, // countプロパティだけを上書き
  // userとsettingsは同じ参照が使われる（コピーされるのは参照だけ）
};

// 参照の比較で確認
console.log(state1.user === state2.user); // true（同じ参照）- userオブジェクトは再利用されている
console.log(state1.settings === state2.settings); // true（同じ参照）- settingsオブジェクトも再利用されている

/**
 * 構造共有の利点:
 * 1. メモリ効率: 変更されない部分のオブジェクトを複製する必要がない
 * 2. パフォーマンス: 変更検知が高速（変更された部分だけを比較すればよい）
 * 3. 参照の同一性を利用したメモ化が可能（React.memoやNgRxのselectorなど）
 *
 * 注意:
 * ネストされたオブジェクトを更新する場合は、更新パスに沿ったオブジェクトだけを
 * 新しく作成し、それ以外は参照を再利用するのがベストプラクティスです。
 */
