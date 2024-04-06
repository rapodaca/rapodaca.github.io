---
title: MDL Valence-Mageddon
summary: "Understanding what happened to the molfile format in 2014, and what it means today."
twitter: true
summary-image: images/posts/20211201/summary.png
published: "2021-12-01T23:45:00Z"
---

The one guarantee in science is that the facts will eventually change. When they do, scientific information tools need to adapt. Information exchange formats occupy an especially delicate position in this regard. Ideally, changes at this foundational level of tooling will always be well-communicated and backward-compatible. But this isn't always true in practice. A case in point is a set of backward-incompatible changes made to the molfile specification that has received little attention. This article delves into what happened and why it matters.

# In a Nutshell

In 2014 [BIOVIA](https://www.3ds.com/products-services/biovia/), corporate custodian of the molfile format, changed the rules for counting implicit hydrogens in molfiles. Although the molfile format supports versioning, the rule change was not accompanied by a change in molfile version. The effect was to retroactively change the meaning of countless existing molfiles (or not). At the very least the change has sowed confusion about which algorithm should be used for the mundane but crucial task of hydrogen counting. This largely undocumented incident has been dubbed "MDL Valence-Mageddon."

# Hydrogen Suppression in Molfiles

MDL Valence-Mageddon relates to an obscure yet crucial feature of the molfile format, namely [*hydrogen suppression*](/articles/2020/05/18/hydrogen-suppression-in-cheminformatics/). Before diving into what happened in 2014, a few words on hydrogen suppression as it relates to molfiles are in order.

A previous article detailed [hydrogen suppression in molfiles](https://depth-first.com/articles/2020/04/13/hydrogen-suppression-in-molfiles/). To recap: "Hydrogen suppression is the practice of eliding hydrogens as nodes in a molecular graph." Molfiles support two forms of hydrogen suppression: *implicit hydrogens* and *virtual hydrogens*.

Virtual hydrogens are hydrogen atoms that are compiled to an atomic attribute counter on an atom. Monovalent <sup>1</sup>H atoms attached to a root node are virtualized through deletion with an accompanying increment of the counter. This process is more complicated in molfiles because a valence attribute is used instead of a virtual hydrogen count. But the outcome is largely the same. A molfile lets a writer encode the hydrogen atoms attached to a root atom as a count attribute, increasing efficiency of storage, marshalling, and display.

The other form of hydrogen suppression, implicit hydrogens, is the topic of today's article. Like virtual hydrogens, implicit hydrogens are deleted as nodes in the molecular graph. But unlike virtual hydrogens, there is no corresponding count attribute on the parent atom. Instead, implicit hydrogen count is determined algorithmically.

The algorithm works as follows. Some elements are assigned one or more *default valences*. Valence is the sum of bond orders, including bonds to implicit hydrogens, at an atom. Alternatively, valence can be thought of as the bonding electron count at an atom. For example, the valence the carbon atom of methane is four. The valence of the oxygen atom of methanol is two, and so on. A default valence is a value that may be associated with an element that represents a common valence for atoms. To compute the implicit hydrogen count (~h~) at an atom, subtract the bonding electron count (~b~) from the default valence (~v~):

```asciimath
h = v - b
```

There are some special cases to consider. First, hydrogen bonds and coordination bonds ([supported in V3000](/articles/2021/11/17/ten-reasons-to-adopt-the-v3000-molfile-format/)) do not add to an atom's computed valence. Second, in those elements with multiple default valences, the smallest one that does not exceed the computed bond order sum (~b~) is used for ~v~. Third, a radical subtracts one from an atom's computed valence. Fourth, atoms with non-zero charge attributes use the default valence(s) of the isoelectronic neutral element, with some provisions for further special cases.

An atom will have a zero implicit hydrogen count in three cases: (1) it has a non-default valence attribute; (2) no default valences for its element is defined; and (3) its element has a default valence equal to the computed valence.

Surprisingly, this algorithm never appears in the document most commonly cited as ["the specification"](http://help.accelrysonline.com/ulm/onelab/1.0/content/ulm_pdfs/direct/reference/ctfileformats2016.pdf). Instead, it appears in something that has gone by various names over the years, and for simplicity I'll just call ["The Guide"](http://help.accelrysonline.com/insight/2018/content/pdf_files/bioviachemicalrepresentation.pdf). Both V2000 and V3000 molfiles use the same implicit hydrogen algorithm defined in The Guide.

# Something's Wrong

The Guide occupies a central yet shadowy position in cheminformatics in that it defines the virtual hydrogen algorithm for every molfile-encoded molecular graph. Given the ubiquity of the molfile format, that's a lot of molecules in a lot of databases maintained by a lot of organizations.

If The Guide were to change the implicit hydrogen algorithm, even a little, the effects could be wide-ranging. The only way to determine virtual hydrogen count of an atom is to run the algorithm. The count itself is completely absent from the molfile format.

It turns out that The Guide didn't just change the implicit hydrogen algorithm a little. It changed the algorithm a lot. And this appears to have happened without warning (unless perhaps for Accelrys/BIOVIA customers) and most certainly without a version change. V2000 and V3000 are still the only two versions of the molfile format.

# The Change

The May 30, 2014 edition of The Guide introduced changes to the default valences of several elements. In most cases, default valences were removed entirely. In one case (Br), three of four default valences were removed. In another case (Al), default valences were removed for the neutral atom but added back for the the +1 oxidation state.

The name given to this change, "MDL Valence-Mageddon" is a tongue-in-cheek reference to its sweeping and undesirable consequences. The term was coined at NextMove software in a presentation titled [*Building on Sand*](https://www.nextmovesoftware.com/talks/Mayfield_BuildingOnSand_InChI_201708.pdf). That presentation incorrectly identifies the year of the change as 2017. Another document, [CTfile Reading](https://github.com/cdk/cdk/wiki/CTfile-Reading), gives the correct year as 2014.

The following table summarizes the differences between the default valences prior to 2014 and from 2014 onward.

<table>
  <caption>Default Molfile Elemental Valence Differences</caption>
  <thead>
    <tr>
      <th>Element</th><th>Pre-2014</th><th>2014 and Later</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Li</td><td>(1)</td><td>-</td>
    </tr>
    <tr>
      <td>Na</td><td>(1)</td><td>-</td>
    </tr>
    <tr>
      <td>K</td><td>(1)</td><td>-</td>
    </tr>
    <tr>
      <td>Rb</td><td>(1)</td><td>-</td>
    </tr>
    <tr>
      <td>Cs</td><td>(1)</td><td>-</td>
    </tr>
    <tr>
      <td>Fr</td><td>(1)</td><td>-</td>
    </tr>
    <tr>
      <td>Be</td><td>(2)</td><td>-</td>
    </tr>
    <tr>
      <td>Mg</td><td>(2)</td><td>-</td>
    </tr>
    <tr>
      <td>Ca</td><td>(2)</td><td>-</td>
    </tr>
    <tr>
      <td>Sr</td><td>(2)</td><td>-</td>
    </tr>
    <tr>
      <td>Ba</td><td>(2)</td><td>-</td>
    </tr>
    <tr>
      <td>Ra</td><td>(2)</td><td>-</td>
    </tr>
    <tr>
      <td>Al</td><td>(3)</td><td>(4) -1 only</td>
    </tr>
    <tr>
      <td>Ga</td><td>(3)</td><td>-</td>
    </tr>
    <tr>
      <td>In</td><td>(3)</td><td>-</td>
    </tr>
    <tr>
      <td>Tl</td><td>(1, 3)</td><td>-</td>
    </tr>
    <tr>
      <td>Ge</td><td>(4)</td><td>-</td>
    </tr>
    <tr>
      <td>Sn</td><td>(2, 4)</td><td>-</td>
    </tr>
    <tr>
      <td>Pb</td><td>(2, 4)</td><td>-</td>
    </tr>
    <tr>
      <td>Sb</td><td>(3, 5)</td><td>-</td>
    </tr>
    <tr>
      <td>Be</td><td>(3, 5)</td><td>-</td>
    </tr>
    <tr>
      <td>Po</td><td>(2, 4, 6)</td><td>-</td>
    </tr>
    <tr>
      <td>Br</td><td>(1, 3, 5, 6)</td><td>(1)</td>
    </tr>
  </tbody>
</table>

These differences were compiled from the corresponding tables in the [2011](https://help.accelrysonline.com/insight/2.1/Content/PDF_files/AccelrysChemicalRepresentation.pdf) and [2014](https://help.accelrysonline.com/insight/2.2/Content/PDF_files/AccelrysChemicalRepresentation.pdf) editions of The Guide.

# Consequences

What's the effect of completely removing default valences from an element? Consider an isolated, neutral sodium atom. Under the 2011 version of The Guide, sodium has a single default valence of one. Therefore, the isolated, neutral atom has a hydrogen count of 1 (~h~ = 1 - 0 = 1). Under the 2014 version of The Guide, sodium has no default valences and therefore no implicit hydrogens. The net effect is to remove a hydrogen &mdash; retroactively. It's worth noting that the implicit hydrogen count for Na+1 is zero in both cases, but for different reasons.

Another element whose default valences were stripped entirely is tin. Under the 2011 version of the Guide, tin had two default valences (2 and 4). Under the 2014 version of the guid, tin has no default valences. Consider the virtual hydrogen count of the tin atom in tributlytin. Under the 2011 rules, the count is one (~h~ = 4 - 1 = 3). Under the 2014 rules, the count is zero. The net effect is deletion of an implicit hydrogen. Notice, however, that the default hydrogen count of tetrabutyltin remains zero under either regime, but again for different reasons.

In other words, removing a default valence has the effect of under-counting implicit hydrogens in some cases.

There are two problems here. The first is that as of 2014, two sets of rules could be used to compute implicit hydrogen count. This problem would, however, be manageable if not for the second problem. There is no way to specify which implicit hydrogen algorithm applies to a given molfile. As mentioned previously, V2000 and V3000 are the only valid versions of the molfile format. There is no way to capture the valence model being used.

Various heuristics might be used to solve the problem. For example, we could examine a molfile's timestamp field. If the timestamp preceded May 30, 2014, then the semantics of the 2011 Guide would be used. If the timestamp falls after that, then post-2014 semantics would be used. But there are many problems with this approach, the most serious of which being that copying a molfile can change the timestamp. So the mere act of opening a molfile and saving it again, without editing by the user, could change the meaning of the file.

Ironically, divergent implementation of the molfile spec could mitigate the situation somewhat. It's not exactly obvious that The Guide goes with the specification. It could even be argued that The Guide merely describes how one software vendor implicit hydrogen counting. So it's understandable that some implementations have invented their own rules. Those rules would be divorced from any incarnation of The Guide and therefore not subject to change through its revision.

All of this raises the question of how various cheminformatics tools handle the situation. Are they using pre-2014 rules or post-2014 rules to compute implicit hydrogens? Do they invent their own rules? Is some combination of approaches being used? The sheer number of molfile implementations makes answering this question a daunting task. I may take up the issue in a future post. But either way, the "right" way to address the problem of two incompatible sets of rules is far from clear.

# Timeline

Given its wide-ranging and likely unintended consequences, how does something like MDL Valence-Mageddon happen in the first place? I suspect that factors related to business could explain a lot of it.

Molecular Design Limited (MDL), founded in 1978, was an early entrant into the chemistry software market. In 1991 MDL [described](http://dx.doi.org/10.1021/ci00007a012) a family of file formats, of which molfile (then written as "MOLfile") was a member. Both before and after this publication, MDL went through various mergers and acquisitions, eventually becoming the property of Accelrys through a [merger](https://www.fiercebiotech.com/biotech/accelrys-inc-and-symyx-technologies-inc-announce-merger) with Symyx Technologies in 2010.

On November 8, 2011, Accelrys published [the last edition](https://help.accelrysonline.com/insight/2.1/Content/PDF_files/AccelrysChemicalRepresentation.pdf) of The Guide to assign default valences to metals including sodium and tin.

On January 29, 2014, Dassault Sytemes [announced](https://www.reuters.com/article/us-dassault-acquisition/dassault-systemes-to-buy-u-s-based-accelrys-for-750-million-idUSBREA0T0AO20140130) its intent to acquire Accelrys. On April 29, 2014, Dassault [announced](https://www.3ds.com/press-releases/single/dassault-systemes-successfully-completes-acquisition-of-accelrys/) completion of the deal.

MDL Valence-Mageddon occurred just one month later, on [May 30, 2014](https://help.accelrysonline.com/insight/2.2/Content/PDF_files/AccelrysChemicalRepresentation.pdf) with the publication of the revised Guide.

My identification of 2014 as the year in which Valence-Mageddon occurred is based on documents available from the old Accelrys website. The URL for the Guide bearing the date "November 8, 2011" (linked above) contains the string `.../insight/2.1/Content/...` whereas the URL for the Guide bearing the date "May 30, 2014" (also linked above) contains the string `.../insight/2.2/Content/...`. These appear to be the directories containing documentation for neighboring minor releases of the Insight product line. And it is these two documents in which the differences in virtual hydrogen counting algorithms first appear. It's nevertheless possible that one or more Guides were published between the years 2011 and 2014. If so, I haven't seen them.

My information about this incident is drawn exclusively from public sources. But it does appear that MDL Valence-Mageddon developed simultaneously with the corporate shakeup happening at what had once been MDL.

# Other Changes

Given the changes to implicit hydrogen counting introduced in the 2014 Guide, it's reasonable to ask what other changes might affect the semantics of molfiles. The lengths of the documents in question run into the hundreds of pages, so this question is not easy to answer. One other difference I've spotted is the elements allowed to form tetrahedral stereocenters within substructure matches. The 2014 edition appears to expand this list. 

Nor is this the only difference. The 2014 Guide supported something called "Accelrys line notation," used for salts definitions. The 2014 Guide removed all reference to Accelrys line notation.

I would be surprised, however, if these were the only differences.

# Mitigation

Given the confusion caused by MDL Valence-Mageddon, how should maintainers of chemical databases respond?

As noted previously, atoms in both V2000 and V3000 formats support an attribute called "valence," which indirectly sets a virtual hydrogen count while at the same time disabling implicit hydrogen counting. So one option would be to re-write all molfiles to ensure that every atom, regardless of its element, has a non-default valence attribute.

The only problem with this approach is that it's not clear how widely-supported the valence attribute is. Even those tools supporting it now may not have done so in the past. So there's likely to be a spectrum of tools in the wild supporting the valence property to varying degrees.

# Conclusion

Implicit hydrogen counting is central to cheminformatics because of its incorporation into one of the most widely-used file formats, molfile. But all implicit hydrogen schemes suffer from a single point of failure, namely that any change whatsoever to the counting algorithm has the potential to cause large-scale data integrity issues. MDL Valence-Mageddon illustrates the problem quite clearly and hopefully serves as a warning to those who would venture to create scientific information exchange formats.
