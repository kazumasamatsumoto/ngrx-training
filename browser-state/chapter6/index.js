/**
 * Chapter 6: 仮想DOM（Virtual DOM）の実装
 *
 * このファイルでは、ReactやAngularなどのフレームワークで使われている
 * 仮想DOM（Virtual DOM）の簡単な実装例を紹介します。
 *
 * 仮想DOMとは何か？
 * 簡単に言うと、画面に表示されるHTML要素の設計図のようなものです。
 * JavaScriptのオブジェクトで作られた軽い模型と考えてください。
 *
 * 仮想DOMの働き方（3つのステップ）:
 * 1. アプリの状態（データ）から仮想的な画面の設計図を作る
 * 2. 前の設計図と新しい設計図を比べて、変わった部分を見つける
 * 3. 変わった部分だけを実際の画面（DOM）に反映する
 *
 * なぜ仮想DOMが便利なの？
 *
 * 【速度アップの秘密】
 * 実際の画面（DOM）を直接変更するのは、とても重い作業です。
 * 例えば、Webページの一部を変更すると、ブラウザは画面の再計算や
 * 再描画をする必要があり、これが遅さの原因になります。
 *
 * 仮想DOMは、この問題を解決する賢い方法です。例えるなら：
 * 実際の画面を直接書き換えるのは「家全体を建て直す」ようなもの。
 * 仮想DOMを使うと「変更が必要な部屋だけをリフォームする」ように
 * 効率的に画面を更新できます。
 *
 * 仮想DOMの3つのメリット：
 * 1. 必要な部分だけを更新するので無駄がない
 * 2. 複数の変更をまとめて一度に反映できる
 * 3. ブラウザの重い処理（再計算や再描画）を減らせる
 *
 * 【状態管理との相性】
 * ReduxやNgRxなどの状態管理と仮想DOMを組み合わせると、
 * 大きなアプリでも効率よく画面を更新できます。
 * 
 * 例えるなら、状態管理は「設計変更の指示書」、仮想DOMは
 * 「変更箇所を正確に特定する検査官」のような関係です。
 * この組み合わせで、複雑なアプリでもスムーズな操作感を
 * 実現できます。
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
 * 仮想DOMのメリットまとめ:
 * 1. 速さ: 画面の必要な部分だけを更新するので動作が速い
 * 2. 書きやすさ: 「こんな画面にしたい」という形で簡単に書ける
 * 3. 管理しやすさ: 複雑なDOM操作を直接書かなくていいので、コードが整理しやすい
 *
 * この仕組みは、ReactやAngularなどの人気フレームワークの核となる技術で、
 * データの変化に合わせて効率よく画面を更新するために使われています。
 * 
 * 例えるなら、仮想DOMは「効率的なリフォーム計画を立てる建築士」のようなもので、
 * 無駄なく素早く画面を更新する手助けをしてくれます。
 */
