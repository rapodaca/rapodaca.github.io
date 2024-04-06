---
title: "Write Once, Run Anywhere: Simplifying Java Applet Deployment"
published: "2007-11-20T00:00:00.000Z"
---

From the early days, Java has been described by Sun as the "write once, run anywhere" language and platform. And for the most part, Sun has made good on this promise. It's taken some time, but today's Java Virtual Machines (JVMs) enable developers to feel very confident of their code executing as designed (and unmodified) on any computer system. It's easy to forget, but that's a Big Deal.

Unfortunately, one aspect of Java has been saddled with platform-specific issues from the beginning. Ironically, it's the same area for which Java was originally marketed: applets in Web browsers.

The fuzzy boundary between the Web browser and a Java applet is a place where many cross-platform problems can be found. In areas ranging from keyboard focus to state persistence to deployment, developers need to keep on their toes and test on every platform they want to deploy on.

But to be fair, why should we expect all applets to work the same on every browser when even [CSS and HTML don't](http://davidwalsh.name/6-reasons-why-ie6-must-die/)? The "[browser wars](http://en.wikipedia.org/wiki/Browser_wars)" exacted a heavy toll on the entire Web user experience that we're only now starting to move past.

As a much-needed step toward making browser applet quirks a lot less interesting, Sun recently introduced its [Deployment Toolkit](https://jdk6.dev.java.net/testDT.html). At its center is a JavaScript library that allows developers to largely forget the differences among browsers when deploying applets on arbitrary clients.

[A more technical summary](http://metamolecular.com/blog/2007/11/14/simplifying-java-applet-deployment/) of Sun's Java Deployment Toolkit, including a [live example](http://metamolecular.com/products/chemwriter/demo/chemwriter-and-the-java-deployment-toolkit/) using the [ChemWriter&trade; structure editor](http://metamolecular.com/products/chemwriter) can be found on the [Metamolecular Company Blog](http://metamolecular.com/blog/).