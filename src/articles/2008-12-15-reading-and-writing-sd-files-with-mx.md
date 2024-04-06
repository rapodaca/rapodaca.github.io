---
title: Reading and Writing SD Files With MX
published: "2008-12-15T00:00:00.000Z"
---

[MDL Structure Data Files (SD Files)](http://www.mdli.com/downloads/public/ctfile/ctfile.jsp) are the de facto standard for the exchange of chemical structures and associated data. As a result, methods for efficiently reading and writing these files play an important part in any cheminformatics toolkit.

The latest release of [MX](http://code.google.com/p/mx-java/), the open source cheminformatics toolkit, adds support for reading and writing SD Files. Both [source](http://code.google.com/p/mx-java/downloads/detail?name=mx-0.107.0-src.tar.gz&can=2&q=) and [platform-independent binary](http://code.google.com/p/mx-java/downloads/detail?name=mx-0.107.0.jar&can=2&q=) distributions are available.

The new release introduces `SDFileReader`. In [interactive JRuby](/articles/2008/11/24/getting-started-with-mx):

```bash
jirb
irb(main):001:0> require 'mx-0.107.0.jar'                       
=> true
irb(main):002:0> import com.metamolecular.mx.io.mdl.SDFileReader
=> Java::ComMetamolecularMxIoMdl::SDFileReader
irb(main):003:0> r=SDFileReader.new 'pubchem_sample_33.sdf'     
=> #&lt;Java::ComMetamolecularMxIoMdl::SDFileReader:0x40b181 @java_object=com.metamolecular.mx.io.mdl.SDFileReader@145b02f>
irb(main):004:0> r.next_record                                  
=> nil
irb(main):005:0> m=r.get_molecule                               
=> #&lt;Java::ComMetamolecularMxModel::DefaultMolecule:0xcb754f @java_object=com.metamolecular.mx.model.DefaultMolecule@60b407>
irb(main):006:0> m.count_atoms                                  
=> 31
irb(main):007:0> r.get_keys                                     
=> #&lt;Java::JavaUtil::ArrayList:0x381d92 @java_object=[PUBCHEM_COMPOUND_CID, PUBCHEM_COMPOUND_CANONICALIZED, PUBCHEM_CACTVS_COMPLEXITY, PUBCHEM_CACTVS_HBOND_ACCEPTOR, PUBCHEM_CACTVS_HBOND_DONOR, PUBCHEM_CACTVS_ROTATABLE_BOND, PUBCHEM_CACTVS_SUBSKEYS, PUBCHEM_IUPAC_OPENEYE_NAME, PUBCHEM_IUPAC_CAS_NAME, PUBCHEM_IUPAC_NAME, PUBCHEM_IUPAC_SYSTEMATIC_NAME, PUBCHEM_IUPAC_TRADITIONAL_NAME, PUBCHEM_NIST_INCHI, PUBCHEM_EXACT_MASS, PUBCHEM_MOLECULAR_FORMULA, PUBCHEM_MOLECULAR_WEIGHT, PUBCHEM_OPENEYE_CAN_SMILES, PUBCHEM_OPENEYE_ISO_SMILES, PUBCHEM_CACTVS_TPSA, PUBCHEM_MONOISOTOPIC_WEIGHT, PUBCHEM_TOTAL_CHARGE, PUBCHEM_HEAVY_ATOM_COUNT, PUBCHEM_ATOM_DEF_STEREO_COUNT, PUBCHEM_ATOM_UDEF_STEREO_COUNT, PUBCHEM_BOND_DEF_STEREO_COUNT, PUBCHEM_BOND_UDEF_STEREO_COUNT, PUBCHEM_ISOTOPIC_ATOM_COUNT, PUBCHEM_COMPONENT_COUNT, PUBCHEM_CACTVS_TAUTO_COUNT, PUBCHEM_BONDANNOTATIONS]>
irb(main):008:0> r.get_data 'PUBCHEM_COMPOUND_CID'              
=&gt; "1"
```

`SDFileReader` implements lazy iteration with `Molecules` and data only being created when requested.

SD Files can be written with `SDFileWriter`. In [interactive JRuby](/articles/2008/11/24/getting-started-with-mx):

```bash
jirb
irb(main):001:0> require 'mx-0.107.0.jar'                       
=> true
irb(main):002:0> import com.metamolecular.mx.io.mdl.SDFileWriter
=> Java::ComMetamolecularMxIoMdl::SDFileWriter
irb(main):003:0> import com.metamolecular.mx.io.Molecules       
=> Java::ComMetamolecularMxIo::Molecules
irb(main):004:0> w=SDFileWriter.new 'output.sdf'                
=> #&lt;Java::ComMetamolecularMxIoMdl::SDFileWriter:0x8a2023 @java_object=com.metamolecular.mx.io.mdl.SDFileWriter@43da1b>
irb(main):005:0> w.write_molecule Molecules.create_benzene      
=> nil
irb(main):006:0> w.write_data 'key', 'value'                    
=> nil
irb(main):007:0> w.close
=> nil
```

For an up-to-date summary of MX's current capabilities, please check out the [MX Homepage](http://code.google.com/p/mx-java/).