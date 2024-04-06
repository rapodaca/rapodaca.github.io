---
title: Calculating Molecular Mass With MX - Using a Complete Hydrogen to Uranium System of Atomic Masses Linked to the Primary Literature
published: "2008-12-08T00:00:00.000Z"
---

Calculating molecular mass is an important capability in cheminformatics. Performing the calculation itself is trivial, but determining what the masses will be used can be tricky. Ideally, each measurement in a system of atomic masses and isotopic distributions would be traceable to the primary literature.

[MX](http://code.google.com/p/mx-java/) is an open source cheminformatics toolkit written in Java that can be used without modification in a variety of other languages including [Python](/articles/2008/12/01/open-source-cheminformatics-in-python-with-mx) and [Ruby](/articles/2008/11/24/getting-started-with-mx). The latest release of MX, [v0.106.0](http://code.google.com/p/mx-java/downloads/list) includes a complete hydrogen to uranium system of atomic masses linked to the primary literature.

You can try out the new feature with an [interactive Jython shell](/articles/2008/12/01/open-source-cheminformatics-in-python-with-mx) (or [interactive JRuby](/articles/2008/11/24/getting-started-with-mx), if you'd prefer). Let's calculate the molecular mass of cubane. After downloading the [mx-0.106.0 jarfile to your working directory](http://mx-java.googlecode.com/files/mx-0.106.0.jar), use:

```bash
Jython Completion Shell
Jython 2.5b0 (trunk:5540, Oct 31 2008, 13:55:41) 
[Java HotSpot(TM) Client VM (Sun Microsystems Inc.)] on java1.5.0_16
>>> import sys
>>> sys.path.append("mx-0.106.0.jar")
>>> from com.metamolecular.mx.io.daylight import SMILESReader
>>> from com.metamolecular.mx.calc import MassCalculator
>>> c=MassCalculator()
>>> c.findAveragedMass(SMILESReader.read("C12C3C4C1C5C4C3C25"))
104.14912000000001
```

Using this new calculator is quite easy. One minor detail is the "1" at the end of result, which appears to be a Java floating point issue unrelated to the system of atomic masses.

MX uses [an XML file](http://github.com/rapodaca/mx/tree/master/resources/atomic_system.xml) compiled from the definitive [IUPAC publication on atomic masses](http://www.iupac.org/publications/pac/75/6/0683/). The source of each measurement is cited, complete with uncertainty. More information on this file and its uses is available [here](/articles/2007/02/02/octet-fundamentals-a-documented-system-of-atomic-masses).