---
title: Reading SMILES with MX
published: "2008-12-03T00:00:00.000Z"
---

The [latest release](http://code.google.com/p/mx-java/downloads/list) of [MX](http://code.google.com/p/mx-java/), the Java toolkit for cheminformatics, now supports reading a subset of [SMILES strings](http://www.daylight.com/smiles/). Although incomplete, full support for this feature is planned within a few releases.

To get an idea of how to use the new SMILES reader, we can use [interactive JRuby](/articles/2008/11/24/getting-started-with-mx). Assuming we've downloaded the [mx-0.105.0 jarfile](http://mx-java.googlecode.com/files/mx-0.105.0.jar) to our working directory, we can use:

```bash
jirb
irb(main):001:0> require 'mx-0.105.0.jar'                            
=> true
irb(main):002:0> import com.metamolecular.mx.io.daylight.SMILESReader
=> Java::ComMetamolecularMxIoDaylight::SMILESReader
irb(main):003:0> bromobenzene = SMILESReader.read 'C1=CC=CC=C1Br'    
=> #&lt;Java::ComMetamolecularMxModel::DefaultMolecule:0x8a2023 @java_object=com.metamolecular.mx.model.DefaultMolecule@182a70>
irb(main):004:0> bromobenzene.count_atoms                            
=> 7
irb(main):005:0> bromobenzene.get_atom(6).get_symbol                 
=> "Br"
```
