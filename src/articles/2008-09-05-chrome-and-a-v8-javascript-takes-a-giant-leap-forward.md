---
title: "Chrome and a V8: JavaScript Takes a Giant Leap Forward?"
published: "2008-09-05T00:00:00.000Z"
---

Back when I started writing Java software in 1997, the Java Virtual Machine was *slow*. It was so slow that for years, many developers abandoned all hope of using the language for "serious" work once it became clear how much slower it was than C and C++. Eleven years of Moore's Law compounding, and countless JVM optimizations later, Java is so fast today that relative speed is rarely even considered when developing client and server applications.

Today, JavaScript occupies a similar position to that held by Java in 1997: a ubiquitous language with a basically good design that has significant performance issues.

# The Next Big Thing? JavaScript Virtual Machines

This situation may be about to change - radically. Several groups are going to great effort to improve the performance of JavaScript by creating JavaScript Virtual Machines. The most recent entry into this increasingly crowded field is [Google Chrome](/articles/2008/09/02/google-chrome-rethinking-the-browser-as-an-operating-system). Among Chrome's many innovations is the introduction of one of the first [JavaScript Virtual Machines](http://code.google.com/apis/v8/intro.html) (V8) into a production browser. A virtual machine works fundamentally differently from traditional JavaScript interpreters, with the potential for greatly reduced memory requirements and speed increases.

# Put a V8 in Your Browser

How fast is Chrome's V8 engine? We can get an idea by running some benchmarks.

The chart below shows the results of running [Google's V8 Benchmark Suite](http://code.google.com/apis/v8/run.html) (bigger bars mean faster execution):

![Chart](/images/posts/20080904/chart.png "Chart")

As you can see, Chrome leaves both Firefox 3 and IE 7 in the dust, at least according to this benchmark. Another popular benchmark is [SunSpider](http://www2.webkit.org/perf/sunspider-0.9/sunspider.html), where the results are qualitiatively similar; Chrome's execution time surpasses that of IE 7 by over two orders of magnitude.

My system consisted of an Ubuntu Linux machine running a clean install of Windows XP on Sun's excellent virtualization product, [VirtualBox](http://www.virtualbox.org/). Your mileage may vary. Note: it's important to disable Internet Explorer's warning prompt that reads "This page contains a script which is taking an unusually long time to finish. To end this script now, click Cancel." (the presence of which is telling in itself).This can be done by following the [instructions here](http://support.microsoft.com/default.aspx?scid=kb;en-us;175500).

# Conclusions

JavaScript is in the middle of a textbook [Marketplace Disruption](http://en.wikipedia.org/wiki/Disruptive_technology). Just four years ago, few even thought about the language. Today it's the centerpiece of Web interactivity. Perhaps the biggest issue remaining, performance, is now the focus of intense research that is beginning to bear fruit. Many of the key technologies now starting to appear, such as V8, are modular and open source; other browser vendors can adapt them for use in their own products. It's an offer few can afford to refuse.

Sooner than many might have thought possible, JavaScript may stop being viewed as the *slow* language. Then what?
