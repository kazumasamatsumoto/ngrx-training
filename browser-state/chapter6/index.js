/**
 * Chapter 6: 仮想DOM（Virtual DOM）の実装
 *
 * このファイルでは、ReactやAngularなどのフレームワークで使用される
 * 仮想DOM（Virtual DOM）の簡易的な実装を示しています。
 *
 * 仮想DOMは、実際のDOMの軽量な表現であり、状態の変更に基づいて
 * 効率的にUIを更新するために使用されます。
 *
 * 主な手順:
 * 1. 状態に基づいて仮想DOMツリーを生成
 * 2. 前回の仮想DOMと新しい仮想DOMを比較して差分を計算
 * 3. 計算された差分だけを実際のDOMに適用
 *
 * なぜ仮想DOMが重要なのか？
 *
 * 【パフォーマンスの最適化】
 * 実際のDOM操作は非常にコストが高い処理です。要素の追加、削除、属性の変更など
 * すべてのDOM操作はブラウザによるレイアウト計算やリペイントを引き起こし、
 * これらは計算コストが高く、アプリケーションのパフォーマンスに大きな影響を与えます。
 *
 * 仮想DOMは、この問題を解決するための効率的なアプローチです。JavaScriptオブジェクトの
 * 操作は実際のDOM操作よりもはるかに高速です。仮想DOMを使用することで：
 *
 * 1. 状態変更ごとに必要な最小限のDOM更新だけを行える
 * 2. 複数の変更をバッチ処理して、一度にDOMに適用できる
 * 3. 不要なレイアウト計算やリペイントを減らせる
 *
 * 【状態管理との連携】
 * ReduxやNgRxなどの状態管理ライブラリと仮想DOMの組み合わせは非常に強力です。
 * イミュータブルな状態更新と参照比較を活用することで、変更があった部分だけを
 * 効率的に特定し、必要最小限のDOM更新を行うことができます。
 *
 * これにより、大規模なアプリケーションでも高いパフォーマンスを維持しながら、
 * 複雑なUIを管理することが可能になります。状態の変更が予測可能で、UIの更新が
 * 効率的に行われるため、ユーザー体験も向上します。
 */

// 仮想DOMノードを表す簡易的なクラス
class VNode {
  constructor(type, props, children) {
    this.type = type; // HTML要素の種類（div, span, buttonなど）
    this.props = props || {}; // 要素の属性（id, class, styleなど）
    this.children = children || []; // 子要素（他のVNodeまたはテキスト）
  }
}

// 仮想DOMツリーを生成する関数
// 状態（state）に基づいて仮想DOMツリーを構築
function renderVirtualDOM(state) {
  // 状態に基づいて仮想DOMツリーを生成
  return new VNode("div", { id: "app" }, [
    new VNode("h1", {}, [`カウント: ${state.count}`]), // カウント表示
    new VNode("button", { onClick: "increment()" }, ["増加"]), // 増加ボタン
    new VNode("button", { onClick: "reset()" }, ["リセット"]), // リセットボタン
  ]);
}

// 2つの仮想DOMツリーの差分を計算する関数
// この関数は、変更された部分だけを特定するために使用されます
function diff(oldVTree, newVTree) {
  const patches = []; // 変更点を格納する配列

  // 引数のチェック
  if (!oldVTree || !newVTree) {
    console.log("警告: 無効な仮想DOMツリーが渡されました");
    return patches;
  }

  // oldVTreeまたはnewVTreeにchildrenプロパティがない場合は空配列を設定
  oldVTree.children = oldVTree.children || [];
  newVTree.children = newVTree.children || [];

  // 型が変わった場合は完全に置き換え
  // （例: divからspanに変更された場合）
  if (oldVTree.type !== newVTree.type) {
    patches.push({ type: "REPLACE", newVTree });
    return patches;
  }

  // プロパティの変更を検出
  // （例: classやstyleが変更された場合）
  if (JSON.stringify(oldVTree.props) !== JSON.stringify(newVTree.props)) {
    patches.push({ type: "PROPS", props: newVTree.props });
  }

  // 子要素の変更を再帰的に検出
  const minLength = Math.min(
    oldVTree.children.length,
    newVTree.children.length
  );

  for (let i = 0; i < minLength; i++) {
    // 子要素がプリミティブ型（文字列など）の場合
    if (
      typeof oldVTree.children[i] !== "object" ||
      typeof newVTree.children[i] !== "object"
    ) {
      // テキストノードの内容が変更された場合
      if (oldVTree.children[i] !== newVTree.children[i]) {
        patches.push({
          type: "TEXT_CHANGE",
          index: i,
          content: newVTree.children[i],
        });
      }
    } else {
      // 子要素がオブジェクト（VNode）の場合は再帰的に比較
      const childPatches = diff(oldVTree.children[i], newVTree.children[i]);
      if (childPatches.length > 0) {
        patches.push({ type: "CHILD", index: i, patches: childPatches });
      }
    }
  }

  // 子要素の追加または削除
  if (oldVTree.children.length > newVTree.children.length) {
    // 子要素が削除された場合
    patches.push({
      type: "REMOVE_CHILDREN",
      startIndex: newVTree.children.length,
    });
  } else if (newVTree.children.length > oldVTree.children.length) {
    // 子要素が追加された場合
    patches.push({
      type: "ADD_CHILDREN",
      children: newVTree.children.slice(oldVTree.children.length),
    });
  }

  return patches;
}

// 差分を実際のDOMに適用する関数
// 実際のアプリケーションでは、この関数がDOMを更新します
function patch(domNode, patches) {
  console.log("DOMに適用される差分:", patches);
  // 実際のアプリケーションでは、ここで実際のDOM操作を行う
  // この例では簡略化のため、差分のログ出力のみ行う
}

// 使用例 - 初期状態と更新後の状態
const state1 = { count: 0 }; // 初期状態
const state2 = { count: 1 }; // 更新後の状態

// 初期状態と更新後の状態に基づいて仮想DOMを生成
const vdom1 = renderVirtualDOM(state1);
const vdom2 = renderVirtualDOM(state2);

// 差分を計算
const patches = diff(vdom1, vdom2);
console.log("検出された差分:", patches);

// 実際のDOMがあれば適用する
// patch(document.getElementById('app'), patches);

// 前回の仮想DOMを保存（次回の比較のため）
let previousVirtualDOM = vdom2;

// UIを更新する関数
// この関数は、状態が変更されるたびに呼び出されます
function updateUI(newState) {
  // 1. 新しい仮想DOMツリーを生成
  const newVirtualDOM = renderVirtualDOM(newState);

  // 2. 前回の仮想DOMと比較して差分を計算
  const patches = diff(previousVirtualDOM, newVirtualDOM);

  // 3. 実際のDOMに差分だけを適用（実際のDOMがある場合）
  // patch(document.getElementById('app'), patches);
  console.log("UIを更新:", patches);

  // 4. 新しい仮想DOMを保存（次回の比較のため）
  previousVirtualDOM = newVirtualDOM;
}

// 状態を更新してUIを更新する例
const state3 = { count: 2 };
updateUI(state3);

/**
 * 仮想DOMの利点:
 * 1. パフォーマンス: 実際のDOMの操作は最小限に抑えられる
 * 2. 宣言的UI: 状態に基づいてUIがどのように見えるべきかを宣言的に記述できる
 * 3. 抽象化: DOMの直接操作を抽象化し、コードの可読性と保守性を向上
 *
 * この仕組みは、ReactやAngularなどのフレームワークの中核技術であり、
 * 状態の変更に基づいて効率的にUIを更新するために使用されています。
 */
