const obj1 = { count: 0 };
const obj2 = obj1; // 同じ参照
const obj3 = { count: 0 }; // 新しいオブジェクト（異なる参照）

console.log(obj1 === obj2); // true（同じメモリアドレスを指している）
console.log(obj1 === obj3); // false（異なるメモリアドレスを指している）
