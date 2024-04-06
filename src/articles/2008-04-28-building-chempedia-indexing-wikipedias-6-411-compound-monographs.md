---
title: Building Chempedia - Indexing Wikipedia's 6,411 Compound Monographs
published: "2008-04-28T00:00:00.000Z"
---

[The Merck Index](http://www.merckbooks.com/mindex/) is one of chemistry's most useful reference works. Organized like an encyclopedia, each entry, or "Compound Monograph," describes a single compound complete with chemical structure, CAS Number, IUPAC name, trivial names, physical properties, and leading primary literature references describing uses. Unlike other chemistry databases, the Merck Index focuses on only those compounds with important industrial, biological, medical, or technical applications.

# What's Wrong with the Merck Index?

Wonderful product though it may be, the Merck Index has some limitations. For starters, online versions are not free. The disadvantages of this access model go well beyond a simple price barrier; it prevents the very thing the Web was designed to promote: linking. Another limitation is the time it takes for new versions to appear, which is typically measured in years. Still another limitation is in the cost of adding entries for niche compounds that may not be suitable for a general audience, a major barrier to exposing [chemistry's long tail](/articles/2007/08/27/the-long-tail-and-chemistry-why-so-many-acs-meeting-talks-are-uninteresting).

# What's Chempedia?

If we wanted to create a free, online service that worked like the Merck Index but which took full advantage of today's powerful collaboration and information technology tools, how could we go about doing so?

This article, the first in a series, discusses [Chempedia](http://chempedia.com), a free, structure-oriented online encyclopedia of useful chemical compounds designed to answer this question.

# Background

The following articles may be useful in understanding Chempedia's approach and underlying technology:

-  [User-Created Compound Monographs on Chempedia.net: Open Sourcing the Collation and Indexing of Chemical Information](/articles/2008/04/17/user-created-compound-monographs-on-chempedia-net-open-sourcing-the-collation-and-indexing-of-chemical-information)
-  [Chempedia.net: Mashing Up PubChem and Wikipedia](/articles/2008/04/04/chempedia-net-mashing-up-pubchem-and-wikipedia)
-  [Wikipedia for Cheminformatics: A Simple Web API for Finding CAS Numbers in Compound Monographs](/articles/2008/04/02/wikipedia-for-cheminformatics-a-simple-web-api-for-finding-cas-numbers-in-compound-monographs)
-  [Thirty-Two Free Chemistry Databases](/articles/2007/01/24/thirty-two-free-chemistry-databases)

# Where to Begin?

One of the first problems we'd face in building a free Web-based version of the Merck Index is where to get the compound monographs.

It turns out that [Wikipedia](http://wikipedia.org) (yes, Wikipedia) hosts a growing collection of compound monographs that, when viewed together, bear a striking resemblance to the Merck Index. And the effort is becoming increasingly organized with respect to content and data provenance.

Why not start here?

# The Task at Hand

To get an idea of just how Wikipedia's collection of compound monographs compares to the Merck Index, it helps to know: (1) how to find Wikipedia compound monographs; and (2) the range of information available for each entry.

This tutorial will describe a simple method to index Wikipedia's compound monographs using nothing but free tools and data. Subsequent articles will discuss qualitative aspects of Wikipedia's compound monographs and the challenges involved in organizing them into a chemically-aware service.

# Indexing Wikipedia's Compound Monographs

We can index Wikipedia compound monographs via a simple procedure.

Most compound monographs employ one of four precompiled Wikpedia templates: [Chembox](http://en.wikipedia.org/wiki/Template:Chembox) (deprecated); [Chembox new](http://en.wikipedia.org/wiki/Template:Chembox_new); [Drugbox](http://en.wikipedia.org/wiki/Template:Drugbox); and [Explosivebox](http://en.wikipedia.org/wiki/Template:Explosivebox). As an example of what these templates look like, see the right-hand box on Wikipedia's entry on [modafinil](http://en.wikipedia.org/wiki/Modafinil). To index Wikipedia's compound monographs, all we need to do is find the titles of all articles using one of these four templates.

To get started, we'll need a local copy of Wikipedia. The complete set of all Wikipedia articles, as of March 12, 2008 can be [downloaded here](http://download.wikimedia.org/enwiki/20080312/enwiki-20080312-pages-articles.xml.bz2). This data dump is updated periodically, so you may have access to a more recent version.

The Wikipedia dump, which contains the full text of every article in Wikipedia, consists of a 3.5 GB file in [BZip2](http://www.bzip.org/) format. Fortunately, we won't need to inflate it to index its chemical content.

The following code will scan the raw Wikipedia dump and produce a list of all compound monograph titles:

```ruby
title = ""
log = File.new 'monographs.txt', "w"

while((line = STDIN.gets))
  line.match /&lt;title&gt;(.*)&lt;\/title&gt;/

  if $1
    title = $1

    next
  end

  if line.match /\{\{(chembox|drugbox|explosivebox)/i
    unless title == "" || title.match(/:/)
      puts title
      log.puts title
      log.flush

      title = ""
    end
  end
end

log.close
```

Saving this code into a file called `filter.rb`, we can run it by piping the output of <code>bzcat</code> on the raw dump file:

```bash
bzcat &lt;path_to_dump&gt;/enwiki-20080312-pages-articles.xml.bz2 | ruby filter.rb
```

Alphabetizing the output file gives a complete listing of Wikipedia's compound monograph titles (all 6,411 of them), which for convenience can be [downloaded here](/images/posts/20080428/compound_monographs_20080315.txt).

We can construct a URL to each Wikipedia compound monograph by prepending the title with **http://wikipedia.org/wiki/**. In other words, our program's output can be used both as a list of chemical names and as a hash of chemical names to Wikipedia URLs. And with the URL in hand, [all kinds of interesting things can be done](/articles/2008/04/02/wikipedia-for-cheminformatics-a-simple-web-api-for-finding-cas-numbers-in-compound-monographs).

# Limitations

Although easy to carry out, the procedure described here has some limitations:

-  Monographs added after March 12, 2008 are not visible.
-  Monographs that don't use the chembox, chembox new, drugbox, or explosivebox templates are not visible.
-  A very small number of articles erroneously use the chembox template, for example [this one](http://en.wikipedia.org/wiki/Iraq%27s_Chemical_Warfare).

# Chempedia Redesign

Currently, Chempedia doesn't include all 6,411 monographs but rather a subset created by a much less comprehensive indexing method. As part of a major redesign of the site, all Wikipedia compound monographs will be available on Chempedia, which should result in a much more useful service.

# Conclusions

Wikipedia is fast becoming a major storehouse of chemical information with tantalizing potential for creating powerful new services for chemists. More to the point for cheminformatics, the entire Wikipedia dataset can be downloaded and reprocessed free of charge; Wikipedia is one of those rare cheminformatics datasets that is [both free as in speech and free as in beer](/articles/2006/09/27/hacking-pubchem-free-speech-or-free-beer).

As this article has shown, some simple programming is all it takes to begin doing useful things with Wikipedia's chemical content. Future articles will discuss some of the possibilities.
