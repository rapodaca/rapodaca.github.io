---
title: "Hacking PubChem: Query by SMILES"
published: "2006-09-21T00:00:00.000Z"
---

Recently, I showed how <a href="http://depth-first.com/articles/2006/08/30/hacking-pubchem-with-ruby">a simple PubChem API</a> could be built from a few lines of Ruby code. The API we created could retrieve a molfile and a 2-D molecular rendering given a PubChem compound ID (CID). In this tutorial, we'll see how a SMILES query mechanism can be added to the API, enabling CIDs to be retrieved from any valid SMILES string. We'll also see how to extend this capability to retrieving a 2-D image from PubChem by submitting a SMILES string.

# Credits

The API that follows is based on the `pubchem.rb` file found in <a href="http://rubyforge.org/projects/chemruby">Chemruby</a> by Tadashi Kadowaki and Nobua Tanaka.

# Defining the Problem

We want to create a PubChem API that returns an <code>Array</code> of CIDs given any valid SMILES string. The API will communicate with the publically-available molecular database <a href="http://pubchem.ncbi.nlm.nih.gov/">PubChem</a> using HTTP.

In some cases, PubChem associates more than one CID for a given molecular structure. For example, querying the SMILES string <code>c1ccccc1</code> (benzene) finds both benzene and C-14 benzene. The software needs to handle these cases as well.

# Prerequisites

The only thing you'll need for this tutorial is Ruby, preferably v1.8 or better.

# Code

Create a file called `query.rb` in your working directory containing the following code:

```ruby
require 'uri'
require 'net/http'

# A simple SMILES query for PubChem based on the file <tt>pubchem.rb</tt>,
# and originally part of Chemruby (http://rubyforge.org/project/chemruby).
# Distributed under Ruby's License.
#
# Copyright (C) 2005, 2006 KADOWAKI Tadashi <kado@kuicr.kyoto-u.ac.jp>
#                          TANAKA   Nobuya  <tanaka@kuicr.kyoto-u.ac.jp>
#                          APODACA  Richard <r_apodaca@users.sf.net>
class PubChemQuery
  @@host="pubchem.ncbi.nlm.nih.gov"
  @@searchpath="/search/"
  @@query="PreQSrv.cgi"
  @@boundary="-----boundary-----"

  # Synthetic form data. Lifted from Chemruby pubchem.rb
  @@data = [
    @@boundary, "Content-Disposition: form-data; name=\"mode\"", "", "simplequery",
    @@boundary, "Content-Disposition: form-data; name=\"queue\"", "", "ssquery",
    @@boundary, "Content-Disposition: form-data; name=\"simple_searchdata\"", "", '%s',
    @@boundary, "Content-Disposition: form-data; name=\"simple_searchtype\"", "", "fs",
    @@boundary, "Content-Disposition: form-data; name=\"maxhits\"", "", '%s',
    @@boundary].join("\x0d\x0a")

  # Returns an Array of CIDs matching smiles. If no matches are found,
  # nil is returned.
  def self.query_by_smiles(smiles, maxhits = 100)
    form_response = post_form(smiles, maxhits)
    wait_response = process_wait_page(form_response)
    url = get_report_url(wait_response)

    url ? process_report(url) : nil
  end

private

  # Returns the response to posting the initial search form.
  def self.post_form(smiles, maxhits)
    response = ''

    Net::HTTP.start(@@host, 80) do |http|
      response = http.post(@@searchpath + @@query, @@data % [smiles, maxhits],
      {
        'Content-Type' => "multipart/form-data; boundary=#{@@boundary}",
        'Referer' => "http://pubchem.ncbi.nlm.nih.gov/search/"
      }).body
    end

    response
  end

  # Processes the wait page displayed after submission of the search form.
  def self.process_wait_page(body)
    response = ''

    if m = /url="([^"]+)"/.match(body)
      Net::HTTP.start(@@host, 80) do |http|
        response = http.get(@@searchpath + m[1]).body
      end
    end

    response
  end

  # Returns the URL, as a String, to the search report, given the specified
  # body of the wait page.
  def self.get_report_url(body)
    url = nil

    Net::HTTP.start(@@host, 80) do |http|
      while /setTimeout\('document.location.replace\("([^"]+)"\);', (\d+)\)/ =~ body do
        sleep($2.to_f/100)

        response = http.get(URI.parse($1).to_s)
        body = response.body
        url = response['location']
      end
    end

    url
  end

  # Extracts CIDs from the search report contained at url.
  def self.process_report(url)
    cid = Array.new

    Net::HTTP.start(@@host, 80) do |http|
      # text format
      url.sub!(/cmd=Select\+from\+History/, 'cmd=Text&dopt=Brief')
      http.get(url).body.scan(/\d+: CID: (\d+)/).each do |id|
        cid.push(id[0])
      end
    end

    cid
  end
end
```

You might want to <a href="http://pubchem.ncbi.nlm.nih.gov/search/">manually submit a SMILES query</a> to PubChem as a refresher on how this webapp works. Briefly, the contents of the SMILES search field are read, and a wait screen appears, typically for three seconds. You are then redirected to a results report page containing thumbnail images of the hits and their CIDs.

The PubChemQuery class contains a single public class method, <code>query_by_smiles</code>. This method builds a form to submit, based on the supplied SMILES string and optional <code>maxhits</code> argument. It then waits until PubChem indicates that the query is about to finish processing. The URL for the results report page is then parsed. If a nonempty URL was found, then its page is loaded, and CIDs are scraped. Otherwise, the method returns <code>nil</code>.

# Usage

Using <code>PubChemQuery</code> consists of invoking its class method <code>query_by_smiles</code>. You can do so either via the Ruby interpreter (<code>ruby</code>), or preferably through Interactive Ruby (<code>irb</code>).

```ruby
require 'query'

smiles = "c1cccc(Cl)c1(Cl)" # chlorobenzene
puts "Searching CID(s) for SMILES, #{smiles} ..."
cid = PubChemQuery.query_by_smiles(smiles)
puts cid # => 7239
```

# Layering Complexity

We can combine the SMILES query API discussed here with the molfile and image retrieval discussed in the <a href="http://depth-first.com/articles/2006/08/30/hacking-pubchem-with-ruby">earlier Hacking Pubchem article</a>.

Let's say you'd like to download PubChem's 2-D image of imatinib (Gleevec) by submitting its SMILES string. Copy the file named `pubchem.rb`, provided in the original PubChem tutorial, into your working directory. Now you can programmatically download imatinib's 2-D image from PubChem based only on a SMILES string, for example:

```ruby
require 'pubchem'
require 'query'

smiles="Cc3ccc(NC(=O)c2ccc(CN1CCN(C)CC1)cc2)cc3Nc5nccc(c4cccnc4)n5" #imatinib
puts "Searching CID(s) for SMILES, #{smiles} ..."
cid = PubChemQuery.query_by_smiles(smiles)

if cid
  puts "CID found: #{cid[0]}"

  filename = cid[0] + ".png"
  puts "Writing image to #{filename} ..."
  PubChem.write_image(cid[0], filename)
else
  puts "No CID for #{smiles} was found."
end
```

This produces an image of imatinib called `5291.png` in your working directory:

# Wrapping Up

As you can see, we're just scratching the surface. The approach outlined here offers nearly unlimited possibilities for repackaging PubChem's own content, and mashing this content up with that of other sites. Happy hacking!