---
title: "Parsing InChI: It's Complicated"
summary: "SMILES and InChI may look like two solutions to the same problem, but looks can be deceiving."
twitter: true
summary-image: images/posts/20210310/summary.png
published: "2021-03-10T16:00:00Z"
---

InChI and SMILES stand as the two de facto standard line notations for cheminformatics. A [line notation](/articles/2007/03/14/eleven-qualities-of-the-perfect-line-notation-for-the-web/) represents a molecular graph as a compact string of characters without newlines. Given its similarity to SMILES, a reasonable assumption would be that InChI can be parsed to regenerate the molecular graph that created it. With few exceptions, this is not the case. This article explains why.

# Anatomy of an InChI

To understand the problem, it's helpful to know a few things about how InChI is structured.

An InChI is composed of *layers*. The [InChI Technical Manual](https://www.inchi-trust.org/download/104/InChI_TechMan.pdf) notes that there are five InChI layers, "each representing a different class of structural information." A layer is composed of one or more *sublayers*. A sublayer begins with the forward slash character (`/`) and ends with either a second forward slash or the end of the string. Every sublayer except for the first begins with a single character signifying its purpose. The sequence of characters leading up to the first forward slash is called the *prefix*. The prefix contains metadata, but nothing specific to any molecular graph.

Consider the InChI for methanol.

```console
InChI=1S/CH4O/c1-2/h2H,1H3
```

This InChI encodes three sublayers:

- `CH4O`. The "formula" sublayer encoding elemental composition as [Hill notation](https://en.wikipedia.org/wiki/Chemical_formula#Hill_system). This sublayer appears first in all InChIs.
- `c1-2`. The "connections" sublayer encoding the sigma framework of a molecular graph. The first character (`c`) stands for "connections." The remainder of the sublayer encodes a graph using continuous integer ids as node labels and the dash character (`-`) to denote edges.
- `h2H,1H3`. The "fixed" hydrogens sublayer. An atom id is followed by a hydrogen count, with each entry separated by a comma (`,`). Sometimes, a range of ids is used. What's reported here are [virtual hydrogen](/articles/2019/11/06/virtual-hydrogens/) counts. The sublayer's first character ('h') stands for "hydrogens."

InChI builds up atomic specifications stepwise through each sublayer. To do this, each atom is assigned an integer id. When a sublayer needs to update an atomic specification, it references the atomic id. For example, the connections sublayer defines a mutual connection between ids 1 and 2. Likewise, the fixed hydrogens sublayer tells us that atom 2 has one virtual hydrogen and atom 1 has three.

You may have guessed which atom is which in the case of methanol. If so, the trap has been set.

# Atomic Attributes

Using the information contained in each sublayer, it's possible to compile an *atomic attribute table*. An atomic attribute table lists all of the information about an atom, identified by its id, as revealed by the layers of an InChI. Building an atomic attribute table makes it possible to see which information is and isn't conveyed by the corresponding InChI.

Methanol's InChI (`InChI=1S/CH4O/c1-2/h2H,1H3`) yields the following atomic attribute table:

<table>
  <thead>
    <tr>
      <th>ID</th><th>Connections</th><th>Hydrogens</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td><td>2</td><td>3</td>
    </tr>
    <tr>
      <td>2</td><td>1</td><td>1</td>
    </tr>
  </tbody>
</table>

Using the table allows some conclusions to be drawn. Atom 1 has three virtual hydrogens and is connected to atom 2. Atom 2 has one virtual hydrogen and is connected to atom 1.

However, the table is silent on the crucial question of which element is mapped to which atom id. To fill in this blank, we might turn to the formula sublayer (`CH4O`). It tells us there are two heavy atoms (carbon and oxygen). Combining this information with a simple valence model yields the elemental assignment: 1(C); 2(O).

Although we can deduce which elements go with each atom index, no InChI layer explicitly conveys this information. Therein lies the problem.

# Ambiguous Elemental Mapping

An InChI's formula sublayer conveys the identity and count of all elements, but says nothing about their mapping to atom ids. In the case of methanol, we can fall back to hydrogen counts and valence rules to deduce the assignment. But in many cases that kind of deduction won't be possible.

To illustrate where things start to get off track, consider methylsilane.

```console
InChI=1S/CH6Si/c1-2/h1-2H3
```

It generates the following table:

<table>
  <thead>
    <tr>
      <th>ID</th><th>Connections</th><th>Hydrogens</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td><td>2</td><td>3</td>
    </tr>
    <tr>
      <td>2</td><td>1</td><td>3</td>
    </tr>
  </tbody>
</table>

The table reveals that both atoms have three virtual hydrogens and are mutually connected. As such, we can't definitively say which atom is which. What rescues the situation is that mapping either id to silicon will yield the correct molecular graph.

But increasing the complexity of the example even slightly leads to trouble. Consider dimethylsilane.

```console
InChI=1S/C2H8Si/c1-3-2/h3H2,1-2H3
```

Using the same procedure as before, we build this table:

<table>
  <thead>
    <tr>
      <th>ID</th><th>Connections</th><th>Hydrogens</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>1</td><td>3</td><td>3</td>
    </tr>
    <tr>
      <td>2</td><td>3</td><td>3</td>
    </tr>
    <tr>
      <td>3</td><td>1,2</td><td>2</td>
    </tr>
  </tbody>
</table>

This table describes a three atom chain, with atom 3 inside and atoms 1 and 2 outside. Atom 3 has two virtual hydrogens and atoms 1 and 2 each have three.

But this table says nothing about the element associated with each atom. Does the table describe dimethylsilane (atom 3 is silicon) or ethylsilane (atom 3 is carbon)? Without an in-depth understanding of the [InChI canonicalization algorithm](/articles/2006/08/12/inchi-canonicalization-algorithm/), there's no way to know. Even then, it may not be possible to say with certainty.

In other words, the problem is not so much the parsing of an InChI. Instead, the problem is that parsing an InChI can yield not a single molecular representation, but more than one.

# Other Layer Failures

Clearly, the InChI formula sublayer by itself lacks the detail needed to unambiguously map every atom id to an element. But this is not the only limitation. At least three other commonly-used InChI features will present similar problems:

- Charge sublayer. The charge sublayer reports overall molecular charge, not the formal charge associated with particular atom ids. Take, for example, methoxide anion (`InChI=1S/CH3O/c1-2/h1H3/q-1`).
- Protons sublayer. Like the charge sublayer, the protons sublayer also reports overall proton counts, not counts mapped to a particular atomic id. Consider methylammonium cation (`InChI=1S/CH5N/c1-2/h2H2,1H3/p+1`).
- Metal disconnection. Chemists can debate whether the carbon-metal bond in methyllithium (`InChI=1S/CH3.Li/h1H3;`) is covalent or not. For its part, standard InChI will treat this bond as ionic and so it will be absent from the connections sublayer.

Could these limitations be overcome in certain cases to yield a single unique molecular graph? Of course. But as we saw before, even slightly more complex molecules will become difficult to impossible to nail down.

# The Trap

InChI's similarity to SMILES sets up a seductive trap. As bait, the trap uses the incorrect assumption that InChI itself provides sufficient information to generate a single molecular graph. Driven by this fallacy, it seems reasonable to use InChI not only as a unique identifier, but as the primary representation. The former is what InChI was designed for, but the latter leads to trouble.

This trap has ensnared a few database designers and users. Consider two public examples:

- An RDKit user generated the InChI for a propargyl carbene represented by the SMILES `[CH]C#C`. However, parsing the resulting InChI yielded a molecule with incorrect hydrogen counts and a pentavalent carbon to boot (SMILES `[CH-]=C=[CH3+]`). ([link](https://github.com/rdkit/rdkit/issues/542))
- A CDK user attempted to parse an InChI but found that it was not possible to assign hydrogen atoms. The user noted: "I don't really have any alternative to reading InChis, since I was given a database of molecules as a table of InChi strings." ([link](https://github.com/cdk/cdk/issues/475))

For years, the InChI project has [cautioned](http://www.hellers.com/steve/pub-talks/toronto-7-14.pdf) users that:

> InChI is not a replacement for any existing internal structure representations. (We do not start religious wars. ) InChI is in ADDITION to what one uses internally. Its value to student or scientist is in FINDING and LINKING information.

In other words, bare InChIs are to be used for molecular identification, but not for molecular representation. Although this guidance is helpful, it explains neither the distinction being made nor the validity of the guidance. What's needed to drive the point home are specific examples of failure when using InChI outside the scope of its intended role.

# Avoiding the Trap

Given the problems of parsing InChIs, what's a database creator or user to do? A few options are available. One is to be sure the database contains the information needed to generate a sufficiently detailed molecular representation.

For example, a full-featured representation can be stored alongside the InChI. Both SMILES and Molfile would be candidates. However, InChI can readily be generated from either of these representations. In that case, why store the InChI at all? One reason would be to allow fast exact structure search through indexing. If this is the use case, then it could be argued that InChI Key should be used, not InChI itself. But if that's not a use case, then storing InChIs may not make much sense.

Alternatively, InChI Auxiliary Information ("AuxInfo") can be stored. This sparsely-documented type of metadata is both read and written by the InChI software. Given AuxInfo, InChI works much like SMILES and Molfile. The tradeoff is storage space and additional complexity.

Neither of these approaches will be available to a user forced to extract molecular graphs from an existing database using just InChI. Fortunately, InChI's intended role as a molecular identifier can be called into service. Many public databases store InChIs along with molfiles and/or SMILES. These mappings can be used to retroactively patch a database containing only InChIs. Of course, this approach relies on the InChI of interest being present in public databases. The more unique the collection, the less viable this lookup approach becomes.

# Conclusion

Superficial similarities between InChI and SMILES can lead to the erroneous conclusion that InChI can be read and written like SMILES. This article covers some of the ways this assumption can fail. Three approaches to dealing with the problem are presented.
