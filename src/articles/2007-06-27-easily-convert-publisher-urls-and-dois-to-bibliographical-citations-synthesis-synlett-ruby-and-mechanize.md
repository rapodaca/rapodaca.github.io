---
title: Easily Convert Publisher URLs and DOIs to Bibliographical Citations - Synthesis, Synlett, Ruby, and Mechanize
published: "2007-06-27T00:00:00.000Z"
---

Just ten years ago, the thought of accessing all of the world's scientific literature online struck many as optimistic at best. Today, an increasing number of scientists use the Web as their *only* means of reading the literature.

This shift has brought with it a significant, but rarely discussed problem: converting a publisher URL or DOI to a bibliographical citation (title, authors, journal, page, volume, etc.). This is a problem because bookmarking and linking URLs are the way we reference Web documents, but the bibliographical citation is still how we reference paper documents. We may well see the day when the need for bibliographical citations disappears, but until that happens there's a need for user-friendly tools that manage the conversion.

This article discusses remarkably simple and flexible solution to this problem using [Ruby](http://www.ruby-lang.org/en/) and the outstanding [Mechanize](http://mechanize.rubyforge.org) library. As test subjects, I'll use two of my favorite journals: [Synthesis](http://www.thieme-chemistry.com/thieme-chemistry/journals/info/synthesis/index.shtml) and [Synlett](http://www.thieme-chemistry.com/thieme-chemistry/journals/info/synlett/index.shtml).

# What is Mechanize?

From the [Mechanize documentation](http://mechanize.rubyforge.org/mechanize/):

>The Mechanize library is used for automating interaction with websites. Mechanize automatically stores and sends cookies, follows redirects, can follow links, and submit forms. Form fields can be populated and submitted. Mechanize also keeps track of the sites that you have visited as a history.

Think of Mechanize as a programmable Web browser controlled by Ruby. This powerful idea offers possibilities that go far beyond the relatively simple example I'll describe here.

# A Simple Library

Our library consists of the following code:

```ruby
require 'rubygems'
require 'mechanize'

module Thieme
  def get_ris url
    agent =  WWW::Mechanize.new
    page = agent.get url
    ris_link = page.links.text /[Bb]iblio/
    ris_url = "http://" + page.uri.host + ris_link.href

    agent.get_file ris_url
  end
end
```

After saving this code in a file called <strong>thieme.rb</strong>, we can test it on <a href="http://dx.doi.org/10.1055/s-2007-966071">this <i>Synthesis</i> article</a> with interactive ruby (irb):

```bash
irb
irb(main):001:0> require 'thieme'
=> true
irb(main):002:0> include Thieme
=> Object
irb(main):003:0> ris=get_ris 'http://www.thieme-connect.com/ejournals/abstract/synthesis/doi/10.1055/s-2007-966071'
=> "\nTY  - JOUR\nID  - 101055S2007966071\nAU  - Gil,Mar\355a Victoria\nAU  - Ar\351valo,Mar\355a Jos\351\nAU  - L\363pez,\323scar\nT1  - Click Chemistry - What?s in a Name? Triazole Synthesis and Beyond\nJO  - Synthesis\nPY  - 2007///\nIS  - 11\nSP  - 1589\nEP  - 1620\nER  - \n\n"
irb(main):004:0> ris.match /T1  - (.*)/
=> #<MatchData:0xb77c9784>
irb(main):005:0> title = $1
=> "Click Chemistry - What?s in a Name? Triazole Synthesis and Beyond"
```

Let's say that instead of a deep link to an article in the Thieme site we have a DOI. Can we still get the bibliographical citation?

```bash
irb(main):006:0> ris=get_ris 'http://dx.doi.org/10.1055/s-2007-966071'
=> "\nTY  - JOUR\nID  - 101055S2007966071\nAU  - Gil,Mar\355a Victoria\nAU  - Ar\351valo,Mar\355a Jos\351\nAU  - L\363pez,\323scar\nT1  - Click Chemistry - What?s in a Name? Triazole Synthesis and Beyond\nJO  - Synthesis\nPY  - 2007///\nIS  - 11\nSP  - 1589\nEP  - 1620\nER  - \n\n"
irb(main):007:0> ris.match /T1  - (.*)/
=> #<MatchData:0xb77c6264>
irb(main):008:0> title = $1
=> "Click Chemistry - What?s in a Name? Triazole Synthesis and Beyond"
```

It worked! Mechanize had no problem following the redirect from dx.doi.org. Similar results would be obtained with a *Synlett* article or DOI.

For this approach to be truly useful, our software would need to gracefully handle character encoding to avoid garbled strings such as "What?s".

# How it Works

Our library relies on two important things being provided by the publisher: (1) a downloadable version of the [RIS](http://www.adeptscience.co.uk/kb/article/A626) file for every article; and (2) a consistent way to access it across journals. By simply telling Mechanize to follow a link labeled as "Download bibliographical data", we can easily retrieve the full citation. Fortunately, nearly every scientific publisher follows this practice.

# Conclusions

Just a few lines of Ruby code have solved a significant scientific information management problem, at least for one journal. A complete solution to the problem would require code for every scientific journal, a task well underway at [CiteULike](http://depth-first.com/articles/2007/06/22/hacking-citeulike-metascripting-with-ruby-and-session). While nothing here can pretend to be an end-user application, it's not difficult to imagine how to build one (or a few) using these basic concepts. But that's a story for another time.