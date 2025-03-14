/**
 * Chapter 4: イミュータブルな状態更新
 *
 * このファイルでは、状態管理における重要な原則である「イミュータビリティ（不変性）」を示しています。
 * ReduxやNgRxでは、状態を直接変更せず、常に新しい状態オブジェクトを作成します。
 * これにより、参照による変更検知が可能になり、予測可能な状態管理が実現します。
 */

// イミュータブルな状態更新の例
// この関数は、元の状態を変更せず、新しい状態オブジェクトを返します
function updateCount(state, newCount) {
  // スプレッド構文（...）を使用して、元のオブジェクトのプロパティをコピーし、
  // count プロパティだけを新しい値で上書きした新しいオブジェクトを作成
  return { ...state, count: newCount };
}

// 初期状態
const state1 = { count: 0, name: "App" };
// 状態を更新（実際には新しい状態オブジェクトを作成）
const state2 = updateCount(state1, 1);

// 結果の確認
console.log(state1.count); // 0（元の状態は変更されていない）
console.log(state2.count); // 1（新しい状態）
console.log(state1 === state2); // false（異なる参照）

/**
 * 注意:
 * 1. イミュータビリティは、状態の変更履歴を追跡しやすくします（デバッグが容易になる）
 * 2. 参照の変更により、変更検知が高速になります
 * 3. タイムトラベルデバッギングなどの高度な機能が可能になります
 * 4. ネストされたオブジェクトを更新する場合は、すべてのレベルで新しいオブジェクトを作成する必要があります
 */
