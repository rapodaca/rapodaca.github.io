---
title: Ruby CDK for Newbies
published: "2007-10-04T00:00:00.000Z"
---

Scripting languages and cheminformatics can be a highly-effective combination. With their relaxed syntax, compilation-free execution, and interactive testing environments, scripting languages offer fast development iteration cycles. And scripting languages' support for manipulating libraries written in other languages can be key in today's heterogeneous cheminformatics software environment.

Although there are many [cheminformatics scripting environments](/articles/2006/11/14/eleven-free-cheminformatics-scripting-environments) to choose from, Ruby offers some important advantages. Number one on the list is the wildly-popular [Ruby on Rails](http://rubyonrails.org) Web development framework. Others worth mentioning include [interactive ruby](http://tryruby.hobix.com/) (irb), the [RubyGems](http://www.rubygems.org/) package manager, the [Rake](http://martinfowler.com/articles/rake.html) build system, the [JRuby](http://jruby.org) Ruby implementation, [RubyForge](http://rubyforge.org), and a host of other productivity-boosters.

A major focus of Depth-First over the last few months has been [Ruby CDK](/articles/tag/rubycdk). This library consists of a thin Ruby wrapper around the open source [Chemistry Development Kit](http://cdk.sf.net) (CDK), [Structure-CDK](/articles/2006/08/28/drawing-2-d-structures-with-structure-cdk), an open source 2D rendering toolkit, and [OPSIN](/articles/tag/opsin), an open source chemical nomenclature parser. A recent comment on Depth-First by [Egon Willighagen](http://chem-bla-ics.blogspot.com/), one of CDK's creators, got me thinking about centralizing this documentation. The following collection of links is a step in that direction.

# Overview and Installation

-  [Agile Chemical Informatics Development with CDK and Ruby CDK 0.3.0](/articles/2006/10/30/agile-chemical-informatics-development-with-cdk-and-ruby-rcdk-0-3-0) Installation of Ruby CDK on Linux.
-  [Running Ruby Java Bridge on Windows](/articles/2006/10/12/running-ruby-java-bridge-on-windows) Special installation instructions for Ruby CDK on Windows.

# Ruby CDK in Its Environment

-  [From IUPAC Nomenclature to 2D Structures with OPSIN](/articles/2006/10/17/from-iupac-nomenclature-to-2-d-structures-with-opsin) OPSIN converts IUPAC nomenclature into molecular representations and is now part of Ruby CDK.
-  [Eleven Free Cheminformatics Scripting Environments](/articles/2006/11/14/eleven-free-cheminformatics-scripting-environments) So many choices, so little time.
-  [Metaprogramming with Ruby : mapping Java Packages Onto Ruby Modules](/articles/2006/10/24/metaprogramming-with-ruby-mapping-java-packages-onto-ruby-modules) Behind the scenes look at a trick used in Ruby CDK.

# Using Ruby CDK

-  [Build a Rails Cheminformatics Application in Thirty Minutes](/articles/2006/11/21/build-a-rails-cheminformatics-application-in-thirty-minutes) First article in a series on building a SMILES Depict application.
-  [Anatomy of a Cheminformatics Web Application: Beautifying Depict](/articles/2006/11/27/anatomy-of-a-cheminformatics-web-application-beautifying-depict) Second article in the series - cleaning up the Depict user interface.
-  [Anatomy of a Cheminformatics Web Application: Ajaxifying Depict](/articles/2006/12/04/anatomy-of-a-cheminformatics-web-application-ajaxifying-depict) Third article in the series - use Ajax to automatically update the Depict drawing.
-  [Cheminformatics for the Web: Convert SD Files to HTML with Ruby CDK](/articles/2006/11/13/cheminformatics-for-the-web-convert-sd-files-to-html-with-ruby-cdk) SD Files are both everywhere and useless by themselves to chemists - why not convert them into HTML and post them to the Web?
-  [Diversity-Oriented Chemical Informatics](/articles/2006/11/15/diversity-oriented-chemical-informatics) CDK is chock-full of nifty little tidbits, like the ability to enumerate all molecules of a given empirical formula.
-  [Scripting Molecular Fingerprints with Ruby CDK](/articles/2006/11/22/scripting-molecular-fingerprints-with-ruby-cdk) To borrow a phrase from a cheminformatics master: "It's just that easy."
-  [Hacking Molbank: Creating a Graphical Table of Contents](/articles/2006/12/11/hacking-molbank-creating-a-graphical-table-of-contents) The intersection of Open Access, Open Source, and rapid application development.
-  [Anatomy of a Cheminformatics Web Application: Structure Cleanup in Java Molecular Editor](/articles/2006/12/18/anatomy-of-a-cheminformatics-web-application-structure-cleanup-in-java-molecular-editor) The structure editor *can* be lean, mean, and still highly functional - just offload resource-hungry features to the server.
-  [From IUPAC Name to Molecular Formula with Ruby CDK](/articles/2007/03/13/from-iupac-name-to-molecular-formula-with-ruby-cdk) [Peter Corbett's](http://wwmm.ch.cam.ac.uk/blogs/corbett/) awesome OPSIN Library plays nice with Ruby CDK.
-  [From InChI to Image with Ruby Open Babel and Ruby CDK](/articles/2007/09/06/from-inchi-to-image-with-ruby-open-babel-and-ruby-cdk) InChIs are not easy to interpret - fortunately, this little library will do it for you.
-  [Easily Calculate TPSA Descriptors from SMILES Strings Using Ruby CDK](/articles/2007/09/19/easily-calculate-tpsa-descriptors-from-smiles-strings-using-ruby-cdk) It just works.
-  [Ruby CDK One-Liners: Create a Molfile with 2D Atom Coordinates from Arbitrary SMILES Strings](/articles/2007/09/20/ruby-cdk-one-liners-create-a-molfile-with-2d-atom-coordinates-from-arbitrary-smiles-strings) Extremely short library for solving a very common cheminformatics problem.
-  [Source Code Documentation in Ruby: RDoc for Ruby CDK](/articles/2006/12/05/source-code-documentation-in-ruby-rdoc-for-ruby-cdk) When all else fails, read the documentation.
