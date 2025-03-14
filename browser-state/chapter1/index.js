// プリミティブ型の例
let a = 5;
let b = a; // 値のコピー
a = 10;
console.log(b); // 5（aの変更はbに影響しない）

// オブジェクト型の例
let obj1 = { count: 5 };
let obj2 = obj1; // 参照のコピー
obj1.count = 10;
console.log(obj2.count); // 10（obj1の変更がobj2に影響する）
