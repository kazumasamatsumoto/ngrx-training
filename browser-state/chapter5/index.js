/**
 * Chapter 5: 構造共有（Structural Sharing）
 *
 * このファイルでは、イミュータブルな状態更新における「構造共有」の概念を示しています。
 * 構造共有とは、状態の一部だけを更新する際に、変更されない部分の参照を再利用することです。
 * これにより、メモリ効率とパフォーマンスが向上します。
 *
 * ReduxやNgRxでは、この原則を活用して効率的な状態更新を実現しています。
 *
 * なぜ構造共有が重要なのか？
 *
 * 【パフォーマンスとメモリ効率のバランス】
 * イミュータビリティは多くの利点がありますが、純粋に実装すると「状態を更新するたびに
 * 完全に新しいオブジェクトツリーを作成する」ことになり、メモリ使用量とパフォーマンスに
 * 問題が生じる可能性があります。
 *
 * 特に大規模なアプリケーションでは、状態オブジェクトが非常に大きく、深くネストされた
 * 構造を持つことがあります。そのような状態を更新するたびに完全にコピーしていたら、
 * メモリ消費が膨大になり、ガベージコレクションの負荷も増大します。
 *
 * 構造共有は、この問題を解決するための賢い方法です。変更された部分のパスに沿った
 * オブジェクトだけを新しく作成し、変更されていない部分は元のオブジェクトの参照を
 * そのまま再利用します。これにより：
 *
 * 1. メモリ使用量を大幅に削減できる
 * 2. オブジェクト生成のコストを最小限に抑えられる
 * 3. 変更検知を効率的に行える（変更されたパスのみをチェックすればよい）
 * 4. 参照の同一性を保持できるため、メモ化（memoization）が効果的に機能する
 *
 * 実際のReduxやNgRxのアプリケーションでは、この構造共有の原則に基づいて
 * 状態更新が行われており、イミュータビリティの利点を維持しながらも
 * パフォーマンスを最適化しています。
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
