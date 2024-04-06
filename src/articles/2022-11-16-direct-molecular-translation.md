---
title: Direct Molecular Translation
genre: Big Idea
summary: "Weighing two approaches to a perennial problem."
twitter: true
summary-image: images/posts/20221116/summary.png
published: "2022-11-16T15:00:00Z"
---

Several molecular serialization formats are used in cheminformatics. Examples include SMILES, molfile, CDXML, and InChI, among others. Each format has a preferred context, making translation a perennial problem. To avoid generating [molecular garbage](/articles/2020/07/27/a-guide-to-molecular-standardization/), translations must occur cleanly, neither adding artifacts nor dropping features unnecessarily. This article offers some perspective on two approaches to this problem.

# Hub vs. Direct Translations

Translation rewrites an input serialization as an output serialization having a different format. There are two basic approaches to this problem:

1. *Hub Translation*. The input is rewritten to a hub format, which is then rewritten as the output.
2. *Direct Translation*. The input is rewritten as the output, without an intermediate format.

Hub Translation routes all data through a single hub format. The main advantage is to scale the translation space linearly with the number of formats. Each format has two translations, one into and one out of the hub format. Therefore, the maximum size of the translation space is 2*n*, where *n* is the number of supported formats.

<figure>
  <img alt="Molecular Translations" src="/images/posts/20221116/molecular-translations.png">
  <figcaption>
    <strong>Molecular Translations.</strong> Hub Translation (top) proceeds through an intermediate format, whereas Direct Translation (bottom) does not.
  </figcaption>
</figure>

Hub Translation is often found in cheminformatics toolkits, with the toolkit's native molecule data structure serving as the hub format. Alternatively, a widely-used serialization format can be used as a hub. For example, SMILES is often used as a hub format given its broad software support.

The main disadvantage of Hub Translation is the potential for data loss or corruption. If the hub format is too simple, it will be incapable of capturing all of the features that might be conveyed through translation. If the hub format's features poorly match either input or output format, then translation can lead to garbage.

An alternative is Direct Translation. Because no hub format is used, data can flow unmodified from input to output. In principle, every feature found in both formats can be conveyed with high fidelity.

The main disadvantage of Direct Translation is exponential growth of the translation space. Each new translation requires a dedicated conversion to and from every other format. The translation space therefore scales as *n*<sup>2</sup>, where *n* is the number of serialization formats.

# The Not-So-Super Superformat

A hub format can morph into a *superformat*. A superformat is a hub format designed to support translation of two or more distinct formats. When used as a hub format, a superformat allows high-fidelity conversions with linear growth of the translation space. At least in principle.

An effective superformat requires mutual compatibility of all features found in all supported formats. The ease of merging features from distinct formats depends on the kind of feature. Some will play nice together, but others won't.

Consider formal charge. As [noted previously](/articles/2020/03/16/formal-charge-and-bond-order-are-side-effects/), formal charge is most accurately considered as a computation rather than an attribute. However, serialization formats commonly treat formal charge as an attribute (e.g., molfile and [Balsa](https://doi.org/10.26434/chemrxiv-2022-01ltp)). Combining attribute and computation models in the same format is possible, but requires careful design of the underlying representation.

The complexity of the problem rises quickly for highly nuanced formats like [CDXML](/articles/2021/04/07/an-introduction-to-the-chemdraw-cdxml-format/) and [V3000 molfile](/articles/2021/11/17/ten-reasons-to-adopt-the-v3000-molfile-format/). For example, both formats support a form of extended bonding not available in most other formats. The creator of a superformat supporting CDXML or V3000 translation faces a dilemma: fully support niche features like extended bonding, risking the introduction of an incompatibility, or disregard the niche features, preventing complete translation?

One option for dealing with niche features is freeform attributes. For example, a superformat can allow storage of arbitrary key-value pairs as a kind of feature grab-bag. Although simple in principle, this approach creates a freeform API highly prone to data loss and mis-translation.

An important secondary consideration is bloat. A superformat necessarily represents a superposition of all translatable formats. The surface area for a superformat is therefore at least as large as the most complex translatable format. In practice, it's likely to be much larger. As such, the superformat will be harder to learn, use, debug, and extend than any constituent format. The use of a superformat directly conflicts with the goals of the [minimal molecule API](/articles/2020/04/06/a-minimal-molecule-api/), whose purpose is to condense the main modes of molecular interaction into just a few well-defined methods.

Finally, the performance of a superformat should be considered. Adding features to a molecular encoding is not free. Each additional feature adds computational costs in the form of memory and time complexity. These costs can't be eliminated, but merely managed. The problem will likely boil down to trading performance for internal complexity.

# Making Direct Translation Work

Two factors could tip the balance toward Direct Translation:

1. The number of useful translation pairs is limited. Although cheminformatics has produced many molecular serialization formats, few are routinely useful. In practice, *n* is small and so is the translation space.
2. Once complete, a Direct Translation requires little maintenance because the underlying formats change so infrequently, if at all. Moreover, these translations can evolve independently of any given cheminformatics toolkit or superformat. With no superformat, translations are loosely coupled. Each one can be added or removed without affecting the others.

Implementing Direct translation requires two elements:

- A format-specific toolkit. This software can transform any serialization in the target format to a useful data structure, and vice versa. Examples of software pursuing this approach are [Trey](/articles/2022/07/13/trey-a-toolkit-for-v3000-molfiles-and-rgfiles/) (V3000 molfile) and [Balsa](https://github.com/metamolecular/balsa).
- A translation function. To avoid coupling format-specific toolkits, these functions should be packaged separately from the format-specific toolkits they use. One possibility would be to bundle them together into the same module, importing format-specific toolkits as a dependency.

# Conclusion

Translating molecular serialization formats is a necessary evil in cheminformatics. Two broad approaches are possible: Hub and Direct. Hub Translation is often favored for its ability to constrain the growth of translation space. However, Hub Translation brings with it the potential for data loss or corruption, even when a superformat is used. Direct Translation is not used as much, but offers the potential for higher fidelity. Exponential growth of the translation space may not be the problem in practice that it appears to be in theory. Format-specific toolkits combined with a few translation functions may therefore be sufficient for at least some purposes.
