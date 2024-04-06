---
title: "A Molecular Language for Modern Chemistry: Getting Started with FlexMol"
published: "2006-12-20T00:00:00.000Z"
---

Existing molecular languages are limited in their ability to represent such commonplace features as multi-center bonding and axial chirality. The practical outcome of these limitations can be seen in <a href="http://depth-first.com/articles/2006/12/12/the-problem-with-ferrocene">PubChem's four separate entries for ferrocene</a> and the inability to fully represent <a href="http://depth-first.com/articles/2006/12/19/ferrocene-and-beyond-a-solution-to-the-molecular-representation-problem">many molecules now in common use by organic chemists</a>.

<a href="http://depth-first.com/articles/2006/12/19/ferrocene-and-beyond-a-solution-to-the-molecular-representation-problem">A recent article</a> touched on a molecular representation system that was capable of far greater expressive power than those currently in use. In this article, I'll introduce FlexMol, an XML implementation of this advanced molecular representation system.

# What is FlexMol?

FlexMol is an XML-based molecular language that's designed to allow the faithful representation of any molecule, regardless of its peculiarities. The following is a list of features that FlexMol can encode:

- Multi-atom, multi-electron bonds
- All known forms of stereochemistry, including axial chirality (e.g., allenes and biarlys), planar chirality (e.g., metallocenes), and non-tetrahedral stereocenters (e.g., square planar and octahedral metal complexes)
- Non-natural isotopic distributions and pure isotopes
- Virtual hydrogens (similar to "implicit hydrogens") through mandatory, explicit enumeration
- Electronic spin, enabling the differentiation of spin states

# What Does FlexMol Look Like?

Let's start with the simple example of benzene:

```xml
<!-- Benzene, represented as "1,3,5-cyclohexatriene" -->
<?xml version="1.0" standalone="yes"?>

<molecule>
  <constitution>
    <atoms>
      <atom id="C0" symbol="C" hydrogens="1" ionization="4"></atom>
      <atom id="C1" symbol="C" hydrogens="1" ionization="4"></atom>
      <atom id="C2" symbol="C" hydrogens="1" ionization="4"></atom>
      <atom id="C3" symbol="C" hydrogens="1" ionization="4"></atom>
      <atom id="C4" symbol="C" hydrogens="1" ionization="4"></atom>
      <atom id="C5" symbol="C" hydrogens="1" ionization="4"></atom>
    </atoms>
    <bonding>
      <bond source="C0" target="C1" bondingElectrons="2"></bond>
      <bond source="C1" target="C2" bondingElectrons="4"></bond>
      <bond source="C2" target="C3" bondingElectrons="2"></bond>
      <bond source="C3" target="C4" bondingElectrons="4"></bond>
      <bond source="C4" target="C5" bondingElectrons="2"></bond>
      <bond source="C0" target="C5" bondingElectrons="4"></bond>
    </bonding>
  </constitution>
</molecule>
```

The above representation divides the structure of benzene into two main elements - <code>atoms</code> and <code>bonding</code>. Both of these elements are in turn subelements of the <code>constitution</code> element, which specifies atom connectivity. Had we been representing a molecule with stereochemical features, the above document could have also contained a <code>configuration</code> element, a <code>conformation</code> element, or both.

Within the <code>atoms</code> element are definitions for each of the six degenerate carbon atoms of benzene. Each atom is assigned a unique ID for use elsewhere in the document, an atomic symbol, the number of hydrogens bonded to each atom, and the effective ionization state of each atom. The mandatory <code>hydrogens</code> attribute specifies "virtual" hydrogens, or those associated with an atom without being full-fledged nodes in the graph representation.

The <code>bonding</code> element defines all of the bonding arrangements within benzene. In this case, benzene is being represented as "cyclohexatriene" with alternating single and double bonds; below we'll see how to use FlexMol to represent delocalized (aromatic) bonding. Each bond specifies a source atom, a target atom, and the number of bonding electrons.

In many situations, the above representation of benzene will not suffice. What if we want to describe the one-electron ionization of benzene to form the benzene radical cation? Using the "cyclohexatriene" form of benzene makes it impossible to select the correct bond from which to take electrons.

Instead, we could use a more physically meaningful representation of benzene, such as that shown below:

```xml
<!-- Benzene, represented with a delocalized pi-system -->
<?xml version="1.0" standalone="yes"?>

<molecule>
  <constitution>
    <atoms>
      <atom id="C0" symbol="C" hydrogens="1" ionization="4"></atom>
      <atom id="C1" symbol="C" hydrogens="1" ionization="4"></atom>
      <atom id="C2" symbol="C" hydrogens="1" ionization="4"></atom>
      <atom id="C3" symbol="C" hydrogens="1" ionization="4"></atom>
      <atom id="C4" symbol="C" hydrogens="1" ionization="4"></atom>
      <atom id="C5" symbol="C" hydrogens="1" ionization="4"></atom>
    </atoms>
    <bonding>
      <bond source="C0" target="C1" bondingElectrons="2"></bond>
      <bond source="C1" target="C2" bondingElectrons="2"></bond>
      <bond source="C2" target="C3" bondingElectrons="2"></bond>
      <bond source="C3" target="C4" bondingElectrons="2"></bond>
      <bond source="C4" target="C5" bondingElectrons="2"></bond>
      <bond source="C0" target="C5" bondingElectrons="2"></bond>
      <bondingSystem bondingElectrons="6">
        <connections>
          <atomPair source="C0" target="C1"></atomPair>
          <atomPair source="C1" target="C2"></atomPair>
          <atomPair source="C2" target="C3"></atomPair>
          <atomPair source="C3" target="C4"></atomPair>
          <atomPair source="C4" target="C5"></atomPair>
          <atomPair source="C0" target="C5"></atomPair>
        </connections>
      </bondingSystem>
    </bonding>
  </constitution>
</molecule>
```

This is certainly more verbose, but what does it buy us? Notice the <code>bondingSystem</code> subelement at the end of the <code>bonding</code> element. Here we define an extended six-atom, six-electron bonding system that much more closely reflects the true nature of benzene's pi-system. Now it's obvious that this is the bonding motif from which to take an electron to make the benzene radical cation.

Next, consider the cyclopenadienyl anion, which possesses a five-atom, six-electron Hueckel aromatic bonding system. We can apply the same principles in representing benzene's pi-system to the representation of the cyclopentadienyl anion's pi-bonding:

```xml
<!-- Cyclopentadienyl Anion -->
<?xml version="1.0" standalone="yes"?>

<molecule>
  <constitution>
    <atoms>
      <atom id="C0" symbol="C" hydrogens="1" ionization="4"></atom>
      <atom id="C1" symbol="C" hydrogens="1" ionization="4"></atom>
      <atom id="C2" symbol="C" hydrogens="1" ionization="4"></atom>
      <atom id="C3" symbol="C" hydrogens="1" ionization="4"></atom>
      <atom id="C4" symbol="C" hydrogens="1" ionization="4"></atom>
    </atoms>
    <bonding>
      <bond source="C0" target="C1" bondingElectrons="2"></bond>
      <bond source="C1" target="C2" bondingElectrons="2"></bond>
      <bond source="C2" target="C3" bondingElectrons="2"></bond>
      <bond source="C3" target="C4" bondingElectrons="2"></bond>
      <bond source="C0" target="C4" bondingElectrons="2"></bond>
      <bondingSystem bondingElectrons="6">
        <connections>
          <atomPair source="C0" target="C1"></atomPair>
          <atomPair source="C1" target="C2"></atomPair>
          <atomPair source="C2" target="C3"></atomPair>
          <atomPair source="C3" target="C4"></atomPair>
          <atomPair source="C0" target="C4"></atomPair>
        </connections>
      </bondingSystem>
    </bonding>
  </constitution>
</molecule>
```

In the above representation, all carbon atoms are equivalent - something difficult, if not impossible, to achieve with most other molecular languages. Furthermore, the representation of delocalized bonding closely matches what most chemists would describe. We could get even more sophisticated and place individual electrons into three separate bonding systems in analogy with molecular orbitals - it really depends on what we'd like to emphasize.

This is well and good for aromaticity, but how can all of this help solve the Ferrocene Problem? Just as with cyclopentadienyl anion and benzene, in the representation of ferrocene below, we're taking advantage of FlexMol's support for multi-atom bonding. In this case, we define three <code>bondingSystems</code>, each of which contain six electrons. We could have just as easily created a single eighteen-electron, eleven-atom bonding system. Our choice of representation again depends on what we're trying to emphasize.

```xml
<!-- Ferrocene -->
<?xml version="1.0" standalone="yes"?>

<molecule>
  <constitution>
    <atoms>
      <atom id="C0" symbol="C" hydrogens="1" ionization="4"></atom>
      <atom id="C1" symbol="C" hydrogens="1" ionization="4"></atom>
      <atom id="C2" symbol="C" hydrogens="1" ionization="4"></atom>
      <atom id="C3" symbol="C" hydrogens="1" ionization="4"></atom>
      <atom id="C4" symbol="C" hydrogens="1" ionization="4"></atom>
      <atom id="C5" symbol="C" hydrogens="1" ionization="4"></atom>
      <atom id="C6" symbol="C" hydrogens="1" ionization="4"></atom>
      <atom id="C7" symbol="C" hydrogens="1" ionization="4"></atom>
      <atom id="C8" symbol="C" hydrogens="1" ionization="4"></atom>
      <atom id="C9" symbol="C" hydrogens="1" ionization="4"></atom>
      <atom id="Fe10" symbol="Fe" hydrogens="0" ionization="8"></atom>
    </atoms>
    <bonding>
      <bond source="C0" target="C1" bondingElectrons="2"></bond>
      <bond source="C1" target="C2" bondingElectrons="2"></bond>
      <bond source="C2" target="C3" bondingElectrons="2"></bond>
      <bond source="C3" target="C4" bondingElectrons="2"></bond>
      <bond source="C0" target="C4" bondingElectrons="2"></bond>
      <bond source="C5" target="C6" bondingElectrons="2"></bond>
      <bond source="C6" target="C7" bondingElectrons="2"></bond>
      <bond source="C7" target="C8" bondingElectrons="2"></bond>
      <bond source="C8" target="C9" bondingElectrons="2"></bond>
      <bond source="C5" target="C9" bondingElectrons="2"></bond>
      <bondingSystem bondingElectrons="6">
        <connections>
          <atomPair source="C0" target="C1"></atomPair>
          <atomPair source="C1" target="C2"></atomPair>
          <atomPair source="C2" target="C3"></atomPair>
          <atomPair source="C3" target="C4"></atomPair>
          <atomPair source="C0" target="C4"></atomPair>
          <atomPair source="C0" target="Fe10"></atomPair>
          <atomPair source="C1" target="Fe10"></atomPair>
          <atomPair source="C2" target="Fe10"></atomPair>
          <atomPair source="C3" target="Fe10"></atomPair>
          <atomPair source="C4" target="Fe10"></atomPair>
        </connections>
      </bondingSystem>
      <bondingSystem bondingElectrons="6">
        <connections>
          <atomPair source="C5" target="C6"></atomPair>
          <atomPair source="C6" target="C7"></atomPair>
          <atomPair source="C7" target="C8"></atomPair>
          <atomPair source="C8" target="C9"></atomPair>
          <atomPair source="C5" target="C9"></atomPair>
          <atomPair source="C5" target="Fe10"></atomPair>
          <atomPair source="C6" target="Fe10"></atomPair>
          <atomPair source="C7" target="Fe10"></atomPair>
          <atomPair source="C8" target="Fe10"></atomPair>
          <atomPair source="C9" target="Fe10"></atomPair>
        </connections>
      </bondingSystem>
      <bondingSystem bondingElectrons="6">
        <connections>
          <atomPair source="C0" target="C1"></atomPair>
          <atomPair source="C1" target="C2"></atomPair>
          <atomPair source="C2" target="C3"></atomPair>
          <atomPair source="C3" target="C4"></atomPair>
          <atomPair source="C0" target="C4"></atomPair>
          <atomPair source="C0" target="Fe10"></atomPair>
          <atomPair source="C1" target="Fe10"></atomPair>
          <atomPair source="C2" target="Fe10"></atomPair>
          <atomPair source="C3" target="Fe10"></atomPair>
          <atomPair source="C4" target="Fe10"></atomPair>
          <atomPair source="C5" target="C6"></atomPair>
          <atomPair source="C6" target="C7"></atomPair>
          <atomPair source="C7" target="C8"></atomPair>
          <atomPair source="C8" target="C9"></atomPair>
          <atomPair source="C5" target="C9"></atomPair>
          <atomPair source="C5" target="Fe10"></atomPair>
          <atomPair source="C6" target="Fe10"></atomPair>
          <atomPair source="C7" target="Fe10"></atomPair>
          <atomPair source="C8" target="Fe10"></atomPair>
          <atomPair source="C9" target="Fe10"></atomPair>
        </connections>
      </bondingSystem>
    </bonding>
  </constitution>
</molecule>
```

The same principles outlined for ferrocene apply equally to other metallocenes. FlexMol can also represent a host of otherwise tough cases such as nonclassical carbocations, allylmetal complexes, resonance-stabilized radicals and ions, and transition states.

# Why XML?

XML provides several often-cited advantages:

- Availability of standardized parser and output libraries
- Human readability
- Adequate mapping to Object-Oriented models for most purposes

Nothing about FlexMol prevents it from being built on top of another data-interchange format. Two of the most interesting alternatives to XML are <a href="http://www.json.org/">JavaScript Object Notation</a> (JSON) and <a href="http://www.yaml.org/">YAML</a>. JSON in particular seems to have learned from XML's experiences and so represents a platform worthy of serious consideration.

# What About Chemical Markup Language?

<a href="http://www.xml-cml.org/">Chemical Markup Language</a> (CML) is a widely-used XML-based molecular language. So why invent yet another XML language for chemistry? Currently, CML does not solve the molecular representation problems discussed in this article and those preceding it. So although FlexMol and CML are both built on XML, they are nevertheless each aimed at addressing different problems. In this respect, FlexMol and CML are complementary.

# Where's the Software?

Any language needs software to make it useful. To simplify the use of FlexMol, it is fully supported by <a href="http://sf.net/projects/octet">Octet</a>, an Open Source framework written in Java. Supporting FlexMol in other cheminformatics toolkits will likely be challenging due to <a href="http://en.wikipedia.org/wiki/Impedance_mismatch">impedance mismatch</a>; FlexMol can precisely encode a variety of structural concepts that simply don't exist elsewhere.

# Conclusions

Existing molecular languages lack the expressive power to represent many structural motifs in widespread use by today's chemists. FlexMol was designed to solve this problem. Future articles in this series will demonstrate how FlexMol documents can be read and written, as well as showing some techniques for manipulating the resulting molecular representations.