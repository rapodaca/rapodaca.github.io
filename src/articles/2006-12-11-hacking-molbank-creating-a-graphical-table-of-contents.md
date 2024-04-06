---
title: "Hacking Molbank: Creating a Graphical Table of Contents"
published: "2006-12-11T00:00:00.000Z"
---

<a href="http://www.mdpi.org/">Molbank</a> is an Open Access collection of single-compound articles on synthetic chemistry. Previous articles on Depth-First have highlighted Molbank's practice of including <a href="http://depth-first.com/articles/2006/11/30/molbank-and-the-convergence-of-open-access-open-data-and-open-source-in-chemistry">machine-readable molecular representations of its content</a>, and its very <a href="http://depth-first.com/articles/2006/12/01/hacking-molbank-downloading-a-complete-chemistry-journal">liberal policy on mirroring and robots</a>. In this article, we'll take advantage of both of these features to build something that was left out of Molbank: a graphical table of contents.

# The Graphical Table of Contents (GTOC)

[The Molbank Graphical Table of Contents](/images/posts/20061211/molbank/index.html) (Molbank GTOC) is available online. It consists of a single Web page containing a grid of color 2-D chemical structures representing the contents of Molbank. Each structure is hyperlinked into the Molbank site itself. Clicking on the structure takes you to the complete synthetic procedure and characterization data.

![Molbank](/images/posts/20061211/screenshot_1.png "Molbank")

# Prerequisites, Downloading, and Running

To run this project, you'll need <a href="http://depth-first.com/articles/2006/10/30/agile-chemical-informatics-development-with-cdk-and-ruby-rcdk-0-3-0">Ruby CDK</a>. A recent article described the small amount of system configuration required for <a href="http://depth-first.com/articles/2006/09/25/cdk-the-ruby-way-rcdk-0-2-0">Ruby CDK on Linux</a>. Another article showed how to install <a href="http://depth-first.com/articles/2006/10/12/running-ruby-java-bridge-on-windows">Ruby CDK on Windows</a>.

The complete source code for this project can be <a href="http://rubyforge.org/frs/download.php/15500/molbank-0.0.1.tar.gz">downloaded from RubyForge</a>. A subdirectory called <strong>demo</strong> contains the pre-built final result.

After unpacking the <strong>molbank-0.1.0</strong> archive, the demo application can be run:

```bash
cd molbank-0.0.1
ruby test.rb
```

# Problems, We've Got Problems

Several problems were uncovered while building the Molbank GTOC. This is to be expected with any data produced "in the wild" rather than within the safety of an Ivory Tower. Here are the main categories:


- **Blank Images** The entry for M52 is blank. Checking the <a href="http://www.mdpi.net/molbank/m0052.mol">underlying molfile</a> reveals four instances of bond stereo flags set to "6," a problem common to many of the blank images in the GTOC. According to the Molfile specification, a value of 6 indicates "Down, double bonds," whatever that means. Given that the <a href="http://www.mdpi.net/molbank/m0052.htm">molecules shown in M52</a> only have one possible stereo bond, and that the Molfile specification relies on 2-D coordinates to encode double-bond geometry, an encoding inconsistency or incorrect stereo interpretation may be the cause.
- **Images Containing an "R" Atom Label** Entry M53 shows an "R" group at what should be the carbonyl carbon. <a href="http://www.mdpi.net/molbank/m0053.mol">The underlying molfile</a> contains several less-common entries in the properties block, a common feature of images containing "R" in the GTOC.
- **Molfile not Found** Entry M95 has no associated Molfile because it simply reports errata for other articles. M253-M259, on the other hand, lack molfiles because the articles were "withdrawn before publication." M347 describes a cyclodextrin for which, understandably, no molfile was provided. There are also a couple of cases in which a link to a molfile is provided, but is not available, such as M352.
- **Broken Molfiles** <a href="http://www.mdpi.net/molbank/m0162.mol">The Molfile for M162</a> encodes its line endings as two carriage returns and a newline, giving rise to the appearance of blank lines after data lines. This is something the Molfile specification strictly forbids. Apparently, the underlying CDK molfile reader can only handle one carriage return and a newline. Perhaps the extra return was introduced as the file was copied into and out of text editors on various operating systems in preparation for uploading it to Molbank. Another common problem was binary files being used for molfiles, such as with <a href="http://www.mdpi.net/molbank/molbank2005/m402.mol">M402</a>. These files don't appear to be compressed with either Zip or GZip and their nature is currently unknown.
- **Bogus Molfiles** For reasons I still can't understand, <a href="http://www.mdpi.net/molbank/molbank2005/m407.mol">the Molfile for M407</a> encodes ethylene. So do several other Molbank molfiles. Other common dummy molfiles include toluene, benzene, and ethane.

After cataloging the problems that exist with the Molbank dataset and the software used to mine it, two interesting questions come into focus:

- What can be done to help Molbank fix the most obvious problems in their molfiles and would they accept these improvements?
- How can "real" datasets like Molbank help developers build better cheminformatics software? (a graphical Molfile Debugger Utility would come in handy...)

Clearly, the connection between Open Access, Open Source, and Open Data is very strong and runs very deep.

# Behind the Scenes

The Ruby Molbank GTOC generator works by connecting to the <a href="http://www.mdpi.net">www.mdpi.net</a> server to get its data in real-time. Internally, the software creates a map of the Molbank website so that the molfile (and URL) for any article can be retrieved on demand. Each readable molfile is used to create a 2-D image using <a href="http://rubyforge.org/projects/rcdk">Ruby CDK</a>. As a final step, the <strong>index.html</strong> page is generated, linking the 2-D images to a specific URL for a Molbank article. This file is <a href="http://depth-first.com/articles/2006/11/13/cheminformatics-for-the-web-convert-sd-files-to-html-with-ruby-cdk">produced with eRuby</a> using a previously-described technique.

# Conclusions

Building a Graphical Table of Contents for Molbank is not that difficult given the power of Ruby, and Molbank's forward-thinking attitude toward mirroring and robots. In working on this project, several problems were uncovered, both with Molbank's data, and the software used to mine it.

In some ways, the software described here and its output are less interesting than the larger questions they raise:


- How do scientific journals best serve not only their readers, but developers who want to provide new ways to use the journal?
- How far does copyright extend in scientific publications? For example, are molfiles copyrightable? If so, at what level of detail are they not? If atom coordinates or some other kind of non-essential information is left out, does that change anything?
- In what other practical ways could the connection between Open Source, Open Data, and Open Access be explored?


These and many related questions are waiting just around the corner. As Open Access becomes more viable, both <a href="http://depth-first.com/articles/2006/10/19/disruptive-innovation-in-scientific-publishing-free-journal-management-systems">technically </a> and <a href="http://depth-first.com/articles/2006/10/26/more-open-access-in-the-sciences-metal-based-drugs-and-hindawi-publishing">commercially</a>, look to Open Source and Open Data to provide the synergies that will unlock its true potential.