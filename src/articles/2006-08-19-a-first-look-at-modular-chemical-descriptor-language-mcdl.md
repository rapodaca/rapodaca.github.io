---
title: "A First Look at Modular Chemical Descriptor Language (MCDL)"
published: "2006-08-19T00:00:00.000Z"
---

>The Modular Chemical Descriptor Language (MCDL) was developed to address the need for linear representation of structural and other chemical information for chemical databases, E-journals and the Internet.
>
><cite>[Andrei A. Gakh and Michael N. Burnet](http://dx.doi.org/10.1021/ci000108y)</cite>

Molecular line notations reduce a molecular structure to a string of ASCII characters. This is helpful in a variety of situations: as a method of text-based structure input; as a compact representation that can be stored and transmitted over a network; and in some cases as a method for uniquely identifying a molecular structure. The development of line notations is one of the <a href="/articles/2006/08/18/107-years-of-line-formula-notations-1861-1968">oldest</a> pursuits in chemical informatics.

MCDL has a lot in common with <a href="http://www.iupac.org/inchi/">InChI</a>. Both languages are modular in the sense that succeeding levels of structural complexity are represented by individual “modules” (MCDL) or “layers” (InChI): constitution; connectivity; and stereochemistry. Both languages sport free developer toolkits written in C (the InChI toolkit, and LINDES, respectively).  Interactive structure-drawing tools even exist for both languages (the interactive MCDL tool was <a href="http://sourceforge.net/projects/mcdl">recently released</a>).

MCDL and InChI also differ in some significant ways. One of the biggest differences is that InChI separates hydrogen atoms and their parent atoms into separate layers, whereas MCDL places hydrogen atoms together with the atom to which they are attached. Another difference is in the approach to canonicalization. InChI uses a relatively <a href="/articles/2006/08/12/inchi-canonicalization-algorithm">complex system</a> not unlike that of <a href="http://dx.doi.org/10.1021/ci00062a008">canonical SMILES</a>. In contrast, MCDL uses a simpler system based on ASCII lexical ordering of atom types. On the non-technical side, InChI carries the endorsement of <a href="http://www.iupac.org/">IUPAC</a>, whereas MCDL is the work of independent developers.

MCDL and InChI approach the problem of developing an internet-ready line notation from different angles. It will be interesting to see how each evolves.