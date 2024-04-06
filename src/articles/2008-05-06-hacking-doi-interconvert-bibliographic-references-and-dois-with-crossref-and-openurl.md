---
title: Hacking DOI - Interconvert Bibliographic References and DOIs with CrossRef and OpenURL
published: "2008-05-06T00:00:00.000Z"
---

Science is in the middle of a transition from print to the internet as the primary medium of communication. This transition, although a boon for many scientists, creates a host of problems for those dealing with scientific information. For example, how would you interconvert a [DOI](http://www.doi.org/) and its corresponding bibliographic reference?

A previous Depth-First article discussed [a screen-scraping method](/articles/2007/06/27/easily-convert-publisher-urls-and-dois-to-bibliographical-citations-synthesis-synlett-ruby-and-mechanize) as one solution. Unfortunately, this system relies on an intimate understanding of how individual publishers' Websites work, requires a different implementation for each publisher, and can break at any time without warning.

This article discusses a far more robust solution to the problem of interconverting bibliographic references and DOIs.

# Background: OpenURL and CrossRef

[CrossRef](http://www.crossref.org/) is the official [DOI](http://www.doi.org/) link registration agency for scholarly and professional publications. One of the less well-known services offered by CrossRef is a free, Web-based [bidirectional DOI/bibliographic reference converter](http://www.crossref.org/openurl_info.html) based on [OpenURL](http://en.wikipedia.org/wiki/OpenURL).

# A Simple Ruby Library

The following Ruby library is all we need to begin using CrossRef and OpenURL:

```ruby
require 'rubygems'
require 'hpricot'
require 'open-uri'

module DOI
  # Convert a doi into a bibliographic reference.
  def biblio_for doi
    doc = Hpricot(open("http://www.crossref.org/openurl/?id=doi:#{doi}&noredirect=true&pid=ourl_sample:sample&format=unixref"))

    journal = (doc/"abbrev_title").inner_html
    year = (doc/"journal_issue/publication_date/year").inner_html
    volume = (doc/"journal_issue/journal_volume/volume").inner_html
    number = (doc/"journal_issue/issue").inner_html
    first_page = (doc/"pages/first_page").inner_html
    last_page = (doc/"pages/last_page").inner_html

    "#{journal} #{year}, #{volume}(#{number}) #{first_page}-#{last_page}"
  end

  # Convert a bibliographic reference into a DOI.
  def doi_for journal, year, volume, issue, page
    doc = Hpricot(open("http://www.crossref.org/openurl/?title=#{journal.gsub(/ /, '%20')}&volume=#{volume}&issue=#{issue}&spage=#{page}&date=#{year}&pid=ourl_sample:sample&redirect=false&format=unixref"))

   (doc/"doi").inner_html
  end
end
```

This code makes use of the excellent Ruby HTML parser library <a href="http://code.whytheluckystiff.net/hpricot">Hpricot</a>.

<h4>Testing the Library</h4>

Saving the Ruby code to a file named <strong>doi.rb</strong>, we can test it using the interactive Ruby shell:

```bash
irb
irb(main):001:0> require 'doi'
=> true
irb(main):002:0> include DOI
=> Object
irb(main):003:0> biblio_for "10.1021/cr00032a009"
=> "Chem. Rev. 1994, 94(8) 2483-2547"
irb(main):004:0> doi_for "Chem. Rev.", 1994, 94, 8, 2483
=> "10.1021/cr00032a009"
```

Notice how the journal abbreviation *Chem. Rev.* was used; we'd get the same result if we used *Chemical Reviews*.

Of course, the implementation described here could be refined a lot. With a DOI, it's trivial to [construct a URL to the example paper](http://dx.doi.org/10.1021/cr00032a009). But we could take it further than that. With some carefully crafted regular expressions, our <code>doi_for</code> method could accept a freeform bibliographical citation rather than separately identified fragments. From there we might start to think about creating living HTML and/or Wikis from old PDFs and Word documents.

With a little creative thought, other possibilities are well within reach.

# Caveat

Before extensively experimenting with CrossRef's OpenURL system, you might want to [sign up for a free account](http://www.crossref.org/requestaccount/). CrossRef is understandably interested in tracking usage and this is their way to do it.

# Conclusions

DOIs and traditional bibliographical citations now coexist in a variety of settings, from literature citation managers to journals themselves. Using CrossRef, OpenURL and a little bit of code, it's now possible to make a great deal more sense of it all.

Harvesting bibliographical citations must be one of the least sexy topics in cheminformatics. But as Google demonstrated (building on the approach taken by [*Science Citation Index*](http://scientific.thomson.com/products/sci/)), cataloging citation behavior leads to a unique and highly productive way to view many tough problems. Future articles will discuss how this might apply to cheminformatics.
