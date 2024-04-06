---
title: Wikipedia for Cheminformatics - A Simple Web API for Finding CAS Numbers in Compound Monographs
published: "2008-04-02T00:00:00.000Z"
---

Good news for cheminformatics: Chemical Abstracts Service (CAS) [has agreed](http://en.wikipedia.org/wiki/Wikipedia_talk:WikiProject_Chemistry/CAS_validation) to help Wikipedia users curate its collection of CAS numbers. As a result of the diligence of some hard-working volunteers, chemistry's most universal system for referring to chemicals can now be used far more effectively by the worlds biggest open repository of knowledge.

Wouldn't it be great to be able to pull these CAS numbers from Wikipedia programmatically?

# Perspective

Estimates place the number of Wikipedia pages dealing with individual [inorganic](http://en.wikipedia.org/wiki/Wikipedia:WikiProject_Chemicals/Inorganics) and [organic](http://en.wikipedia.org/wiki/List_of_organic_compounds) substances in the thousands. (I'll use the term "compound monographs" to describe them.) One factor acting to keep this number low is poor visibility of these entries. Unlike most [chemical databases](http://depth-first.com/articles/2007/01/24/thirty-two-free-chemistry-databases), Wikipedia can't, by itself, be easily searched by structure. As chemically-aware tools for indexing Wikipedia begin to emerge, look for six things to happen:

1.  The number of Wikipedia compound monographs will increase significantly.
2.  The quality of monographs for intermediate- to well-known compounds will increase substantially.
3.  Demand for user-friendly interfaces to Wikipedia's chemical content will increase.
4.  Wikipedia users will become interested in storing and finding ever more diverse kinds of information about each compound.
5.  Bench chemists will start to include Wikipedia as one of their preferred literature search techniques, leading to...
6.  More creative tools for using the chemical content of Wikipedia.

As noted previously, it wasn't too long ago that indexing of the chemical literature [was done solely by volunteers](http://depth-first.com/articles/2006/08/19/history-of-abstracting-at-chemical-abstracts-service). Wikipedia offers an intriguing way to channel the innate drive for chemists to combine their own work and experience with that of others to build useful information tools for the community.

But for now we are left with the question of how to index the chemical content of Wikipedia. Although a few systems have been proposed, the only practical method is through the use of CAS numbers. Which brings us to the subject of today's tutorial.

# A Quick CAS Number API for Wikipedia

The Ruby program below will accept the title of any Wikipedia compound monograph title and return the CAS number for the compound being discussed, or an error message if none was found:

```ruby
require 'rubygems'
require 'hpricot'
require 'open-uri'
require 'cgi'

class Wikikemi
  @cas = nil

  attr_reader :cas

  def initialize title
    uri = URI.escape("http://en.wikipedia.org/wiki/#{title}")
    puts "loading... #{uri}"
    doc = Hpricot(open(uri))
    table = (doc/"table")[0]

    table.inner_html.match(/([0-9]{2,7}?\-[0-9]{2}\-[0-9])/) if table

    @cas = $1
  end
end

# Returns the CAS number present in the Wikipedia monograph with
# the indicated title, or an error message if none is found. Try, for example,
# "benzene.".
while true
  puts "Enter the title of the Wikipedia page, for example: 'benzene'"
  monograph_title = gets.chomp
  w = Wikikemi.new monograph_title
  puts w.cas ? "[#{w.cas}]" : "CAS number not found"
end
```

This program makes use of the excellent Ruby HTML parser, <a href="http://code.whytheluckystiff.net/hpricot/">Hpricot</a>.

Saving the above code to a file called <strong>wikikemi.rb</strong>, we can run it with:

```bash
ruby wikikemi.rb
```

For example, we can look up the CAS numbers for Ferrocene, Lipitor, or 1,2,3,4,4a,5,6,7,8,8a-Decahydronaphthalene:

```bash
ruby wikikemi.rb
Enter the title of the Wikipedia page, for example: 'benzene'
ferrocene
loading... http://en.wikipedia.org/wiki/ferrocene
[102-54-5]
Enter the title of the Wikipedia page, for example: 'benzene'
lipitor
loading... http://en.wikipedia.org/wiki/lipitor
[134523-00-5]
Enter the title of the Wikipedia page, for example: 'benzene'
1,2,3,4,4a,5,6,7,8,8a-Decahydronaphthalene
loading... http://en.wikipedia.org/wiki/1,2,3,4,4a,5,6,7,8,8a-Decahydronaphthalene
[91-17-8]
```

All this method requires is that the Wikipedia page lists the correct CAS number in its [Drugbox](http://en.wikipedia.org/wiki/Template:Drugbox) or [Chembox](http://en.wikipedia.org/wiki/Template:Chembox_new) template. Fortunately, CAS has agreed to help make this happen.

# Conclusions

A little Ruby code is all it takes to build a working CAS number lookup system using Wikipedia. Although this may be useful as a standalone tool, it becomes much more powerful when made part of [a larger cheminformatics system](http://depth-first.com/articles/2007/05/21/simple-cas-number-lookup-with-pubchem). But that's a story for another time.

See also [Antony Williams' announcement on CAS and Wikipedia](http://www.chemspider.com/blog/a-message-of-support-and-public-service-from-the-chemical-abstracts-service.html).