## レンダリングの最適化

状態変更に基づいて UI を効率的に更新するために、多くのフレームワークやライブラリでは以下の最適化が行われています：

### 1. 仮想 DOM（Virtual DOM）

React、Vue.js などで使用される技術で、実際の DOM の軽量なコピーをメモリ上に保持し、変更があった部分だけを実際の DOM に反映します。

```javascript
// 仮想DOMの簡易的な例
function updateUI(newState) {
  // 1. 新しい仮想DOMツリーを生成
  const newVirtualDOM = renderVirtualDOM(newState);

  // 2. 前回の仮想DOMと比較して差分を計算
  const patches = diff(previousVirtualDOM, newVirtualDOM);

  // 3. 実際のDOMに差分だけを適用
  patch(realDOM, patches);

  // 4. 新しい仮想DOMを保存
  previousVirtualDOM = newVirtualDOM;
}
```
