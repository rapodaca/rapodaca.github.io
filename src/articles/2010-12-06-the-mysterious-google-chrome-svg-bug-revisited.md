---
title: The Mysterious Google Chrome SVG Bug Revisited
published: "2010-12-06T00:00:00.000Z"
---

A previous post outlined the steps I took to track down [a bug in Google Chrome that prevented the firing of mouse events on certain SVG elements](/articles/2010/12/03/the-mysterious-google-chrome-svg-bug/). After [filing a bug report](http://code.google.com/p/chromium/issues/detail?id=65238), one commenter [suggested that I create a single file that illustrates the bug](http://code.google.com/p/chromium/issues/detail?id=65238#c3), rather than a full Google Closure project.

That's exactly what I did. You can [view the test page here](/demos/chrome-bug-65238/chrome-on-linux-windows-svg-event-bug.xhtml). In addition to major simplification, this demo shows that the Chrome SVG event bug also affects event firing from rectangles as well ellipses. Here's the source:

```html
<html xmlns="http://www.w3.org/1999/xhtml">
  <head>
  <title>Chrome on Linux/Windows SVG Event Bug</title>
    <style>
      p { width: 600px; line-height: 1.5em; }
      svg { width: 600px; height: 200px;}
    </style>
    <script>
      function enter(event) {
        event.target.setAttribute("fill", "#22AA00");
      };
      function exit(event) {
        event.target.setAttribute("fill", "#AA2222");
      };
    </script>
  </head>
  <body>
    <svg xmlns="http://www.w3.org/2000/svg">
      <g transform="translate(0, 200) scale(100, -100)">
        <ellipse cx="1" cy="1" rx="0.75" ry="0.75" fill="#AA2222" onmouseover="enter(evt)" onmouseout="exit(evt)" />
        <ellipse cx="3" cy="1" rx="0.2" ry="0.2" fill="#AA2222" onmouseover="enter(evt)" onmouseout="exit(evt)" />
        <rect x="4" y="0.9" width="0.2" height="0.2" fill="#AA2222" onmouseover="enter(evt)" onmouseout="exit(evt)" />
      </g>
    </svg>
    <p>
      Hover the mouse cursor over all three shapes. Each shape should change its color from red to green.
      This test works on all recent SVG-enabled browsers, but fails in Google Chrome 8.0.552.215 on Linux and Windows.
    </p>
    <p>
      On Chrome for Linux and Windows, the smaller circle and square on the right don't turn green. On Chrome for OS X, all
      three shapes turn green, which is the expected behavior.
    </p>
    <p>
      For details, see <a href="http://code.google.com/p/chromium/issues/detail?id=65238">this bug report</a>
      and <a href="/articles/2010/12/03/the-mysterious-google-chrome-svg-bug/">this writeup</a>.
    </p>
  </body>
</html>
```

This demo creates a transformed SVG coordinate space, populates it with three shapes, and assigns two event listeners, `enter` and `exit`, to respond to mouse events by changing the shapes' fill colors.

**Update 12/06/2010** Fixed onmouseover/onmouseout attributes in demo code.
