---
title: "MX Snippets Part 1: Generate Molecular Fingerprints From the Command Line"
published: "2010-01-11T00:00:00.000Z"
---

[Molecular fingerprints](/articles/2008/10/02/fast-substructure-search-using-open-source-tools-part-1-fingerprints-and-databases) play an important role in cheminformatics. [MX](http://metamolecular.com/mx), the high-performance cheminformatics toolkit written in Java, comes complete with the ability to generate molecular fingerprints. This article, the first of a new series discussing MX through compilable snippets of Java code, shows how to interactively test fingerprints in MX through a simple command-line utility.

# What the Program Does

From the command line, the program accepts a SMILES string as input and returns the indices of all bits set using the MX PathFingerprinter:

```bash
$ java -cp .:mx-1.0-beta-2.jar FPTest
> CCCCC
{185, 293, 595, 742, 927}
> CCCCCC
{185, 293, 338, 595, 742, 927}
> C1CCCCC1 
{185, 194, 293, 338, 595, 742, 927}
> exit
```

After entering a SMILES string, the program prints out the indices of all of the bits set in a 1024-bit fingerprint. As you can see, each fingerprint in the progression pentane&nbsp;&gt;hexane&nbsp;&gt;cyclohexane is a superset of its predecessors. This is, of course, the feature that makes fingerprints so useful for [substructure search](/articles/2008/10/02/fast-substructure-search-using-open-source-tools-part-1-fingerprints-and-databases).

Note: the MX SMILES parser is only partially implemented at the moment and will not accept isotopes, stereochemistry, or lower-case atom labels.

# Create a Workspace

Create a workspace and download the [MX jarfile](http://cloud.github.com/downloads/metamolecular/mx/mx-1.0-beta-2.jar):

```bash
$ mkdir fptest
$ cd fptest
$ wget http://cloud.github.com/downloads/metamolecular/mx/mx-1.0-beta-2.jar
```

# The Code

Create a file called 'FPTest.java' containing:

```java
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.IOException;
import java.util.BitSet;
import com.metamolecular.mx.io.daylight.SMILESReader;
import com.metamolecular.mx.model.Molecule;
import com.metamolecular.mx.fingerprint.PathFingerprinter;

public class FPTest {
  private static PathFingerprinter fingerprinter = new PathFingerprinter();

  public static void main(String[] args) {
    try {
      BufferedReader in = new BufferedReader(new InputStreamReader(System.in));
      String str = "";
      while (str != null) {
          System.out.print("> ");
          str = in.readLine();
          processInput(str);
      }
    } catch (IOException e) {
    }
  }
  public static void processInput(String input) {
    if ("exit".equals(input)) {
      System.exit(0);
    }
    Molecule molecule = SMILESReader.read(input);
    BitSet fp = fingerprinter.getFingerprint(molecule);
    System.out.println(fp);
  }
}
```

# Compile

```bash
javac -cp mx-1.0-beta-2.jar FPTest.java
```

# Conclusions

A good fingerprint generator is a powerful item in any cheminformatics toolbox. This tutorial has shown a simple method for getting started with fingerprints using MX.