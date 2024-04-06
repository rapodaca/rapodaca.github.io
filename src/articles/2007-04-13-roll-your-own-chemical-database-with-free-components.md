---
title: Roll Your Own Chemical Database With Free Components
published: "2007-04-13T00:00:00.000Z"
---

Are you thinking of building a [free chemical database](http://depth-first.com/articles/2007/01/24/thirty-two-free-chemistry-databases) but would rather not rent and maintain a bunch of proprietary software components? [Norbert Haider](http://merian.pch.univie.ac.at/pch/nh_info.html) has thought a lot about this problem and offers some helpful resources to get you started:

-  [Creating a web-based, searchable molecular structure database using free software](http://merian.pch.univie.ac.at/%7Enhaider/cheminf/moldb.html) Step-by step case study
-  [How to create a web-based molecular structure database with free software](http://merian.pch.univie.ac.at/%7Enhaider/cheminf/moldb.pdf) A presentation
-  [checkmol/matchmol](http://merian.pch.univie.ac.at/%7Enhaider/cheminf/cmmm.html) Open source command-line utility for 2D (sub)structure matching
-  [mol2ps](http://merian.pch.univie.ac.at/%7Enhaider/cheminf/mol2ps.html) Command-line utility for converting molfiles into Postscript files

Haider's system can be deployed on commodity hardware running open source operating systems. In other words, the cost of setting up a system like the one he describes is practically zero.

Creating and open sourcing your own custom components is one way to go. Building on top of existing open source tools like [CDK](http://cdk.sf.net), [Open Babel](http://openbabel.sf.net), [Octet](/articles/tag/octet) and [JOELib](http://joelib.sf.net) is another.

Haider's work raises an interesting question. Has anyone assembled a complete, ready to install general purpose chemical database package built from open source components? It for no other reason, such an exercise would give an excellent idea of what [the dogfood tastes like](/articles/2007/01/03/open-source-and-open-data-why-we-should-eat-our-own-dogfood).