---
title: Extending the V3000 Molfile Format with User-Specified Collections
id: df-0025
requires:
enables:
    - df-0024
summary: "A practical look at a unique feature."
twitter: true
summary-image: images/posts/20230111/summary.png
published: "2023-01-11T15:00:00Z"
---

Two versions of the widely-used molfile format exist: V2000 and V3000. As [noted previously](/articles/2021/11/17/ten-reasons-to-adopt-the-v3000-molfile-format/), the V3000 format introduces several capabilities not present in its predecessor. One of them allows the arbitrary grouping and tagging of certain kinds of features. The documentation hints at this grouping and tagging as a V3000 extension mechanism, but how would that work in practice? This article takes a closer look at the question.

# V3000 Collection Block

The syntax and semantics of the V3000 collection block are described in [CTfile Formats 2020](https://discover.3ds.com/sites/default/files/2020-08/biovia_ctfileformats_2020.pdf) ("the documentation"). A collection block is an unordered, tagged grouping of "objects," or molecular features. The types of objects that can be added to a collection include atoms, bonds, Sgroups (e.g., abbreviations/superatoms and polymer blocks), 3D objects, and Rgroups. A collection block can also reference objects of type "Member," or a connection table contained within an Rgroup. Within a collection block, objects are referenced by their respective integer identifiers.

A collection is also associated with either a built-in or user-specified tag.

# Syntax

A collection is defined within a *collection block*. Located within a connection table (`CTAB`) block, a collection block must appear after the blocks defining the objects to be referenced. A collection is demarcated by a begin/end (`BEGIN`/`END`, respectively) line pair. The first element of the collection block is an optional default flag (`DEFAULT`), but no further explanation of its purpose is given. Next, a tag (`name/subname`) is required. Following the tag, groups of like objects are collected using the general notation `{TYPE}=({COUNT} {ID}, [{ID} ...]).

The documentation (p 20) specifies the full syntax of a collection block as:

```console
M  V30 BEGIN COLLECTION
[M  V30 DEFAULT -]
M  V30 name/subname -
M  V30 [ATOMS=(natoms atom [atom ...])] -
M  V30 [BONDS=(nbonds bond [bond ...])] -
M  V30 [Sgroups=(nSgroups sgrp [sgrp ...])] -
M  V30 [OBJ3DS=(nobj3ds obj3d [obj3d ...])] -
M  V30 [MEMBERS=(nmembers member [member ...])] -
M  V30 [Rgroups=(nRgroups Rgroup [Rgroup ...])] -
...
M  V30 END COLLECTION
```

A collection tag is a two-part string consisting of a name and a subname separated by a delimiter (e.g., "NAME/SUBNAME"). This string may contain only "printable characters," and is case-insensitive. Wrapping the tag in double quotation marks (`"`) allows for space characters. The name part must begin with a letter. Any other first character is assumed to be the delimiter between the name and subname parts. The default delimiter is the forward slash character (`/`). Tag names must not begin with the upper or lower character sequence "MDL".

Examples of valid tags include:

- `foo/bar`. The name is "foo" and the subname is "bar". The tags `FoO/BaR` and `FOO/BAR` are equivalent.
- `"foo/bar baz"`. Here the subname is "bar baz".
- `.foo.bar`. The delimiter (`.`) separates the name "foo" from the subname "bar".

Object types must follow the collection tag, and must be listed in the order given. Only the enumerated object types may be used (`ATOMS`, `BONDS`, `Sgroups`, `OBJECT3DS`, `MEMBERS`, and `Rgroups`). User-defined object types are not allowed.

The dash character (`-`) appearing at the end of a line indicates that the contents may appear over one or more lines, and must wrap if the character count exceeds 79. This is a general feature of the V3000 format.

No content other than that listed may appear between the `BEGIN` and `END` lines.

# Semantics

Collections having equivalent tags are deemed to belong to the same collection. For example, two collections might be given the equivalent tags ("ABC/123" and "abc/123"). In such a case, both blocks reference objects belonging to the the same collection.

Two kinds of collection are supported: *internal collections* and *user-specified collections*. An internal collection is one using the tag name "MDLV30", which is reserved for use by the V3000 format sponsor (currently [Dassault Systèmes](https://www.3ds.com)). All other collections are user-specified. Readers and writers must preserve valid internal collections, but may or may not preserve user collections. If user collections are discarded, a warning (but not an error) may be reported. A valid internal collection is one whose object identifiers are used previously in the enclosing connection table block.

Identifier groupings within a collection are unordered. Thus, the atom groupings "ATOMS=(2 1 2)" and "ATOMS=(2 2 1)" express the same two-member group.

# Internal Collections

Four internal collections have been defined to date:

- `MDLV30/HILITE`. Highlighting. Used for display applications.
- `MDLV30/STEABS`. Absolute stereo group.
- `MDLV30/STERACn`. Racemic stereo group.
- `MDLV30/STERELn`. Relative stereo group.

The `MDLV30/HILITE` collection may contain any object type, but the other three internal collections must only reference atoms. These three tags collectively define "stereogroups," an important part of the V3000 format's [enhanced stereochemistry](/articles/2022/02/09/v3000-molfile-enhanced-stereochemistry-representation/) capabilities.

Two internal collections end with a lower case letter (`MDLV30/STERACn` and `MDLV30/STERELn`). Here, the letter is a placeholder for a positive integer index. For example, the first racemic stereo group might have the tag "MDLV30/STERAC1", the second "MDLV30/STERAC2", and so on.

As an example of an internal collection, consider the absolute stereo group. Each connection table gets one and only one of these. A collection block that would place the atom identified by "4" into the absolute stereogroup would be:

```console
M  V30 BEGIN COLLECTION
M  V30 MDLV30/STEABS ATOMS=(1 4)
M  V30 END COLLECTION
```

Similarly, the "1" relative stereogroup (typically displayed as "or1" or "OR Enantiomer") would be constructed from atoms identified as "4" and "5" as follows:

```console
M  V30 BEGIN COLLECTION
M  V30 MDLV30/STEREL1 ATOMS=(2 4 5)
M  V30 END COLLECTION
```

Notice that in this case the tag subname `STEREL1` is doing double duty. First, it identifies the collection as a relative stereogroup. Second, it sets the index for the relative stereogroup to "1".

# User-Specified Collections

The documentation suggests that user-specified collections can be used as a V3000 molfile format extension mechanism. Readers recognizing such collections will process them. Other readers will simply ignore them and may discard them if present.

Although the V3000 molfile format does define a collection dedicated to highlighting, it's rather limited. For example, it does not allow the color to be set. We might remedy this problem with a user-specified collection, as exemplified below:

```console
M  V30  BEGIN COLLECTION
M  V30 MM/HIGHLIGHT#FF0000 BONDS(6 1 2 3 4 5 6)
M  V30  END COLLECTION
```

This user-specified collection identifies its namespace with the tag name "MM". The subname ("HIGHLIGHT#FF0000") serves two purposes. First, marks the collection for use in highlighting. Second, the suffix ("#FF0000") encodes a hexadecimal RGB value (red). The collection would therefore highlight bonds 1-6 in red. Similar collection blocks could highlight bonds, atoms, and other objects using different colors. The scheme could be further expanded to support visual effects like width or transparency. Data could be encoded directly within the subname as is done here, or indirectly through an effect identifier. Readers understanding the "MM/HIGHLIGHT" tag namespace would process its effects according to a well-documented specification. Other readers would just ignore the extension.

# User-Specified Collection Metadata

Arbitrary data can be encoded into a collection tag's name and subname components. Indeed, the authors of the V3000 specification appear to sanction this use in the "STERELn" and "STERACn" stereogroups. The same approach is therefore open to third parties. It's straightforward to associate integers and other simple kinds of data with collections in this way. But encoding more complex structured data such as key/value stores could get unwieldy.

Unfortunately, my reading of the V3000 specification allows for little alternative but to encode all collection metadata into the tag itself. A collection block may only contain the syntax elements described above. Inclusion of other data within the collection block itself risks rejection from compliant readers.

If complex metadata are to be associated with V3000 molfile, the encoding must exist external to the collection block itself. Indeed, it must exist external to the V3000 molfile connection table. This leave two possible locations for encoding complex collection metadata:

1. *Outside of a V3000 connection table block.* V3000 molfiles are designed to be backward compatible with V2000 molfiles. The V2000 part of the documentation directs readers that "All lines that are not understood by the program are ignored." (p 47). If a metadata block were to appear inside a V3000 molfile, but outside of a connection table block, the resulting file should be accepted by conformant readers.
2. *Outside of the molfile.* Alternatively, collection metadata could be stored external to the molfile entirely. For example, a V3000 molfile could be contained within a wrapper format. Such a format could reference identifiers within the molfile for any purpose, including the association of structured metadata with collections. The bigger question would be: why stop there? Anything is possible outside of the molfile, including custom collection syntax and semantics.

# Conclusion

The V3000 molfile format supports aggregation and tagging of objects through collections. Four predefined internal collection types are implemented by default. Third-party extensions are supported through user-specified tags. This extension mechanism may suffice for simple applications. However, syntax restrictions will likely complicate the association of arbitrary structured metadata with collections. In such cases, metadata could be encoded either external to the connection table or the molfile itself.
