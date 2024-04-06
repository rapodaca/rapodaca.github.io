---
title: "Octet Fundamentals: A Documented System of Atomic Masses"
published: "2007-02-02T00:00:00.000Z"
---

The way that atoms, and particularly their masses, are modeled sets the stage for the kinds of problems a cheminformatics environment can solve. Many systems are currently in use, a reflection of the many different ways there are to think about this problem. This article will introduce the atomic mass system used by Octet, which provides atomic mass values and uncertainties cross-referenced to the primary literature.

# A Documented System of Atomic Masses

Mass and isotopic composition are fundamental atomic properties. In addition to the mass values themselves, the errors of these determinations are also important. Because these quantities are sometimes in dispute, it is essential that they be cross-referenced to the primary literature. Fortunately, a landmark work titled <a href="http://www.iupac.org/publications/pac/2003/7506/7506x0683.html">"Atomic weights of the elements"</a> (AWOTE) accomplishing exactly this objective was published in 2000 by a team led by J. K. B&#246;hlke from the U.S. Geological survey.

Octet uses an XML representation of the data contained in AWOTE. To view the entire document, [click here](/images/posts/20070202/mass.xml). To illustrate the kind of data included in this document, consider this entry for the element carbon:

```xml
<entry symbol="C" atomic-number="6">
  <natural-abundance>
    <mass value="12.0107" error="0.0008" />
    <isotope mass-number="12">
      <mass value="12" error="0" />
      <abundance value="0.9893" error="0.0008" />
    </isotope>
    <isotope mass-number="13">
      <mass value="13.003354838" error="0.000000005" />
      <abundance value="0.0107" error="0.0008" />
    </isotope>
  </natural-abundance>
</entry>
```

Carbon has two naturally-occurring stable isotopes, <sup>12</sup>C and <sup>13</sup>C. They have relative abundances of 98.93% and 1.07%, and masses of 12 (exactly) and 13.003354838&plusmn;0.000000005 unified mass units (u), respectively. Every element from hydrogen to uranium is included, excluding technitium. By reference to AWOTE, the determination of every value in the XML file can be found in the primary literature.

# Using the Atomic Mass System

As a demonstration of Octet's system of atomic masses, consider the following Ruby code:

```ruby
require 'rubygems'
require_gem 'rjb'

atomic_system=Rjb::import('net.sf.octet.model.BasicAtomicSystem').getInstance
carbon_distribution=atomic_system.getNaturalAbundance(atomic_system.getAtomicSymbol("C"))

puts carbon_distribution.countNuclei # =>2
puts carbon_distribution.getNucleus(0).getMassNumber # =>12
puts carbon_distribution.getNucleus(1).getMassNumber # =>13
puts atomic_system.getAtomicMass(carbon_distribution.getNucleus(0)).getValue.toString # => 12.0
puts atomic_system.getAtomicMass(carbon_distribution.getNucleus(1)).getValue.toString # => 13.003354838
puts atomic_system.getAtomicMass(carbon_distribution.getNucleus(1)).getUncertainty.toString # => 5.0E-9
```

The <a href="/articles/2007/01/31/a-molecular-language-for-modern-chemistry-reading-flexmol-documents-with-octet">previous article in this series</a> described the small number of steps needed to execute Ruby code such as that shown above on Windows and Linux systems. For more information on the `AtomicSystem` API, consult the <a href="http://depth-first.com/doc/octet/">Octet Javadoc</a>.

# Conclusions

Octet provides a comprehensive system of atomic masses containing both measurements and uncertainties. This system is furthermore cross-referenced to the primary literature. As a result, the mass of every Octet Molecule can be determined to high precision and with error analysis. Not every application will require this level of detail and documentation, but for those that do the capability exists.
