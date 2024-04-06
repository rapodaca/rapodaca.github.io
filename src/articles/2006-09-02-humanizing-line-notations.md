---
title: "Humanizing Line Notations"
published: "2006-09-02T00:00:00.000Z"
---

<a href="http://depth-first.com/articles/tag/linenotation">Line notations</a> are useful for encoding molecular structure with computers, especially in a network environment. Because line notations are compact and ASCII-based, they can, among other purposes, be used to <a href="http://dx.doi.org/10.1039/b502828k">query popular Web search engines</a> for chemical content on the web. Useful as line notations are for computers, they are not as useful to humans, who would much rather have a 2-D structure diagram to look at.

<a href="http://www.daylight.com/daycgi/depict">Depict</a> is an example of software that generates 2-D structure renderings from a SMILES string. Behind the scenes, the software parses the SMILES string, creates a connection table, determines 2-D coordinates for its atoms, and produces a raster image of the result. Software accomplishing the same task is also available from <a href="http://demo.eyesopen.com/cgi-bin/depict">OpenEye</a>. In this tutorial, you'll see one way to create free Depict-like functionality from Open Source tools.

# The Ingredients

This tutorial uses Arton's <a href="http://rjb.rubyforge.org/">Ruby Java Bridge</a>, the installation and use of which has been outlined <a href="http://depth-first.com/articles/2006/08/26/scripting-java-libraries-with-ruby-java-bridge">previously</a>. In addition, you'll need to download <a href="http://prdownloads.sourceforge.net/structure/structure-cdk-0.1.2.zip?download">Structure-CDK v0.1.2</a>, also <a href="http://depth-first.com/articles/2006/08/28/drawing-2-d-structures-with-structure-cdk">previously discussed</a>. Be sure to download v0.1.2, as two upgrades have been released since the package was originally discussed.This tutorial has been tested on Mandriva Linux 2006.

Create a working directory called `depict`. From the `lib` directory of the Structure-CDK distribution, copy `cdk-20060714.jar` and `structure-cdk-0.1.2.jar` into your `depict` working directory.

# The Code

Now create a file called `depict.rb` and copy the following code into it:

```ruby
ENV['CLASSPATH'] = './cdk-20060714.jar:./structure-cdk-0.1.2.jar'

require 'rubygems'
require_gem 'rjb'
require 'rjb'

SmilesParser = Rjb::import 'org.openscience.cdk.smiles.SmilesParser'
StructureDiagramGenerator = Rjb::import 'org.openscience.cdk.layout.StructureDiagramGenerator'
ImageKit = Rjb::import 'net.sf.structure.cdk.util.ImageKit'

class Depictor

  def initialize
    @smiles_parser = SmilesParser.new
    @sdg = StructureDiagramGenerator.new
  end

  def depict_png(smiles, width, height, path_to_png)
    ImageKit::writePNG(smi_to_mol(smiles), width, height, path_to_png)
  end

  def depict_svg(smiles, width, height, path_to_svg)
    ImageKit::writeSVG(smi_to_mol(smiles), width, height, path_to_svg)
  end

  def smi_to_mol(smiles)
    @sdg.setMolecule(@smiles_parser.parseSmiles(smiles))
    @sdg.generateCoordinates

    @sdg.getMolecule
  end
end
```

After you save this file, you'll need to set your `LD_LIBRARY_PATH` on unix (or the equivalent on another OS):

```bash
export LD_LIBRARY_PATH=$JAVA_HOME/jre/lib/i386:$LD_LIBRARY_PATH
```

This tells RJB where to find Java's native libraries. Because of RJB's current design, <tt>LD_LIBRARY_PATH</tt> needs to be set from the command line, rather than from within a Ruby process.

Using the <tt>Depictor</tt> class is simple. For example, to generate SVG and PNG images of desloratadine (Clarinex):

```ruby
require 'depict'

depictor = Depictor.new

depictor.depict_svg('Clc4ccc3C(=C1CCNCC1)c2ncccc2CCc3c4', 300, 300, 'desloratadine.svg')
depictor.depict_png('Clc4ccc3C(=C1CCNCC1)c2ncccc2CCc3c4', 300, 300, 'desloratadine.png')
```

# The Output

Running the above code, either with the Ruby interpreter (ruby) or with Interactive Ruby (irb) will produce an SVG and a PNG image in your `depict` directory containing the 2-D structure of the popular antihistamine (see image below). Scalable Vector Graphics (SVG) format is a popular, XML-based vector graphics encoding system that can be viewed with the <a href="http://www.mozilla.com/firefox/">Firefox browser</a> and several other software packages.

The code we've used here takes advantage of convenience methods in the Structure-CDK library. However, it is possible to customize the output in several ways, including line thickness, line spacing, color scheme, and atom label height by using the library's lower-level API.

Being able to render a human-readable structure diagram from a line notation is useful in many situations. As you can see, this complex process can be accomplished quickly using Ruby, Java and open source chemical informatics libraries. Future articles will make use of this capability in building more complex chemical informatics systems.