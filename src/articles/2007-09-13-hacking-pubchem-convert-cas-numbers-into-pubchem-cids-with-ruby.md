---
title: Hacking PubChem - Convert CAS Numbers into PubChem CIDs with Ruby
published: "2007-09-13T00:00:00.000Z"
---

Although the PubChem system has been discussed in [numerous recent D-F articles](http://depth-first.com/articles/tag/pubchem) and elsewhere, there's much more to the story that hasn't been told. One of the more intriguing things PubChem can do is [look up CAS Numbers for free](http://depth-first.com/articles/2007/05/21/simple-cas-number-lookup-with-pubchem). In this tutorial, we'll see how a simple Ruby script can be used to automate the conversion of CAS numbers into PubChem Compound IDs (CIDs).

# The Library

Our library needs to accept a CAS number and return an array of PubChem CIDs in response. To do this, we'll make use of the [Entrez eUtils system](http://eutils.ncbi.nlm.nih.gov/entrez/query/static/eutils_help.html). Although Entrez is incredibly complex, the only two things that matter now are that the NIH requires automated scripts to access most of its databases through Entrez, and that Entrez can be used to perform PubChem keyword queries.

The library is simplicity itself:

```ruby
require 'rubygems'
require 'mechanize'

module PubChemTerms
  def get_cids term
    agent = WWW::Mechanize.new
    page = agent.get "http://www.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pccompound&retmax=100&term=#{term}"

    (page.parser/"id").collect {|id| id.innerHTML}
  end
end
```

The excellent Ruby library <a href="http://mechanize.rubyforge.org/">Mechanize</a> is used for submitting queries and processing the results. (This is the same library that was used to <a href="http://depth-first.com/articles/2007/06/27/easily-convert-publisher-urls-and-dois-to-bibliographical-citations-synthesis-synlett-ruby-and-mechanize">extract full bibliographical information</a> from nothing more than a DOI). The only remarkable thing about the library above is how unremarkable it is.

# A Test

We can test the library by saving it in a file called <strong>entrez.rb</strong> and starting an interactive Ruby (irb) session. Opening up my copy of the Merck index to a random page and selecting an entry gives a CAS number to try (64318-79-2 - gemeprost). Plugging this CAS number into our irb session gives:

```bash
irb
irb(main):001:0> require 'entrez'
=> true
irb(main):002:0> include PubChemTerms
=> Object
irb(main):003:0> get_cids '64318-79-2'
=> ["5282237", "6434870"]
```

Our library has returned a Ruby array containing two compound identifiers. We can use PubChem to view their records [here](http://pubchem.ncbi.nlm.nih.gov/summary/summary.cgi?cid=5282237) and [here](http://pubchem.ncbi.nlm.nih.gov/summary/summary.cgi?cid=6434870). Visual inspection reveals these two compounds to be isomers of each other, with the first member of the array containing the direct hit.

Let's try another CAS number selected from another random Merck index entry:

```bash
irb(main):004:0> get_cids '66981-73-5'
=> ["68870", "169125"]
```

Again we've obtained two CIDs, with the [first one](http://pubchem.ncbi.nlm.nih.gov/summary/summary.cgi?cid=68870) being the neutral form and the second one being the [sodium salt](http://pubchem.ncbi.nlm.nih.gov/summary/summary.cgi?cid=169125) of the antidepressant tianeptine.

# Applications

Now, instead of converting one or two CAS numbers, imagine we've got a few thousand. Our library could be easily adapted to this purpose. The only caveat is that we'd need to [observe the Entrez use policy](http://eutils.ncbi.nlm.nih.gov/entrez/query/static/eutils_help.html#UserSystemRequirements) and not overload the server with too many requests. We could build in a delay with Ruby's <code>sleep</code> method.

Notice that the library can be used to search for any keyword - not just CAS numbers. For example:

```bash
irb
irb(main):001:0> require 'entrez'
=> true
irb(main):002:0> include PubChemTerms
=> Object
irb(main):003:0> get_cids 'anandamide'
=> ["5281969", "5283455", "5283388", "4671", "5353407", "5283452", "5283456", "5283451", "5283450", "5283449", "5283448", "5283447", "5283445", "5283444"]
```

Like our previous queries, we've obtained multiple CIDs associated with the term 'anandamide', with the first one being the direct hit.

# Conclusions

Our little library isn't perfect, but it performs a very difficult task cheaply and conveniently in the majority of cases. By mashing up this functionality with other Ruby cheminformatics libraries (for example [Ruby Open Babel](/articles/2007/04/09/painless-installation-of-ruby-open-babel) and Ruby CDK, a variety of tough and highly practical cheminformatics problems can be solved elegantly. Look to further installments of the Hacking PubChem series to find out how.