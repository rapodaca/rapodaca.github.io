---
title: Hashing InChIs
published: "2007-05-09T00:00:00.000Z"
---

The InChI team has announced [a proposal](http://chemdata.nist.gov/InChI/inchi-hash.pdf) for a standardized InChI hashing mechanism. This would create a free, fixed-length, alphanumeric molecular identifier.

This is an excellent proposal. One of the biggest problems in working with InChIs (and other line notations such as SMILES) is that even medium-sized molecules produce very long identifiers. Another problem is the use of characters that must be escaped in URLs. The hashing proposal addresses both of these issues, getting very close to creating [the optimal molecular identifier](http://depth-first.com/articles/2007/03/14/eleven-qualities-of-the-perfect-line-notation-for-the-web).

For example, imagine the convenience of being able to refer to a molecule by a universally-recognized, machine-generated string like the one shown below:

`AAAAAAAAAAA-BBBBBBB-XYZ`

This is something that actually stands a chance of getting printed on reagent bottles, in catalogs, in patent applications, or anywhere else chemists are using chemical information. Aside from its length, it's not too different from that [other molecular identifier system](http://www.cas.org/expertise/cascontent/registry/regsys.html), but without the perpetual use tax.

There are at least three downsides to this approach:

1.  For most purposes, hashing is a one-way process. It would become virtually impossible to computationally convert this hashed identifier back into its InChI or molecular representation . On the other hand, this could create a market for cryptography experts in cheminformatics. A hashed-InChI lookup service would start to look very useful.
2.  Because of the one-way nature of hashing, the authenticity of a hashed InChI couldn't be directly verified. Checksums will help, but the fundamental problem remains. InChI itself can be [decoded](http://depth-first.com/articles/2006/09/19/decoding-inchis-with-rino), and therefore authenticated.
3.  It's possible, although extremely unlikely, that two different molecules will end up having the same hashed InChI. Reducing the collision probability means increasing the length of the identifier.

As in any design decision, the question is whether the benefits outweigh the disadvantages.

Anyone is free to develop their own InChI hash system. Several, including me, already have. But by introducing a standard mechanism, the InChI team has the potential to create both a *free* and easy-to-use molecular identifier.
