---
title: Eleven Qualities of The Perfect Line Notation for the Web
published: "2007-03-14T00:00:00.000Z"
---

If you had to design the perfect line notation for the Web, what would it look like? This is hardly an academic exercise given the central role played by line notations in information systems. For a variety of reasons, existing line notations may not be the right match for the Web. This article explores this question and outlines the main qualities needed by a Web-friendly line notation.

# A Few Lines About Line Notations

A line notation is any system that converts a molecular structure into a single line of text. Chemists have been using line notations for over 140 years - long before the advent of computers. Because of their versatility, line notations are frequently used in situations they were not designed for. When this happens, limitations become apparent, resulting in renewed efforts to build a better system.

As [noted previously](http://depth-first.com/articles/2006/08/18/107-years-of-line-formula-notations-1861-1968), the invention of new line notations is a field whose popularity ebbs and flows over time. Currently, the three most important line notations are:

-  IUPAC Nomenclature
-  Simplified Molecular Input Line Entry System (SMILES)
-  IUPAC International Chemical Identifier (InChI)

Each of these systems has its own unique characteristics. [IUPAC nomenclature](http://www.acdlabs.com/iupac/nomenclature/) is the oldest and most widely-used line notation. It appears in numerous contexts, including Web pages, peer-reviewed journals, reports, patents, MSDS sheets, catalogs, and reagent bottles. By comparison, [SMILES](http://www.daylight.com/smiles/index.html) is a distant second in popularity. It's main role has been to facilitate machine entry of structural information by humans, [like this](http://www.emolecules.com/). [InChI](http://en.wikipedia.org/wiki/International_Chemical_Identifier) is the newest of the bunch. It serves both as a line notation and as a unique identifier requiring no central authority.

# The Perfect Line Notation for the Web

The emergence of the Web as a standard information delivery platform has refocused the attention of many developers on the line notation problem. With this idea in mind, here are some guesses about the qualities of the ideal Web-friendly line notation.

1.  **Readily Encodable and Decodable by Humans.** There's something unnerving about a line notation that can't easily be deciphered by humans. Is this really the right string? Did I copy it completely? This problem surfaces with every line notation, but some fare better than others. IUPAC nomenclature, for example, is one of the first things taught in many beginning organic chemistry classes. It's complicated, but still understandable by non-experts.
2.  **Readily Encodable and Decodable by Machines.** It may be relatively simple for humans to read and write IUPAC nomenclature, but not so for machines. Software that reads and writes SMILES, on the other hand, is by comparison easy to write. This explains the abundance of software packages that handle SMILES and the [scarcity](http://depth-first.com/articles/tag/opsin) of those that handle IUPAC nomenclature.
3.  **Uses URI-Safe Characters Only.** A [URI](http://en.wikipedia.org/wiki/Uniform_Resource_Identifier) uniquely identifies every document on the Internet. Why can't a line notation be used in combination with a URI to uniquely identify every molecule? One reason is that every line notation currently in use contains [characters unsafe for use in URIs](http://www.freesoft.org/CIE/RFC/1738/4.htm). Any line notation designed for use on the Web needs to avoid these characters in its syntax. *Update: InChI doesn't use unsafe characters, but it does use the reserved characters "=", "?", and "/". These characters may therefore [need to be escaped](http://info-uri.info/registry/OAIHandler?verb=GetRecord&metadataPrefix=reg&identifier=info:inchi/), depending on the context.*
4.  **Encodes All Molecules.** Buried within every line notation is an opinion on what chemistry is really about. To operate on the Web, these opinions need to be as closely aligned as possible with those of chemists themselves. [Several Depth-First articles](http://depth-first.com/articles/tag/flexmol) have discussed the limitations of existing line notations as molecular languages.
5.  **Compact.** Nobody wants to look at or manipulate a line of text that's longer than it needs to be. Of course, the more expressive a line notation is, the more verbose it will be. In other words, qualities 4 and 5 will always be in conflict.
6.  **Canonicalizable.** A line notation supports canonicalization when it specifies rules that can be guaranteed to always generate the same line notation for a given molecule. This feature enables many labor-saving assumptions. For example, a canonical representation makes a great identifier in a database, reducing the cost of storing and retrieving structural information.
7.  **Explicit Hydrogen Atom Encoding.** SMILES makes few requirements regarding hydrogen atom encoding. As a result, each software implementation is left to its own devices. The resulting confusion is the price paid for the convenience (Quality 1) of a compact notation (Quality 5).
8.  **Hierarchical Structure.** One of InChI's innovations was the introduction of a hierarchical encoding system. This system, also referred to as InChI "layers", enables a molecule to be viewed at several levels of resolution: as a molecular formula; as a network of atoms; as a network of atoms containing hydrogen atoms; as an atomic network with stereochemistry; and so on. I'm unaware of any reports in which this feature has been exploited in a practical way, although they aren't difficult to imagine.
9.  **Flat Structure.** By grouping structural features into layers (Quality 8), InChI introduces a lot of complexity that is absent in SMILES and even IUPAC nomenclature. This complexity, in part, makes it difficult for both humans and machines to properly encode InChIs (Qualities 1 and 2). Given this complexity, and the fact that the utility of hierarchical encoding has yet to be conclusively demonstrated, it may be better to avoid it.
10. **Open Source Software Implementation.** No encoding standard in today's world stands a chance of gaining acceptance without an open source reference implementation. InChI broke new ground in this area and should serve as a model for any system that follows.
11. **Unencumbered by Patents.** The success of molfile and SMILES as de facto standards derives partly from the decision made by their authors to refrain from patenting their languages. As a result, developers are motivated build their own implementations, rather than invent yet another language.

# Conclusions

A robust and modern line notation system is a key technology for chemically enabling the Web. Existing line notations, although useful in many contexts, were not designed with this particular role in mind. The time has come to consider whether a new line notation system, designed specifically with the Web and modern chemistry in mind, might offer a better solution.