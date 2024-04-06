---
title: "Hacking PubChem with Ruby"
published: "2006-08-30T00:00:00.000Z"
---

<a href="http://pubchem.ncbi.nlm.nih.gov/">PubChem</a> is an increasingly popular, free-access, online molecular database operated by the National Institutes of Health. Web services are a hot topic, with sites such as <a href="http://www.flickr.com/services/api/">Flickr</a>, <a href="http://www.google.com/apis/">Google</a>, and <a href="http://developer.ebay.com/common/api/">eBay</a> offering developers the tools to build rich content through "mashups" of several web APIs. Although there is no formal PubChem API, it's possible to roll your own. As a demonstration, this article will show how structural information can be retrieved from PubChem using some simple Ruby code. The inspiration for this article came from the `PubChem` module that is part of <a href="http://chemruby.org">Chemruby</a>.

The only thing you'll need for this tutorial is Ruby, preferably version 1.8.2 or higher. Create a directory called **pubchem** and make it your working directory. Then create a file called **pubchem.rb** containing the following code:

```ruby
require 'net/http'

# A very simple PubChem Web API.
class PubChem

  # Returns a molfile (as a String) for the molecule with PubChem
  # CID matching compound_id.
  def self.get_molfile(compound_id)
    molfile = nil
    path = '/summary/summary.cgi?cid=' + compound_id + '&disopt=DisplaySDF'

    Net::HTTP.start('pubchem.ncbi.nlm.nih.gov') do |http|
      response = http.get(path)
      molfile = response.body
    end

    molfile
  end

  # Writes a PNG image, for the molecule with PubChem
  # CID matching compound_id, to the file specified by filename.
  def self.write_image(compound_id, filename)
    path = '/image/imgsrv.fcgi?t=l&cid=' + compound_id

    Net::HTTP.start('pubchem.ncbi.nlm.nih.gov') do |http|
      response = http.get(path)
      image = response.body

      File.open(filename, "w") do |file|
        file << image
      end
    end
  end
end
```

PubChem references each of its compounds by a unique integer identifier, the PubChem CID. This is very handy because retrieving PubChem resources is as simple as encoding a URL containing the CID of interest. The class above illustrates how this system can be used to get a molfile and write a PNG image using just a few lines of Ruby.

Using the `PubChem` class is simplicity itself. To get the molfile for Levonorgestrel (<a href="http://www.go2planb.com/ForConsumers/Index.aspx">Plan B</a>), which has the CID 13109:

```ruby
require 'pubchem'

molfile = PubChem::get_molfile('13109') #=> returns the molfile for Levonorgestrel as a String
```

To write the 2-D structure diagram of Levonorgestrel as a PNG:

```ruby
require 'pubchem'

PubChem::write_png('13109', 'image.png') #=> writes a PNG image of Levonorgestrel
```

This code saves the image below to your working directory as **image.png**. The above two code fragments can either be saved as a file and executed by the Ruby interpreter:

```bash
ruby filename.rb
```

or it they be entered interactively in your console with <a href="http://tryruby.hobix.com/">irb</a>:

```bash
irb
irb(main):001:0>  
```  

As you can see, there's not much to building a PubChem API in Ruby. The same principles discussed here should apply in any programming language. Future articles in this series will show how to build more complex PubChem APIs and integrate them with other software packages and web services.