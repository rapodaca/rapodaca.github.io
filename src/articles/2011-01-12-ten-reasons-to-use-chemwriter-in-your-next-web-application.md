---
title: "Ten Reasons to Use ChemWriter in Your Next Web Application"
disqus: true
published: "2011-01-12T00:00:00.000Z"
---

The Web has vast, untapped potential as a medium for creating and distributing chemical information. One factor that continues to keep chemistry and the Web at arm's length is lack of cheminformatics tools designed specifically for use in Web applications. Tools that embrace the Web's technical capabilities and limitations. Tools designed for ease of use in a Web context. Tools that anticipate the Web's future directions.

With these thoughts in mind, I'm happy to announce the availability of the new [ChemWriter&trade;](), a ground-up rewrite of [my company's](http://metamolecular.com) chemical [structure editor in pure JavaScript](/articles/the-chemical-structure-editor-bridging-chemistry-and-cheminformatics-on-the-web).

# A Little Background

When we began this effort, success was far from certain. There were numerous daunting technical challenges to address. A chemical structure editor is a sophisticated piece of interactive, graphical software incorporating deep domain knowledge. How would we display interactive graphics? How would we get the necessary code into a package less than 200K? What features would we need to sacrifice along the way and how would that effect the user experience? What about performance? How would we deal with legacy browsers? What libraries and toolkits, if any, would we use? How would we ensure code quality with automated tests?

To make a long story short - we were able to solve each and every one of these problems (and many more).

# See For Yourself

I invite you to try ChemWriter for yourself, either through the [online demo](), or by [downloading the SDK](/evaluate). The SDK can be used freely for testing ChemWriter in your own Web applications - and we offer [licensing options](/buy) should you decide to deploy ChemWriter in production.

# Ten Reasons to Use ChemWriter

1.  **No more browser plugins.** ChemWriter requires no browser plugin dependencies. Instead of debugging your users' Java configuration, you have more time to develop your application.
2.  **Internet Explorer Support.** It would have been easy to abandon Microsoft's quirky technology legacy, but we made IE support a priority due to its continued widespread use in industry. The result: ChemWriter runs unmodified and has reasonable performance on IE6 and later.
3.  **Cross-Browser Compatibility.** We've tested (and continue to test) ChemWriter on a wide range of browsers. The same JavaScript file can be used, unmodified, across the board, streamlining your deployment process.
4.  **Styles.** A good chunk of ChemWriter's appearance is determined by the chemwriter.css stylesheet. This file offers fine-grained control over how the editor looks, enabling a better visual match with your site's design.
5.  **API.** We continue to build out the ChemWriter API. This set of functions will make it possible to integrate structure editor behavior into Web documents like never before.
6.  **Tablet/Touch Devices.** Because ChemWriter is implemented without browser plugins, it runs on browsers packaged on emerging new device platforms such as iPad. Using ChemWriter makes it easy to take advantage of the ever-growing capabilities of touch computing devices in chemistry.
7.  **Clean Structures.** ChemWriter uses an advanced, proprietary structure rendering system that ensures chemical structures remain readable regardless of the size they're displayed at.
8.  **Ergonomic.** Chemists demand a lot from their software and we continue to listen to them. ChemWriter's UI was designed to make sense to chemists familiar with other drawing tools. And we've added our own improvements to make drawing structures as fast and precise as it can be. Our fixation on creating the best structure editor UI leaves one less thing for you to worry about.
9.  **Academic/Nonprofit Licensing Options.** We encourage the development of public-facing chemical information resources by academic institutions and nonprofit organizations. [Contact us](/buy) for free licenses.
10.  **Easy to Get Started.** [The ChemWriter SDK](/evaluate) contains everything you'll need to start creating structure-enabled pages today.



