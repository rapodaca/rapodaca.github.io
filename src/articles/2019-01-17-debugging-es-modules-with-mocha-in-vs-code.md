---
title: "Debugging ES Modules in Node.js and Mocha Using VS Code"
summary: "Integrate in-editor debugging, unit tests, and JavaScript's new module system seamlessly with this simple trick."
twitter: true
disqus: true
summary-image: images/posts/20190117/summary.png
published: "2019-01-17T18:30:00.000Z"
---

The [ES Module](https://hacks.mozilla.org/2018/03/es-modules-a-cartoon-deep-dive/) standard defines a way to build and assemble JavaScript modules. Currently supported in modern browsers and Node.js for many months now, ES Modules will over time render various ad-hoc module systems currently in use obsolete. Given their recent emergence from alpha, however, support for ES Modules can vary across tools. This article describes how to use ES modules within a very specific, but common environment: debugging Mocha tests running on Node.js in Microsoft's [Visual Studio Code](https://code.visualstudio.com) (VS Code).

This article was written with no assumptions other than that your system runs Node 11.6+ and VS Code 1.30.2+. If you're familiar with unit testing JavaScript with Mocha and VS Code debugging, skip to the section [Debugging with Reify](#debuggingwithreify).

# Why ES Modules?

Most programming languages support freestanding code blocks and low-level dependency management out of the box. Not so JavaScript. A browser's JavaScript runtime dumps all variables into the global scope by default. For most of its existence, the only compositional tool was the order in which `<script>` tags appeared in the parent HTML document. This situation made it very difficult develop and integrate independent software packages.

A number of solutions to this problem sprang up. The one adopted by Node.js, [CommonJS](https://blog.risingstack.com/node-js-at-scale-module-system-commonjs-require/), treats each file as an independent module with its own scope. A module can export one or more designated objects for use in other files.

For example, a CommonJS module declares what to export by making assignments to its `module` object:

```js
// name.js

var name = 'foo';

module.exports = name;
```

And a module consumes another module's export by invoking its `require` function:

```js
// greet.js

var name = require('./name.js');

console.log('Hello, ' + name);
```

This system works well enough for code restricted to server environments, but quickly runs into trouble on the browser. The promise of code that runs unmodified in both environments never quite panned out because of all the ad hoc tooling needed to retrofit a module system onto the browser.

The solution is the ES Module standard. ES Modules work a lot like node modules. For example, the name/greet example can be recast with the introduction of the `export` and `import` statements. An object is exported through declaration:

```js
// name.js
var name = 'foo';

export default name
```

and imported with the `import` statement:

```js
// greet.js
import name from './name.js'

console.log('Hello, ' + name);
```

ES Modules are now natively supported by all major browsers and Node.js. However, changes to the module system cut across a wide range of tools. This becomes most apparent when tools are forced to work together.

# Debugging in VS Code

The crown jewel of VS Code is its integrated debugger. Set a breakpoint, run the project in debugger mode, and away you go. Hover over a variable in the source code to get its current value. Experiment in the interactive console. All the functionality of the rich in-browser debugging experience is there.

It's easy to get started. After installing VS Code, set up a test project containing the file `test.js`:

```js
// test.js
const foo = 123;
const bar = 456;

console.log(`Sum: ${foo + bar}`);
```

Set a breakpoint by left clicking to the left of the line number 3. A filled red circle will appear indicating that the breakpoint has been set. Disable the breakpoint by left-clicking again. Add properties to it by right-clicking.

![Breakpoint](/images/posts/20190117/breakpoint.png "Breakpoint")

Begin a debugging session by clicking on the bug icon to the left. A green triangle sits to the upper left of the palette. Clicking this button runs the current file in debugger mode. Line 4 will be highlighted, and a debugging menu will appear in the center-top part of the screen. To exit, click the filled red square button.

![Debug Mode](/images/posts/20190117/debug-mode.png "Debug Mode")

# Automated Testing with Mocha

[Mocha](https://mochajs.org) is an automated testing framework for Node.js and the browser. It supports nested testing contexts, before/after hooks, and plain text descriptions.

Mocha can be installed through [NPM](https://www.npmjs.com). To do so, create the file `package.json` at the top-level of your project. VS Code knows about the structure of this file, and so will attempt to guide you with hints and autocompletion.

```json
{
  "devDependencies": {
    "mocha": "5.2.0"
  }
}
```

(Before creating `package.json`, it may be necessary to switch contexts by clicking on the document icon on the left tool palette. Right click under `test.js` and select "New File.")

The shell command `npm install` installs the dependencies listed in the `package.json` file. You could use a separate terminal for this, but it's more convenient to use the one build into VS Code. Activate it by pressing ctrl&#x2011;\` (control-tilde). After installation, your project contains two new items: the `node_modules` directory and the `package-lock.json` file. The terminal can be dismissed by again pressing ctrl&#x2011;\` or clicking the "X" button.

![NPM Install](/images/posts/20190117/npm-install.png "NPM Install")

By default Mocha looks for test files in the `test` directory of your project. Create that directory and add the file `mocha.spec.js` to it.

```js
// mocha.spec.js
const assert = require('assert');

describe('Math#sign', () => {
  it('returns -1 given -42', () => {
    assert.strictEqual(Math.sign(-42), -1);
  });
});
```

To run the test, create an NPM task for it. Open `package.json` and edit it to read as follows:

```json
{
  "devDependencies": {
    "mocha": "5.2.0"
  },
  "scripts": {
    "test": "mocha"
  }
}
```

Run the test suite by issuing the command `npm test` from the terminal. This should produce some output ending with the text "1 passing".

![Test Success](/images/posts/20190117/test-success.png "Test Success")

# Debugging from a Mocha Test

My workflow relies heavily on test-driven development. The [two rules](http://www.javiersaldana.com/tech/2014/11/26/refactoring-the-three-laws-of-tdd.html) I follow are, in order:

1. Write only enough of a test to fail.
2. Write only enough production code to make the failing test pass.

Iterating over these rules keeps my projects in a state in which every module can be exercised to its fullest extent through one or more tests. As such, the test suite provides an ideal platform from which to launch debugging sessions.

<div class="videowrapper">
  <iframe src="https://www.youtube.com/embed/GvAzrC6-spQ" allowfullscreen></iframe>
</div>

To debug from a Mocha test, VS Code needs some additional configuration. Activate the debug panel by clicking on the debug button from the leftmost palette. Next to the green triangular run button sits a dropdown that should read "No Configuration." Click it and select "Add configuration." A new file will appear called `launch.json`. Add a debug configuration by clicking the "Add Configuration..." button. Update `launch.json` as follows:

```json
{
  "version": "0.2.0",
  "configurations": [

    {
      "type": "node",
      "request": "launch",
      "name": "Test",
      "program": "${workspaceFolder}/node_modules/mocha/bin/_mocha",
      "internalConsoleOptions": "openOnSessionStart"
    }
  ]
}
```

To debug a test, toggle back to the `mocha.spec.js` file. Add a breakpoint at the line with the `assert` call. Next, toggle to debug mode. This time, choose the "Test" option from the pulldown and click the run button. VS Code should pause at the breakpoint just as before. The code under test can now be debugged starting from a well-defined state.

# Refactoring to ES Modules

`mocha.spec.js` runs fine in the default configuration because no ES modules were used. The test can be refactored to use ES Modules as follows:

```js
// mocha.spec.js
import assert from 'assert';

describe('Math#sign', () => {
  it('returns -1 given -42', () => {
    assert.strictEqual(Math.sign(-42), -1);
  });
});
```

# Debug Fail

Unfortunately, running the refactored test with the current debug configuration fails with the following console error:

`SyntaxError: Unexpected identifier`

Although Node.js 11 supports ES Modules natively, this support is disabled by default. To enable it, Node must be run behind the [`--experimental-modules`](https://nodejs.org/api/esm.html) flag. This is the first problem to solve.

However, even if the debugging session were started behind the flag, Node.js wouldn't support ES modules. Currently, files invoking ES Modules must use the `.mjs` ("module JavaScript" aka Michael Jackson Script) extension. The files written so far all use the `.js` extension.

But even after making these changes, we'd still be stuck because Mocha doesn't recognize test files using the `.msj` extension. The error "No test files found" would be reported. Nor can Mocha currently work with tests that invoke ES Modules.

A few solutions to this problem have been reported, such as:

- [Transpile with Babel](http://www.albertgao.xyz/2016/12/16/how-to-debug-mocha-tests-in-visual-studio-code-with-es5-or-es6/).
- [Run mocha-es6-modules](https://github.com/vitalets/mocha-es6-modules).

I'd rather not introduce a build system and its attendant complexity where none existed before. I'm also not a fan of deviating from widespread practice for testing without good reason. In any case, I wanted something far simpler than any of the published approaches I was able to find.

# Reify

[Reify](https://www.npmjs.com/package/reify) is a Node module that transparently allows ES Modules to be used without the `--experimental-modules` flag and without transpilation. It can be used when running applications, test suites, and even interactively in a REPL.

In a nutshell, Reify is the simple solution that this simple problem demands. The trick is getting it to work with VS Code, Node, and Mocha.

# Debugging with Reify

One more bit of configuration is all it takes to allow the debugging of Mocha tests using ES Modules. Begin by adding the Reify dependency to `package.json`:

```json
{
  "devDependencies": {
    "mocha": "5.2.0",
    "reify": "0.17.3"
  },
  "scripts": {
    "test": "mocha"
  }
}
```

Then install Reify with `npm install`.

Finally, update `launch.json`, which is found in your project's `.vscode` directory by adding a directive to require Reify:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "launch",
      "name": "Test",
      "program": "${workspaceFolder}/node_modules/mocha/bin/_mocha",
      "args": [
        "--require", "reify"
      ],
      "internalConsoleOptions": "openOnSessionStart"
    }
  ]
}
```

Launching the VS Code debugger "Test" task should now allow full debugging functionality.

![ES Module Mocha Debug](/images/posts/20190117/es-module-mocha-debug.png "ES Module Mocha Debug")

Note the use of the older 0.17.3 version of Reify rather than the newer 0.18.1 version. A change was introduced in the 0.18.0 release that breaks Mocha when used with the `--watch` option. Instead of changes being reflected after Mocha auto-reloads, stale source code continues to be used. The 0.17.3 release is the last version of Reify that can be used with the Mocha `--watch` option. [An issue has been filed](https://github.com/benjamn/reify/issues/217).

# ESM as an Alternative to Reify

A fork of Reify, [ESM](https://www.npmjs.com/package/esm), serves as a drop-in replacement for Reify. There are two caveats:

1. A `skipFiles` entry containing the path to the `esm.js` file will be needed to get ["Just My Code"](https://code.visualstudio.com/docs/nodejs/nodejs-debugging#_skipping-uninteresting-code-node-chrome) debugging.
2. In a larger project I'm working on, ESM adds about 3 seconds delay to the Mocha auto-reload when using its `--watch` option.

The latter point is the reason I continue to use Reify.

# Conclusions

ES Modules can be debugged through Mocha tests on VS Code with Reify. No transpilation, no build system, and no alternative testing frameworks are needed. Simply require Reify through your project's `.vscode/settings.json` file.