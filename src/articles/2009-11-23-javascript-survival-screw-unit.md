---
title: "JavaScript Survival: Screw.Unit"
published: "2009-11-23T00:00:00.000Z"
---

Over the last year or so, I've become increasingly convinced that implementing [Behavior-Driven Development](http://dannorth.net/introducing-bdd) (BDD) practices can lead to significantly cleaner code and better design. And in the case of dynamic languages like Ruby, a good testing framework can be essential in enabling good maintenance practices.

JavaScript, that language that for years was written off as a toy at best and an abomination at worst, is now much better understood. It turns out JavaScript is quite powerful and surprisingly well-designed, provided that you stick to the [good parts](/articles/2009/09/11/tech-fridays-javascript-the-good-parts) and avoid the bad parts.

But how do you do BDD in JavaScript? One tool I was pleasantly surprised with is [Screw.Unit](http://github.com/nkallen/screw-unit).  If you've ever worked with [RSpec](http://rspec.info/), you'll immediately recognize the connection. The ability to create nested contexts and tests that read like plain English makes this my JavaScript testing tool of choice.