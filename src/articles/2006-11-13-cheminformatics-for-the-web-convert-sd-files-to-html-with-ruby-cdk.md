---
title: "Cheminformatics for the Web: Convert SD Files to HTML with Ruby CDK"
published: "2006-11-13T00:00:00.000Z"
---

The Structure Data File (SDF) format is the de facto standard for cheminformatics data exchange.  One of the problems that arises when working with SD Files, especially large ones like those distributed by <a href="http://pubchem.ncbi.nlm.nih.gov/">PubChem</a>, is "seeing" the structures they contain. Although commercial software packages are available for doing so, they are generally closed, unreasonably expensive, or overly complex. This article describes a simple solution to the SDF visualization problem that uses Open Source tools controlled from the elegant and agile <a href="http://www.ruby-lang.org">Ruby</a> programming language.

# Cut to the Chase

[This page](/images/posts/20061113/index.html) shows the output produced by the software. You'll see a neatly arranged grid of colorful 2-D chemical structures in a Web page that was generated directly from a PubChem <a href="/articles/2006/09/29/hacking-pubchem-direct-access-with-ftp">SDFGZ file</a>. Each structure has a number below it, the PubChem Compound ID (CID). Both the structure and CID are hyperlinked to the Compound Summary page on PubChem. A partial screenshot is provided below.

![SDFGZ](/images/posts/20061113/screenshot.png "SDFGZ")

# Prerequisites

For this tutorial, you'll need <a href="/articles/2006/10/30/agile-chemical-informatics-development-with-cdk-and-ruby-rcdk-0-3-0">Ruby CDK</a> (RCDK). A <a href="/articles/2006/09/25/cdk-the-ruby-way-rcdk-0-2-0">recent article</a> described the small amount of system configuration required for RCDK on Linux. Another article showed how to <a href="/articles/2006/10/12/running-ruby-java-bridge-on-windows">install RCDK on Windows</a>.

# Download the Software

The software described in this article can be <a href="http://rubyforge.org/frs/download.php/14636/sdf-ripper-0.0.1.tar.gz">downloaded here</a>. Inflate this file and make it your working directory. You should see a 14 MB SDFGZ file, a RHTML template, and three Ruby files.

# Ripping PubChem SD Files

The software is designed to work with PubChem <a href="/articles/2006/09/29/hacking-pubchem-direct-access-with-ftp">SDFGZ files</a>. The SDFGZ format simply results from the application of the gzip compression algorithm to an ordinary SD file.

Ripping the example SDFGZ file is just a matter of running `test.rb`:

```bash
ruby test.rb
```

You'll see some output indicating that various CIDs are being processed. On completion, the software has created a directory called `rip` containing a HTML file and an images directory.

# The Little Engine That Could: CDK's StructureDiagramGenerator

If you've ever worked with PubChem's SD Files, you'll no doubt have noticed that the molfile section encodes all hydrogen atoms, which is not general practice. Rendering these hydrogens results in a very cluttered image.

To solve this problem, the software creates its graphics from the <code>PUBCHEM_OPENEYE_CAN_SMILES</code> field encoded by the SDFGZ file. This SMILES string is converted into a molecular representation and coordinates are assigned by CDK's <code>StructureDiagramGenerator</code>.

When an image can't be rendered in this way, it is left out. This was done for CIDs 18, 115, 147, 148, 222, and 223, for example. There are three common themes in these missing structures: metals, phosphorous, and molecules with a single heavy atom. The problem may, in fact, lie in the underlying Structure-CDK software, rather than with CDK. Stay tuned for more on this.

# PubChem for Debugging

In developing this SD File Ripper program, I realized that it could be used as a powerful debugging tool. Notice how the missing structures (and their SMILES strings) can easily be examined via PubChem by clicking the empty cell. The alternative would have been for the program to spit out a list of SMILES that didn't process properly and to then try to construct a mental image of what this string represents. With PubChem, we do away with this tedium altogether.

I doubt the creators of PubChem envisioned this application of their work. Surely it's but one of many still to be discovered.

# Another Cool Thing About Ruby: eRuby Templates

Our SDF Ripper program creates HTML output, something for which Ruby is well-suited through its eRuby ERB library. Among other uses, ERB enables Ruby code to be embedded within HTML. This inside-out scripting capability resembles that of other templating languages such as PHP, ASP, and JSP (ERB is used extensively by the <a href="http://www.rubyonrails.org/">Ruby on Rails</a> web application framework). The file `template.rhtml` contains the rippers's ERB template. The separation of program logic from presentation makes it very simple to customize the appearance of the output.

# Room to Grow

Our SDF Ripper only works with SDFGZ files from PubChem. The program is short enough that it should be simple to adapt it for your specific needs. It would not be much work at all, for example, to create an HTML table containing all fields encoded by the SDFGZ file. Similarly, adding support for non-compressed SD files is straightforward. If JavaScript is your medium, the possibilities become even more interesting. How about a pop-up menu showing an enlarged structure and data summary, <a href="http://netflix.com">a la Netflix</a> when the user mouses over an image?

Paging is a technique that divides large Web pages into smaller pages linked to one another. For example, Google's search results are divided into groups of ten by default. Adding paging support to the software described here would also not be difficult, and would enable the convenient browsing of much larger datasets.

# Other Software That Does This

I am aware of no product, commercial or otherwise, that performs the SDF to HTML conversion in the way shown here. <a href="http://scitegic.com">SciTegic</a> does offer an <a href="http://www.scitegic.com/products/reporting/">HTML table component</a> as part of its <a href="http://www.scitegic.com/products/overview/">Pipeline Pilot</a> framework, but as far as I know, no standalone version is available.

<a href="http://cheminfo.informatics.indiana.edu/~rguha/">Rajarshi Guha</a>, among his many other interesting projects, has written a <a href="http://cheminfo.informatics.indiana.edu/~rguha/code/java/#draw2d">Java SDF to PDF convertor</a> that uses CDK.

# Conclusions

This article has demonstrated how the combination of RCDK and Ruby makes short work of converting the contents of an SD file into a Web-ready format. As usual, we've only scratched the surface of what's easily within reach. Watch for future articles to build on the concepts outlined here.