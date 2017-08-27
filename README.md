# async-generator

> async-generator is a lightweight shim for [async generator functions](https://github.com/tc39/proposal-async-iteration#async-generator-functions). - <https://github.com/rafaelgieschke/async-generator>

## Usage

It allows you to write:

```javascript
async function* getFiles() {
  for (var i = 0; i < 10; i++) {
    yield (await fetch(i)).text();
  }
  return "done";
}
```

as:

```javascript
import asyncGenerator from "https://rafaelgieschke.github.io/async-generator/async-generator.js";
const getFiles = asyncGenerator(function* () {
  for (var i = 0; i < 10; i++) {
    yield [(yield fetch(i)).text()];
  }
  return "done";
});
```

(You can also use include `<script src="https://rafaelgieschke.github.io/async-generator/async-generator.global.js"></script>` to have ayncGenerator defined in the global scope without ECMAScript modules.)

So, you simply have to replace `await` with `yield` and `yield ...` with `yield [...]`.

(This also means, you cannot "`await`" an `Array`.)

## Async iteration

You do not need a shim for [async iteration](https://github.com/tc39/proposal-async-iteration#the-async-iteration-statement-for-await-of),
as you can always write:

```javascript
(async () => {
  for await (const file of getFiles()) {
    console.log(file);
  }
})();
```

as:

```javascript
(async () => {
  for (let file, __iter = getFiles()[Symbol.asyncIterator](); !({value: file} = await __iter.next()).done;) {
    console.log(file);
  }
})();
```

## License

[MIT](https://opensource.org/licenses/MIT)

---

<a href="https://github.com/rafaelgieschke/async-generator"><img style="position: absolute; top: 0; right: 0; border: 0;" alt="Fork me on GitHub" src="https://s3.amazonaws.com/github/ribbons/forkme_right_red_aa0000.png"></a>
<script src="https://rafaelgieschke.github.io/async-generator/async-generator.global.js"></script>

