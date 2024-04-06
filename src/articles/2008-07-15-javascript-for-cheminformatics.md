---
title: JavaScript for Cheminformatics
disqus: true
published: "2008-07-15T00:00:00.000Z"
---

Regular readers of this blog know that one of its recurring themes is the convergence of Web technologies and chemical information. Although several articles describe how [Ruby](/articles/tag/ruby) and [Java](/articles/tag/java) can be applied to cheminformatics, one language has never been featured: JavaScript. JavaScript is both the default language of the Web client, and a language of growing importance [elsewhere](/articles/2007/05/25/flex-rich-internet-applications-and-cheminformatics). This article, the first in a series, introduces JavaScript as a tool for creating rich, chemically-oriented Web applications.

# Surely You Jest

If your last exposure to JavaScript was in the 1990s, a lot has changed for the better. Most importantly, performance has increased considerably, making possible JavaScript software of considerable complexity. A growing collection of well-crafted libraries such as [Prototype](http://www.prototypejs.org/) and [Scriptaculous](http://script.aculo.us/) now make it possible to focus precious developer effort at a higher level of abstraction. Although cross-browser compatibility continues to be an issue with browser-specific features, the JavaScript language itself is now remarkably stable and consistent across browsers and platforms.

JavaScript will obviously never enjoy the performance of Java or C++, and it would be a mistake to assume otherwise. The key is to focus on what JavaScript can do that no other language or platform can. With this thought in mind, it's interesting to speculate on the role JavaScript could play in developing Web-based software for chemistry.

For example, with essentially complete read-write access to the document object model (DOM) of sites on which they're active, tools based on JavaScript have great potential to enhance static content with content created either on a server or locally.

As another example, consider the combination of JavaScript and an invisible Java applet. Java-JavaScript communication is possible in all browsers through [LiveConnect](http://developer.mozilla.org/en/docs/LiveConnect), which can be used to offload computation-intensive operations from JavaScript to an applet. In many ways, this approach to development on the client resembles the approach, discussed here many times, of using Java from Ruby through [Ruby Java Bridge](/articles/tag/rjb) (RJB) or [JRuby](/articles/tag/jruby).

Ultimately, JavaScript is the only programming language that allows cross-browser, client-side software to be written independently of a plugin. This may not sound like a big deal, but for many developers and organizations, Flash, Java, and other plugin technologies are [less than ideal](http://www.javaworld.com/javaworld/jw-05-2008/jw-05-applets.html?page=2).

# What's Known?

There are currently only scattered examples of the use of JavaScript in chemistry, an indication that either the field is ready for this idea, or that it will never work.

Perhaps the two best-known examples of JavaScript applied to chemical informatics are the [WebME](/articles/2006/11/09/look-ma-no-applets) and [PubChem](http://pubchem.ncbi.nlm.nih.gov/edit/) chemical structure editors. Although remarkable accomplishments, both packages rely heavily on server back-ends for processing and analysis of chemical structures. The JavaScript code serves mainly to asynchronously pass low-level mouse events to the server, which then asynchronously passes a raster image back to the client. To an extent, the back and forth degrades the responsiveness of these tools.

[The Blue Obelisk](http://blueobelisk.sourceforge.net/wiki/Main_Page) maintains a Wiki page discussing some of the uses of [Greasemonkey scripts in chemistry](http://blueobelisk.sourceforge.net/wiki/Using_Javascript_and_Greasemonkey_for_Chemistry). Greasemonkey is a wonderful tool for augmenting existing Websites, and these scripts do some remarkable things, but they don't fall into the category of cross-browser, installation-free, general-purpose tools.

Recently, [Robert Hanson](http://www.stolaf.edu/people/hansonr/) discussed [on-demand Javascript](http://chemapps.stolaf.edu/jmol/presentations/bcce19/hansonr-bcce19-ajax.ppt) as a potential tool for building chemistry-oriented Web applications. Although the proposal contains many important points, it has to my knowledge not been followed up with the release of code.

An early compilation of resources can be found [here](http://www.ch.ic.ac.uk/java/), although all of the listed sites have since either disappeared or converted to other content.

Poking around the Web, it's possible to find many examples of one-off chemistry tools created in JavaScript. For example, [this page](http://chemistry.about.com/od/periodictables/l/bljavaperiodictable.htm) contains a JavaScript-enabled periodic table. Useful as tools like this may be, they're not general-purpose solutions designed to create a platform for further work.

# What Would Be Most Valuable?

There are many cheminformatics tools that could be built in JavaScript. But to be of the greatest value, a tool should be usable in a variety of contexts. And it should serve as a platform on which more complex software can be built. Even more importantly, the tool should fix something that really is [broken](/articles/tag/broken).

We might begin by asking: what makes chemical information difficult to work with in the greatest number of cases?

Since the earliest days of chemistry and computers, [it has been clear](/articles/2006/09/03/peculiarities-of-chemical-information) that one of the distinguishing characteristics of chemical information is the central role played by chemical structures and the difficulty in accurately representing and processing them on machines.

So, one answer to the question of what would be the most useful JavaScript tool for cheminformatics could be: a low-level cheminformatics toolkit that understands chemical structures and their associated graph operations.

Another possibility: the handling of NMR, IR, UV, and mass spectra. [JSpecView](/articles/tag/jspecview) is a good first choice, but it may be possible to build a pure JavaScript tool for interactively viewing and manipulating spectra, if a low-level toolkit for processing [JCAMP-DX](http://old.iupac.org/standing/cpep/wp_jcamp_dx.html) were available.

Would the performance and usability of such toolkits be high enough to make them a serious choice for use in chemistry-driven Web applications? What would the availability of such a toolkit enable that is currently difficult or impossible?

# Conclusions

JavaScript is the default programming language of the Web client, offering a great deal to creators of chemically-oriented applications. One of the biggest barriers to using JavaScript for this purpose is the lack of key developer tools. Future articles will explore this idea.

