---
title: Google for Molecules with InChIMatic
published: "2007-02-19T00:00:00.000Z"
---

[InChIMatic](http://inchimatic.com) is a simple Web application that uses Google to perform exact structure searches on the Web. After drawing your structure in the editor window, click the "InChI!" button to get a link. This link takes you to a Google query that displays matches for your molecule. You'll need both Java and JavaScript enabled in your browser to use InChIMatic.

# The Technical Details

The technology at the heart of InChIMatic is the [IUPAC International Chemical Identifier](http://www.iupac.org/inchi/) (InChI). An InChI is an alphanumeric string that uniquely identifies a molecular structure. By converting molecular structures to text, InChI makes it easy to use standard Internet tools to do exact structure searches.

The earliest reference in the peer-reviewed literature to using Google for searching InChIs is contained in a [2005 paper](http://dx.doi.org/10.1039/b502828k). More recently, a service called [QueryChem](http://querychem.com) has taken this idea one step further by using the [Google API](http://code.google.com/) to perform substructure searches based on InChI.

InChIMatic works differently. Unlike a raw Google search, InChIMatic builds a Google query link for you. Unlike QueryChem, InChIMatic doesn't use the Google API and so has none of its restrictions. This does result in a limitation: InChIMatic can only currently be used to for exact structure queries.

The InChIMatic Web application has been discussed in greater technical detail in a [previous article](http://depth-first.com/articles/2006/12/15/anatomy-of-a-cheminformatics-web-application-inchimatic). The rapid Web application development framework [Ruby on Rails](http://rubyonrails.com) made building InChIMatic a snap. InChIMatic is served by the Ruby application container [Mongrel](http://depth-first.com/articles/2007/02/05/mongrel-and-rails-its-just-not-fair), which is hosted on a Linux server running Apache. [Rino](http://depth-first.com/articles/tag/rino) provided the Ruby interface to the [IUPAC/NIST InChI toolkit](http://www.iupac.org/inchi/). The 2-D structure editor is [Java Molecular Editor](http://www.molinspiration.com/jme/) (JME) by Peter Ertl, which is used with his kind permission.

Aside from JME, all components of InChIMatic, from the operating system it runs on to the InChI system itself, are [Open Source](http://opensource.org) software.

# Using InChI to Raise the Visibility of Your Content

InChIMatic returns many Google results for common molecules. But less common, known molecules return no hits at all. Three factors are responsible: (1) Google doesn't index all InChIs on the Internet; (2) few content providers currently use InChI; and (3) there is no standard and convenient mechanism to embed InChIs into Web pages for indexing by Google.

For these reasons, I consider InChI to be bleeding edge technology. Some will find it useful, most will not. Unfortunately, this state of affairs will persist until problems (1) and (3) are solved.

Nevertheless, if you're technically adventurous, InChIMatic offers a relatively painless way to begin incorporating InChIs into your content and verifying that they get indexed. There's no software to download, install, or upgrade. Forget about operating system incompatibilities (hopefully!). Just point your Java-enabled browser to [inchimatic.com](http://inchimatic.com).

Although there's no standard method to encode InChIs in Web pages, some interesting ideas have been put forward. [Egon Willighagen](http://chem-bla-ics.blogspot.com/) has proposed [a system](http://chem-bla-ics.blogspot.com/2006/12/including-smiles-cml-and-inchi-in.html) based on [RDFa](http://www.w3.org/TR/xhtml-rdfa-primer/). Future iterations of InChIMatic may include support for generating scripts and/or markup for including InChIs into blogs and other online content.

# Conclusions

InChI is a complex new technology in need of easy-to-use tools. InChIMatic is one such tool that makes it possible to perform exact structure queries using Google.

One of the exciting things about Web applications is how quickly they can evolve. If in trying out InChIMatic you find something you'd like changed or added, please feel free to <a href="mailto:r_apodaca@users.sf.net">write me</a>.