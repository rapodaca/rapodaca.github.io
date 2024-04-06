---
title: Formal Charge and Bond Order are Side Effects
summary: "Thinking differently about an old problem."
twitter: true
summary-image: images/posts/20200316/summary.png
published: "2020-03-16T19:00:00Z"
---

A cheminformatics toolkit or file format is only as good as its molecular representation. The more robust and expressive the representation, the broader the scope of problems that can be addressed.

Two frequently-overlooked aspects of molecular representation are formal charge and bond order. These numerical quantities underpin depiction, descriptor calculation, and encoding/decoding among others. This article examines molecular representation problems related to formal charge and bond order, and discusses general solutions.

# Attribute vs Computations

A good molecular representation system makes a clear distinction between two fundamental but different kinds of molecular values:

- **Attributes.** Read-write values.
- **Computations.** Read-only values obtained from one or more attributes.

I use the word "attribute" here in the sense of its French derivation "to assign" (ad- "to" + tribuere "assign"). A molecular attribute is assignable, meaning that clients can write it without restriction.

A computation, on the other hand, can only be deduced through reference to one or more attributes. The value of a computation can't be directly assigned.

For example, atomic number could be an attribute of an atom. Assign the number 6 and you'll have a carbon. Assigning 8 gives you oxygen, and so on. In most cases, it wouldn't make sense to obtain an atomic number through computation any more than it would make sense to obtain legal name of a person through computation. A person's legal name is an attribute, set at birth.

In contrast, molecular weight is a computation performed over the atoms of a molecule. It would not make sense to allow clients to set the molecular weight of a molecule any more than it would make sense for a person to choose their own weight. In both cases, the number must be measured or somehow computed.

It turns out that attributes tend to correspond to particles in chemistry. An atomic number expresses the number of protons in the nucleus. A mass number expresses the number of nucleons. As we'll see shortly, electron counts are also attributes used to compute bond order and formal charge.

The result of a computation can be cached, but that still does not make the value an attribute. Should an attribute such as an atomic number change, the computation would need to be performed again.

# Things Go Wrong

The distinction between attributes and computations may seem academic. Why not just allow clients to set formal charge or bond order directly?

Consider ethene. Those who have taken sophomore organic chemistry will recognize that its only bond has a formal bond order of 2.

Now consider benzene. There are six equivalent bonds, but what's the formal bond order? At some point you may have worked through the calculation to get the number 1.5.

All well and good. Now consider naphthalene. What's the bond order there? Perhaps not 1.5, but what exactly?

A cheminformatics toolkit or file format that allows clients to set bond order must account for such possibilities. For example, if the signature for a `setBondOrder` method accepts a floating point number, what happens if another benzene ring is annulated? Who updates the orders of the original bonds and when?

The problem can get out of hand very quickly.

Formal charges follow a similar pattern. Simple cases are easy to reason about, but even a little complexity throws a monkey wrench into the works. Consider the benzyl cation. The primary carbon bears a formal charge of +1. Again, this is a result every college graduate should know.

Now consider the cyclopentadienly anion. There are 5 equivalent atoms, but what's the formal charge on each one? For that matter, what happens to a previously-assigned formal charge through annulation of a benzene ring?

These examples illustrate the interaction of two problems. First, formal charge and bond order are side-effects. They are computed properties that clients should only set under special conditions. Second, molecule mutablilty makes a bad situation worse. I'll have more to say about mutability later. For now, let's look at the attributes needed by formal charge and bond order computations.

# Pity the Poor Electron

What's missing from most file formats and toolkits is the concept of the *electron*. Like protons and neutrons, these fundamental particles can be modeled as attributes on both atoms and bonding relationships. When given, electron counts together with connectivity can be used to compute formal charge and formal bond order.

There are a few ways to model the nonbonding electrons on an atom. One option would be to record total nonbonding electron count as an attribute. Another option would be to record the total nonbonding valence electron count. Still another method would be to record core nonbonding electrons and valence shell nonbonding electrons separately. Depending on the application, energy levels and/or spin states for individual electrons might also be captured, but that's not necessary to compute bond order and formal charge.

Bonding relationships between atoms are usually modeled as a *bond*. A bond can be thought of as an edge of a molecular graph with associated attributes. Convenient thought it may be, this model excludes many common and uncommon bonding arrangements. One solution is to allow fractional bond orders. But for reasons stated above, this option is not generally effective.

# Bonding Systems

Extended bonding relationships can be modeled with a *bonding system*. A bonding system consists of a connected, nonempty subgraph over the atoms and edges of a molecular graph, and associated attributes. The most important attribute is electron count.

Together with a complete set of nonbonding electron counts, the set of all bonding systems allows computation of formal charges for any atom and formal bond order across any edge of the molecular graph.

What does this complexity buy us? If you only ever work with two-atom bonds, then probably nothing. However, many cheminformatics toolkits include aromaticity as a concept. Some even allow for tautomerism. A few might aspire to to work with organometallics. Bonding systems allow all of these features to be handled through a uniform interface.

The concept of "bonding system" is adapted from [the groundbreaking paper by Andreas Dietz](https://doi.org/10.1021/ci00027a001).

# Computing Formal Bond Order

Formal bond order can be computed as follows:

```asciimath
O_{{x,y}} = 1/2sum_(b∈B_{{x,y}})(n(b))/(p(b))
```

where:

- ~B_{{x,y}}~ is the set of bonding systems containing the edge ~{x,y}~
- ~b~ is a bonding system
- ~n(b)~ is the number of electrons in bonding system ~b~
- ~p(b)~ is the number of edges in bonding system ~b~

For example, consider the two-atom, two electron C-C bond in ethane. There is only one bonding system (~b~) between the two carbon atoms, so ~O_{{x,y}}~ simplifies to:

```asciimath
O_{{x,y}} = 1/2*(n(b))/(p(b))  = 1/2*(2/1) = 1
```

This bond consists of one edge (~p(b) = 1~) and one pair of electrons (~n(b) = 2~). Therefore, the formal bond order ~O_{{x,y}}~ is one. Doubling the number of electrons ~n(b) = 4~ yields a formal bond order of 2, and so on.

Now consider benzene. There are a few ways to model it, but many chemists would consider this species to consist of a σ-framework of six C-C bonds and an extended π-framework containing all atoms. Each edge in this molecular graph has the same formal bond order, which can be computed as 1.5:

```asciimath
O_{{x,y}} = 1/2(2/1 + 6/6) = 3/2
```

What about naphthalene? This molecule can be modeled analogously to benzene. One way would be to consider the π-system as an 11-edge, 10-electron bonding system. If so, the formal bond order at any edge ~{x,y}~ would be:

```asciimath
O_{{x,y}} = 1/2(2/1 + 11/11) = 3/2
```

Alternatively, we could leave out the edge between the two tertiary carbons. In this case, the formal bond order between any edge {{x,y}} would be:

```asciimath
O_{{x,y}} = 1/2(2/1 + 10/11) = 16/11
```

Depending on how the π-system is modeled, we get a different formal bond order. The same applies if we were to use a [Kekulé form](https://depth-first.com/articles/2020/02/10/a-comprehensive-treatment-of-aromaticity-in-the-smiles-language/). The ability to express a bonding relationship in multiple ways means that we'll have to choose one. As Dietz observes:

> Note that a molecular structure representation cannot free the user from the task to decide how a chemical structure should be represented. However ,a lack of versatility might force the user to represent a chemical structure in a certain manner, even if he actually would prefer to represent it differently.

# Computing Formal Charge

The formal charge on atom ~x~ of structure ~s~ is given by:

```asciimath
c_s(x) = v(x) - v_s(x)
```

where:

- ~c(x)~ is the formal charge on atom ~x~ of structure ~s~
- ~v(x)~ is the number of electrons on the isolated atom ~x~
- ~v_s(x)~ is the valence electron count on atom ~x~

Calculation of ~v_s(x)~ is only possible if ~s~ satisfies both of the following conditions:

- ~u_s(x)~, the number of nonbonding electrons of ~x~ in ~s~ is known
- the set of all bonding systems involving atom ~x~ is known

If these conditions are met, then ~v_s(x)~ is given by:

```asciimath
v_s(x) = u_s(x) + sum_(b∈B_x)(n(b)*p_x(b))/(p(b))
```

where:

- ~u_s(x)~ is the number of nonbonding electrons for atom ~x~
- ~B_x~ is the set of bonding systems containing atom ~x~
- ~p_x(b)~ is the number of edges in bonding system ~b~ connected to atom ~x~
- ~n(b)~, as defined previously, is the number of electrons in bonding system ~b~
- ~p(b)~, as defined previously, is the number of edges in bonding system ~b~

Consider the ethyl cation. There are three 2-electron, 2-atom bonding systems (two C-H bonds and one C-C bond). The formal charge at the cationic carbon is given by:

```asciimath
C_s(x) = 4 - 0 - 3*1/2(2*1/1) = 1
```

The allyl cation can be modeled as having a two-electron, three-atom π-bond. The formal charge at a primary atom is computed as:

```asciimath
C_s(x) = 4 - 0 - 3*1/2(2*1/1) - 1/2(2*1/1) = 1/2
```

Using the same model of bonding, the formal charge of the secondary atom is computed as:

```asciimath
C_s(x) = 4 - 0 - 3*1/2(2*1/1) - 1/2(2*2/2) = 0
```

# Theory vs. Practice

Although toolkits and file formats should avoid allowing clients to set the values of computations, this may not be practical. Consider the two most widely-used formats in cheminformatics, SMILES and molfile. Instead of electron count attributes, these formats require clients to set formal charges and bond orders.

Nevertheless, such an approach can lead to consistent results &mdash; provided that:

1. charges are restricted to integer values;
2. bond orders are restricted to integer values; and
3. the specification provides a valence model detailed enough to allow reconstruction of electron counts from client-defined formal charges and bond orders

It's worth noting that both two-centered and multi-centered bonding can exist side-by-side in the same toolkit or file format. The key has been to recognize that formal charge and bond order are side effects to be computed. Electron counts on atoms and bonding systems are the attributes tracked underneath the facade. This approach has been put into production through the cheminformatics toolkit built into [ChemWriter](https://chemwriter.com) for [some time now](https://chemwriter.com/smiles/). Future articles will discuss the approach in detail.

# Conclusion

Formal charge and bond order are often treated as read-write attributes, but they should be considered for most purposes read-only computations. Fractional bond orders and formal charges can be supported by extending the traditional two-atom bond to a multi-atom bonding system. Only in limited cases should bond order and formal charge be treated as attributes.
