---
title: "JavaScript for Cheminformatics: An Introduction to WebSpex, a Spectroscopy Tool for the Internet"
published: "2008-07-17T00:00:00.000Z"
---

The [previous article](/articles/2008/07/15/javascript-for-cheminformatics) in this series discussed the untapped potential of JavaScript for building rich, chemistry-oriented Web applications. This article will describe the design of WebSpex, a spectrum viewer designed for the Web and written entirely in JavaScript.

# Warning: Potential Vaporware Ahead

WebSpex can't yet be download or deployed, and it may never be finished. Articles like this one will document the tool's transition from concept to hopefully something more substantial. There may be false-starts and dead-ends along the way. But I'm hoping that there will also be feedback from readers like you. Feel free to chime in, regardless of your background.

This process will be necessarily non-linear. But I believe that being able to incorporate feedback in real-time increases the chances of creating a better product, and seeing mistakes, false-starts, and dead-ends in context can be useful to everyone.

# The Problem

Of all the forms of chemical data generated in labs around the world today, spectra are one of the most common. Although several tools can display and manipulate these data, few are capable of being used on the Web. If you agree with the hypothesis that the Web is fast becoming the only information exchange platform that matters, this presents a significant problem (or [opportunity](/articles/tag/broken), depending on your perspective).

Recently, a series of articles on the Web-based spectroscopy tool [JSpecView](/articles/2008/02/01/hacking-jspecview-enhancing-the-user-interface) appeared here. JSpecView is one of the only free tools currently available that enables spectra to be displayed and manipulated on the Web.

JSpecView is written in Java and deployed as an applet. In very many situations, applets are the best technology for delivering interactive Web content of the kind required by spectroscopy.

But no technology is perfect. One of the biggest limitations of applets is that they require the correct version of the Java plug-in to be installed on a users' machine (a limitation shared by all plug-in technologies, including [Flash](/articles/2008/06/10/adobe-flash-for-cheminformatics-fast-scalable-and-attractive-2d-depiction-of-chemical-structures-with-vector-graphics)). In situations where users either can't or won't install the plugin, or in which adequate resources are not available to ensure [smooth applet deployment](/articles/2008/03/12/demystifying-java-applets-part-3-failing-gracefully-when-your-users-dont-have-java), Java applets may not be the best technology platform.

What if there were a [spectroscopy tool](/articles/2007/12/20/if-you-want-to-change-the-world-build-the-tool-first-part-2) that worked on any browser without any plugin dependencies?

# Scenarios

For a better idea of what WebSpex will be about, consider some scenarios:

**Viewing** Sally logs into her research group's spectroscopy archive website. She clicks on the link to her most recently-collected IR spectrum and is taken to a page displaying an image of her spectrum along with textual metadata.

**Zooming** Fred is viewing an IR spectrum published on a chemical supplier's Website. Wanting a better view of the fingerprint region, he uses the mouse to zoom the spectrum.

**Peak Picking** Victor is using a publisher website to view the IR spectrum of a compound described in a recent paper. Wanting to match the carbonyl stretching frequency of the material he prepared, he uses the mouse to pick the peak.

# Data

WebSpex will use as its input format [JCAMP-DX](http://dx.doi.org/10.1351/pac199163121781), the de facto standard for spectral data encoding. Although JCAMP-DX has been extended in many ways over the last several years, for now the goal of WebSpex will be to simply read and display [error-free examples](http://wwwchem.uwimona.edu.jm:1104/spectra/testdata/index.html) of the original format specification.

# Conclusions

Good Web-based spectroscopy tools are a prerequisite for the open sharing of this important form of experimental data. WebSpex could fill this need by providing an installation-free tool that can be used in any browser without plugins. Currently consisting of nothing more than just some ideas, WebSpex successes and failures will be documented here in several installments.
