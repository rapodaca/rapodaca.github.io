---
title: "Hacking NMRShiftDB"
published: "2006-09-04T00:00:00.000Z"
---

<a href="http://nmrshiftdb.org">NMRShiftDB</a> is an open web database of peer-reviewed NMR chemical shifts compiled by volunteers. As of this writing, it contains 22,429 measured spectra from 18,986 structures, and reports 927 registered users. The <a href="http://sourceforge.net/projects/nmrshiftdb/">database code</a> itself is open source.

Although NMRShiftDB has a web interface, its architecture is designed to simplify writing programs that use it. A <a href="http://depth-first.com/articles/2006/08/30/hacking-pubchem-with-ruby">previous article</a> showed how a working <a href="http://pubchem.ncbi.nlm.nih.gov/">PubChem</a> API could be written with just a few lines of Ruby. This time, I'll show how the same thing can be done for NMRShiftDB.

# Ingredients

This tutorial uses Arton's excellent <a href="http://rjb.rubyforge.org/">Ruby Java Bridge</a>, the installation and use of which has been <a href="http://depth-first.com/articles/2006/08/26/scripting-java-libraries-with-ruby-java-bridge">previously discussed</a>. Also used is Ruby's InChI interface, <a href="http://rubyforge.org/projects/rino">Rino</a>, for which installation instructions are <a href="http://depth-first.com/articles/2006/08/17/ruby-and-inchi-the-rino-library">here</a>.

Create a working directory called `nmr`. Into this directory, copy `cdk-20060714.jar`, which can be <a href="http://prdownloads.sourceforge.net/cdk/cdk-20060714.jar?download">downloaded here</a>.

# Code

Create a file called `nmr.rb` containing the following Ruby code:

```ruby
require 'net/http'
require 'smi2inchi'

# A very simple NMRShiftDB Web API.
class NMRFetcher

  # Creates a `Translator` instance.
  def initialize
    @translator = Translator.new
  end

  # Returns an XML record, as a string, for the molecule
  # with SMILES matching `smiles` and spectrum type
  # matching `spectrumtype` (13C, 1H, 15N and 31P).
  def get_record(smiles, spectrumtype)
    body = nil
    inchi = (smi2inchi(smiles)).gsub('InChI=', 'inchi=')
    path = '/NmrshiftdbServlet?nmrshiftdbaction=exportcmlbyinchi&' + inchi + '&spectrumtype=' + spectrumtype

    Net::HTTP.start('nmrshiftdb.ice.mpg.de') do |http|
      response = http.get(path)
      body = response.body
    end

    if !valid_record?(body)
      return nil
    end

    body
  end

private

  def valid_record?(body)
    !body.eql?('No such molecule or spectrum')
  end

  def smi2inchi(smiles)
    @translator.translate(smiles)
  end
end
```

The magic in the above code is nothing more than a simple HTTP request sent to `nmrshiftdb.ice.mpg.de`, contained in the `get_record` method. This request encodes an InChI identifier, which is generated from the SMILES string passed as an argument. We also specify a spectrum type.

Now create a file called `smi2inchi.rb`, containing the following Ruby code:

```rb
ENV['CLASSPATH'] = './cdk-20060714.jar'
require 'rubygems'
require_gem 'rjb'
require_gem 'rino'
require 'rjb'

StringWriter = Rjb::import 'java.io.StringWriter'

SmilesParser = Rjb::import 'org.openscience.cdk.smiles.SmilesParser'
MDLWriter = Rjb::import 'org.openscience.cdk.io.MDLWriter'

# Converts a SMILES string into an InChI identifier using
# the CDK Library (Java) and the Rino Library (Ruby/C).
class Translator

  def initialize
    @smiles_parser = SmilesParser.new
    @mdl_writer = MDLWriter.new
    @mol2inchi = Rino::MolfileReader.new
  end

  # Returns an InChI identifier from the specified SMILES string.
  # Uses the CDK classes SmilesParser and MDLWriter to generate
  # a molfile from a SMILES string. Then this molfile is
  # parsed by Rino::MolfileReader.
  def translate(smiles)
    mol = @smiles_parser.parseSmiles(smiles)

    sw = StringWriter.new

    @mdl_writer.setWriter(sw)
    @mdl_writer.write(mol)

    @mol2inchi.read(sw.toString)
  end
end
```

The description and use of this code was discussed in <a href="http://depth-first.com/articles/2006/08/26/from-smiles-to-inchi-rino-cdk-and-java-ruby-bridge">a recent article</a> on generating InChI identifiers from SMILES strings.

Before using the code we've just created you'll need to set the `LD_LIBRARY_PATH` (or equivalent) to point to the native Java libraries. On Linux with Sun's JDK, this is done from the command line with:

```bash
export LD_LIBRARY_PATH=$JAVA_HOME/jre/lib/i386:$LD_LIBRARY_PATH
```

Using the `NMRFetcher` class is just a matter of creating an instance, and invoking `get_record` with the desired SMILES string and spectrum type (1H, 13C). Doing so returns a CML document containing the structure of the compound and its spectrum. If no record matches, the method returns `nil`. The code below give an example in which the CML output is pretty-printed using the wonderful Ruby API for XML, <a href="http://www.germane-software.com/software/rexml/">REXML</a>:

```ruby
require "rexml/document"
require 'nmr'

nmr = NMRFetcher.new
smiles = 'c1ccccc1' #benzene, to keep things simple
type = '13C'
record = nmr.get_record(smiles, type)

if record #pretty-print the CML record using REXML
  file = File.new('result.xml', 'w')

  (REXML::Document.new(record)).write(file, 0)

  file.close
else #write an error
  File.open('result.error', 'w') do |file|
    file << 'No record of SMILES: ' + smiles
  end
end
```

The above code can be put into a file (`test.rb`) and run:

```bash
ruby test.rb
```

Alternatively, it can be entered interactively and played with using irb:

```bash
irb
irb(main):001:0>
```

# Output

The program produces the following <a href="http://www.xml-cml.org/">Chemical Markup Language</a> output in a file called `result.xml`:

```xml
<cml>
  <molecule title='Benzene' id='nmrshiftdb7901' xmlns='http://www.xml-cml.org/schema/cml2/core'>
    <atomArray xmlns='http://www.xml-cml.org/schema'>
      <atom elementType='C' y2='0.7625' x2='-1.4063' id='a1' formalCharge='0' hydrogenCount='0'/>
      <atom elementType='C' y2='0.35' x2='-2.1207' id='a2' formalCharge='0' hydrogenCount='0'/>
      <atom elementType='C' y2='-0.475' x2='-2.1207' id='a3' formalCharge='0' hydrogenCount='0'/>
      <atom elementType='C' y2='-0.8875' x2='-1.4063' id='a4' formalCharge='0' hydrogenCount='0'/>
      <atom elementType='C' y2='-0.475' x2='-0.6918' id='a5' formalCharge='0' hydrogenCount='0'/>
      <atom elementType='C' y2='0.35' x2='-0.6918' id='a6' formalCharge='0' hydrogenCount='0'/>
    </atomArray>
    <bondArray xmlns='http://www.xml-cml.org/schema'>
      <bond atomRefs2='a1 a2' order='S' id='b1'/>
      <bond atomRefs2='a2 a3' order='D' id='b2'/>
      <bond atomRefs2='a3 a4' order='S' id='b3'/>
      <bond atomRefs2='a4 a5' order='D' id='b4'/>
      <bond atomRefs2='a5 a6' order='S' id='b5'/>
      <bond atomRefs2='a1 a6' order='D' id='b6'/>
    </bondArray>
  </molecule>
  <spectrum moleculeRef='nmrshiftdb7901' xmlns:cml='http://www.xml-cml.org/dict/cml' xmlns:cmlDict='http://www.xml-cml.org/dict/cmlDict' xmlns:siUnits='http://www.xml-cml.org/units/siUnits' type='NMR' xmlns:macie='http://www.xml-cml.org/dict/macie' xmlns:units='http://www.xml-cml.org/units/units' id='nmrshiftdb15502' xmlns:subst='http://www.xml-cml.org/dict/substDict' xmlns:nmr='http://www.nmrshiftdb.org/dict' xmlns='http://www.xml-cml.org/schema/cml2/spect'>
    <conditionList xmlns='http://www.xml-cml.org/schema'>
      <scalar dataType='xsd:string' units='siUnits:k' dictRef='cml:temp'>298</scalar>
      <scalar dataType='xsd:string' units='siUnits:hertz' dictRef='cml:field'>Unreported</scalar>
    </conditionList>
    <metadataList xmlns='http://www.xml-cml.org/schema'>
      <metadata name='nmr:OBSERVENUCLEUS' content='13C'/>
    </metadataList>
    <peakList xmlns='http://www.xml-cml.org/schema'>
      <peak xUnits='units:ppm' peakShape='sharp' xValue='128.5' id='p0' atomRefs='a1 a2 a3 a4 a5 a6'/>
    </peakList>
  </spectrum>
</cml>
```

The kind of output produced by NMRFetcher and NMRShiftDB could be used in a variety of ways. Notice, near the bottom of the document, how peak assignments are made relative the the atom labels in the `molecule` declaration. It should be possible, for example, to create interactive 2-D structure diagrams from this document in which a user mouses over an atom and gets a C-13 chemical shift.

NMRShiftDB is a valuable and free online resource for NMR spectroscopy. Programatically mixing its capabilities with free software and other online services offers numerous opportunities to build innovative chemical informatics systems.