---
title: "Hydrogen Suppression in Cheminformatics"
summary: "The fine art of dealing with what isn't there."
twitter: true
summary-image: images/posts/20200518/summary.png
published: "2020-05-18T16:00:00Z"
---

Hydrogen bears the distinction of being both the most common element in the universe and one of the most predicable elements on the periodic table. Outnumbering carbon in many organic molecules, hydrogen rarely participates in anything more exciting than hydrogen bonding or acid-base reactions. For the most part, the monovalent hydrogen atoms studding the average organic molecule are ignored. This article describes some problems that can arise from treating hydrogens in this way, and some solutions.

# Hydrogen Suppression

*Hydrogen suppression* is the practice of omitting some or all hydrogen atoms from a molecular graph. Despite its removal, a suppressed hydrogen and the bonds to its parent atom are still understood to be present. A molecular graph using hydrogen suppression is considered fully equivalent to one in which all hydrogens are present as atomic nodes.

Hydrogen suppression is one of those unglamorous topics that doesn't get much attention. This is unfortunate, because ambiguous or incorrectly-implemented hydrogen suppression schemes account for many of the errors encountered when exchanging information within and between scientific teams.

Organic chemists have used hydrogen suppression for almost as long as they've been studying organic molecules. How long? As early as 1872, Augustus Kekulé [used the technique](https://doi.org/10.1002/jlac.18721620110) to depict three possible structures of benzene:

<figure>
  <img alt="Kekule and Hydrogen Suppression" src="/images/posts/20200518/kekule.png">
  <figcaption>
    <strong>Hydrogen Suppression is Old.</strong> Including the hydrogens in these diagrams by Kekulé would have distracted from the important part &mdash; the carbon framework. [<a href="https://doi.org/10.1002/jlac.18721620110">source</a>]
  </figcaption>
</figure>

Although used for at least a century and a half, it took many decades for hydrogen suppression to become standardized in journals. During the 1930s, for example, the same journal might run an article whose figures [used hydrogen suppression](https://doi.org/10.1021/jo01233a002) in the same issue with one whose figures [did not](https://doi.org/10.1021/jo01233a004).

<figure>
  <img alt="Why not Both?" src="/images/posts/20200518/why-not-both.png">
  <figcaption>
    <strong>Why Not Both?</strong> The top figure uses hydrogen suppression, but the bottom one dies not. Both figures come from the same issue of <em>J. Org. Chem.</em>.
  </figcaption>
</figure>

Today, organic chemists routinely draw hydrogen suppressed molecular graphs in both formal and informal settings. The rules are deceptively simple (although not without [controversy](https://syntheticremarks.com/hiding-implicit-hydrogens-is-just-stupid/)). Hydrogens attached to most carbon atoms may be suppressed, but hydrogens attached to heteroatoms appear as a hydrogen count.

<figure>
  <img alt="Modern Hydrogen Suppression" src="/images/posts/20200518/modern-hydrogen-suppression.png">
  <figcaption>
    <strong>Modern Hydrogen Suppression</strong> Today, hydrogen suppression in 2D molecular drawing is expected. Here, hydrogens are suppressed on carbons but not heteroatoms [<a href="https://doi.org/10.1021/acs.joc.0c00221">source</a>]
  </figcaption>
</figure>

The distinction between completely invisible hydrogens and a hydrogen count associated with an atom plays a central role in cheminformatics as well.

# Implicit Hydrogen

An *implicit hydrogen* is a suppressed hydrogen that can be reconstituted through a set of rules. The hydrogen atom and the bond to its parent are wiped away from the graph. They still exist, but can only be reconstituted through a set of conventions.

These conventions are collectively referred to as *valence rules* or a *valence model*. In the best case, these rules have been exhaustively enumerated, are widely-available, and are not subject to change. As we'll see, practice leaves much room for improvement.

 Application of a valence model begins by computing an atom's *bonding electron count*, or the number of electrons it has contributed to bonding relationships. This value is equal to the sum of all the atom's formal bond orders. Mathematically, the relationship is expressed as:

```asciimath
e_x = 1/2sum_(b∈B_x)n(b)
```

where:

- ~e_x~ is bonding electron count for atom ~x~
- ~b~ is a bond terminating at atom ~x~
- ~B_{x}~ is the set of all bonds terminating at atom ~x~
- ~n(b)~ is the electron count of bond ~b~

Also required is a *target valence*. A target valence is the maximum allowable bonding electron count for an atom hosting a given element. For example, the target valence for carbon is usually four. The target valence for oxygen is usually two. And so on.

To compute the implicit hydrogen count subtract the bonding electron count from the target valence.

```asciimath
h_x = v_x - e_x
```

where:

- ~h_x~ is the hydrogen count for atom ~x~
- ~v_x~ is the target valence for atom ~x~

A similar approach applies in systems using [multi-atom bonding](/articles/2020/04/27/multi-atom-bonding-in-cheminformatics/).

Things get complicated with atoms that can support multiple target valences. For example, nitrogen may be considered to support a target valence of only three. In some applications, however, nitrogen also supports a target valence of five. Depending on the situation, sulfur can support as many as three target valences (2, 4, and 6). In general, the further one proceeds down the rows of the periodic table, the more complicated the target valence situation becomes.

The popular exchange formats V2000 Molfile and SMILES both support implicit hydrogens. In SMILES, valence rules apply to atoms not wrapped by the left and right bracket symbols (`[` and `]`, respectively). In Molfile, [valence rules](/articles/2020/04/13/hydrogen-suppression-in-molfiles/) apply to all atoms except those explicitly identified with a custom target valence.

# The Problem with Implicit Hydrogens

Rules-based implicit hydrogen schemes are useful in that they eliminate the need to explicitly encode atomic hydrogens or hydrogen counts. But this convenience and efficiency come with a price tag: valence rules must be easy to obtain, understand, and implement. If they are not, confusion and data mangling will result.

A case in point recently occurred with the Molfile format. In 2017, the corporate sponsor, BIOVIA, modified the target valences of several elements. This event, dubbed ["MDL Valence-Mageddon,"](https://www.nextmovesoftware.com/talks/Mayfield_BuildingOnSand_InChI_201708.pdf) in one fell swoop changed the constitution of untold millions of chemical structures previously stored in databases around the world. But even prior to this event, the Molfile valence rules were anything but consistently-applied because the crucial documentation explaining them was only available to paying customers.

To a lesser extent, SMILES users also suffer the ill-effects of a poorly-understood valence model. A perpetual source of confusion is [pyrrole nitrogen](https://www.slideshare.net/baoilleach/we-need-to-talk-about-kekulization-aromaticity-and-smiles). Such atoms may not appear outside of brackets, but often do. A lesser-known example is [tetrasubstituted nitrogen](https://nextmovesoftware.com/blog/2018/06/06/can-we-agree-on-the-structure-represented-by-a-smiles-string/) which, unless placed within a bracket, will have a target valence of five and therefore *one* implicit hydrogen.

# Virtual Hydrogen

A much less problematic form of hydrogen suppression is [*virtual hydrogen*](/articles/2019/11/06/virtual-hydrogens/). A virtual hydrogen replaces an atomic hydrogen and its connecting bond with an integer hydrogen count on the parent atom.

Unlike implicit hydrogens, virtual hydrogens require no valence model. All information needed to assign a hydrogen count is encoded explicitly as an atomic attribute. With no valence model to consult, what you see is what you get.

Both V2000 Molfile and SMILES support virtual hydrogens. In SMILES, all bracket atoms must provide a virtual hydrogen count that defaults to zero. Support for virtual hydrogens in Molfiles is [more indirect](/articles/2020/04/13/hydrogen-suppression-in-molfiles/). Rather than specifying a hydrogen count, a custom target valence can be assigned to each atom separately. The virtual hydrogen count is then deduced from the custom target valence. This indirection, coupled with poor availability of the relevant documentation, has led to ignorance about the feature and erroneous but understandable claims that V2000 Molfiles do not allow virtual hydrogen counts to be set.

# Reification and Virtualization

It's sometimes useful to interconvert a molecular graph using hydrogen suppression with one that doesn't. I call the process of replacing atomic hydrogens with virtual hydrogens *virtualization*. I call the reverse process of converting virtual hydrogens into atomic hydrogens *reification*.

Full reification, replacing all implicit and virtual hydrogens with atomic hydrogens, is sometimes applied when an environment's valence model is either poorly-documented or poorly understood. As an example of full reification, consider [PubChem](https://pubchem.ncbi.nlm.nih.gov) molfiles. In Compound records, every hydrogen, virtual or implicit, it explicitly present in atomic form. This sets all virtual hydrogen counts to zero. The cost is verbosity and possibly extra resource requirements when processing these files.

It's more common to reify a small subset of hydrogens. In particular, hydrogens attached to stereocenters are reified to increase clarity. This is often seen with hydrogens attached to fused ring systems. Without reification, a stereo bond would need to be placed within the ring, which breaks widely-used drawing conventions. Reification allows a bond to hydrogen to carry the stereo decoration (wedge or hash). Likewise, reification can prevent the confusing placement of a stereo decoration between two stereocenters.

<figure>
  <img alt="Reification for Clarity" src="/images/posts/20200518/reification-for-clarity.png">
  <figcaption>
    <strong>Reification for Clarity.</strong> Without atomic hydrogens, stereo bonds would need to be drawn within rings, breaking conventions and causing confusion. [<a href="https://doi.org/10.1351/pac200678101897">source</a>]
  </figcaption>
</figure>

A function accepting a molecular representation as an argument must account for all valid hydrogen suppression states. For example, atomic connectivity measurements may or may not require suppressed hydrogens to be counted the same as atomic nodes. Failure to provide the correct equivalency can lead to errors.

For these reasons, special care is called for when working with molecules allowing hydrogen suppression. Reification elevates virtual hydrogens to the first class atomic status, but the presence of atomic hydrogen can confound algorithms and human expectation.

# Toolkits

In addition to exchange formats, hydrogen suppression also figures prominently within cheminformatics toolkits. Toolkits tend to support reading an atom's virtual hydrogen count. However, they can vary greatly in how or even whether a virtual hydrogen count can be set. Some go further by imposing a valence model.

A sampling of approaches to hydrogen suppression in toolkits is given below.

- **[CDK](https://cdk.github.io).** Virtual hydrogen count can be set with `Atom#setImplicitHydrogenCount`. Automated saturation under the control of a valence model is provided by `CDKHydrogenAdder`.
- **[Open Babel 2](http://openbabel.org/api/2.3/).** Hydrogen count may be read with `OBAtom#ImplicitHydrogenCount`, which uses a toolkit-wide valence model behind the scenes. Custom hydrogen counts are not allowed.
- **[Open Babel 3](https://open-babel.readthedocs.io/en/latest/UseTheLibrary/migration.html#handling-of-implicit-hydrogens).** Virtual hydrogen count can be set via `OBAtom#SetImplicitHCount`.
- **[RDKit](https://www.rdkit.org).** Virtual hydrogen count can be read with [`Atom#getNumImplicitHs`](https://www.rdkit.org/docs/source/rdkit.Chem.rdchem.html#rdkit.Chem.rdchem.Mol). No corresponding ability to set hydrogen count appears to be present, although  new molecules saturated under the control of a valence model can be constructed with [`AddHs`](https://www.rdkit.org/docs/source/rdkit.Chem.rdchem.html#rdkit.Chem.rdchem.Mol).

Toolkits that offer their own default or mandatory valence models face a potential dilemma with regard to interchange formats like Molfile and SMILES. The valence models built into those formats must be respected. However, doing so may conflict with the native valence model. Even if such dilemmas can be navigated for the most part, the crevices provide a happy home to a variety of bugs.

# Minimal Molecule API

Previous posts described a [minimal molecule API](/articles/2020/04/06/a-minimal-molecule-api/) and an [implementation in Rust](/articles/2020/05/11/cheminformatics-in-rust-implementing-a-minimal-molecule-api/). The API supports reading a virtual hydrogen count attribute through the `Molecule#hydrogens` method. This arrangement allows for unambiguous representation of both saturated and partially unsaturated atoms such as radicals. Virtual hydrogen counts are set at the time of a molecule's creation through a specification object.

Such a system precludes implicit hydrogens by definition. Nevertheless, it's still possible to support automatic hydrogen assignment under the direction of a valence model. The important difference with implicit hydrogen systems is that the virtual hydrogen count is considered the single source of truth regarding hydrogen suppression. Hydrogen counts can be determined from the Molecule alone, without reference to the valence model.

# Conclusion

Hydrogen suppression has a long history in chemistry and cheminformatics. In cheminformatics, hydrogen suppression takes two forms: virtual hydrogens and implicit hydrogens. Whereas a virtual hydrogen is represented by an explicit value, an implicit hydrogen count must be computed using a valence model. Many systems support both virtual and implicit hydrogens. To avoid errors, it's crucial to understand which form of hydrogen suppression is in play before attempting to use a toolkit or file format.
