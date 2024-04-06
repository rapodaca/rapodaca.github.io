---
title: Dark Corners of the Molfile Specification - Sgroups and Substructure Abbreviations
published: "2009-06-10T00:00:00.000Z"
---

The [molfile specification](http://metamolecular.com/cheminformatics/molfile-format/) is chemistry's de facto standard for the exchange of chemical structures. [Tracing its history back to at least 1979](http://dx.doi.org/10.1021/ci00007a012), the V2000 Molfile format is now supported in varying degrees by nearly every vendor and product on the market today. Despite its limitations, molfile has stood the test of time remarkably well.

When presenting chemical structures to chemists, sometimes its convenient to abbreviate large groups with text labels. For example, a phenyl group can be shortened to "Ph". Likewise a t-butyloxycarbonyl group can be represented as "BOC." The amino acid glycine can be represented as "Gly", and so on. This article discusses how the molfile format allows for this kind of abbreviated structure representation using a feature called "Sgroups."

# A Family of File Formats

One of the most useful aspects of the molfile specification is its modularity. Molfile is actually a member of a family of file formats referred to as "CTFile" (Chemical Table File).

![CTFile](/images/posts/20090610/ctfile.png "CTFile")

As you can see, molfile is composed of the simpler Ctab element and is itself part of RGfile (Rgroup query file), SDfile (Structure Data file), and RDfile (reaction-data file) flavors.

# Sgroup

For encoding most specific small molecules, little more is needed than the Atoms block, the Bonds block, and a few properties. To encode higher-level molecular concepts, we need to turn to more advanced molfile features.

From the [original paper describing them](http://dx.doi.org/10.1021/ci00004a003), an Sgroup (substructure group) is:

>... a persistent collection of atoms and bonds, i.e., as an identified substructure that is maintained as an integral part of the connection table. Because Sgroups are maintained in connection tables, they can be stored in transfer files and databases and can be searched. ...

Sgroups are part of a larger hierarchy within the molfile format:

-  data sgroup
-  chemical sgroup
  -  polymers
  -  components, mixtures, and formulations
  -  drawing and display shortcuts
     -  multiple groups
     -  generics
     -  superatoms

In other words, superatoms are a type of display shortcut, which is in turn a kind of chemical Sgroup.

# Example

The following example (forwarded to me by a [ChemWriter](http://chemwriter.com) user who created it with ChemDraw) is a V2000 molfile representation for nitrobenzene in which the nitro group is shortened to "NO2":

```bash
Untitled ACS Document 1996-1
  ChemDraw05180908552D

  9  9  0  0  0  0  0  0  0  0999 V2000
   -0.7145   -0.2042    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
   -0.7145   -1.0292    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.0000   -1.4417    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.7145   -1.0292    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.7145   -0.2042    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.0000    0.2083    0.0000 C   0  0  0  0  0  0  0  0  0  0  0  0
    0.0000    1.0306    0.0000 N   0  3  0  0  0  0  0  0  0  0  0  0
    0.7121    1.4417    0.0000 O   0  0  0  0  0  0  0  0  0  0  0  0
   -0.7121    1.4417    0.0000 O   0  5  0  0  0  0  0  0  0  0  0  0
  1  2  2  0      
  2  3  1  0      
  3  4  2  0      
  4  5  1  0      
  5  6  2  0      
  6  1  1  0      
  6  7  1  0      
  7  8  2  0      
  7  9  1  0      
M  CHG  2   7   1   9  -1
M  STY  1   1 SUP
M  SLB  1   1   1
M  SAL   1  3   7   8   9
M  SBL   1  1   7
M  SMT   1 NO2
M  SCL   1  
M  SBV   1   7    0.0000   -0.8222
M  END
```

The superatom definition occurs starting with the line "M  STY...". Let's take them one at a time:

```bash
M  STY  1   1 SUP
```

Here, we specify the type of Sgroup we'll be defining ("SUP" for superatom), and assign it the index value of 1.

```bash
M  SLB  1   1   1
```

Next, we give the Sgroup a unique integer label (1).

```bash
M  SAL   1  3   7   8   9
```

We need a list of atoms in the group (7, 8, and 9), which is what the line above does.

```bash
M  SBL   1  1   7
```

We also need to define the bond (in this case only one) that connects the explicit part of the structure to the superatom. In our example, this is bond 7 (C-N).

```bash
M  SMT   1 NO2
```

A display program needs to have a label for the superatom, which is what the line above defines ("NO2").

```bash
M  SCL   1  
```

The Superatom class property was added in 2007 "to support the chemical representation enhancements of ISIS Desktop 2.0." Not much documentation on this feature is availalble.

```bash
M  SBV   1   7    0.0000   -0.8222
```

For a superatom attached to a main structure though a single bond, the vector for the attachment is obvious. Because V2000 supports multiple attachment point, however, it's necessary to specify a bond vector to tell a display program how to draw the connection to the superatom. The line above specifies a vector of (0, -0.8222) for the superatom bond identified with index 7.

# Conclusions

The molfile specification has been extended and adapted over the course of thirty years of commercial use. It offers many features for representing and displaying more complex concepts in cheminformatics, including display shortcuts for functional groups.

In a future installment in this series, I'll highlight an implementation of superatom capability in the open source cheminformatics toolkit [Mx](http://metamolecular.com/mx).