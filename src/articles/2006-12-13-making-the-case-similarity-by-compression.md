---
title: "Making the Case: Similarity by Compression"
published: "2006-12-13T00:00:00.000Z"
---

>...The structures were converted to SMILES format and canonicalized using a program written with the open-source Java cheminformatics library JOELib2. ... To conclude, we have demonstrated that SMILES strings and compression programs are a simple, yet powerful method for similarity searching, competitive with state-of-the-art-techniques. The Ruby scripts used to carry out the experiments described in this paper are available for download from <a href="http://comp.chem.nottingham.ac.uk/download/zippity/">http://comp.chem.nottingham.ac.uk/download/zippity/</a>.
>
><cite>[James Melville, Jenna Riley, and Johathan Hirst](http://dx.doi.org/10.1021/ci600384z)</cite>

Yet another appearance of Open Source software in the literature comes by way of a paper from Melville, Riley, and Hirst. This work takes advantage of the alphabet-like nature of SMILES strings and widely-available compression algorithms to perform molecular similarity analyses. Not only does this work use the Open Source <a href="http://www-ra.informatik.uni-tuebingen.de/software/joelib/">JOELib</a> library but the authors have made the Ruby scripts that perform the similarity analysis <a href="http://comp.chem.nottingham.ac.uk/download/zippity/">freely available</a> under the same terms as Ruby (<a href="http://www.ruby-lang.org/en/LICENSE.txt">Ruby's license</a> or the <a href="http://opensource.org/licenses/gpl-license.php">GPL</a>).

The times they are <a href="/articles/2006/10/13/making-the-case">a-changein'</a>.