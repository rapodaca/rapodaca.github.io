---
title: Introducing Balsa
summary: "Improving data quality in chemistry by constraining SMILES."
twitter: true
summary-image: images/posts/20220629/summary.png
published: "2022-06-29T21:40:00Z"
---

When molecular structures are encoded and decoded as short strings, SMILES is more likely than not to be used. In the 34 years since Weininger's [landmark publication](https://doi.org/10.1021/ci00057a005), SMILES has been widely adopted by both software vendors and database maintainers. But despite its crucial importance to the fields of both chemistry and cheminformatics, SMILES remains underspecified. This article outlines problem and describes a solution.

# SMILES is Underspecified

To get a sense of just how underspecified SMILES is, try locating the specification itself. By a wide margin, modern literature cites Weininger's [1988 paper](https://doi.org/10.1021/ci00057a005). But by its own admission, this source is incomplete. The most glaring omission is stereochemistry, but there are several others.

A [previous article](/articles/2022/06/01/protosmiles/) describes this problem, and a solution, at length. To recap, a 2003 [book chapter](http://doi.wiley.com/10.1002/9783527618279.ch5) by Weininger is not only authoritative but the most complete description of SMILES ever published. I call the language described therein "ProtoSMILES" to avoid confusion with the many often conflicting notions of "SMILES." With ProtoSMILES we can at least begin to talk about something specific.

Although it's the best source available, ProtoSMILES is nevertheless incomplete. Major language elements lacking complete descriptions include: the algorithm for implicit hydrogen counting; upper and lower bounds on numerical quantities; the algorithm for converting Kekulé and aromatic forms; the function of aromatic bonds; and formal grammar.

Software implementors require clarity on these and other points. None was ever given, leaving only one path forward: guesswork. This has led to a proliferation of SMILES dialects, none of which is documented in sufficient detail or has sufficient market share to be considered a reference standard. To further muddy the waters, each implementation adds its own extensions to varying degrees.

To get a sense of the ways in which opinions around SMILES diverge, consider a series of [informal polls](/articles/2022/06/15/smiles-problems/) I've conducted over the last two years on Twitter. If the results of those polls seem unrepresentative, try asking the same questions to a few knowledgeable peers. I suspect that the level of disagreement could be surprising. But even more surprising will be the lack of a clear path to resolving these differences. Simply put, the necessary documentation was never written.

Some view this situation as no big deal or even healthy. Spoken languages are fluid, lacking full specification and evolving over time. Many computer languages have similar characteristics. The world didn't end as a result &mdash; far from it. So why make a fuss about underspecification in SMILES?

Ambiguity at the level seen with SMILES undermines science. The most obvious problem is the central role played by molecular structure in chemistry. Experimental chemists spend a large amount of time and money in pursuit of the goal of associating molecular structure with various properties. An unreliable primary key (molecular representation) can throw the integrity of entire data sets into question.

It would be one thing if SMILES were widely-understood to actually be two or so dozen vendor-specific formats whose differences have never been documented. At least then the problem would be apparent and workarounds possible. This view may be present to a degree, but so is the view of SMILES as a vendor-independent data exchange format. Where you get your SMILES strings and how you process them matters to some unknown degree. It's not unreasonable to ask how many [FAIR Principles](https://www.go-fair.org/fair-principles/) are put at risk through the continued use of SMILES in databases and in toolkits.

# Language Subset

At its core, SMILES solves a real problem: the compact representation of a subset of addressable chemical space. The problem is that SMILES is underspecified, yet treated as if it were fully specified. Over time, that underspecification and lack of awareness of the problem have led to a proliferation of implementations that are mutually incompatible in subtle yet scientifically meaningful ways.

A clear step toward solving an underspecification problem is to add constraints. Wherever ProtoSMILES is vague, inconsistent, or unclear about either syntax or semantics, we add the necessary constraints, erring on the side of preserving useful functionality. For example, ProtoSMILES sets no upper or lower bounds on the atomic isotope attribute. So we define it to be an integer greater than zero and less than 1,000.

A few SMILES features were poorly-conceived. Take, for example, the aromatic bond, represented by the colon symbol (`:`). ProtoSMILES says nothing about the function of such bonds, and even hints that they may serve no purpose at all. Eliminating aromatic bonds therefore subtracts no functionality. Non-tetrahedral stereo descriptors (e.g., "OH") are removed due to their low cost/benefit ratio. SMILES lacks the features needed to faithfully represent the bonding relationships for organometallic and inorganic molecules in which such configurations appear. At the same time, the system of chiral classes used in ProtoSMILES is extraordinarily complex and for this reason not commonly implemented. Moreover, templates fail to address the root cause of the problem, which is that they inevitably beget more templates as chemistry advances.

Some ProtoSMILES features are not only underspecified but under-documented. Consider "aromaticity." Not only does ProtoSMILES overload a highly contentious term from organic chemistry, but it fails to provide a procedure for converting Kekulé and aromatic forms, or even counting implicit hydrogens on atoms designated as aromatic. Therefore, documentation consistent with all descriptions of aromatic behavior in ProtoSMILES is added. The terms may be different, but the net effect is to fully document a feature, while providing a clear path to implementation.

The process is purely subtractive. Features are clarified and if need be removed altogether, but never added. The result is a SMILES language subset or [sublanguage](https://en.wikipedia.org/wiki/Sublanguage). Language subsets have ample precedent in computer science. A well-known example is the one based on JavaScript and found in *[JavaScript: The Good Parts](https://www.oreilly.com/library/view/javascript-the-good/9780596517748/)*. The author's aim was to "chip away at the features that are not beautiful until the language's true nature reveals itself." SMILES also has many good parts, which can be accentuated by removing the bad parts.

<div class="videowrapper">
  <iframe src="https://www.youtube.com/embed/hQVTIJBZook" allowfullscreen></iframe>
</div>

# Introducing Balsa

Balsa (previously known by the codename "Dialect") is a SMILES language subset. It consists of two ongoing efforts:

1. [A working paper](https://github.com/metamolecular/balsadoc) describing Balsa in sufficient detail to write a software implementation. The manuscript is being written in the open using GitHub. Questions, comments, and suggestions can be submitted as [issues](https://github.com/metamolecular/balsadoc/issues). A first draft of the manuscript text has been completed. In progress are figures, which are likely to number 25-30.
2. [A reference implementation](https://github.com/metamolecular/balsa). It is being written simultaneously with the working paper in an effort to ensure compatibility and to inform the content of the paper. This implementation has already undergone two incarnations as [Purr](https://github.com/rapodaca/purr) and [Dialect](https://github.com/rapodaca/dialect.rs). The reference implementation is written in [Rust](/articles/2020/01/20/cheminformatics-in-rust/) for its rich suite of tools and to maximize portability and security.

The name "Balsa" was chosen in reference to the [tree](https://en.wikipedia.org/wiki/Ochroma) (*Ochroma pyramidale*). The working paper introduces the concept of a "molecular tree" on which discussions of syntax and semantics are based. The wood from the balsa tree is [renowned](https://www.apogeerockets.com/education/downloads/Newsletter69.pdf) for its high strength-to-weight ratio, which fits well with the aim of compact, lossless molecular representation.

# Compatibility

The main reason to construct a language subset such as Balsa is compatibility with existing software. In this sense, Balsa strings should be readable by all SMILES implementations. Given a reference implementation, this endpoint can be tested in an automated fashion through a compliance suite. Such a compliance suite can also serve as a helpful resource for developing Balsa-compatible software.

A Balsa reader won't necessarily be able to interpret every SMILES. The degree to which this poses a practical problem depends on the degree to which the features Balsa leaves out are being used elsewhere. My belief is that Balsa drops features that are used rarely, if at all. Fortunately, this hypothesis can be tested through the combination of a reference implementation and large SMILES data sets such as those published by [PubChem](https://pubchem.ncbi.nlm.nih.gov), [ChEBI](https://www.ebi.ac.uk/chebi/), and [ChemBL](https://www.ebi.ac.uk/chembl/).

# Looking Forward

What does a successful Balsa look like? Two outcomes would be important: (1) the development of additional reference implementations; and (2) the development of comprehensive compliance suites.

Porting software from one language to another is a powerful labor-saving technique. In this sense the Rust implementation gives developers using other languages a leg up over starting from scratch. Moreover, Rust's ability to integrate with other languages means that a full port may not even be necessary.

The point of reference implementations is to replicate behavior across software stacks. Tests are paramount here, and the more comprehensive they are the better. Compliance suites compiled from a diverse collection of SMILES found in the wild would offer the means to verify compatibility in an automated fashion.

A longer-range goal behind Balsa is to lay a foundation for extensions. SMILES itself lacks versioning, a limitation that Balsa necessarily inherits as a language subset. This means that Balsa must remain closed to future changes, or else risk recreating the very problem Balsa was designed to solve. In other words, what you see is what you will always get. Nevertheless, Balsa is open to extensions, provided that they avoid changes to grammar or semantics. The emergence of such extensions would both add and demonstrate value.

# Conclusion

Balsa is a molecular line notation designed to be a subset of SMILES. Balsa eliminates problematic features from SMILES, while fully constraining the features that are left. The output of Balsa writers should be readable by any SMILES reader, and Balsa readers should in general be able to read SMILES. Two projects are underway: a working paper that describes the language in detail; and a software reference implementation. This combination should provide a practical entry for those interested in improving data quality in chemistry.
