---
title: Hacking ChemSpider - Query by SMILES and InChI with Ruby
published: "2007-09-17T00:00:00.000Z"
---

Slowly but surely, cheminformatics Web APIs are starting to appear. What's the big deal, you may ask? By exposing Web APIs, service providers enable third parties to develop new applications that ["mash up"](http://depth-first.com/articles/2006/09/23/mashups-for-fun-and-profit) functionality from two or more sites, or which take the original service in directions its founders never considered.

By way of [Antony Williams' blog](http://www.chemspider.com/blog), I came across [the announcement](http://www.chemspider.com/blog/?p=135 ) for the [ChemSpider Web API](http://www.chemspider.com/inchi.asmx). What can this API do for Web developers? To find out, let's write a small Ruby library.

# The Library

Our library will accept a SMILES string or InChI identifier and returns a URL pointing to the corresponding ChemSpider compound summary page. Like [previous Web API demos](http://depth-first.com/articles/2007/09/13/hacking-pubchem-convert-cas-numbers-into-pubchem-cids-with-ruby), this one uses the powerful Ruby library [Mechanize](http://mechanize.rubyforge.org/), leading to very concise code:

```ruby
require 'rubygems'
require 'mechanize'
require 'hpricot'

module ChemSpider
  def url_for_inchi inchi
    agent = WWW::Mechanize.new
    page= agent.get "http://www.chemspider.com/inchi.asmx/InChIToCSID?inchi=#{inchi}"
    csid = (Hpricot(page.body)/"string").innerHTML

    csid == "" ? nil : "http://www.chemspider.com/RecordView.aspx?id=#{csid}"
  end

  def url_for_smiles smiles
    agent = WWW::Mechanize.new
    page= agent.get "http://www.chemspider.com/inchi.asmx/SMILESToInChI?smiles=#{smiles}"
    inchi = (Hpricot(page.body)/"string").innerHTML

    raise "Invalid SMILES: #{smiles}" if inchi == ""

    url_for_inchi inchi
  end
end 
```

The `url_for_inchi` method directly uses the ChemSpider API to query by InChI. The `url_for_smiles` method first uses the ChemSpider API to convert a SMILES string to an InChI identifier, and then calls the `url_for_inchi` method.

Two points are worth noting. First, although for convenience the InChI identifier isn't <a href="http://www.aptana.com/docs/index.php/URL_Escape_Codes">escaped</a> before being appended to the API URL, strictly speaking it should be. Second, both methods invoke the underlying Mechanize library <a href="http://code.whytheluckystiff.net/hpricot/">Hpricot</a> to parse the raw XML returned by ChemSpider.

# Testing

Saving the above code to a file called <strong>chemspider.rb</strong>, we can get the URL to ChemSpider's benzene page from its InChI identifier via interactive Ruby (irb):

```bash
irb
irb(main):001:0> require 'chemspider'
=> true
irb(main):002:0> include ChemSpider
=> Object
irb(main):003:0> url_for_inchi "InChI=1/C6H6/c1-2-4-6-5-3-1/h1-6H"
=> "http://www.chemspider.com/RecordView.aspx?id=236"
```

We can work with SMILES strings just as easily as with InChIs:

```bash
irb
irb(main):001:0> require 'chemspider'
=> true
irb(main):002:0> include ChemSpider
=> Object
irb(main):003:0> url_for_smiles 'c1ccccc1'
=> "http://www.chemspider.com/RecordView.aspx?id=236"
```

Both the InChI and the SMILES string yield a URL pointing to the [same Chemspider page for benzene](http://www.chemspider.com/RecordView.aspx?id=236).

# Conclusions

Like most [chemical databases](/articles/2007/01/24/thirty-two-free-chemistry-databases), ChemSpider uses a compound summary page as a way of organizing the available resources for a given molecule. With a method in hand for accessing these pages based on arbitrary SMILES or InChIs, we can begin to think of manipulating ChemSpider independently of its current user interface. But that's a story for another time.
