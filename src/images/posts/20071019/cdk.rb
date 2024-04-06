# The Rubidium Cheminformatics Toolkit for Ruby
#
# Copyright (c) 2007 Richard L. Apodaca
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:
#
# The above copyright notice and this permission notice shall be included in
# all copies or substantial portions of the Software.
#
# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
# THE SOFTWARE.

require 'java'

module CDK
  class Conversion
    attr_accessor :molecule

    def initialize
      @readers = {'mol'   => MolfileReader.new,
                  'inchi' => InChIReader.new,
                  'smi'   => SmilesReader.new,
                  'iupac' => IUPACReader.new}
      @writers = {'mol'   => MolfileWriter.new,
                  'inchi' => InChIWriter.new,
                  'smi'   => SmilesWriter.new}
    end

    def set_formats in_format, out_format
      set_in_format in_format
      set_out_format out_format
    end

    def convert input
      read input
      write
    end

    def set_in_format format
      raise "No input format matching #{format}" unless @readers[format]

      @in_format = format
    end

    def set_out_format format
      raise "No output format matching #{format}" unless @writers[format]

      @out_format = format
    end

    def read input
      raise "No input format" unless @in_format

      @molecule = @readers[@in_format].read input

      @molecule != nil
    end

    def write
      raise "No output format" unless @out_format

      @writers[@out_format].write @molecule
    end
  end

  class MolfileReader
    import 'java.io.StringReader'
    import 'org.openscience.cdk.io.MDLReader'
    import 'org.openscience.cdk.Molecule'

    def initialize
      @reader = MDLReader.new
    end

    def read molfile
      @reader.set_reader StringReader.new(molfile)
      @reader.read Molecule.new
    end
  end

  class InChIReader
    import 'org.openscience.cdk.inchi.InChIGeneratorFactory'
    import 'org.openscience.cdk.Molecule'

    def initialize
      @factory = InChIGeneratorFactory.new
    end

    def read inchi
      Molecule.new @factory.getInChIToStructure(inchi).atom_container
    end
  end

  class SmilesReader
    import 'org.openscience.cdk.smiles.SmilesParser'

    def initialize
      @reader = SmilesParser.new
    end

    def read smiles
      @reader.parse_smiles smiles
    end
  end

  class IUPACReader
    import 'java.io.StringReader'
    import 'uk.ac.cam.ch.wwmm.opsin.NameToStructure'
    import 'org.openscience.cdk.io.CMLReader'
    import 'org.openscience.cdk.ChemFile'

    def initialize
      @iupac_reader = NameToStructure.new
      @cml_reader = CMLReader.new
    end

    def read name
      cml = @iupac_reader.parse_to_cml(name)

      raise "Could not parse '#{name}'." unless cml

      @cml_reader.set_reader StringReader.new(cml.to_xml)

      chem_file = @cml_reader.read ChemFile.new

      chem_file.chem_sequence(0).chem_model(0).molecule_set.molecule(0)
    end
  end

  class MolfileWriter
    import 'java.io.StringWriter'
    import 'org.openscience.cdk.io.MDLWriter'

    def initialize
      @writer = MDLWriter.new
    end

    def write mol
      string_writer = StringWriter.new

      @writer.set_writer string_writer
      @writer.write_molecule mol
      @writer.close

      string_writer.to_string
    end
  end

  class InChIWriter
    import 'org.openscience.cdk.inchi.InChIGeneratorFactory'
    import 'org.openscience.cdk.tools.HydrogenAdder'

    def initialize
      @factory = InChIGeneratorFactory.new
      @hydrogen_adder = HydrogenAdder.new
    end

    def write mol
      @hydrogen_adder.add_implicit_hydrogens_to_satisfy_valency mol
      @factory.getInChIGenerator(mol).inchi
    end
  end

  class SmilesWriter
    import 'java.io.StringWriter'
    import 'org.openscience.cdk.io.SMILESWriter'

    def initialize
      @writer = SMILESWriter.new
    end

    def write mol
      string_writer = StringWriter.new

      @writer.set_writer string_writer
      @writer.write mol
      @writer.close

      string_writer.to_string.strip
    end
  end
end 
