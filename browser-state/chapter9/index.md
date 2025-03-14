### 3. セレクター（Selectors）

状態の一部だけを選択して取得する関数です。多くの場合、メモ化と組み合わせて使用されます。

```javascript
// セレクターの例（Redux + Reselectの簡易版）
const getCount = (state) => state.count;
const getUser = (state) => state.user;

// メモ化されたセレクター
const getUserName = createSelector(
  getUser,
  (user) => user.name // userが変わった場合のみ再計算される
);
```
