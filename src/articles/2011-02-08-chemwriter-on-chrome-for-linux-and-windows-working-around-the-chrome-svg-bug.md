---
title: "ChemWriter on Chrome for Linux and Windows: Working Around the Chrome SVG Bug"
published: "2011-02-08T00:00:00.000Z"
---

I'm happy to report that [ChemWriter](http://chemwriter.com) now runs without known issues on Chrome for Linux and Windows.

As reported here previously, SVG on Chrome for Linux and Windows suffers from [a known bug that prevents attachment of event listeners to SVG DOM elements under certain conditions](http://code.google.com/p/chromium/issues/detail?id=65238). Fortunately, the bug was pinpointed and a [simple XHTML file](/demos/chrome-bug-65238/chrome-on-linux-windows-svg-event-bug.xhtml) can be used to reproduce the behavior.

Although Chrome recently pushed Version 9 to clients, this update unfortunately didn't fix the problem.

I won't go into how we enabled the workaround here. Suffice it to say - ChemWriter can now be used on all desktop browsers with a significant user base, with custom interfaces for iPad and Android tablets coming soon.

[ChemWriter](http://chemwriter.com) is the ergonomic chemical structure editor for the Web. Written entirely with JavaScript, it requires neither Java nor plugins of any kind. Both [commercial and academic](http://chemwriter.com/buy) license are available to fit your project.