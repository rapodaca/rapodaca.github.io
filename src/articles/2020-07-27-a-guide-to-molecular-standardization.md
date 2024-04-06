---
title: A Guide to Molecular Standardization
summary: "Toward practical rules for improved data quality in cheminformatics."
twitter: true
summary-image: images/posts/20200727/summary.png
published: "2020-07-27T19:00:00Z"
---

What set of features uniquely characterize a given molecule? What modes of representation should be fixed or rejected, and under what conditions? Given that machine-based molecular encodings have been in use for more than sixty years, it might seem that such questions have long since been resolved. Nevertheless, the topic casts a long shadow to this day, particularly when dataset curation or property prediction come into play. Increased reliance on automation and the ever-expanding datasets that drive it ratchet the stakes ever higher. This article offers some signposts for a seemingly boundless thicket.

# Garbage in, Garbage out

Computational chemistry and cheminformatics can be thought of at a basic level as fields that transform [molecular graphs](/articles/2020/04/06/a-minimal-molecule-api/) and associated data into predictions and insights. The quality of the input sets an upper limit on the value of the output. In other words, the familiar adage "garbage in, garbage out" applies.

It's relatively simple to define "garbage" in the context of [numerical data associated with molecular graphs](https://doi.org/10.1080/10629360902949567). Well-defined tolerances for accuracy and precision play a role, as does adherence to standard experimental practices. Scrutiny of the suitability of the dataset as a whole to the question being asked is also crucial. The list goes on.

But what does "garbage" mean when applied to individual molecular graphs or collections of them? To be clear, I'm not talking about molecular graphs deemed inappropriate for certain datasets due to unfavorable properties (e.g., [Pan-Assay Interference Compounds](https://en.wikipedia.org/wiki/Pan-assay_interference_compounds), aka PAINS). Instead, I'm talking about molecular graphs encoded in such a way as to hinder the extraction of valuable insights and predictions.

Failure to address this problem risks a range of negative consequences, including: erroneous property prediction; incomplete substructure search; misclassification during model training and/or use; and duplication within an allegedly unique collection such as a registration system.

# A Taxonomy of Molecular Garbage

Until recently, the formulation of general guidelines and protocols around molecular graph encoding was rarely considered in the literature. As evidence, consider that a [pivotal 2010 review](https://dx.doi.org/10.1021%2Fci100176x) by the Tropsha group stated:

> Surprisingly, the investigations into how the primary data quality influences the performances of cheminformatics models are almost absent in the published literature. ...

The authors went on to identify the [one previous study](https://doi.org/10.1002/qsar.200810084) that had up to that point been published. It found both a high incidence of low-fidelity molecular graphs (see below) in popular datasets and a non-negligible effect of those errors on QSAR model accuracy. The authors cite a second study that treats the problem more tangentially.

Since then, several reports have been published that could be placed under the heading "detection, repair, and removal of garbage molecular graphs," including:

- *[An Open Source Chemical Structure Curation Pipeline using RDKit](https://doi.org/10.21203/rs.3.rs-34715/v1)* (2020). Describes a "chemical curation pipeline" that has been used to "standardise the nearly 2 million compounds in the ChEMBL database" and "identify compounds with the most serious issues so that they can be prioritised for manual curation."
- *[PubChem chemical structure standardization](https://doi.org/10.1186/s13321-018-0293-8)* (2018). Describes "an effective and efficient tool to account for molecular diversity and to eliminate invalid/incomplete structures," which is currently [available online](https://pubchem.ncbi.nlm.nih.gov/standardize/standardize.cgi).
- *[The Chemical Validation and Standardization Platform (CVSP): large-scale automated validation of chemical structure datasets](https://jcheminf.biomedcentral.com/articles/10.1186/s13321-015-0072-8)* (2015). Describes [a platform](https://blogs.rsc.org/chemspider/2018/11/30/chemical-validation-and-standardization-platform-cvsp/) developed by ChemSpider to "detect issues with submitted molecular representations using pre-defined or user-defined dictionary-based molecular patterns that are chemically suspicious or potentially requiring manual review."

A number of smaller relevant studies have also appeared in the last ten years. This burst of activity likely reflects the increased availability and use of large, publicly-available datasets - a phenomenon noted on this blog [many years ago](/articles/2006/08/12/changes/). With greater interdependence mediated by these datasets comes a heightened need for community guidelines.

Two points emerge from this work when viewed as a whole: (1) the problems to be solved are deeply nuanced; and (2) at least three distinct problems too often get lumped into one. It seems plausible that fixing (2) would go a long way toward mitigating (1).

Given that a dataset contains a molecular graph, what factors can interfere with the production of valuable predictions and insights? Three categories have emerged from the literature so far, in increasing order of subtlety:

1. **Validity.** Does the encoding break one or more syntactical rules in a file format or in-memory representation? For example, a molfile may use an invalid bond type. Likewise, a SMILES may fail to place a metallic element within brackets.
2. **Fidelity.** How consistent is the graph with other information provided in the dataset? For example, data fields may include a systematic name, InChI,  CAS number, or internal ID. How faithfully does the molecular graph reflect the known features implied by those identifiers?
3. **Uniformity.** Does the molecular graph break any rules for representation form, style, or semantics? As a simple example, consider a molfile encoding no atoms or bonds. Although it may not violate syntax rules or create any conflicts with external identifiers, it may nevertheless not be appropriate for inclusion within certain datasets.

This list suggests a high-level workflow. First, an encoding is read. The resulting in-memory graph representation is then cross-referenced with any identifiers that may be present within the dataset or external to it. Finally, the molecular graph is transformed to become consistent with existing standards of representation. Records producing errors should at a minimum be reviewed before proceeding.

The first two factors are relatively simple (if not inexpensive) to address. Cheminformatics toolkits should report file format errors while at the same time following published standards to the greatest extent possible. It could be argued that fidelity is not really a cheminformatics problem at all. To the extent that a molecular graph can be generated from an identifier, this renders alternative encodings such as Molfile or SMILES redundant. This points to a more generic normalization issue, not a specific cheminformatics problem.

 But the third factor, uniformity, is both ubiquitous and complex.

# Uniformity through Molecular Standardization

The use of any externally-generated chemical dataset brings with it the implicit need for *standardization*. Standardization is the process of filtering and/or transforming the molecular graphs in a dataset according to a set of well-defined and self-consistent rules.

Standardization policies can vary by organization, team, or even project. The simplest standardization policy is a no-op: accept all molecular graphs exactly as encoded. More interventionist policies can perform sweeping changes such as the reinterpretation of interchange format semantics, the introduction of new chemical elements, bonding arrangements, or even the rejection of most molecular graphs entirely. Most projects will find themselves somewhere in the middle most of the time.

Clearly, no single size fits all. Does this mean that nothing remains to be done? Far from it.

Perhaps the most acute need at the moment is to catalog and categorize all of the operations used in molecular standardization. Although dataset-specific studies like the ones cited in the previous section have appeared, what's lacking are studies that cut across toolkits, vendors, datasets, and organizations.

Given the specific work published to date, it should be possible to begin constructing a generalized guide to molecular graph standardization.

# A Guide to Molecular Standardization

An important component of any guide would be a complete catalog of operations performed during molecular standardization. The reasons behind the operations are less important than documenting the operations themselves. As explained previously, a hard requirement in one organization may be just a nice-to-have in another. The main goal of exhaustively cataloging standardization operations is to provide those using datasets with the richest possible set of options for their specific case. A secondary goal would be to provide software teams with a complete feature set to aid dataset curators.

Standardization can be thought of as a sequence of steps, each of which follows the pattern:

1. **Check**: look for the presence of a feature; and
2. **Remedy**: apply one or more graph transformations, if available, to eliminate the feature.

This view suggests that the guide should be divided into two parts: a set of transformations; and a set of tests with associated remedies. The ordering of standardization steps clearly matters, so a third section could enumerate the ways in which transformations interact.

To be more specific, consider the set of primitive transformations. It might include the following procedures, among others:

- [Reify and virtualize hydrogens](/articles/2020/05/18/hydrogen-suppression-in-cheminformatics/);
- Move stereo bond out of ⟷ into ring;
- Move stereo bond away from ⟷ toward stereocenter;
- Wavy ⟷ plain single bond;
- Plain double bond ⟷ crossed double bond;
- Increase distance between atoms;
- Linearize triple bonds and cumulene systems;
- Mark unspecified double bond geometry;
- No bond ⟷ zero-valent bond;
- Covalent bond ⟷ ionic bond;
- Zwitterion ⟷ covalent bond;
- Diradical ⟷ covalent bond;
- split ⟷ combine connected components;
- protonate ⟷ deprotonate charged atom
- 1,3-hydrogen shift;

These primitives can be incorporated into more complex transformations. For example, tautomer generation and/or canonicalization can be thought of as involving a guided sequence of 1,3-hydrogen shifts with the simplest implementation consisting of a single shift. (Tautomerism is rightly viewed more as an entire field unto itself, as [this recent paper highlights](https://doi.org/10.1021/acs.jcim.9b01080).) Transformation of the wedge/hash environment around an atom follows a similar pattern, with reification/virtualization, and wedge/hash interconversion coming into play.

The set of primitives can then be used to correct non-uniform features after checking. Some checks won't be correctable. Others may use one or more transformations. Moreover, the same transformation might be used by one or more checks. The guide could distinguish among these cases.

The set of checks without remedies might include:

- Empty graph. The graph contains no atoms.
- Unsupported element. Some systems reject most of the periodic table due to lack of support for [multi-atom bonding](/articles/2020/04/27/multi-atom-bonding-in-cheminformatics/) and other restrictions.
- Unsupported element quantity. For example, more than seven borons may suggest a cluster.
- Impossible isotope. The atomic number exceeds the mass number.
- Unsupported isotope. An isotope may either be feasible but unknown, known but unstable, or too short lived.
- Non-stereocenter stereo specification. [Automorphism](/articles/2009/09/15/stereoisomer-generation/) or Morgan-derived symmetry classes can be used.
- Impossible configuration. For example, three wedges originating from the same atom.
- Subvalent atom. [Virtual hydrogens](/articles/2020/05/18/hydrogen-suppression-in-cheminformatics/) are supported by both [Molfile](/articles/2020/04/13/hydrogen-suppression-in-molfiles/) and [SMILES](/articles/2020/06/08/hydrogen-suppression-in-smiles/). It's possible to use these features (or the built-in support for radicals by Molfile) to encode unsupported subvalent electronic configurations.
- Hypervalent atom. Bonding electrons, charges, or other features deplete the available valence electron count for an element and leave it negative.
- Unusual valence. For example, pentacoordinate nitrogen does not result in a negative valence electron count, but it does put nitrogen into an unusual valence state.
- Unsupported feature. Both Molfile and SMILES support features that may make little sense in certain datasets. For example, OpenSMILES supports "[wildcard atoms](http://opensmiles.org/opensmiles.html)."

Checks with remedies might include:

- hypervalent nitrogen, sulfur, phosphorous, etc? A very broad class of checks/remedies that include N-oxides, nitro compounds, sulfoxides, sulfones, phosphates, and phosphites.
    - zwitterion → covalent bond
- metal-nonmetal bond?
    - covalent bond ⟷ ionic bond
- metal-metal bond?
    - covalent bond → diradical
- hydrogen on non-stereocenter?
    - virtualize hydrogen
- stereo bond in ring?
    - reify hydrogen
    - move stereo bond out of ring
- stereo bond between chiral centers?
    - reify hydrogen
    - move stereo bond away from stereocenter
- overlapping atoms?
    - increase distance between atoms
- ambiguous double bond conformation?
    - plain double bond → crossed double bond
- tautomerizable group?
    - compute canonical tautomer or enumerate tautomers
- salt cation or anion?
    - split connected components
    - protonate or deprotonate parent ion

# Conclusion

The last ten years have seen a surge of interest in the problem of molecular graph standardization. This interest has been fed by increasing use of large, public datasets. The studies published to date have been centered on the ways a single organization, group, or toolkit have addressed the problem. What's missing is a synthesis of these efforts into a broadly-applicable whole. This article takes the first step in that direction.
