---
title: "Making the Case: Personal Chemistry Client"
published: "2007-01-19T00:00:00.000Z"
---

Good software designed with chemists in mind is still quite rare, and when that software is Open Source it's even rarer still. Two very popular titles are <a href="http://jmol.sourceforge.net/">Jmol</a> and <a href="http://pymol.sourceforge.net/">PyMol</a>. A third, <a href="http://www.bioclipse.net/">Bioclipse</a>, is gaining in popularity. So it was with great interest that I came upon a company called <a href="http://www.akosgmbh.de/">AKos Consulting &amp; Solutions</a>, and their Open Source application <a href="http://www.akosgmbh.de/pcc/">Personal Chemistry Client</a> (PCC).

![Personal Chemistry Client](/images/posts/20070119/screenshot.png "Personal Chemistry Client")

PCC, as best as I can tell, is designed to be a personal chemical database. The good news is that PCC is licensed under the <a href="http://opensource.org/licenses/gpl-license.php">GNU General Public License</a>. The bad news is that PCC also requires two important things from your computer:

- A system capable of running the Microsoft .NET 2.0 Framework. The framework itself is included with the download. Unfortunately, this requirement rules out running PCC on Linux or Mac OSX.
- The free (<a href="http://depth-first.com/articles/2006/09/27/hacking-pubchem-free-speech-or-free-beer">as in beer</a>) ActiveX plugin <a href="http://www.hyleos.net/?s=applications&amp;p=ChemView">ChemViewX</a> from <a href="http://www.hyleos.net/">Hyleos</a>. This plugin is also included with the download.

I was able to download, install, and use PCC on my system (Windows XP Home) without a problem. Aside from some confusing behaviors of its template components, the application seems to work as described.

Behind the scenes, PCC uses the <a href="http://cdk.sf.net">Chemistry Development Kit</a> (CDK) for structure searching. It's not clear what rendering engine is used by the ChemViewX plugin. Just looking at the output, though, it may well also be CDK.

The emergence of PCC, an Open Source program developed by a for-profit vendor, is an exciting development. Business models may take some time to solidify, but chemistry clearly offers numerous <a href="http://depth-first.com/articles/2006/09/03/peculiarities-of-chemical-information">peculiarities</a> to take advantage of. And the folks behind PCC are well ahead of the curve.