---
title: "Rethinking the Chemical Reaction as a Graph: Imaginary Transition Structures and Beyond"
summary: "Bridging the divide between reactions and molecules in cheminformatics."
twitter: true
summary-image: images/posts/20200224/summary.png
published: "2020-02-24T14:00:00Z"
---

Cheminformatics concerns itself with two entities: molecules and reactions. A molecule embodies chemistry's static nature, whereas a reaction embodies the dynamic. Although there are important problems to solve on both sides, cheminformatics tends to focus on molecular tools over reaction tools. One reason is complexity. Reaction tools require solutions to all of the problem required by molecule tools, and then some.

Then there's graph theory. For 150 years, theoretical chemistry and later cheminformatics have reaped the benefits of close ties with this branch of mathematics. An obvious relationship between the two fields presents itself: in a molecule, atoms map to nodes and bonds map to edges. Algorithms and proofs from graph theory are applied to molecular problems. Likewise, molecular problems inspire graph theory. The crossover continues to this day. Reactions, on the other hand, don't align in such an obvious way. Although reaction networks, where nodes map to molecules and edges map to transformations can be built, this approach presents several challenges.

What if reactions could be formulated more like molecules? That was the premise of a series of papers from the 1980s.

# Arrow Notation

Arrow notation depicts a chemical reaction with the head pointing away from starting materials and toward products. This convention, which [dates back to at least 1757](https://doi.org/10.1080/00033795900200088), is still used today. In modern notation, catalysts and excess reagents often appear above the arrow, with time, temperature, and solvent below.

<figure>
  <img alt="Arrow Notation" src="/images/posts/20200224/arrow-notation.png">
  <figcaption>
    <strong>Arrow Notation.</strong> The main reactant appears on the left, with the product on the right. Reagents used in excess, catalysts, solvents, additives, and conditions appear above/below the arrow [<a href="https://en.wikipedia.org/wiki/Friedel–Crafts_reaction">source</a>].
  </figcaption>
</figure>

Cheminformatics tools have for the most part adopted arrow notation. For example, [Daylight documentation](https://www.daylight.com/meetings/summerschool01/course/basics/smirks.html) explains how to use the greater than (`>`) symbol as a reaction arrow. Other examples can also be found, including the [MDL RXNFile format](https://www.3dsbiovia.com/products/collaborative-science/biovia-draw/ctfile-no-fee.html).

# The Problem with Arrow Notation

Easily understandable and ubiquitous though it may be, arrow notation drags some baggage into the cheminformatics arena. Problems include:

- Repetition. Non-participating atoms and bonds are duplicated on both sides of the arrow.
- Hypergraph. A single reaction maps potentially many reactants to many products. If molecules are nodes in a reaction graph, then a reaction arrow maps to a [hypergraph edge](https://en.wikipedia.org/wiki/Hypergraph). Graph manipulation procedures often explicitly disallow such graphs.
- Atom mapping. We usually want to correlate an atom or bond in the starting material with one appearing in a product. Arrow notation requires a secondary mapping system.
- The above complexities make it difficult to re-use standard graph-based computational methods such as cycle perception, traversal, and isomorphism detection.

The result is two disconnected cheminformatics software stacks: one dealing with molecules and the other dealing with reactions. The division can be seen from the bottom software layer (the cheminformatics toolkit) all the way to the user interface (structure vs. reaction editors). Attractive though it may be in the beginning, arrow notation unnecessarily fragments the code base.

# Imaginary Transition Structures (ITS)

In 1986, [Shinsaku Fujita](https://doi.org/10.22052/ijmc.2016.13882) proposed an alternative to arrow notation. His approach, [Imaginary Transition Structures](https://doi.org/10.1021/ci00052a009) (ITS), viewed reactions as "an extended kind of chemical structure." This system encodes reactants, products, and atom mappings within a single, undirected, connected graph.

<figure>
  <img alt="Building an Imaginary Transition Structure" src="/images/posts/20200224/building-an-imaginary-transition-structure.png">
  <figcaption>
    <strong>Building an Imaginary Transition Structure.</strong> Reactants, products, and the mapping of atoms/bonds are combined within a single graph [<a href="https://doi.org/10.22052/ijmc.2016.13882">source</a>]. 
  </figcaption>
</figure>

Consider the acid-catalyzed hydrolysis of ethyl acetate. Here, two reacting species (ethyl acetate and water) produce two products (ethanol and acetic acid). Hydrogen chloride, serving as a catalyst, appears on both sides. The arrow notation for this reaction is:

```console
CH3CO2CH2CH3 + H2O + HCl → CH3CO2H + CH3CH2OH + HCl
```

An ITS for this reaction could be encoded as follows. First, create a starting graph *S* as the sum of all reactant molecular graphs. Next, create a products graph *P* as the sum of all product molecular graphs. Finally, sum these two graphs to create a third graph, which will contain all nodes and edges in the reaction. Label each edge according to whether the reaction creates, breaks, or leaves unchanged the corresponding bond. The resulting graph is an ITS. 

<figure>
  <img alt="ITS for Ester Hydrolysis" src="/images/posts/20200224/its-hydrolysis.png">
  <figcaption>
    <strong>ITS for Ester Hydrolysis.</strong> In-bonds are marked with a circle; out-bonds are marked with a hash [<a href="https://doi.org/10.1021/ci00052a009">source</a>]. 
  </figcaption>
</figure>

Catalysts can optionally be omitted. If they are, the result is an *abbreviated ITS*. The abbreviated ITS for ethyl acetate hydrolysis can be represented as:

<figure>
  <img alt="Abbreviated ITS for Hydrolysis" src="/images/posts/20200224/its-hydrolysis-no-catalyst.png">
  <figcaption>
    <strong>Abbreviated ITS for Hydrolysis.</strong> Catalysts such as hydrogen chloride may be omitted, but at the cost of reduced reaction information [<a href="https://doi.org/10.1021/ci00052a009">source</a>].
  </figcaption>
</figure>

The edges in an ITS graph ("ITS bonds") are classified according to their role in the corresponding reaction:

- an *in-bond* is formed by the reaction;
- an *out-bond* is broken by the reaction; and
- a *par-bond* is preserved by the reaction.

Within a data model, ITS bonds are labeled with an ordered pair of integers (*a*, *b*). The first member *a* denotes the bond order at the start of the reaction. The second member *b* denotes the change in bond order caused by the reaction. For example:

- a single par bond (unchanged by the reaction) would be labeled as (1, 0);
- a single in-bond (formed by the reaction) would be labeled as (0, +1);
- a single out-bond (broken by the reaction) would be labeled as (1, -1).
- a double bond reduced during a reaction would be labeled as (2, -1).

And so on. Summing *a* and *b* yields the bond order in the product. Given a molecular graph with three possible bond orders (1, 2, and 3), the possible ITS graph edge labels, and the proposed visual representation, are:

<figure>
  <img alt="ITS Bond Labels" src="/images/posts/20200224/bond-labels.png">
  <figcaption>
    <strong>ITS Bond Labels.</strong> The first number represents the starting bond order. The second number represents the change in bond order, which may be positive or negative. The table can be divided into three sections: the middle column (par bonds); entries to the left (out-bonds); and entries to the right (in-bonds) [<a href="https://doi.org/10.1021/ci00052a009">source</a>].
  </figcaption>
</figure>

As originally formulated, ITS does not capture formal charges consumed or produced during a reaction. For example, the reaction of trimethylamine and methyl iodide has the following arrow notation:

```console
(CH3)3N + CH3I -> (CH4)N+I-
```

The formal charges produced by the reaction will not be captured by an ITS. The same applies to stereochemistry. A [follow-up paper](https://doi.org/10.1021/ci00055a004) offers comprehensive solutions to both problems. A simpler approach, in which ionic bonds are modeled as edges in the ITS graph is [also described](https://doi.org/10.1021/ci00052a011).

ITS transforms the problem of reaction manipulation into one of graph manipulation. As such, we get a number of useful features essentially for free.

# Regenerating Reactants and Products

An edged-labeled ITS can be used to regenerate either the set of reactants or the set of products through graph manipulation. Fujita describes two processes:

1. **Projection to starting stage (PS).** Extract all nodes in the ITS graph as atoms. For each edge label (*a*, *b*) in the ITS graph, add a bond of order *a*. The result is a molecular graph in which each connected component is an input to the reaction.
2. **Projection to product stage (PP).** Extract all nodes in the ITS graph as atoms. For each edge label (*a*, *b*) in the ITS graph, add a bond of order *a* + *b*. The result is a molecular graph in which each connected component is an output from the reaction.

<figure>
  <img alt="ITS Projections" src="/images/posts/20200224/its-projections.png">
  <figcaption>
    <strong>ITS Projections.</strong> Reactants and products can be regenerated through simple graph operations [<a href="https://doi.org/10.22052/ijmc.2016.13882">source</a>].
  </figcaption>
</figure>

# Graph of Reaction Centers

As sophomore organic chemistry students are taught, molecules can be classified by the functional groups they contain. Viewed from the perspective of graph theory, a functional group represents a subgraph over one or more molecular graphs. Functional groups in turn provide a wealth of insight into reactivity and other physical properties of the molecules containing them. Learning how one functional group behaves lets you say a lot about an unknown molecule in which it appears.

We can likewise glean valuable information by looking at ITS subgraphs. An important example is the *reaction center graph* (RC graph). An RC graph is a subgraph of an ITS containing only dynamic nodes and edges. An edge is dynamic if it: (1) represents an in-bond; (2) represents an out-bond; or (3) lies between two dynamic nodes. A dynamic node is incident to at least one dynamic edge.

As an example, the RC graph of ethyl acetate hydrolysis catalyzed by hydrogen chloride can be drawn as follows:

<figure>
  <img alt="RC Graph" src="/images/posts/20200224/rc-graph.png">
  <figcaption>
    <strong>RC Graph.</strong> Static edges not incident with two dynamic nodes are discarded from the ITS. The result is analogous to the well-known concept of functional group [<a href="https://doi.org/10.22052/ijmc.2016.13882">source</a>]. 
  </figcaption>
</figure>

We can think of an RC graph as the reaction analog of the functional group. Like molecules sharing a common functional group, ITS graphs sharing a common RC graph are likely to behave similarly and share similar characteristics.

Graph theory provides powerful tools for further analysis of RC graphs. Consider how the edges of an RC graph alternate between in- and out-bonds. The RC graph of ethyl acetate hydrolysis drawn above consist of a single cycle in which edges alternative between being formed (in-bonds) and broken (out-bonds).

Fujita refers to an alternating sequence of in- and out-bonds in an RC graph as a *string*. He goes on to classify reactions according to the number of strings they contain ("stringity"). A string will always occur over a cycle, however an abbreviated ITS can produce acyclic strings. A reaction containing multiple strings can sometimes be thought of as occurring over multiple steps. For example, condensation reactions such as ketalization, esterification, or imine formation produce bicyclic RC graphs in which two strings can be traced.

Although not mentioned in his original work, what Fujita is describing can also be cast in terms of the graph theoretical problem of [*perfect matching*](/articles/2019/04/02/the-maximum-matching-problem/). A matching is a subgraph in which every node has degree one. Matchings can be classified as maximal, maximum, or perfect depending on coverage. A perfect matching contains all the nodes of its supergraph.

<figure>
  <img alt="Graph Matching" src="/images/posts/20190403/matchings.png">
  <figcaption>
    <strong>Graph Matching.</strong> Related to resonance and tautomerism, perfect matching also factors into reaction mechanism and ITS.
  </figcaption>
</figure>

It turns out that every valid RC graph, whether cyclic or acyclic, has a perfect matching over in- and out-bonds. Organic chemists would recognize the striking similarity to "pushing electrons" in an aromatic system or within a reaction mechanism.

The requirement for a perfect matching over the dynamic bonds of an RC graph can be applied in several ways. For example, we can use it to validate arbitrary reactions. Alternatively, we can use it to invent new reactions.

# Rethinking the Chemical Reaction as Graph

The graph-based model of reactions afforded by ITS offers several opportunities not available through arrow notation. Some of them include:

- **Classification.** An ITS can be classified by graph invariants including cycle count, [cyclomatic
   complexity](https://en.wikipedia.org/wiki/Cyclomatic_complexity), edge count, and node count.
- **Validation.** A valid ITS must contain a perfect matching over dynamic edges.
- **Invention.** Which valid RC graphs have never been reported as reactions in the literature? What do they have in common?
- **Storage/Retrieval/Indexing**. Molecular fingerprints have been used for decades to index molecules and define similarity relationships. All of the same analysis work with ITS graphs.
- **Editing.** Molecules *and* reactions can be edited using the same compact tool.
- **Depiction**. The redundancy of arrow notation results large depictions in which atom/bond mapping isn't always obvious. ITS depictions approach the compactness of chemical structures while explicitly and accurately representing reactant/product mapping.

# Machine Learning

An intriguing recent development in the use of ITS-style reaction graphs comes by way of machine learning. A group led by Varnek [recently described](https://chemrxiv.org/articles/Discovery_of_Novel_Chemical_Reactions_by_Deep_Generative_Recurrent_Neural_Network/11635929/1) the discovery of novel reactions using a representation similar to Fujita's ITS. Varnek's publications refer to the ITS concept as a *Condensed Graph of Reaction* (CGR).

The technique, called "SMILES/CGR" extends SMILES so as to capture dynamic bonds. In-bonds and out-bonds are represented using a new bond notation wrapped in brackets. For example, a single bond broken in a reaction would be represented as `[->.]`. A single bond formed by a reaction would be represented as `[.>-]`. A double bond reduced to a single bond in a reaction would be represented as `[=>-]`, and so on.

<figure>
  <img alt="Example SMILES/CGR" src="/images/posts/20200224/smiles-cgr.png">
  <figcaption>
    <strong>Example SMILES/CGR for Suzuki Reaction.</strong> In-bonds are depicted in green and out-bonds are depicted in read. (<a href="https://chemrxiv.org/articles/Discovery_of_Novel_Chemical_Reactions_by_Deep_Generative_Recurrent_Neural_Network/11635929/1">source</a>)
  </figcaption>
</figure>

Combining this notation with the now common approach of [SMILES-based autoencoders](/articles/2019/03/19/chemical-line-notations-for-deep-learning-deepsmiles-and-beyond/) lead to several reactions not present in the training set.

The Varnek group has produced a substantial body of work applying reaction graphs to a diverse array of problems:

- [A Representation to Apply Usual Data Mining Techniques to Chemical Reactions — Illustration on the Rate Constant of SN2 Reactions in Water](https://doi.org/10.1142/S0218213011000140) Modeling rates of reaction.
- [Assessment of tautomer distribution using the condensed reaction graph approach](https://doi.org/10.1007/s10822-018-0101-6) Modeling tautomer distributions as reaction graphs.
- [Automatized Assessment of Protective Group Reactivity: A Step Toward Big Reaction Data Analysis](https://doi.org/10.1021/acs.jcim.6b00319) Protecting group removal recommendations via reaction graphs.
- [Expert System for Predicting Reaction Conditions: The Michael Reaction Case](https://doi.org/10.1021/ci500698a) Predicting reaction feasibility. No difference between reagent-based descriptors and reaction-based descriptors.
- [Mining Chemical Reactions Using Neighborhood Behavior and Condensed Graphs of Reactions Approaches](https://doi.org/10.1021/ci300149n) Similarity-based virtual screening.
- [Models for Identification of Erroneous Atom-to-Atom Mapping of Reactions Performed by Automated Algorithms](https://doi.org/10.1021/ci300418q). Validation of mappings made by other tools.
- [Prediction of Activity Cliffs Using Condensed Graphs of Reaction Representations, Descriptor Recombination, Support Vector Machine Classification, and Support Vector Regression](https://doi.org/10.1021/acs.jcim.6b00359) A pair of molecules can be modeled as a transformation and so condensed graph can be used.

At least two software packages created by Varnek group associates have been released as open source. [CGRTools](https://github.com/cimm-kzn/CGRtools) is a toolkit for working with reaction graphs. [CGRdb](https://github.com/stsouko/CGRdb/blob/master/doc/tutorial/main.ipynb) is a reaction database organized around reaction graphs.

# Conclusion

Imaginary Transition Structures, and more broadly reaction graphs, offer a powerful abstraction for working with reactions. By encoding starting materials, products, and atom/bond mappings in a single graph, reaction analyses can take advantage of the same techniques developed for molecular graphs over the last 50 years. The appearance of the first study combining machine learning autoencoders with reaction graphs may foreshadow a renaissance in reaction cheminformatics, with reaction graphs leading the way.