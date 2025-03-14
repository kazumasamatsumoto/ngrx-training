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
// 簡単に言うと「前の設計図と新しい設計図を比べて、変わった部分を見つける」機能です
function diff(oldVTree, newVTree) {
  // 変更点を記録するリスト（「ここが変わりました」というメモのようなもの）
  const patches = []; 

  // まず、比較する2つの設計図（oldVTreeとnewVTree）が正しく渡されているか確認
  // もし片方でも設計図がなければ、何も変更点はないと判断
  if (!oldVTree || !newVTree) {
    console.log("警告: 比較する設計図（仮想DOM）が見つかりません");
    return patches;
  }

  // 設計図に子要素の情報がない場合は、空の配列を用意しておく
  // これは「子供部屋がない家」の場合でも比較できるようにするための準備
  oldVTree.children = oldVTree.children || [];
  newVTree.children = newVTree.children || [];

  // 要素の種類が変わった場合（例：divからspanに変更された場合）
  // 例えるなら「和室が洋室に変わった」場合は、完全に作り直す必要がある
  if (oldVTree.type !== newVTree.type) {
    patches.push({ type: "REPLACE", newVTree });
    return patches;
  }

  // 要素の属性（class, style, idなど）が変わったかチェック
  // 例えるなら「同じ部屋でも、壁紙や床材が変わった」場合
  if (JSON.stringify(oldVTree.props) !== JSON.stringify(newVTree.props)) {
    patches.push({ type: "PROPS", props: newVTree.props });
  }

  // 子要素の変更をチェック（部屋の中の家具や小物が変わったか）
  // まずは、古い設計図と新しい設計図の両方にある子要素の数を確認
  const minLength = Math.min(
    oldVTree.children.length,
    newVTree.children.length
  );

  // 両方の設計図にある子要素を一つずつ比較していく
  for (let i = 0; i < minLength; i++) {
    // 子要素がテキスト（文字列）の場合
    // 例えば「こんにちは」というテキストが「さようなら」に変わったかどうか
    if (
      typeof oldVTree.children[i] !== "object" ||
      typeof newVTree.children[i] !== "object"
    ) {
      // テキストの内容が変わっていたら記録
      if (oldVTree.children[i] !== newVTree.children[i]) {
        patches.push({
          type: "TEXT_CHANGE",
          index: i,
          content: newVTree.children[i],
        });
      }
    } else {
      // 子要素が単なるテキストではなく、さらに複雑な要素（VNode）の場合
      // 例えるなら「部屋の中にさらに小部屋がある」ような入れ子構造の場合
      // その小部屋の中も再帰的に（繰り返し）チェックする
      const childPatches = diff(oldVTree.children[i], newVTree.children[i]);
      if (childPatches.length > 0) {
        patches.push({ type: "CHILD", index: i, patches: childPatches });
      }
    }
  }

  // 子要素の数が変わった場合の処理
  if (oldVTree.children.length > newVTree.children.length) {
    // 子要素が減った場合（例：3つの部屋が2つになった）
    // 余分な部屋を取り壊す指示を記録
    patches.push({
      type: "REMOVE_CHILDREN",
      startIndex: newVTree.children.length,
    });
  } else if (newVTree.children.length > oldVTree.children.length) {
    // 子要素が増えた場合（例：2つの部屋が3つになった）
    // 新しい部屋を追加する指示を記録
    patches.push({
      type: "ADD_CHILDREN",
      children: newVTree.children.slice(oldVTree.children.length),
    });
  }

  // すべての変更点をまとめて返す
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
console.log("検出された差分:", JSON.stringify(patches, null, 2));

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
  console.log("UIを更新:", JSON.stringify(patches, null, 2));

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
