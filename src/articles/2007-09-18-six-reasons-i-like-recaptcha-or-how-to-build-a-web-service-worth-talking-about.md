---
title: "Six Reasons I Like reCAPTCHA, or How to Build a Web Service Worth Talking About"
published: "2007-09-18T00:00:00.000Z"
---

Having spent a great deal of time with [reCAPTCHA](http://recaptcha.net/) over the last few weeks, I've come to appreciate both the clever idea and spot-on execution. Aside from being an excellent product, reCAPTCHA also offers clues to building Web services that people will not just use, but also tell their friends about. Here, in no particular order, are six things about reCAPTCHA that I hope all of my future Web services achieve:

1.  **It solves a nasty, boring, and widespread problem elegantly.** The nastier and more boring a problem is, the more likely that a solution that actually works will be praised by all who use it. Boring and difficult problems create a [natural scarcity](http://www.paulgraham.com/bronze.html) of good solutions and people willing to work on them. Seek these kinds of problems out; they are a high-probability path to success.

2.  **It never goes down.** Having used reCAPTCHA pretty much continuously over the last three weeks on my current project as well as on [this blog](http://depth-first.com), it's never been unavailable. As much as anything on the Web can be trusted to be there tomorrow, reCAPTCHA seems like a safe bet.

3.  **The business model is obvious.** reCAPTCHA "pays" for itself by helping to digitize old books. This is a valuable service in itself that could be monetized in some very interesting ways. Because reCAPTCHA does something valuable beyond just fighting spam, it's very likely that I can rely on the service being around for a long time.

4.  **It solves problems from two different groups of users at the same time.** Consider the giants of the Web: Yahoo, Google, YouTube, Facebook, eBay. What every one of them has in common is that along the way they have discovered how to solve problems from two different groups of users simultaneously. The same is true for reCAPTCHA. Come to think of it, every *unsuccessful* Web venture I can think of *failed* to solve two problems simultaneously (most didn't even really solve one). This shouldn't be surprising, but for some reason it is. Could this dual-problem thing be the golden rule of Web development?

5.  **The Ruby Library Rocks.** Although short on examples, the [Ruby Library for reCAPTCHA](http://www.loonsoft.com/recaptcha/) does what it needs to do and gets out of my way. Of course, the actual language is unimportant. What matters is that solid libraries in popular programming languages exist. The number of people willing to experiment with a new Web service is low to begin with - forcing them to develop their library beforehand is pointless.

6.  **No Limit on Usage.** This is where a lot of Web services simply don't get it. I won't name names, but they know who they are. reCAPTCHA allows essentially unlimited use of their service - it's just part of the design. reCAPTCHA does make the reasonable request to "be contacted beforehand if you expect your site to constantly need more than 100,000 reCAPTCHAs solved per day." No access limit means developers can build scalable Web applications based on reCAPTCHA with confidence.

In the end, building a successful Web service that people will gladly tell their friends isn't complicated. It's just a matter of building value and trust.

One more thing. I'm currently using reCAPTCHA on this site in the comments section. There are probably still some browser-specific kinks to work out. If you're so inclined, I would be grateful for a short comment describing your experience, along with your browser and OS.
