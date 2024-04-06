---
title: "Decoding IUPAC Names With OPSIN"
published: "2006-10-14T00:00:00.000Z"
---

IUPAC chemical nomenclature is everywhere. It can be found in journal articles, both new and old, on the Web, in databases, on Material Safety Data Sheets (MSDS), in chemical catalogs, and just about anywhere chemical information is found. The rules of this nomenclature are one of the first things taught in Organic Chemistry classes, and entire books are devoted to the subject. Although software for IUPAC nomenclature translation has been researched <a href="http://depth-first.com/articles/2006/09/10/chemical-nomenclature-translation">since the 1970s</a>, it has only become widespread within the last ten years. As is typical, IUPAC nomenclature developer toolkits are closed, proprietary, very expensive, and not customizable - <a href="http://depth-first.com/articles/2006/09/11/visualizing-iupac-names-with-chemnomparse">with one notable exception</a>.

A little software package called OPSIN may be set to change this. Read on to see how you can use OPSIN to begin programatically decoding IUPAC chemical nomenclature today.

# Meet OPSIN

OPSIN is an Open Source Java library for parsing IUPAC nomenclature. Despite its early development status, OPSIN can decode a variety of difficult features in basic IUPAC nomenclature, including bicyclo systems, nested substitution, saturated heterocycles, and a variety of arenes and heteroarenes. OPSIN currently doesn't handle stereochemistry, organometallics, or a variety of other advanced IUPAC nomenclature features.

# Brief Background

OPSIN was written by <a href="http://wwmm.ch.cam.ac.uk/blogs/corbett/">Peter Corbett</a> at the University of Cambridge. Until recently, OPSIN was an integral part of of the innovative chemical data checker <a href="http://www.rsc.org/Publishing/ReSourCe/AuthorGuidelines/AuthoringTools/ExperimentalDataChecker/index.asp">OSCAR</a>. One of the exciting uses of OSCAR is in the <a href="http://wwmm.ch.cam.ac.uk/blogs/murrayrust/?p=59">automated validation</a> of experimental data.

# Getting OPSIN

Recently, OPSIN was factored out of OSCAR. It can now be downloaded as two standalone packages from SourceForge:

<ul>
<li><a href="http://prdownloads.sourceforge.net/oscar3-chem/opsin_0.1.0.zip?download">Source Distribution</a>: Contains the complete OPSIN source code, all library dependencies, all datasets, and an Ant build script.</li>
<li><a href="http://prdownloads.sourceforge.net/oscar3-chem/opsin-big-0.1.0.jar?download">Jarfile</a>: A standalone jarfile containing all library dependencies and data files.</li>
</ul>

# What OPSIN Does

OPSIN accepts an IUPAC name, encoded as a <code>String</code> object, as input and provides a <a href="http://www.xml-cml.org/">Chemical Markup Language</a> (CML) document object model as output. The main point of entry into the library is the <code>NameToStructure</code> class and its two overloaded <code>parseToCML</code> methods.

OPSIN's output is the root node in a <a href="http://www.xom.nu/">XOM</a> XML <code>Element</code> hierarchy. XOM's <code>Element</code> class provides a convenience method, <code>toXML</code> that conveniently prints the text-based XML representation for itself and all <code>Elements</code> below it.

Because its output is pure XML, OPSIN does not depend on any chemical informatics toolkit to do its job. This makes OPSIN ideal for use within larger chemical informatics systems. Provided your software can interpret CML, you should be able to manipulate OPSIN's output in a variety of useful ways.

# What's Next?

Future articles will discuss OPSIN's capabilities and limitations in more detail. As has become customary for Depth-First's tutorials, <a href="http://ruby-lang.org">Ruby</a> and the excellent <a href="http://depth-first.com/articles/2006/10/12/running-ruby-java-bridge-on-windows">Ruby Java Bridge</a> will be used to illustrate the important points.