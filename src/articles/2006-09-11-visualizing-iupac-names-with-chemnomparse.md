---
title: "Visualizing IUPAC Names with ChemNomParse"
published: "2006-09-11T00:00:00.000Z"
---

<a href="http://depth-first.com/articles/2006/09/10/chemical-nomenclature-translation">Nomenclature translation</a> is the process of converting a human-readable chemical name into a machine-readable notational scheme such as a connection table. It plays a key role in linking the <a href="http://depth-first.com/articles/2006/09/03/peculiarities-of-chemical-information">older chemical literature</a> to modern information technologies, such as the Internet.

Buried deep within the <a href="http://cdk.sf.net">Chemistry Development Kit</a> (CDK) is a library for nomenclature translation called <a href="http://chemnomparse.sourceforge.net/">ChemNomParse</a>. At the heart of ChemNomParse is a remarkable piece of software called the <a href="https://javacc.dev.java.net/">Java Compiler Compiler</a> (JavaCC), a parser generator and lexical analyzer generator for Java. A FAQ on JavaCC is available <a href="http://www.engr.mun.ca/~theo/JavaCC-FAQ/javacc-faq-moz.htm">here</a>.

This tutorial demonstrates how freely-available, open source tools can be used to parse an IUPAC chemical name and generate its corresponding 2-D structure rendering. A <a href="http://depth-first.com/articles/2006/09/02/humanizing-line-notations">closely-related tutorial</a> on generating 2-D structures from SMILES strings may be helpful as background.

# Ingredients

This tutorial uses Arton's <a href="http://rjb.rubyforge.org/">Ruby Java Bridge</a>, the installation and use of which has been outlined <a href="http://depth-first.com/articles/2006/08/26/scripting-java-libraries-with-ruby-java-bridge">previously</a>. In addition, you'll need to download <a href="http://prdownloads.sourceforge.net/structure/structure-cdk-0.1.2.zip?download">Structure-CDK v0.1.2</a>, also <a href="http://depth-first.com/articles/2006/08/28/drawing-2-d-structures-with-structure-cdk">previously discussed</a>. Be sure to download v0.1.2, as two upgrades have been released since the package was originally described. This tutorial has been tested on Mandriva Linux 2006.

Create a working directory called `nom`. From the `lib` directory of the Structure-CDK distribution, copy `cdk-20060714.jar` and `structure-cdk-0.1.2.jar` into your `depict` working directory.

# Code

Create a file called `depict.rb` and copy the following code into it:

```ruby
ENV['CLASSPATH'] = './cdk-20060714.jar:./structure-cdk-0.1.2.jar'

require 'rubygems'
require_gem 'rjb'
require 'rjb'

NomParser = Rjb::import 'org.openscience.cdk.iupac.parser.NomParser'
StructureDiagramGenerator = Rjb::import 'org.openscience.cdk.layout.StructureDiagramGenerator'
ImageKit = Rjb::import 'net.sf.structure.cdk.util.ImageKit'

class Depictor

  def initialize
    @sdg = StructureDiagramGenerator.new
  end

  def depict_png(nom, width, height, path_to_png)
    ImageKit::writePNG(nom_to_mol(nom), width, height, path_to_png)
  end

  def depict_svg(nom, width, height, path_to_svg)
    ImageKit::writeSVG(nom_to_mol(nom), width, height, path_to_svg)
  end

private

  def nom_to_mol(nom)
    @sdg.setMolecule(NomParser::generate(nom))
    @sdg.generateCoordinates

    @sdg.getMolecule
  end
end
```

After you save this file, you'll need to set your <code>LD_LIBRARY_PATH</code> on unix (or the equivalent on another OS):

```bash
export LD_LIBRARY_PATH=$JAVA_HOME/jre/lib/i386:$LD_LIBRARY_PATH
```

This tells RJB where to find Java's native libraries. Because of RJB's current design, <code>LD_LIBRARY_PATH</code> needs to be set from the command line, rather than from within a Ruby process.

Using the Depictor class is as simple as creating an instance and invoking <code>depict_png</code> or <code>depict_svg</code> on it:

```ruby
require 'nom'

depictor = Depictor.new

depictor.depict_png('2-phenylcyclohexan-1-ol', 300, 300, 'output.png')
```

Executing the above code either through the Ruby interpreter (ruby) or via Interactive Ruby (irb) products a PNG image of the chiral auxiliary shown below:

Other names correctly recognized by ChemNomParse include:

- phenylhexyne
- 2-chloro-3-phenyl-4,4-dimethylhexane
- 3-phenyl-1-aminopropane
- 1,2-difluoro-3-hydroxycyclohexene

# Limitations

Many chemical names, ranging from the simple to the complicated, were not be recognized at all by ChemNomParse. Some examples are:

- benzene
- piperidine
- 1-methoxyhexane
- 2-methyl-5-prop-1-en-2-yl-cyclohex-2-en-1-one (carvone)

Some names were incorrectly interpreted due to misassigned locants. For example, 2-chloro-3-hydroxybutanoic acid produced the incorrectly asssigned structure shown below:

ChemNomParse can accurately recognize chemical names representing simple substitutions on basic hydrocarbon scaffolds. More complicated structures, such as heterocycles, bicyclic systems, and systems involving nested substituents  do not appear to be handled at all. It is not clear to what extent these limitations reflect a small dictionary of morphemes (the basic nomenclature building blocks) versus deeper design issues.

Despite its limitations, ChemNomParse is an interesting piece of open source software for working with chemical nomenclature. From this simple tutorial, it can be seen that nomenclature translation, when combined with other capabilities such as 2-D rendering, offers many exciting possibilities.