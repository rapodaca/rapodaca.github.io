---
title: "PerlMol: A Case Study in Open Source Cheminformatics Software"
published: "2007-11-15T00:00:00.000Z"
---

How does open source software happen? Although many factors come into play, the majority of answers seem to revolve around a simple theme: developers building solutions to fill their own needs. Yet only a fraction of these solutions end up becoming open source software. And only a fraction of those end up being used by a wider audience. What's the key ingredient? There's still a lot to learn from studying individual cases.

Readable discussions about the origins of specific open source projects are pretty rare, but those dealing with the origins of open source cheminformatics software are more uncommon still. So it was with great interest that I came across [Ivan Tubert-Brohman's account](http://www.ddj.com/web-development/184416118) of how [PerlMol](http://www.perlmol.org/) was created.

PerlMol is an open source "collection of Perl modules for cheminformatics and computational chemistry." Many software packages fit into this category, and some of them are open source, so why write another? For Tubert-Brohman, the deciding factor was being able to work in his preferred environment, Perl:

> I was surprised that CPAN \[[The Comprehensive Perl Archive Network](http://www.cpan.org/)\] was sorely lacking in terms of modules for chemistry. The only available modules were Chemistry::Element, which allows you to convert between atomic number, element symbol, and element name and store other elemental information; and Chemistry::MolecularMass, which calculates the mass from the molecular formula. There were no modules that actually dealt with the structure of molecules. While some of the options in other languages are not bad, I was looking for something with the simplicity and conciseness of Perl that could allow me to write "chemical one-liners" to solve small problems very quickly, without having to compile anything. Hence, PerlMol was born.

The elimination of the need to compile, and relaxed syntaxes that promote succinct code are two of the biggest reasons to try a [cheminformatics scripting environment](/articles/2006/11/14/eleven-free-cheminformatics-scripting-environments).

There's a lot of great software still to be written in cheminformatics, and some of it will be open source. Although open sourcing that side project you've been working on may not be the best option for your career or your company, studying case studies like that of PerlMol gives plenty of food for thought.