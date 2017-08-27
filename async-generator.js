/**
 * @license
 * Copyright 2017 Rafael Gieschke
 * Licensed under the MIT License (<https://opensource.org/licenses/MIT>).
 */

/**
 * @fileoverview
 * async-generator is a lightweight shim for
 * [async generator functions](https://github.com/tc39/proposal-async-iteration#async-generator-functions).
 * @see {@link https://rafaelgieschke.github.io/async-generator/}
 */

if (!("asyncIterator" in Symbol)) Symbol.asyncIterator = Symbol("Symbol.asyncIterator");

export default generatorFunction => new Proxy(generatorFunction, {
  apply(target, thisArg, args) {
    const iterator = Reflect.apply(target, thisArg, args);
    let queue = Promise.resolve();
    iterator.next = new Proxy(iterator.next, {
      apply: (target, thisArg, [value]) => queue = queue.then(async () => {
        for (;!({value} = Reflect.apply(target, thisArg, [value])).done; value = await value) {
          if (Array.isArray(value)) return {done: false, value: await value[0]};
        }
        return {done: true, value: await value};    
      })
    });
    iterator[Symbol.asyncIterator] = function() { return this; };
    return iterator;
  }
});
