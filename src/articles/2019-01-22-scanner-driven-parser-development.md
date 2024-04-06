---
title: "Scanner-Driven Parser Development"
summary: "Writing a parser shouldn't require unnecessary detours into linguistic theory or unproductive coding dead-ends. Find out how to start and finish a parser quickly with this in-depth guide."
twitter: true
summary-image: images/posts/20190122/summary.png
published: "2019-01-22T15:30:00.000Z"
---

Writing a parser from scratch can be a daunting task. For a beginner, the topic may seem barricaded behind a thick wall of theory and vocabulary. Getting to the heart of the matter, running code, can take a lot of time and effort. This article describes a shift in thinking that can significantly reduce the time needed to get started and finish. The examples are written in JavaScript, but the underlying principles can can be adapted to any programming language.

# Parsing in a Nutshell

For the purposes of this article, a parser is a function that accepts a string conforming to some set of rules as input and returns an object representing the string's syntax as output. Input strings are evaluated one character at a time from left-to-right until either all characters are consumed or an invalid character is found.

The following function template captures the essence of a parser:

```js
/**
 * @param {string} string input to be parsed
 * @returns {*} representation of string's syntax
 * @throws {Error} given invalid string
 */
const parse = (string) => {
  // parse string, return representation
};
```

Writing a parser boils down to completing the body of a `parse` function consistent with a set of predefined rules.

# Embrace Constraints

Like most problems, writing a parser becomes much easier by embracing some well-chosen constraints. Scanner-Driven Development requires two:

1. Characters are read left-to-right, one at a time.
2. Only one character of lookahead is allowed.

The second point deserves some explanation. *Lookahead* refers to how many characters beyond the current reading position your parser will be allowed to "peek," or read without consuming characters. Restricting lookahead to one character simplifies the `parse` function by reducing the need to *backtrack*. Backtracking is a procedure that restores a parser to some previous state after following a dead end. One character lookahead allows the program's stack frame to be used for backtracking without maintaining additional state.

# A Minimal Scanner

The centerpiece of Scanner-Driven Parser Development is a *Scanner*. A Scanner wraps a string, dividing it into two regions with a cursor. Before the cursor, characters are completely inaccessible. After the cursor, characters can be read either with or without advancing the cursor.

Some languages (such as [Ruby](http://ruby-doc.org/stdlib-2.5.3/libdoc/strscan/rdoc/StringScanner.html)) include a `Scanner` class. Although JavaScript has none, a minimal `Scanner` is easy to implement:

```js
const Scanner = class {
  constructor (string) {
    this._string = string;
    this._cursor = 0;
  }

  /**
   * @return {number}
   */
  get cursor () {
    return this._cursor;
  }

  /**
   * Returns the next character, or '' if done without advancing the cursor.
   *
   * @return {string} a single character or ''
   */
  peek () {
    return this._string[this._cursor];
  }

  /**
   * Returns the next character, or '' if done. Advances the cursor.
   *
   * @return {string} a single character or ''
   */
  pop () {
    return this._string[this._cursor++];
  }
};
```

# Using a Scanner

Rather than using a string directly to implement the `parse` function, commit yourself to only interacting with a string through a `Scanner` instance. Here are some example uses:

```js
const scanner = new Scanner('abc');

scanner.cursor;  // => 0
scanner.peek();  // => 'a'
scanner.pop();   // => 'a'
scanner.peek();  // => 'b'
scanner.pop();   // => 'b'
scanner.peek();  // => 'c'
scanner.cursor;  // => 2
```

Here's a more complex example:

```js
const scanner = new Scanner('abc');
let char = scanner.peek();

while (char) {
  console.log(scanner.pop());

  char = scanner.peek();
}
```

Notice that `Scanner` can only return the character immediately following the cursor. `Scanner` moves forward over the characters of a string, never backward.

Given a `Scanner`, the original goal for the `parse` function can be recast as follows:

```js
const parse = (string) => {
  const scanner = new Scanner(string);

  // parse string using only scanner, then return result
};
```

# Grammar and Syntax Diagrams

Before writing the `parse` function, a *formal grammar* (aka "grammar") will be needed. Think of a grammar as a blueprint for the functions to be written. Grammars can be represented in many ways, one of the most popular of which is [Backus-Naur Form](https://en.wikipedia.org/wiki/Backus–Naur_form) (BNF).

I find the equivalent [Syntax Diagram](https://en.wikipedia.org/wiki/Syntax_diagram) to be more readable. One of the best-known examples defines [JSON](https://www.json.org). Here's a fragment that explains how to produce a JSON "number:"

![JSON Number](/images/posts/20190122/number.gif "JSON Number")

This image depicts a "production rule." A grammar is simply a collection of production rules that may refer to each other or even themselves. Each production rule describes how to produce one element of a grammar or alternatively how to *parse* a single element.

To interpret a syntax diagram, begin at the leftmost single/double vertical line and proceed to the rightmost single/double vertical line. Any item lying on a horizontal line is mandatory. Branches may be followed in their direction of curvature.

For example, starting at the leftmost side of the "number" production rule, we encounter a branch. Following it adds a negative sign to the number. Next comes another branch. Following it adds a non-zero digit (1...9) followed by an optional digit (0...9). But rather than doing that, we can instead append a zero digit. Next, we can add an optional decimal point followed by at least one digit. Finally, we can optionally add an exponent using either a lower- or upper-case letter "E."

A few tools can generate syntax diagrams, including:

- [Railroad Diagram Generator](http://www.bottlecaps.de/rr/ui)
- [Railroad Diagrams](https://github.com/tabatkins/railroad-diagrams)
- [Macro Railroad](https://lukaslueg.github.io/macro_railroad_wasm_demo/)
- [EBNFParser & Syntax Diagram Reader](https://karmin.ch/ebnf/index#download_and_install)

# Implementing `parse`

Using a grammar and `Scanner`, the `parse` function can be implemented with the following procedure:

1. Find the topmost production rule `R`.
2. Create a function named for `R` that uses a `Scanner` to parse the remainder of the string according to `R`.
3. Use loops, quantifiers, and conditional branches as required by `R`.
4. If you encounter a production rule without an implementation, create a function body for it and invoke it.
5. Continue until all production rules have been implemented.

# Example: JSON

Consider writing a simple JSON parser. If the input string is valid, it returns an array containing the input characters. Otherwise an error is thrown. Whitespace is not allowed.

![JSON Object](/images/posts/20190122/object.gif "JSON Object")

The topmost production rule given for JSON is "object." Following Step (1), we begin by creating an empty function body called `parseObject` and invoke it from `parse`:

```js
const parse = (string) => {
  const scanner = new Scanner(string);
  const result = [ ];

  if (!parseObject(scanner, result)) {
    throw Error(`invalid character at ${scanner.cursor}`);
  }

  return result;
};

const parseObject = (scanner) => { }; // TODO
```

Following Step (3), we implement `parseObject`:

```js
const parseObject = (scanner, characters) => {
  if (scanner.peek() === '{') {
    characters.push(scanner.pop());
  } else {
    return false;
  }

  const parseKeyValue = () => {
    if (!parseString(scanner, characters)) {
      return false;
    }

    if (scanner.peek() === ':') {
      characters.push(scanner.pop());
    } else {
      throw Error(`expected : at ${scanner.cursor}`);
    }

    if (!parseValue(scanner, characters)) {
      throw Error(`expected value at ${scanner.cursor}`);
    }
  };

  parseKeyValue();

  while (scanner.peek() === ',') {
    characters.push(scanner.pop());
    parseKeyValue();
  }

  if (scanner.peek() === '}') {
    characters.push(scanner.pop());
  } else {
    throw Error(`expected } at ${scanner.cursor}`);
  }

  return true;
};

const parseString = (scanner, characters) => { }; // TODO
const parseValue = (scanner, characters) => { }; // TODO
```

Several points are worth noting:

- The function `parseObject` mirrors the grammar it recognizes.
- Each call to `peek` that returns an expected character is followed by a call to `pop` that consumes it.
- If the first element of a production rule is detected, but any subsequent mandatory element is not, an error is thrown.
- If the first element of a production rule is not found, `false` is returned.
- The result object may be updated in the process of parsing a production rule.
- We always know the current cursor position, so it's easy to include it in error messages.

These same principles apply to the implementation of `parseString`, `parseValue`, and the remaining production rules.

In practice, an array of characters will be insufficient to represent the syntax of an input string. Use a representation that best fits the problem at hand.

Not all grammars will be compatible with the simple method outlined here. The trick is to configure the grammar to be compatible with the method. The name "Scanner-Driven Parser Development" reflects the fact that this method forces the grammar to be moulded around the parser, not the other way around.

# Supporting Regular Expressions

It will often be more convenient to consume characters, not one at a time, but as a group. `Scanner` can support this functionality by adding a new method, `scan`:

```js
const Scanner = class {
// ...

  /**
   * Returns the string match for `regex` starting
   * from the current cursor. Advances cursor if a
   * match is found. Returns `undefined` otherwise.
   * 
   * @param {RegExp} regex
   * @return {string|undefined}
   * @throws {Error} given regex global flag not set
   */
  scan (regex) {
    if (!regex.global) {
      throw Error('regex global flag must be set');
    }

    regex.lastIndex = this._cursor;
    const match = regex.exec(this._string);

    if (match === null || match.index !== this._cursor) {
      return undefined;
    }

    this._cursor = regex.lastIndex;

    return match[0];
  }

// ...
};
```

The `global` flag must be set for regular expressions passed to `scan`. The reason has to do with [how JavaScript treats the `lastIndex` property](http://2ality.com/2013/08/regexp-g.html).

This new version allows text to be matched by pattern:

```js
const scanner = new Scanner('hello, world');

scanner.match(/h[aeiou]/g); // => 'he'
scanner.match(/llo/g);      // => 'llo'
scanner.match/[a-z]/g);     // => undefined
scanner.match/[^a-z]/g);    // => ','
scanner.match(/\s+/g);      // => ' '
scanner.match(/world/g);    // => 'world'
scanner.peek();             // => ''
```

The same functionality is available through `peek` and `pop`, but `scan` collapses what would otherwise require multiple operations into one.

# Theory

Grammars can be classified in a number of ways. The major axis separates context-free grammars (CFGs) from everything else. A CFG consists of a set of production rules with [single nonterminals on their left-hand sides](https://softwareengineering.stackexchange.com/q/253454). A *terminal* is a character from the grammar's alphabet, and as such contains no productions. A *nonterminal* is a pattern composed of *terminals* and *non-terminals*.

CFGs are in turn classified along three axes:

1. whether they are read left-to-right or right-to-left;
2. whether they are left-associative or right-associative; and
3. the maximum number of lookahead characters that are required.

A shorthand notion for CFGs is used in which the first character (L or R) denotes the read direction, the second character denotes the direction of [operator associativity](https://en.wikipedia.org/wiki/Operator_associativity) (L or R), and the last character represents the number of lookahead characters (which may be in parentheses). For example, JSON is an example of an LL(1) grammar. Similarly, any LL(1) grammar can be parsed using a Scanner-driven approach.

Although the examples here don't make use of it, CFG nonterminals can be *recursive*. That is, a production rule can refer to itself. However, to avoid infinite recursion, the self-reference may not be the leftmost element. Should a grammar exhibit left-recursion, it can often be removed through a process called "refactoring."

<div class="videowrapper">
  <iframe src="https://www.youtube.com/embed/3_VCoBfrt9c" allowfullscreen></iframe>
</div>

In some cases, the simple error reporting method used in this article's examples won't be enough. For example, it might be important to parse the entire string, reporting *all* errors found, rather than aborting at the first one. If so, then "Panic Mode" error recovery may be worth supporting. In Panic Mode, the parser will either log an error and simply continue, or backtrack to a known synchronization point.

For an excellent practical introduction to parsers with a helpful dash of theory, see [Crafting Interpreters](http://www.craftinginterpreters.com/parsing-expressions.html).

# Parser Generators

The systematic way in which an LL(1) parser can be written raises the obvious question of automation. Can software write the parser for us? The answer is "yes!"

[Parser Generators](https://en.wikipedia.org/wiki/Comparison_of_parser_generators) accept as input a grammar which can often be defined in some variant of BNF, and returns a program that will parse strings using the grammar. Some examples of JavaScript-based parser generators include:

- [PEG.js](https://pegjs.org)
- [Nearly](https://nearley.js.org)
- [Jison](http://zaa.ch/jison/)

Parser generators can be used with good results, but they also come with [sometimes hidden costs](https://mortoray.com/2012/07/20/why-i-dont-use-a-parser-generator/):

- they output source code, which must be treated differently than a project's other source code;
- they can produce stack traces that make debugging a challenge; and
- they vary greatly in their support for generating custom representations of the string being parsed.

These drawbacks may not matter in your project. Regardless, you'll be better positioned to use a parser generator if you first take the time to practice a few hand-crafted parsers using Scanner-Driven Development.

A variation on the parser generator theme is [rd-parse](https://github.com/dmaevsky/rd-parse). Rather than producing source code, this library allows production rules to be defined in JavaScript. Debugging and producing a syntax representation with rd-parse can nevertheless be challenging.

# Conclusions

Parsers developed with a `Scanner` end up resembling their underlying grammar, making them easier to write, understand, and maintain than parsers written with alternative approaches. Provided that the language to be parsed can be represented in LL(1) form, Scanner-Driven Parser Development leads to running code quickly while avoiding unnecessary detours into theory.