// イミュータブルな状態更新
function updateCount(state, newCount) {
    // 新しいオブジェクトを返す（元のオブジェクトは変更しない）
    return { ...state, count: newCount };
  }
  
  const state1 = { count: 0, name: "App" };
  const state2 = updateCount(state1, 1);
  
  console.log(state1.count); // 0（元の状態は変更されていない）
  console.log(state2.count); // 1（新しい状態）
  console.log(state1 === state2); // false（異なる参照）