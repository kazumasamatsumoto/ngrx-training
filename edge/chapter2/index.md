# Chapter 2: JavaScript のメモリモデル

## 概要

このチャプターでは、JavaScript のメモリモデルについて学びます。JavaScript における値型（プリミティブ型）とオブジェクト型（参照型）の違い、変数の割り当て方法、およびメモリ内でのデータの保存方法について理解を深めます。

## JavaScript のデータ型

JavaScript のデータ型は大きく分けて以下の 2 種類があります：

### 1. プリミティブ型（値型）

プリミティブ型は、単一の値を表す基本的なデータ型です。JavaScript には以下の 7 つのプリミティブ型があります：

- **数値（Number）**: 整数や浮動小数点数（例: `42`, `3.14`）
- **文字列（String）**: テキストデータ（例: `"こんにちは"`, `'JavaScript'`）
- **真偽値（Boolean）**: `true`または`false`
- **null**: 値が存在しないことを表す特殊な値
- **undefined**: 値が割り当てられていないことを表す特殊な値
- **Symbol**: ES6 で導入された一意で不変の値
- **BigInt**: ES2020 で導入された任意精度の整数（例: `9007199254740991n`）

プリミティブ型の値はスタックメモリに直接格納され、変数にはその値自体が保存されます。

### 2. オブジェクト型（参照型）

オブジェクト型は、複数の値や機能をグループ化したデータ型です。JavaScript には以下のようなオブジェクト型があります：

- **オブジェクト（Object）**: キーと値のペアの集合（例: `{ name: "田中", age: 30 }`）
- **配列（Array）**: 順序付きの値の集合（例: `[1, 2, 3, 4]`）
- **関数（Function）**: 実行可能なコードブロック
- **日付（Date）**: 日時を表すオブジェクト
- **正規表現（RegExp）**: パターンマッチング用のオブジェクト
- **Map、Set、WeakMap、WeakSet**: ES6 で導入されたコレクション
- **TypedArray**: バイナリデータを扱うための配列

オブジェクト型の値はヒープメモリに格納され、変数にはそのメモリアドレス（参照）が保存されます。

## 値の格納方法

### プリミティブ型の格納

プリミティブ型の値は、変数に直接格納されます。変数を別の変数にコピーすると、値そのものがコピーされます。

```javascript
let a = 5; // 変数aに値5を格納
let b = a; // 変数bに値5をコピー
a = 10; // 変数aの値を10に変更
console.log(b); // 5（aの変更はbに影響しない）
```

### オブジェクト型の格納

オブジェクト型の値は、ヒープメモリに格納され、変数にはそのメモリアドレス（参照）が保存されます。変数を別の変数にコピーすると、参照がコピーされるため、両方の変数は同じオブジェクトを指します。

```javascript
let obj1 = { count: 5 }; // obj1はヒープ上のオブジェクトへの参照を保持
let obj2 = obj1; // obj2はobj1と同じオブジェクトへの参照をコピー
obj1.count = 10; // obj1を通じてオブジェクトのプロパティを変更
console.log(obj2.count); // 10（obj1の変更がobj2にも反映される）
```

## メモリ割り当てのビジュアル表現

以下の図は、プリミティブ型とオブジェクト型のメモリ割り当ての違いを示しています：

```
// プリミティブ型
スタックメモリ
+-------------+
| a: 5        |
+-------------+
| b: 5        |
+-------------+

// オブジェクト型
スタックメモリ           ヒープメモリ
+-------------+         +----------------+
| obj1: 参照  | ------> | { count: 10 }  |
+-------------+         +----------------+
| obj2: 参照  | ------/
+-------------+
```

## 参照の比較

JavaScript では、`===`演算子を使用して値の比較を行います。プリミティブ型の場合は値自体が比較されますが、オブジェクト型の場合は参照（メモリアドレス）が比較されます。

```javascript
// プリミティブ型の比較
let a = 5;
let b = 5;
console.log(a === b); // true（値が同じ）

// オブジェクト型の比較
let obj1 = { count: 5 };
let obj2 = { count: 5 };
let obj3 = obj1;
console.log(obj1 === obj2); // false（異なるオブジェクトへの参照）
console.log(obj1 === obj3); // true（同じオブジェクトへの参照）
```

## 関数の引数とメモリモデル

関数に引数を渡す場合も、プリミティブ型とオブジェクト型で動作が異なります。

### プリミティブ型の引数

プリミティブ型の引数は値渡し（pass by value）で渡されます。つまり、関数内で引数の値を変更しても、元の変数には影響しません。

```javascript
function updateValue(x) {
  x = x + 1;
  console.log("関数内:", x);
}

let num = 5;
updateValue(num); // 関数内: 6
console.log(num); // 5（変更されていない）
```

### オブジェクト型の引数

オブジェクト型の引数は参照渡し（pass by reference）で渡されます。つまり、関数内でオブジェクトのプロパティを変更すると、元のオブジェクトにも影響します。

```javascript
function updateObject(obj) {
  obj.count = obj.count + 1;
  console.log("関数内:", obj.count);
}

let myObj = { count: 5 };
updateObject(myObj); // 関数内: 6
console.log(myObj.count); // 6（変更が反映されている）
```

ただし、関数内で引数に新しいオブジェクトを割り当てた場合は、元のオブジェクトには影響しません。

```javascript
function replaceObject(obj) {
  obj = { count: 100 }; // 新しいオブジェクトを割り当て
  console.log("関数内:", obj.count);
}

let myObj = { count: 5 };
replaceObject(myObj); // 関数内: 100
console.log(myObj.count); // 5（変更されていない）
```

## 実践例

以下のコードを使用して、JavaScript のメモリモデルを実験してみましょう：

```javascript
// プリミティブ型とオブジェクト型の違いを確認
function memoryModelDemo() {
  // プリミティブ型
  let num1 = 5;
  let num2 = num1;
  num1 = 10;

  console.log("プリミティブ型:");
  console.log(`num1: ${num1}, num2: ${num2}`);

  // オブジェクト型
  let obj1 = { value: 5 };
  let obj2 = obj1;
  obj1.value = 10;

  console.log("オブジェクト型:");
  console.log(`obj1.value: ${obj1.value}, obj2.value: ${obj2.value}`);

  // 新しいオブジェクトの割り当て
  obj1 = { value: 20 };

  console.log("新しいオブジェクトの割り当て後:");
  console.log(`obj1.value: ${obj1.value}, obj2.value: ${obj2.value}`);
}

memoryModelDemo();
```

## 次のステップ

次のチャプターでは、JavaScript のガベージコレクションについて学びます。不要になったメモリを自動的に解放するガベージコレクションの仕組みと、メモリリークを防ぐためのベストプラクティスについて理解を深めましょう。
