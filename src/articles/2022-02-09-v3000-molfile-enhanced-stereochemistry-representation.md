---
title: V3000 Molfile Enhanced Stereochemistry Representation
summary: A practical approach to encoding stereochemical mixtures and unknowns.
twitter: true
summary-image: images/posts/20220209/summary.png
published: "2022-02-09T20:00:00Z"
---

Stereoisomerism plays a crucial role in the science and technology of chemistry, but this is a relatively new development. Analytical and synthetic techniques have not yet advanced to the stage that allows configuration to be assigned with the same ease as other aspects of molecular structure. Depending on the context, it's still not unusual for configuration to remain partially or completely unknown indefinitely. This poses challenges for serialization formats, which must be capable of capturing both the known and known unknowns. A [previous article](/articles/2021/12/29/stereochemistry-and-the-v2000-molfile-format/) described the solution offered by the molfile V2000 format. This article continues the discussion with the successor, V3000, and its "enhanced representation."

# Revisiting V2000 Stereochemistry

V3000 inherits the stereochemical notation of its predecessor, V2000. The earlier format used two features in combination to achieve limited support for partial stereochemical characterization: (1) *defined stereocenters*; and (2) *the chiral flag*. A defined stereocenter sits at the the thin end of a wedge or hash bond. The chiral flag is a global property affecting how defined stereocenters are interpreted.

Unfortunately, the V2000 system is described imprecisely at best. The intent appears to be to interpret defined stereocenters absolutely when the chiral flag is On, and relatively when the chiral flag is Off. Additional subtleties come into play depending on whether one or more stereocenters are defined. Imprecise, even contradictory language doesn't help matters. See [my earlier article](/articles/2021/12/29/stereochemistry-and-the-v2000-molfile-format/) for details.

Limited though it may have been, V2000 set the stage for the enhanced representation in two important ways. First, it codified how stereocenters are defined. Second, it introduced the idea of context-sensitive interpretation of stereochemical markers.

# Documentation

This article is based on source documents produced by BIOVIA, the molfile format's current corporate sponsor. In this article I refer to them collectively as "the documentation":

- [CTFILE FORMATS 2020](https://discover.3ds.com/sites/default/files/2020-08/biovia_ctfileformats_2020.pdf)
- [CHEMICAL REPRESENTATION 2020](http://help.accelrysonline.com/insight/2020/content/pdf_files/bioviachemicalrepresentation.pdf)
- [BIOVIA Enhanced Stereochemical Representation](https://paperzz.com/doc/8466241/biovia-enhanced-stereochemical-representation)

The first two are authoritative copies of syntax and semantic documentation, respectively, provided by BIOVIA. The third is a white paper apparently written by BIOVIA but hosted on a third-party service.

# Stereogroups

One V2000 problem solved by V3000 enhanced representation is the global nature of the chiral flag. There is no way to tailor its effect to specific atoms or groups of atoms. Either all atoms are affected or none are. This lack of precision maps poorly to practice in that a given molecule can contain stereocenters with differing levels of characterization.

Enhanced representation solves this problem with the *stereochemical group* (aka "stereogroup"). A stereogroup can contain one, some or all defined stereocenters in a molfile. Multiple stereogroups may be present in the same molfile, but a defined stereocenter must only belong to one of them.

A second problem with V2000 format is a lack of nuance. Stereochemical characterization can have multiple levels of uncertainty, but the chiral flag can capture only two of them.

To address this problem V3000 introduces what I'll call here *operators*. An operator changes the interpretation of the centers in a stereogroup. V3000 enhanced representation supports three operators:

- ABSOLUTE. The absolute configuration is the one drawn.
- OR. The absolute configuration is either the one drawn *or* the inverse.
- AND. The absolute configuration is the one drawn *and* the inverse.

Stereogroup operators are often referred to by their codes: `or` (OR); `&` (AND); and `abs` (ABSOLUTE).

The `abs` operator is the easiest to understand. All stereocenters in the associated group are interpreted as drawn. The semantics mirror the effect of setting the chiral flag to `On` in an V2000 molfile. Unlike the chiral flag, however, the ABSOLUTE operator can apply to one, some, or all defined stereocenters.

<figure>
  <img alt="ABSOLUTE Operator" src="/images/posts/20220209/abs-equals.png">
  <figcaption>
    <strong>ABSOLUTE Operator.</strong> Only the configuration drawn is present.
  </figcaption>
</figure>

The `or` (OR) operator models the uncertainty that results from knowing that a single configuration is present, but with unknown sense. When applied to a stereogroup containing a single stereocenter, OR indicates that the configuration is as drawn or the inverse. When applied to a multi-center stereogroup, `or` means the same thing, just over two or more centers. This behavior roughly corresponds to the case of a V2000 molfile whose chiral flag is set to `Off`.

<figure>
  <img alt="OR Operator" src="/images/posts/20220209/or-equals.png">
  <figcaption>
    <strong>OR Operator.</strong> Either the configuration drawn or its inverse is present.
  </figcaption>
</figure>

Use of the `&` (AND) operator indicates a mixture. Both the drawn configuration and its inverse are present. When the stereogroup contains just one center, `&` indicates that both the drawn configuration and its inverse are present. The same interpretation applies when multiple centers are present. The `&` operator has no counterpart in V2000 molfiles.

<figure>
  <img alt="AND Operator" src="/images/posts/20220209/and-equals.png">
  <figcaption>
    <strong>AND Operator.</strong> Both the configuration drawn and its inverse is present.
  </figcaption>
</figure>

Stereogroups are identified by a *stereogroup label*. The label is constructed as follows. The singleton stereogroup using the `abs` operator is simply called `abs`. Stereogroups using the `&` and `or` operators use a label obtained by appending a unique integer index greater than one to the code. For example, a stereogroup using the `OR` operator and the index `2` would be referred to as `or2`. A stereogroup using the AND operator and the index `5` would be referred to as `&5`. And so on.

Regardless of label, all stereogroups operate independently of each other. For example, the presence of groups labelled as `or1` and `&1` implies no relationship whatsoever. Indexes must be unique across each type of group, but may assume any unique value within that type.

A defined stereocenter in a V3000 molfile must belong to at least one stereogroup. If a stereocenter does not belong to any explicitly-defined groups, it is assumed to belong to `abs`.

# Assigning Stereogroups

To ensure data integrity, it's important for users and developers alike to understand how to assign stereogroups when working with V3000 molfiles. The documentation offers some examples, but without ever concisely stating a sequence of steps. Below is my attempt to boil the rules down to a repeatable procedure.

1. Divide the defined stereocenters into two groups: "invertible" and "non-invertible." An invertible stereocenter either has unknown absolute configuration, or is present in both configurations. A non-invertible stereocenter is only present in the form drawn.
2. Mark all non-invertible stereocenters with the "abs" label.
3. Label each invertible stereocenter with "or" if only one of its configurations is present, or "&" if both configurations are present.
4. Group invertible stereocenters based on whether inversion of one member implies inversion of all the others.
5. Assign a unique integer index (>1) to each invertible group.
6. Append the group index to each invertible group.

The simplest case is a molecule with one stereocenter of known configuration. Placing the stereocenter at the thin end of a wedge defines the stereocenter. There is only one stereocenter, and it is non-invertible. Therefore, it gets added to the `abs` stereogroup and the procedure exits at step (2).

<figure>
  <img alt="ABSOLUTE Only" src="/images/posts/20220209/absolute-only.png">
  <figcaption>
    <strong>ABSOLUTE Only.</strong> One stereocenter of known configuration.
  </figcaption>
</figure>

Stereochemical mixtures involving molecules with one stereocenter are common and can easily be handled by the procedure. It begins by instructing us to consider the stereocenter to be invertible (Step 1). Because both forms are present, we label the stereocenter "&" (Step 3). Because there is only one center, there can be only one group (Step 4). We arbitrarily select the index `1` (Step 5). Finally, we append the index to the group to yield `&1` (Step 6).

<figure>
  <img alt="AND Only" src="/images/posts/20220209/and-only.png">
  <figcaption>
    <strong>AND Only.</strong> A mixture of stereoisomers with a molecule having just one defined stereocenter.
  </figcaption>
</figure>

Resolution is an experimental technique that separates enantiomeric mixtures. Even though a pure enantiomer with one stereocenter may be present after resolution, the configuration may not be known for some time. Starting with Step 1, we identify the stereocenter as invertible. Then we apply the "or" label because only one configuration is present (Step 3). There is only one group (Step 4), so we assign the index `1` to it. The group label is therefore `or1`.

<figure>
  <img alt="OR Only" src="/images/posts/20220209/or-only.png">
  <figcaption>
    <strong>OR Only.</strong> A single stereoisomer of unknown absolute configuration.
  </figcaption>
</figure>

The presence of multiple stereocenters increases the complexity of assignment, but not its essence. Consider a sample obtained through the non-specific reduction of enantiomerically pure 3-methylcyclohexanone of known absolute configuration. A mixture of two diastereomers is present. In both components the absolute configuration of the methyl-bearing center is the same. The two components differ in the configuration at the oxygen-bearing center. There is therefore one invertible and one non-invertible center (Step 1). Using Step 2, we apply the "abs" label to the methyl-bearing center. Both configurations of the oxygen-bearing center are present, so its label becomes "&" (Step 3). There is only one group, so there can be only one index (Step 5). Concatenating the index to the label yields the final label (`&1`).

<figure>
  <img alt="Mixed ABSOLUTE/AND" src="/images/posts/20220209/abs-and.png">
  <figcaption>
    <strong>Mixed ABSOLUTE/AND.</strong> Reaction of an enantiomerically pure, prochiral substrate of known absolute configuration with a nonspecific reagent yields a mixture.
  </figcaption>
</figure>

The above reaction might instead have been performed with enantiomerically pure starting material of unknown absolute configuration. The final product is still a mixture, but with an additional level of uncertainty. Nevertheless, this information can be expressed in a straightforward way.

<figure>
  <img alt="Mixed OR/AND" src="/images/posts/20220209/or-and.png">
  <figcaption>
    <strong>Mixed OR/AND.</strong> Reaction of an enantiomerically pure, prochiral substrate of unknown absolute configuration with a nonspecific reagent yields a mixture.
  </figcaption>
</figure>

Despite the flexibility of enhanced representation, some mixtures are not representable and the six-step procedure will fail. Consider the following mixture in which three stereoisomers are present. Such a situation could arise through either a synthesis or purification.

<figure>
  <img alt="Three Component Mixture" src="/images/posts/20220209/three-component-mixture.png">
  <figcaption>
    <strong>Three Component Mixture.</strong> A mixture in which one of four possible stereoisomers is not present. The V3000 format is incapable of representing this case.
  </figcaption>
</figure>

Although the left-hand stereocenter clearly belongs to the `abs` group, it's not clear where the other two belong. Using `&1` and `&2` misleadingly implies the presence of four isomers, but only three are present. The failure here is due in part to the restriction that a stereocenter can only belong to one stereogroup.

Be wary of applying enhanced representation to mixtures containing an odd-number of components. 

# Enumeration

Given a structure containing enhanced representation, which components are or may be present? This question can be answered through enumeration, which transforms a single structure into a set of structures, where each stereocenter is contained within the `abs` group. Enumeration can be accomplished through the following procedure:

1. Choose an arbitrary invertible stereogroup. If there are none, exit.
2. Draw two structures, one with the stereogroup as drawn, the other inverted.
3. If the operator is "&" separate the two structures with "AND". Otherwise, separate them with "OR".
4. Replace the invertible stereo label with "abs".
5. For each of the two new structures, GOTO (1), wrapping the result in parentheses and bringing down the separator.

The result of enumeration resembles a tree whose bottom layer enumerates the specific stereoisomers that are or may be present and their relationships.

Consider the example of an enantiomeric mixture of a compound with one stereocenter. A single group, `&1` is present. This center is invertible (Step 1). Next, we draw two structures, each of opposite configuration (Step 2). The operator is `AND`, so these structures are separated by "AND" (Step 3). The original label is replaced with "abs" in each structure (Step 4). Neither structure contains additional stereocenters, so we exit (Step 5).

<figure>
  <img alt="Enumerate AND" src="/images/posts/20220209/enumerate-and.png">
  <figcaption>
    <strong>Enumerate AND.</strong> Enumeration of the isomers present given a structure with a single AND stereogroup.
  </figcaption>
</figure>

Things get more complex with multiple stereogroups. Consider a molecule with three stereocenters divided into two groups, which comes courtesy of the documentation. All centers are invertible. Starting from the top (`&1`, Step 1), we draw both structures (Step2). The operator is `AND`, so we separate the structures with "AND" (Step 3). Next, both labels are replaced with "abs" (Step 4). We select the structure on the left (Step 5) and begin with Step 1. Selecting the group second from the top (`or1`), we create two new structures. Notice, however, that the `or1` group covers *two* stereocenters. Inverting both as a unit (Step 2) yields two structures, which are separated by "OR" (Step 3). We then replace all labels for `or1` with "abs" (Step 4). Continuing as before leads to full enumeration of the stereoisomers that are or may be present, together with their relationships to each other. Enumeration ultimately reveals that the structure represents a mixture of two components.

<figure>
  <img alt="Tree Enumeration" src="/images/posts/20220209/tree-2.png">
  <figcaption>
    <strong>Tree Enumeration.</strong> Each new set of wrapping parentheses represents an iteration on the procedure. Every iteration applies the same rules, but the number of components increases exponentially with each stereogroup. Iteration ends when every stereogroup uses the ABSOLUTE operator. The final stage of enumeration reveals a two-component mixture.
  </figcaption>
</figure>

# Other Sources

This article was inspired and aided by a few resources beyond the documentation, including:

- [Improvements in InChI treatment of stereoconfiguration](https://www.inchi-trust.org/wp/wp-content/uploads/2017/11/11.-InChI-Stereo-Yerin-201708.pdf). Discusses V3000 enhanced representation and how it does or doesn't yet intersect with InChI.
- [A Twitter thread](https://twitter.com/med_chemist/status/1417952392180552612). Covers some of the ground in this article with examples.
- [Advanced Stereochemistry Registration: Atropisomers, Mixtures, Unknowns and Non-Tetrahedral Chirality](https://support.collaborativedrug.com/hc/en-us/articles/360020872171-Advanced-Stereochemistry-Registration-Atropisomers-Mixtures-Unknowns-and-Non-Tetrahedral-Chirality). A blog post with additional enumeration examples.
- [The RDKit Book: Support for Enhanced Stereochemistry](https://www.rdkit.org/docs/RDKit_Book.html#support-for-enhanced-stereochemistry). Examples of enumeration.

# Software

ChemDraw, BIOVIA Draw, and Marvin JS all support the drawing of enhanced representation. Consult each software package's documentation for details.

# Conclusion

V3000 enhanced stereochemical representation offers a powerful albeit limited solution to an important problem, namely the accurate representation of stereochemical uncertainty. This article describes the features comprising enhanced representation and offers specific guidelines for encoding and decoding it.

