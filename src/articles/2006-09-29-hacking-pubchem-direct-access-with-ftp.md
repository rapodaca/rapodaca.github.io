---
title: "Hacking PubChem: Direct Access with FTP"
published: "2006-09-29T00:00:00.000Z"
---

A <a href="http://depth-first.com/articles/2006/09/22/hacking-pubchem-why-the-open-access-fight-is-just-the-beginning">previous article</a> in the <em>Hacking PubChem</em> series pointed out that the entire PubChem database can be <a href="ftp://ftp.ncbi.nlm.nih.gov/pubchem/">downloaded via FTP</a>. This article shows how simple tools written in Ruby can be used to efficiently process the massive amount of data on PubChem's FTP-server.

# Prerequisites

The only software you'll need for this tutorial is <a href="http://www.ruby-lang.org/en/">Ruby</a>.

# Organization of PubChem's FTP-Server

PubChem is a big database. To deal with its size, the FTP-server spreads its contents over about 950 files. Each file contains a contiguous range of Compound Identification Numbers (CIDs), which appears to be set at 10,000 [<em>Now 25,000, see below</em>]. In some of the files I've examined, the actual number of compounds in a given block was less than 10,000. The root directory containing the files can be accessed <a href="ftp://ftp.ncbi.nlm.nih.gov/pubchem/Compound/CURRENT-Full/SDF/">here</a>.

# Compression Saves the Day

For storage and transmission efficiency, PubChem's SDF files are compressed using the GZip algorithm, giving files that typically range in size from five to seven megabytes. Compression ratios for the files I've examined are about 10:1. I'm calling these files "SDFGZ" files, and they have the extension `*.sdf.gz`.

A back of the envelope calculation, based on 950 files with an average size of 6 MB and a compression ratio of 10:1, gives an approximate storage requirement of 57 GB for the uncompressed PubChem database. Although storing this much data is feasible with today's hardware, there are many better uses for storage space. This is especially true if only a few fields of the PubChem database are of interest.

# Setting Up

You'll need to download some SDFGZ data. This tutorial uses the <a href="ftp://ftp.ncbi.nlm.nih.gov/pubchem/Compound/CURRENT-Full/SDF/Compound_09540001_09550000.sdf.gz">file containing CIDs 9540001-9550000</a>. [<em>Note: PubChem recently increased the number of compounds in each sdfgz file to 25,000. This means that the link to the file no longer works. Instead, choose a file from <a href="ftp://ftp.ncbi.nlm.nih.gov/pubchem/Compound/CURRENT-Full/SDF/">here</a></em>.] Put this file in your working directory.

# A Short Library

Create a file called <strong>sdfgz.rb</strong> containing the following code:

```ruby
require 'zlib'

# A simple splitter for *.sdf.gz files available
# from PubChem's FTP-server.
class SDFGZSplitter
  @@stop = "$$$$\n"
  @@blank = ""

  # Configures this SDFGZSplitter using the IO
  # object io.
  def initialize(io)
    @gzip = Zlib::GzipReader.new(io)
  end

  # Yield a sequence of SDFile records.
  def each_record
    record = get_record

    while record != @@blank
      yield record
      record = get_record
    end
  end

  # Gets the next record, or an empty string if
  # none is available.
  def get_record
    line = read_line
    record = [line]

    while !(@@stop.eql?(line) || nil == line)
      line = read_line
      record << line
    end

    record.join
  end

  private

  # Reads the next line in the SDFGZ file.
  def read_line
    begin
      line = @gzip.readline
    rescue EOFError
      return nil
    end

    line
  end
end

# Utility class for getting data out of a SDFile record.
class Extractor
  # Gets the data from record associated with
  # key.
  def self.extract_data(record, key)
    record.match(/> <#{key}>\n(.+)\n/)
    $1
  end

  # Gets the molfile for record.
  def self.extract_molfile(record)
    record.match(/M  END$/).pre_match + "M  END\n"
  end
end
```

The `SDFGZSplitter` class uses Ruby's built-in GZip library to read SDFGZ files without inflating them. The method `each_record` is a <a href="http://www.rubycentral.com/book/tut_containers.html">Ruby iterator</a>, one of the strangely cool things that makes Ruby the language it is. The iterator's job is to allow retrieval of each SDFGZ record individually, until all records have been retrieved.

# Using the Library

As a test for the `sdfgz` library, lets scrape all PubChem CIDs and InChI identifiers from an SDFGZ file, and place the result into a new CSV file. Create the following code, either in a file to be run by `ruby` or in a terminal session using `irb`:

```ruby
require 'sdfgz'

file = File.new('Compound_09540001_09550000.sdf.gz')
splitter = SDFGZSplitter.new(file)

puts "parsing..."

File.open('dictionary.csv', 'w+') do |file|
  splitter.each_record do |record|
    cid = Extractor.extract_data(record, 'PUBCHEM_COMPOUND_CID')
    inchi = Extractor.extract_data(record, 'PUBCHEM_NIST_INCHI')

    file << "#{cid},\"#{inchi}\"\n"
  end 
end
```

Running this test creates a (rather large) file called <strong>dictionary.csv</strong> in your working directory. Its contents consist of the following truncated output:

```bash
9540001,"InChI=1/C20H22N2O4/c1-13-7-5-10-16(14(13)2)22-20(26)15-8-3-4-9-17(15)21-18(23)11-6-12-19(24)25/h3-5,7-10H,6,11-12H2,1-2H3,(H,21,23)(H,22,26)(H,24,25)/p-1/fC20H21N2O4/h21-22H/q-1"
9540002,"InChI=1/C20H22N2O4/c1-13-7-5-10-16(14(13)2)22-20(26)15-8-3-4-9-17(15)21-18(23)11-6-12-19(24)25/h3-5,7-10H,6,11-12H2,1-2H3,(H,21,23)(H,22,26)(H,24,25)/f/h21-22,24H"
9540003,"InChI=1/C19H20N2O5/c1-26-16-8-3-7-15(12-16)21-19(25)13-5-2-6-14(11-13)20-17(22)9-4-10-18(23)24/h2-3,5-8,11-12H,4,9-10H2,1H3,(H,20,22)(H,21,25)(H,23,24)/p-1/fC19H19N2O5/h20-21H/q-1"
9540004,"InChI=1/C19H20N2O5/c1-26-16-8-3-7-15(12-16)21-19(25)13-5-2-6-14(11-13)20-17(22)9-4-10-18(23)24/h2-3,5-8,11-12H,4,9-10H2,1H3,(H,20,22)(H,21,25)(H,23,24)/f/h20-21,23H"
...
```

Many customizations of the above code are possible. For example, it would not be difficult to programatically log into the PubChem FTP-server, download a file, and process it as shown. By parsing the SDFGZ filename, a program could even know which file contained a given CID. Because the `SDFGZSplitter` constructor takes a Ruby `IO` object, it's also feasible to process PubChem's SDFGZ files directly from the FTP-server, without downloading them beforehand. But that's a subject for another day.

# Summing Up

The PubChem FTP-server is a treasure trove of useful data that's available free of charge. Using simple tools like those discussed here, it's possible to generate a virtually infinite variety of customized views of this valuable resource. Many creative, and novel, applications are possible by combining the capabilities shown here with those of Open Source chemical informatics software, such as <a href="http://depth-first.com/articles/2006/09/26/looking-at-inchis">RCDK</a>, and other Open data sources, such as <a href="http://depth-first.com/articles/2006/09/04/hacking-nmrshiftdb">NMRShiftDB</a>.