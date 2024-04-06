---
title: The Best API May Be No API At All - PubChem and PDB
published: "2007-08-13T00:00:00.000Z"
---

Both [PubChem](http://pubchem.ncbi.nlm.nih.gov/) and the [Protein Data Bank](http://www.rcsb.org/pdb/home/home.do) (PDB) maintain vast collections of molecular data. Individual users are free to view and search these collections via standard Web browsers. But what are the options if you're developing software to interact with these databases?

Various application programming interfaces (APIs) are available for accessing PubChem and PDB records. For example, PubChem recently introduced its [Power User Gateway](/articles/tag/pug) (PUG), an XML-based query language. But writing APIs is extremely difficult; reconciling the need for simplicity with the need for rich functionality is a tough balancing act. Where do you draw the line?

Recently, [Bosco](http://boscoh.com/) described a [remarkably short method](http://boscoh.com/protein/fetching-pdb-files-remotely-in-pure-python-code) to retrieve PDB records using nothing more than standard Python. Given the similarities between Python and Ruby, it seemed reasonable that his method could be adapted to Ruby.

The following Ruby library accepts a PDB identifier and returns the corresponding PDB record:

```ruby
require 'net/http'

module PDB
  # Returns a PDB record for the given id
  def self.get_record id
    Net::HTTP.get_response('www.rcsb.org', "/pdb/files/#{id}.pdb").body
  end
end
```

Notice how the business end of this library is nothing more than a single line of Ruby code.

The library can be tested by saving it in a file called `pdb.rb` and invoking interactive Ruby (irb):

```bash
irb
irb(main):001:0> require 'pdb'
=> true
irb(main):002:0> puts PDB::get_record('1hpn')
HEADER    GLYCOSAMINOGLYCAN                       17-JAN-95   1HPN
TITLE     N.M.R. AND MOLECULAR-MODELLING STUDIES OF THE SOLUTION
TITLE    2 CONFORMATION OF HEPARIN

[truncated]
```

Several months ago, a D-F article described a related, but somewhat lengthier approach to [retrieving PubChem molfiles](/articles/2006/08/30/hacking-pubchem-with-ruby). Using the same approach we used for PDB, we can create the world's shortest PubChem library:

```ruby
require 'net/http'

module PubChem
  # Returns a molfile for the given PubChem CID
  def self.get_molfile cid
    Net::HTTP.get_response('pubchem.ncbi.nlm.nih.gov', "/summary/summary.cgi?cid=#{cid}&disopt=DisplaySDF").body
  end
end 
```

This library can be tested by saving it in a file called `pubchem.rb` followed by running irb:

```bash
irb
irb(main):001:0> require 'pubchem'
=> true
irb(main):002:0> puts PubChem::get_molfile('969472') #eszopiclone (Lunesta)
969472
  -OEChem-08130700422D

 44 47  0     1  0  0  0  0  0999 V2000
    9.2619   -2.2732    0.0000 Cl  0  0  0  0  0  0  0  0  0  0  0  0

[truncated]
```

Both of these Ruby libraries leverage one the most versatile and robust protocols ever developed: plain old http. The last few years have witnessed a renaissance in using bare http as platform for building simplified yet powerful Web APIs with less software. Referred to as [REST](http://www.ics.uci.edu/~fielding/pubs/dissertation/rest_arch_style.htm), the approach has gained traction partly in response to the wasteful complexities introduced by various XML-based approaches. Although [slow to catch on in cheminformatics](/articles/2007/05/30/restful-cheminformatics), REST has enormous potential in unifying [a diverse array](/articles/2007/01/24/thirty-two-free-chemistry-databases) of isolated database systems.

One limitation of the approach described here is that the PubChem (or PDB) folks may get upset if you use it a lot. For example, if you examine the [PubChem robots.txt file](http://pubchem.ncbi.nlm.nih.gov/robots.txt), you'll notice that access to the <tt>summary.cgi</tt> resource, which our library makes use of, is prohibited to robots:

```http
...

User-agent: *

...
Disallow: /summary/summary.cgi
...
```

What makes a "robot" and does your software qualify for exclusion? The answer is not enirely clear-cut, especially in the era of browser-side scripting.

Regardless, it looks like PubChem's policy was put in place in 2004, long before PubChem had experience with usage patterns for its service. It may be that this restriction could be relaxed without adversely affecting PubChem's ability to operate efficiently. It may even be possible to offer a low-level http retrieval method alongside PubChem's PUG interface on a machine dedicated to automated queries (i.e., [Entrez eUtils](http://eutils.ncbi.nlm.nih.gov/entrez/query/static/eutils_help.html)).

As developers, our mission is to deliver functionality, not to write software. We should extract every possible ounce of value from established protocols and APIs before writing a single line of additional code. REST, and the creative use of good old http, are powerful tools to do so.
