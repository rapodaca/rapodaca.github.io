---
title: "Chemical Nomenclature Translation"
published: "2006-09-10T00:00:00.000Z"
---

>... We report here the development of a computer program for converting chemical names into connection tables, a process we call "nomenclature translation." ... this process provides an alternate method of structure registration by allowing a new substance to be input <em>via</em> a structurally descriptive systematic name instead of only as a connection table taken from a structural diagram.
>
><cite>[G.G.V. Stouw et al.](http://dx.doi.org/10.1021/c160055a009)</cite>

Systematic nomenclature is one of the oldest forms of <a href="/articles/2006/08/18/107-years-of-line-formula-notations-1861-1968">line notation</a>.  As a result, it can be found widely in papers, patents, spreadsheets, and other documents. Any software that can convert systematic nomenclature, such as IUPAC names, into a computer-based representational system, such as a connection table, has the potential to unlock vast amounts of <a href="/articles/2006/09/03/peculiarities-of-chemical-information">legacy chemical information</a> by making it structure-searchable.

Stouw and his group at Chemical Abstracts Service (CAS) developed the first working system for name to structure conversion. Their interest in an automated process stemmed from the potential to greatly accelerate the rate at which the chemical literature could be indexed. Instead of a human creating a computer representation by manually parsing a systematic name from a paper, a computer could do it error-free at a fraction of the cost. These factors are still at work today, although the pool of raw chemical information material has increased exponentially since 1974.

Nomenclature translation has been more widely investigated than the related problem of <a href="/articles/2006/08/25/computational-perception-and-recognition-of-digitized-molecular-structures">2-D raster image interpretation</a>, although the driving forces in both cases are the same. There are, of course, several proprietary packages for nomenclature translation. An important disadvantage of all of them is a distinct lack of customizability.

Open source nomenclature translation options have been very limited. One of the first such packages was <a href="http://chemnomparse.sourceforge.net/index.php">ChemNomParse</a> by David Robinson, Bhupinder Sandhu, and Stephen Tomkinson at the University of Manchester. ChemNomParse has since been <a href="http://cdk.sourceforge.net/api/org/openscience/cdk/iupac/parser/package-summary.html">made part of</a> the <a href="http://cdk.sf.net">Chemistry Development Kit</a> (CDK). Although its capabilities are relatively limited, ChemNomParse is very useful for the design it embodies.

More recently, <a href="http://wwmm.ch.cam.ac.uk/blogs/corbett/">Peter Corbet</a> at Cambridge has developed a package called OPSIN. Egon Willighagen wrote about <a href="http://chem-bla-ics.blogspot.com/2006/09/chemical-archeology-oscar3-to.html">integrating OPSIN</a> into the desktop software package <a href="http://bioclipse.net/">Bioclipse</a>. OPSIN's source can be found in the <a href="http://svn.sourceforge.net/viewvc/oscar3-chem/trunk/src/uk/ac/cam/ch/wwmm/opsin/">project's SVN repository</a>.

The most exciting potential for chemical nomenclature translation is realized when this capability is blended with other chemical informatics technologies. Future articles in this series will show how ChemNomParse and OPSIN can be used with other open source tools to create rich chemical informatics systems.