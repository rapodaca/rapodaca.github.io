---
title: "How to Validate CAS Registry Numbers in JavaScript"
published: "2011-10-20T00:00:00.000Z"
---

Some time ago I needed to [validate CAS Numbers in Ruby](http://depth-first.com/articles/2008/07/23/validating-cas-numbers/). Recently, I needed to validate CAS Numbers in JavaScript. The problem boils down to comparing the [terminal check digit](http://www.cas.org/expertise/cascontent/registry/checkdig.html) with the expected value. The function **validateCAS** does the trick:

```js
var validateCAS = function(cas) {
  if (!cas || !cas.match(/[0-9]{2,7}-[0-9]{2}-[0-9]/)) {
    return false;
  }
    
  var sum = 0;
  var digits = cas.replace(/-/g, '');
    
  for (var i = digits.length - 2; i >= 0; i--) {
    sum = sum + parseInt(digits[i]) * (digits.length - i - 1);
  }
    
  return sum % 10 === parseInt(cas.slice(-1));
};
```

To test, open up a browser or Node.js console, include the above function, and use:

```js
console.log(validateCAS('107-07-3')); // prints true
```