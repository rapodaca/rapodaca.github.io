---
title: "Jmol Without Applets Using Websockets"
disqus: true
published: "2011-01-19T00:00:00.000Z"
---

<div class="videowrapper">
  <iframe src="https://www.youtube.com/embed/1wu5gOxQxcs" allowfullscreen></iframe>
</div>

This demo shows one way to deploy an interactive applet like Jmol on clients lacking the Java plugin.

The technique is based on [Websockets](http://dev.w3.org/html5/websockets/), a bi-directional communication protocol that runs over TCP. Currently, Websockets are supported natively on the most recent versions of most standards-compliant browsers. Websockets are also supported on Internet Explorer and other legacy browsers using a [Flash implementation](https://github.com/gimite/web-socket-js).

I recently wrote about [WebGL and its application to chemistry](http://depth-first.com/articles/2011/01/14/webgl-and-what-it-means-for-chemistry/), especially in the area of 3D visualization. One problem with WebGL is that it may or may not ever make it to Internet Explorer, which is widely-used in pharma.

The combination of Websockets and a server-side Jmol instance could provide [scaffolding](http://depth-first.com/articles/2006/12/21/scaffolding/) for the development of a pure-JavaScript 3D molecular visualizer that would work on all browsers.

First, build the UI around a Jmol/Websockets renderer. This software would work on all browsers and only require Flash on IE and other clients lacking Websockets. Other platforms, such as iPad, would use native Websockets. Getting the JavaScript-based UI right for the browser would be no small piece of work in itself and could take some time.

Then, when it becomes clear what the 3D rendering situation will be on IE 9, create the Websockets-free 3D renderer implementation based on WebGL, Microsoft's fork of it, or a higher-level JavaScript API that encompasses both implementations.
