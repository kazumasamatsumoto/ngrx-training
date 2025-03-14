// 仮想DOMの簡易的な実装例

// 仮想DOMノードを表す簡易的なクラス
class VNode {
  constructor(type, props, children) {
    this.type = type;
    this.props = props || {};
    this.children = children || [];
  }
}

// 仮想DOMツリーを生成する関数
function renderVirtualDOM(state) {
  // 状態に基づいて仮想DOMツリーを生成
  return new VNode("div", { id: "app" }, [
    new VNode("h1", {}, [`カウント: ${state.count}`]),
    new VNode("button", { onClick: "increment()" }, ["増加"]),
    new VNode("button", { onClick: "reset()" }, ["リセット"]),
  ]);
}

// 2つの仮想DOMツリーの差分を計算する関数
function diff(oldVTree, newVTree) {
  const patches = [];

  // 型が変わった場合は完全に置き換え
  if (oldVTree.type !== newVTree.type) {
    patches.push({ type: "REPLACE", newVTree });
    return patches;
  }

  // プロパティの変更を検出
  if (JSON.stringify(oldVTree.props) !== JSON.stringify(newVTree.props)) {
    patches.push({ type: "PROPS", props: newVTree.props });
  }

  // 子要素の変更を再帰的に検出
  const minLength = Math.min(
    oldVTree.children.length,
    newVTree.children.length
  );

  for (let i = 0; i < minLength; i++) {
    const childPatches = diff(oldVTree.children[i], newVTree.children[i]);
    if (childPatches.length > 0) {
      patches.push({ type: "CHILD", index: i, patches: childPatches });
    }
  }

  // 子要素の追加または削除
  if (oldVTree.children.length > newVTree.children.length) {
    patches.push({
      type: "REMOVE_CHILDREN",
      startIndex: newVTree.children.length,
    });
  } else if (newVTree.children.length > oldVTree.children.length) {
    patches.push({
      type: "ADD_CHILDREN",
      children: newVTree.children.slice(oldVTree.children.length),
    });
  }

  return patches;
}

// 差分を実際のDOMに適用する関数
function patch(domNode, patches) {
  console.log("DOMに適用される差分:", patches);
  // 実際のアプリケーションでは、ここで実際のDOM操作を行う
  // この例では簡略化のため、差分のログ出力のみ行う
}

// 使用例
const state1 = { count: 0 };
const state2 = { count: 1 };

const vdom1 = renderVirtualDOM(state1);
const vdom2 = renderVirtualDOM(state2);

const patches = diff(vdom1, vdom2);
console.log("検出された差分:", patches);

// 実際のDOMがあれば適用する
// patch(document.getElementById('app'), patches);

// 前回の仮想DOMを保存
let previousVirtualDOM = vdom2;

// UIを更新する関数
function updateUI(newState) {
  // 1. 新しい仮想DOMツリーを生成
  const newVirtualDOM = renderVirtualDOM(newState);

  // 2. 前回の仮想DOMと比較して差分を計算
  const patches = diff(previousVirtualDOM, newVirtualDOM);

  // 3. 実際のDOMに差分だけを適用（実際のDOMがある場合）
  // patch(document.getElementById('app'), patches);
  console.log("UIを更新:", patches);

  // 4. 新しい仮想DOMを保存
  previousVirtualDOM = newVirtualDOM;
}

// 状態を更新してUIを更新する例
const state3 = { count: 2 };
updateUI(state3);
