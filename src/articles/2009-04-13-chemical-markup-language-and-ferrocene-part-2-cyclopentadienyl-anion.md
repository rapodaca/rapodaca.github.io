---
title: Chemical Markup Language and Ferrocene Part 2 - Cyclopentadienyl Anion
published: "2009-04-13T00:00:00.000Z"
---

The representation of ferrocene is a longstanding problem in cheminformatics. What makes ferrocene a problem is that the deeply entrenched simplification that covalent bonds only ever consist of two atoms sharing a multiple of two electrons simply doesn't apply. When we try to stick with this model anyway, [Bad Things can happen](/articles/2006/12/12/the-problem-with-ferrocene).

This is a problem that deserves attention and vigorous debate. Ferrocenes and other organometallics are no longer novelty items safely tucked away in the recesses of a few organometallics labs - they are stable structural motifs in a variety of useful substances [ranging from catalysts to biological probes](/articles/2009/03/27/a-comprehensive-guide-flexmol-a-modern-language-for-chemical-representation-part-2-real-world-problems). And they're starting to show up in databases and other cheminformatics services with results that range from puzzling to comical.

# All Articles in this Series

-  [Chemical Markup Language and Ferrocene Part 1: Chem4Word and Breaking with the Past](/articles/2009/04/09/chemical-markup-language-and-ferrocene-part-1-chem4word-and-breaking-with-the-past)
-  Chemical Markup Language and Ferrocene Part 2: Cyclopentadienyl Anion

# A Scientific Debate

Peter Murray-Rust has agreed to take up my challenge to [demonstrate how Chemical Markup Language (CML) represents ferrocene](/articles/2009/04/09/chemical-markup-language-and-ferrocene-part-1-chem4word-and-breaking-with-the-past). In this series of articles, I'll be comparing the CML representations he offers with those available through [FlexMol](/articles/2009/03/19/a-comprehensive-guide-flexmol-a-modern-language-for-chemical-representation-part-1-outlining-the-problem) another XML-based molecular language.

The goal is to use a specific problem molecule in cheminformatics as a lense through which the techniques and tradeoffs in both FlexMol and CML can become clear. The lessons should be applicable to those who want to improve CML or FlexMol, or design an entirely different language altogether.

# Start with Cyclopentadienyl Anion

If you want to understand ferrocene, it helps to understand cyclopentadienyl anion, one of its component parts. This article will simply compare a CML representation of cyclopentadienyl anion with a FlexMol representation.

# CML

Peter [offers the following CML](http://wwmm.ch.cam.ac.uk/blogs/murrayrust/?p=1563) as one approach to representing cyclopentadienyl anion:

![CML](/images/posts/20090413/cml.png "CML")

```xml
<molecule id="m2" formalCharge="-1">
  <atomArray>
    <atom id="a1" elementType="C"/>
    <atom id="a2" elementType="C"/>
    <atom id="a3" elementType="C"/>
    <atom id="a4" elementType="C"/>
    <atom id="a5" elementType="C"/>
    <atom id="a6" elementType="H"/>
    <atom id="a7" elementType="H"/>
    <atom id="a8" elementType="H"/>
    <atom id="a9" elementType="H"/>
    <atom id="a10" elementType="H"/>
  </atomArray>
  <bondArray>
    <bond id="a1_a2" atomRefs2="a1 a2/>
    <bond id="a2_a3" atomRefs2="a2 a3/>
    <bond id="a3_a4" atomRefs2="a3 a4/>
    <bond id="a4_a5" atomRefs2="a4 a5/>
    <bond id="a5_a1" atomRefs2="a5 a1/>
    <bond id="a1_a6" atomRefs2="a1 a6/>
    <bond id="a2_a7" atomRefs2="a2 a7/>
    <bond id="a3_a8" atomRefs2="a3 a8/>
    <bond id="a4_a9" atomRefs2="a4 a9/>
    <bond id="a5_a10" atomRefs2="a5 a10/>
  </bondArray>
</molecule>
```

About this representation, Peter says:

>Note that I have not added any bond orders - this is deliberate. the community will argue about whether the ring bonds are single, double, delocalised, pi, etc. They will argue where the charge should be put. So I have added exactly enough information that stops before they start fighting.

Leaving the pi-system undefined may be appealing as a way to prevent "fighting", but it also prevents those with informed opinions on the subject from engaging in the kind discussion that's essential for scientific progress. For example:

-  We need to specify an overall formal charge.
-  A system or person with opinions about the "right" way to represent the pi system will have no tool with which to do so.
-  The level of ambiguity may be unacceptably high, depending on the application. For example, calculating the bond order of any of the C-C bonds would be difficult at best, and impossible if two or more Cp- units appeared in the same molecule because we can't say with which atoms the electrons giving rise to the "formal charges" are associated with.

Note that this representation accomplishes the goal of making all carbon atoms equivalent without introducing inconsistencies - something that's impossible to do with most other molecular languages.

# FlexMol

Here is one way of representing cyclopentadienyl anion in FlexMol:

![FlexMol](/images/posts/20090413/flexmol.png "FlexMol")

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

This example demonstrates explicit notation not just for hydrogen atoms, but for electron counts on atoms and in bonding systems. Additional points include:

-  We specify no overall formal charge, but can deduce it with simple electron counting rules.
-  No bond orders have been specified, yet they can be calculated using simple electron counting rules.
-  The sigma bonding framework is represented much as in CML with the shortcut <code>bond</code> element, but with the difference that we must explicitly state how many electrons are involved.
-  Simple 2-electron C-H bonds can be represented as attributes of the carbon atoms.
-  All carbon atoms are equivalent.
-  We can explicitly represent the pi system as a five-atom, six-electron <code>bondingSystem</code>. We could use the same approach to [represent benzene](/articles/2006/12/20/a-molecular-language-for-modern-chemistry-getting-started-with-flexmol) with a six-electron, six-atom <code>bondingSystem</code>, eliminating all need for the problematic "aromatic" bond flag used in other languages.
-  We could alternatively make a 1-1 correspondence between Hueckel molecular orbitals and <code>bondingSystems</code>, creating five five-atom <code>bondingSystems</code>, three of which would contain two electrons, and two of which would contain zero electrons.
-  Whether we use one <code>bondingSystem</code> or five to model the pi-system, we'll arrive at the same result for bond order and formal charge calculations.
-  In exchange for more expressive power, we may have a more verbose representation than the CML approach.

The most important point about the <code>bondingSystem</code> element is that it separates the important concepts of connectivity (<code>atomPair</code>) from bonding. This is a key point that distinguishes FlexMol from all other molecular languages that I'm aware of, and it's a subject we'll return to in subsequent articles.

# Conclusions

Although we haven't yet gotten to ferrocene, we've seen some big differences between CML and FlexMol even at the level of cyclopentadienyl anion. I'd suggest that FlexMol offers a more expressive palette, but at the expense of being a bit more verbose. The utility of that additional expressiveness depends on the problem at hand.