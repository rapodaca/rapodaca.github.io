---
title: "Dispelling Open Source Confusion: An Introduction to Licenses"
published: "2006-12-29T00:00:00.000Z"
---

> Selecting an open-source license is a minefield for which few are prepared when they need to be. There are a plethora of licenses under which open-source software can be released. Selecting a license at the initiation of a FOSS [Free and Open Source Software] project is likely to be a low priority, as there is no initial value to the project. Without a line of source code written, wading through the legalese and nuances of distribution licenses seems unimportant. In reality, the irrevocable nature of the license makes this the most critical time if authors wish to eventually exercise control over derivative works. ... Unfortunately, even the most carefully selected and restrictive license may not afford complete protection from unanticipated and undesired uses.
>
><cite>[Matthew T. Stahl](http://dx.doi.org/10.1016/S1359-6446(04)03364-1)</cite>

Few subjects cause as much confusion and as many heated debates as Open Source licensing. The <a href="http://opensource.org/">Open Source Initiative</a> has approved <a href="http://opensource.org/licenses/">over 50 licenses</a> compatible with their ten-point definition of "Open Source". Whenever that many solutions to a problem exist, it's a sure sign that one size does not fit all. In this article, I'll introduce some of the key concepts in Open Source licensing.

# Disclaimer

There is a phrase used so often in discussing the legal aspects of Open Source software that it has its own acronym: I Am Not A Lawyer (IANAL). Clearly IANAL, and chances are that you are not one either. Yet the very acts of writing and using Open Source software require basic familiarity with licensing terms and concepts. My aim in this article is not to provide legal advice, but rather to relate what I've found useful in trying to understand Open Source licensing for my own work. When in doubt, hire a lawyer.

# One Good Book

The best writing on the subject of Open Source licensing I've read can be found in the book <em>Open Source Licensing</em> by Lawrence Rosen. An intellectual property attorney, Rosen also served as general counsel and secretary of the Open Source Initiative. His book is remarkably clear and easy to read. If you'd rather not <a href="http://www.amazon.com/gp/product/0131487876?ie=UTF8&amp;tag=depthfirst-20&amp;linkCode=as2&amp;camp=1789&amp;creative=9325&amp;creativeASIN=0131487876">pay for a hardcopy</a>, it can be <a href="http://www.rosenlaw.com/oslbook.htm">viewed in its entirety online</a>.

# The Good News

Fortunately, all Open Source licenses share some common features, if you know what to look for. For example, most licenses can be divided into one of two major categories:

- **Academic Licenses** These licenses, named for their original use in universities, allow unlimited freedom to distribute binaries based on altered source code without making these changes public.  Examples of widely-used academic licenses include the Apache License, the BSD License, and the MIT License.
- **Reciprocal Licenses** These licenses require, to varying degrees, the developer of a derivative work to release his or her modifications to the public <em>if their work is distributed</em>. The question of what constitutes a "derivative work" varies from license to license, but most generally involves the modification of the files of a software package. Examples of widely-used reciprocal licenses include the GNU General Public License (GPL), the GNU Lesser General Public License (LGPL), the Mozilla Public License (MPL), and the Common Public License (CPL).

# The Importance of Copyright

A frequently-encountered misconception equates Open Source licensing with release into the "public domain." Nothing could be further from the truth. The difference is in the ownership of copyright.

Software in the public domain has no owner. All enjoy unrestricted freedom to copy and otherwise use public domain software. A well-known example is David Megginson's <a href="http://www.saxproject.org/copying.html">SAX XML toolkit</a>. Megginson, by placing his software in the public domain has forfeited all rights to control how his work is used. Sun Microsystems <a href="http://java.sun.com/j2se/1.5.0/docs/api/org/xml/sax/package-summary.html">incorporated SAX</a> into their Java Development Kit without any obligation to Megginson whatsoever. SAX is not Open Source software; it is <em>public domain software</em>.

In contrast, software distributed under an Open Source license remains the intellectual property of the copyright owner. The license is simply a mechanism for the software's creator to give some (or all) of their rights to a licensee, usually in exchange for conditions that must be met. Ownership remains with the creator, who is free do distribute his or her work simultaneously under commercial and Open Source licenses if they so desire.

As you can see, copyright gives a license its legal legitimacy. Far from placing software in the public domain, Open Source licenses use copyright law in the same ways as commercial licenses. This is why understanding Open Source licenses is so important for developers and users alike.

# Reciprocity: Share and Share Alike?

Critics of the GPL frequently cite its "viral" nature. The debate essentially boils down to the following paragraph:

> You must cause any work that you distribute or publish, that in whole or in part contains or is derived from the Program or any part thereof, to be licensed as a whole at no charge to all third parties under the terms of this License.
>
><cite>[GPL License](http://opensource.org/licenses/gpl-license.php)</cite>

Like a virus that spreads through replication, the GPL spreads by forcing licensees to release their modifications under the GPL. There are at least two other terms that describe this concept. The <a href="http://www.fsf.org">Free Software Foundation</a> (FSF) uses the term "copyleft." Lawrence Rosen prefers the term "reciprocity" because of its neutral tone and greater descriptive ability. It's the term I'll also use. Reciprocity is such a fundamental concept in the GPL and other licenses that Rosen's book dedicates <a href="http://www.rosenlaw.com/Rosen_Ch06.pdf">an entire chapter to the subject</a>.

Developers distribute their software under reciprocal licenses for a variety of reasons. Two of the most common are:

- To limit "freeloading", or the use of the software by those (typically companies) who contribute nothing back to the developer community.
- To prevent "forking", or the establishment of a competing software package based on the original package.

In reality, Open Source licenses are limited in their ability to prevent either freeloading or forking. For example, provided that a company distributes no modifications to a GPLed package, they are under no obligation to release any of their own source code. Forking happens whenever one or more developers feel strongly enough about a subject to go in a different direction; an Open Source license does nothing to change this.

Given the limitations (and complexities) of reciprocity provisions, one might ask "why bother?". This is an excellent question, the answer to which will depend on your specific goals for your software. And as Stahl points out, the time to make this choice is before a line of code has been written.

# Conclusions

Although Open Source licensing may appear to be a minefield, there is nothing mysterious about it. A lot of good writing is available on the subject, with Lawrence Rosen's book being a prime example. If you plan on creating or using Open Source software, learning the basic ideas behind Open Source licensing is a wise investment.