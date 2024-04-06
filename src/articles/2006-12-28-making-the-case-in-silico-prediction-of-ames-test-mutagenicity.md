---
title: "Making the Case: In Silico Prediction of Ames Test Mutagenicity"
published: "2006-12-28T00:00:00.000Z"
---

> The two models (SAm and AIm) and the RHC [robust hybrid classifier] were implemented in C++ using OpenBabel 1.100.2 libraries (<a href="http://openbabel.sourceforge.net/wiki/Main_Page">http://openbabel.sourceforge.net/wiki/Main_Page</a>).
>
> The AI model (AIm) is based on the LAZAR system (<a href="http://www.predictive-toxicology.org/lazar/index.html">http://www.predictive-toxicology.org/lazar/index.html</a>) developed by C. Helma...
>
><cite>[Paolo Mazzatorta, Li&ecirc;n-Anh Tran, Beno&icirc;t Schilter, and Martin Grigorov](http://dx.doi.org/10.1021/ci600411v)</cite>

Yet another appearance of Open Source software in the primary cheminformatics literature comes by way of <a href="http://dx.doi.org/10.1021/ci600411v">a paper from Mazzatorta, Tran, Shilter, and Grigorov</a> of the Nestl&eacute; Research Center. This work employs two Open Source libraries: <a href="http://www.predictive-toxicology.org/lazar/index.html"><code>lazar</code></a>, a tool for the prediction of toxic properties of chemical structures; and <a href="http://openbabel.sf.net">Open Babel</a>, a widely-used, low-level library for cheminformatics. <code>lazar</code>, in turn, is based on both Open Babel and the <a href="http://www.gnu.org/software/gsl/">GNU Scientific Library</a> (GSL), a numerical library. Unfortunately, the Nestl&eacute; authors don't indicate whether the source code for their system is publicly available. Nevertheless, their work gives a taste of the kinds of synergies that inevitably develop through the the use of Open Source software.