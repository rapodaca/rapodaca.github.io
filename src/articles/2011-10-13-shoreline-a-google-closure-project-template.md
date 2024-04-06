---
title: "Shoreline: A Google Closure Project Template"
published: "2011-10-13T00:00:00.000Z"
---

[Google Closure](http://code.google.com/closure/) is a suite of tools for building scalable JavaScript software. I've used it in numerous projects with success.

Closure's biggest limitation is complexity. It can take thirty minutes or more just to get a new project set up and debugged. And if you're new to Closure, that time can stretch into hours or days.

My solution is [Shoreline](https://github.com/metamolecular/shoreline), a complete template for Closure projects. With it, you can:

-  Create BDD-style tests using [Jasmine](http://pivotal.github.com/jasmine/).
-  Autotest your project (save any file and your Jasmine test-suite re-runs).
-  Build and compile your project using [Jake](http://cappuccino.org/discuss/2010/04/28/introducing-jake-a-build-tool-for-javascript/).

The directory structure is set up according to a system I've been using and improving over the course of a year:

-  **build** is created by Jake and contains dependencies and compiled JavaScript.
-  **html** contains html files used to display your application or parts of it. index.html displays your application using uncompiled JavaScript. index-compiled.html runs your project as compiled JavaScript.
-  **lib** contains library dependencies, which can be added as [Git submodules](http://chrisjean.com/2009/04/20/git-submodules-adding-using-removing-and-updating/).
-  **spec** test files written with Jasmine.
-  **src** your project's source files, optionally grouped into packages.
-  **stylesheets** CSS files used with the HTML files.

To set up a Shoreline project:

```bash
git clone git@github.com:metamolecular/shoreline.git
cd shoreline
git submodule init
git submodule update
npm install jake
```

To create dependencies and view the sample code in all of its glory, use:

```bash
jake
```

Then open the `html/index.html` file. To view the spec suite, open `spec/suite.html`.

If you've already installed [Node.js](http://nodejs.org/), there's nothing else to download or install.