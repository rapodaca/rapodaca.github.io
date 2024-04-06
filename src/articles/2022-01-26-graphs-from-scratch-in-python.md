---
title: Graphs from Scratch in Python
summary: Boiling the complexity of graphs down to a few methods, then implementing them.
twitter: true
summary-image: images/posts/20220126/summary.png
published: "2022-01-26T17:30:00Z"
---

Graphs are central to many areas of programming, so it's not surprising to find many general-purpose graph libraries. But these ready-made solutions sometimes lack the focus needed to solve specific problem well. Having hit this problem several times, I recently proposed a solution in the form of a [minimal graph API](/articles/2020/01/06/a-minimal-graph-api/) with a [Rust implementation](/articles/2020/02/17/graphs-in-rust-introducting-graphcore/). The idea is to maximize reusability by distilling a graph's essence to the smallest possible set of methods.

This article extends the idea to Python. Because graphs draw from so many areas of computer science, they make excellent test subjects for the intermediate-level programming language student. Along these lines, this article touches on concepts including the Python data model, iterators, generators, list comprehension, abstract base classes, protocols, complexity analysis, and type hints. For those interested in code first, [a companion repository](https://github.com/rapodaca/pygraph) is available at GitHub.

# A Minimal Graph API

A graph can be viewed as a set of nodes and a set of pairwise relationships, or edges, between them. The simplest possible API for a graph would therefore contain just two operations: iterate all nodes and iterate all edges. However, such a spartan API would not support doing any of the things that make graphs interesting. What's needed in addition are operations for counting, testing membership, and testing connectivity. The following minimal set of graph operations is based on the one I [previously proposed](/articles/2020/01/06/a-minimal-graph-api/).

1. Iterate all nodes.
2. Return the node count ("order").
3. Test whether any nodes are present ("empty").
4. Test whether a node is a present ("membership").
5. Iterate all edges.
6. Return the edge count ("size").
7. Test whether an edge exists ("connectivity").
8. Iterate the nodes connected to a given node ("neighborhood").
9. Return the count of nodes attached to a given node ("degree").
10. Return a debugging string.

This set is provably complete in the sense that it supports the two fundamental operations: iterating nodes (1) and iterating edges (5). The set also includes convenience operations for counting items, testing connectivity, and membership. A Python object mapping the above operations to methods could be used within any solvable graph problem.

But isn't this API too narrow? Popular libraries offer graphs with far more than just ten methods. Keep in mind that the ten operations can be composed limitlessly. Especially useful combinations can be bundled into functions and distributed as a library.

Some problem domains require graphs with special capabilities. In my field, chemistry, graphs model molecular structure with nodes modeling atoms and edges modeling bonding relationships. In such applications, the minimal API can be extended. Restricting methods to those fundamental to the problem domain will yield a flexible, but lean result.

The idea of a "lean," or minimal, API may not seem important. After all, what difference does it make whether a function is attached to a class (as a method) or accepts a class instance (as a function)? That distinction will become clearer after addressing the question of reducing the minimal graph API to practice.

# A Graph Protocol

Python has been described as a "protocol-oriented" language. A *protocol* is a collection of methods useful for some purpose. A similar idea can be found in many languages: Java has interfaces, C++ has abstract classes, and Rust has traits.

A protocol can be implicit in the sense that a function might assume that an argument supports a specific set of methods. This assumption might even be stated in the documentation, but that's the extent of it. The function behaves as if the methods are present. If they're not the interpreter raises a runtime error. This is called "[duck typing](https://en.wikipedia.org/wiki/Duck_typing)."

It's also possible to define a protocol explicitly using the `Protocol` [type hint](https://docs.python.org/3/library/typing.html). This approach makes it easier to structure documentation. But more than this, an explicit protocol can be analyzed by Python type checkers. These type checkers can themselves be integrated into developer tools to reveal type errors before runtime. This way of working has a lot in common with [Typed Javascript](/articles/2021/11/03/typed-javascript/).

The following `Protocol` translates the minimum graph API to a Python Protocol.

```python
from typing import Iterator, Protocol, Tuple


class graph(Protocol):
    def __len__(self) -> int:
        """Return the node count."""
        ...
    
    def __contains__(self, id: int) -> bool:
        """Test whether a node is present."""
        ...

    def __iter__(self) -> Iterator[int]:
        """Iterate all nodes."""
        ...

    def __repr__(self) -> str:
        """Return a debugging string."""
        ...

    def iteredges(self) -> Iterator[Tuple[int, int]]:
        """Iterate all edges."""
        ...

    def size(self) -> int:
        """Return the edge count."""
        ...

    def iterneighbors(self, id: int) -> Iterator[int]:
        """Iterate the neighbors of a node."""
        ...

    def degree(self, id: int) -> int:
        """Return the count of nodes attached to a node."""
        ...

    def has_edge(self, sid: int, tid: int) -> bool:
        """Test whether an edge exists."""
        ...
```

This protocol reflects a collection-centric view in which a `Graph` contains zero or more integer node identifiers ("ids"). Ids can be counted, tested for membership, and iterated by virtue of the [special methods](https://docs.python.org/3/reference/datamodel.html#special-method-names) `__len__`, `__contains__`, and `__iter__`, respectively. A debug string is available through `__repr__`.

```python
def test_graph(graph: Graph):
    for id in graph:
        print("Found node id", id)

    print("Sorted node list", sorted(graph))
    print("Unsorted node list", [id for id in graph])

    if graph:
        print("Graph is not empty.")
    else:
        print("Graph is empty.")

    if 42 in graph:
        print("So special!")
    else:
        print("Not so special.")

    print("Here I am", repr(graph))
```

This concept goes by the name of "data model." The Python data model links classes, special methods, built-in functions and types, and protocols into a cohesive whole. For an excellent treatment of this topic see this talk by [James Powell](https://twitter.com/dontusethiscode).

<div class="videowrapper">
  <iframe src="https://www.youtube.com/embed/cKPlPJyQrt4" allowfullscreen></iframe>
</div>

What remains of the `Graph` protocol is implemented without special methods, but with Python idioms and conventions in mind. For example, a simple way to reveal edges would be to return a list of tuples. But that's not what `Graph` does. Instead, it returns an iterator of tuples. As we'll see, this offers flexibility to implementors of `Graph`, without restricting the uses of the return value:

```python
def report_edges(graph: Graph):
    for sid, tid in graph.iteredges():
        print(f"Found edge ({sid}, {tid}).")

    print("A list of bonds:", list(graph.iteredges()))
```

The same applies to reporting neighbors:

```python
def report_neighbors(id: int, graph: Graph):
    for tid in graph.iterneighbors(id):
        print(f"Found neighbor {tid}.")

    print("A list of neighbors:", list(graph.iterneighbors(id)))
```

Bundled with `Graph` are five custom exceptions that are raised either in the context of constructing or using a `Graph`.

```python
class DuplicateNode(Exception):
    """Raised when building a graph with duplicate nodes."""


class DuplicateEdge(Exception):
    """Raised when building a graph with duplicate edges."""


class Loop(Exception):
    """Raised when building a graph with with a loop."""


class UnknownNode(Exception):
    """Raised when accessing a node whose id is not found."""


class HalfEdge(Exception):
    """Raised when building an adjacency-style graph without a back edge."""
```

Let's make this discussion of the `Graph` protocol more concrete with an implementation.

# AdjacencyList

An [adjacency list](https://en.wikipedia.org/wiki/Adjacency_list) is a graph implementation that associates each node with a list of neighbors. This pattern is implemented by the `AdjacencyList` class.

```python
from typing import Iterator, Tuple
from pygraph.graph import DuplicateEdge, HalfEdge, Loop, UnknownNode


class AdjacencyList:
    def __init__(self, adjacency: dict[int, list[int]]):
        for sid, tids in adjacency.items():
            for tid in tids:
                try:
                    sids = adjacency[tid]
                except KeyError:
                    raise UnknownNode

                if sid not in sids:
                    raise HalfEdge
                elif tids.count(tid) > 1:
                    raise DuplicateEdge
                elif tid == sid:
                    raise Loop

        self._adjacency = dict(adjacency)

    def __len__(self) -> int:
        return len(self._adjacency)

    def __contains__(self, id: int) -> bool:
        return id in self._adjacency

    def __iter__(self) -> Iterator[int]:
        return iter(self._adjacency.keys())

    def __repr__(self) -> str:
        return 'AdjacencyList({})'.format(self._adjacency)

    def iteredges(self) -> Iterator[Tuple[int, int]]:
        for sid, tids in self._adjacency.items():
            for tid in tids:
                if sid < tid:
                    yield (sid, tid)

    def iterneighbors(self, id: int) -> Iterator[int]:
        return iter(self._neighbors(id))

    def size(self) -> int:
        return sum(1 for _ in self.iteredges())

    def degree(self, id: int) -> int:
        return len(self._neighbors(id))

    def has_edge(self, sid: int, tid: int) -> bool:
        if tid not in self:
            raise UnknownNode

        return tid in self._neighbors(sid)

    def _neighbors(self, id: int) -> list[int]:
        try:
            result = self._adjacency[id]
        except KeyError:
            raise UnknownNode

        return result
```

`AdjacencyList` is backed by a `dict[int, list[int]]`, or a mapping of node id to neighbor list. This data structure by itself offers a remarkably good match to the minimal graph API, as can be seen from the delegated methods `__len__`, `__contains__`, `__iter__`, `iterneighbors`, and `degree`.

The remaining methods illustrate mismatches between a raw dict and the minimal graph API. Take, for example, `iteredges`.

```python
def iteredges(self) -> Iterator[Tuple[int, int]]:
    for sid, tids in self._adjacency.items():
        for tid in tids:
            if sid < tid:
                yield (sid, tid)
```

The backing dict doesn't offer a direct method for edge iteration. Fortunately, a short [generator](https://wiki.python.org/moin/Generators) can be used instead. No temporary collections (e.g, list or set) are required to avoid iterating non-unique edges. Instead, we use a trick that simply checks that the source id is less than the target id before yielding. This approach has the added advantage of always iterating edges in the same sense and direction.

Given that `AdjacencyList` uses a clone of the dict passed to it through the constructor, the `__init__` method may seem overly busy. What's happening here is a check to ensure that the dict does not contain any of the following bad encodings: a non-member neighbor; a half-edge (sid->tid without tid->sid); a duplicate edge; or a loop (edge to self).

```python
def __init__(self, adjacency: dict[int, list[int]]):
    for sid, tids in adjacency.items():
        for tid in tids:
            try:
                sids = adjacency[tid]
            except KeyError:
                raise UnknownNode

            if sid not in sids:
                raise HalfEdge
            elif tids.count(tid) > 1:
                raise DuplicateEdge
            elif tid == sid:
                raise Loop

    self._adjacency = dict(adjacency)
```

Three methods, `iterneighbors`, `degree`, and `has_edge` call a private helper method, `_neighbors`. The sole purpose of doing so is to avoid the duplication that would result from transforming the built-in `KeyError` into the custom `UnknownNode` exception.

The sailing has been pretty smooth with `AdjacencyList`. Now let's consider an implementation that trades a simpler backing data type for a more complex implementation.

# EdgeList

An [edge list](https://en.wikipedia.org/wiki/Edge_list) views a graph as a list of edges. `EdgeList` implements this idea.

```python
from typing import Iterator, Tuple
from pygraph.graph import DuplicateEdge, Loop, UnknownNode


class EdgeList:
    def __init__(self, edges: list[Tuple[int, int]]):
        seen = set()

        for (sid, tid) in edges:
            if (sid, tid) in seen or (tid, sid) in seen:
                raise DuplicateEdge
            elif sid == tid:
                raise Loop

            seen.add((sid, tid))

        self._edges = list(edges)

    def __len__(self) -> int:
        return sum(1 for _ in self._nodes())

    def __contains__(self, id: int) -> bool:
        for sid, tid in self._edges:
            if id == sid or id == tid:
                return True
        else:
            return False

    def __iter__(self) -> Iterator[int]:
        return iter(self._nodes())

    def __repr__(self) -> str:
        return 'EdgeList({})'.format(self._edges)

    def iteredges(self) -> Iterator[Tuple[int, int]]:
        return iter(self._edges)

    def size(self) -> int:
        return len(self._edges)

    def iterneighbors(self, id: int) -> Iterator[int]:
        return iter(self._neighbors(id))

    def degree(self, id: int) -> int:
        return sum(1 for _ in self._neighbors(id))

    def has_edge(self, sid: int, tid: int) -> bool:
        if sid not in self or tid not in self:
            raise UnknownNode

        for edge in self._edges:
            if edge[0] == sid and edge[1] == tid:
                return True
            elif edge[1] == sid and edge[0] == tid:
                return True
        else:
            return False

    def _neighbors(self, id: int) -> Iterator[int]:
        if id not in self:
            raise UnknownNode
        else:
            return self._mates(id)

    def _mates(self, id: int) -> Iterator[int]:
        for sid, tid in self._edges:
            if id == sid:
                yield tid
            elif id == tid:
                yield sid

    def _nodes(self) -> Iterator[int]:
        seen = set()

        for sid, tid in self._edges:
            if sid not in seen:
                seen.add(sid)

                yield sid

            if tid not in seen:
                seen.add(tid)

                yield tid
```

The main advantage of `EdgeList` is the simplicity and low cost of its backing store, which is just a `list[Tuple[int, int]]`. The main disadvantage is almost everything else. Although edges can be iterated and counted with pure delegation, the remaining methods require greater computational complexity.

These difficulties are such that `EdgeList` defines two private helper methods: `_neighbors`, a two part function-generator pair to to iterate the neighbors of a node; and `_nodes` to iterate the set of `Graph` member node ids.

The result is that certain method calls are more inefficient than they aught to be. Consider `__len__`. Just counting member nodes or testing membership has a time complexity of *O(n)*, where *n* is the number of edges.

Still, `EdgeList` offers the advantage of efficient operations over the set of all edges. Recall that this was something `AdjacencyList` wasn't very good at. Maybe it's possible to get the best of both worlds.

# Hybrid

The node-centered efficiency of `AdjacencyList` can be combined with the edge-centered efficiency of `EdgeList` with `Hybrid`. An instance of this class will be backed by both an adjacency list and an edge list generated from it.

```python
from typing import Iterator, Tuple
from pygraph.graph import HalfEdge, Loop, UnknownNode


class Hybrid:
    def __init__(self, adjacency: dict[int, list[int]]):
        self._edges = []

        for sid, tids in adjacency.items():
            for tid in tids:
                try:
                    sids = adjacency[tid]
                except KeyError:
                    raise UnknownNode

                if sid not in sids:
                    raise HalfEdge
                elif sid == tid:
                    raise Loop
                elif sid < tid:
                    self._edges.append((sid, tid))

        self._adjacency = dict(adjacency)

    def __len__(self) -> int:
        return len(self._adjacency)

    def __contains__(self, id: int) -> bool:
        return id in self._adjacency

    def __iter__(self) -> Iterator[int]:
        return iter(self._adjacency.keys())

    def __repr__(self) -> str:
        return 'Hybrid({})'.format(self._adjacency)

    def iteredges(self) -> Iterator[Tuple[int, int]]:
        return iter(self._edges)

    def size(self) -> int:
        return len(self._edges)

    def iterneighbors(self, id: int) -> Iterator[int]:
        return iter(self._neighbors(id))

    def degree(self, id: int) -> int:
        return len(self._neighbors(id))

    def has_edge(self, sid: int, tid: int) -> bool:
        if tid not in self:
            raise UnknownNode

        return tid in self._neighbors(sid)

    def _neighbors(self, id: int) -> list[int]:
        try:
            result = self._adjacency[id]
        except KeyError:
            raise UnknownNode

        return result

```

The main difference with `AdjacencyList` is that `Hybrid` stores a list of edges, simplifying the implementation of `iteredges` and `size`, and decreasing the time complexity of `size` to *O(1)*.

# Whither Abstract Base Classes?

There's one other way to make a protocol explicit: an [Abstract Base Class](https://docs.python.org/3/library/abc.html) (ABC). An ABC is a class that defines one or more abstract methods to be implemented by subclasses.

It's possible to declare `Graph` as an ABC like so.

```python
from abc import ABC

class Graph(ABC):
    pass
```

The distinction between `Protocol` and `ABC` is both subtle and important. A `Protocol` requires nothing from a conforming class other than a set of methods. An ABC, on the other hand, requires an inheritance relationship.

```python
from pygraph import Graph

class ConcreteGraph(Graph):
    # method overrides
    pass
```

Under ABC, a class can implement all `Graph` methods and still be rejected by the type checker if it fails to also inherit from `Graph`. Using Protocol, however, any class with a conforming interface will be considered a valid `Graph`.

I bring this up because of the unfortunate fact of graph life that many algorithms are computationally demanding. One way to improve performance is to implement those algorithms in a fast language such as C, C++, or Rust. (I'll have more to say about `Graph` and Rust in future articles.) Depending on the tooling around that low-level implementation, it may not be feasible to ensure an inheritance relationship with a `graph` ABC. For now, the advantage goes to Protocol.

# Other Graph Implementations

It may not seem like it, but there's a lot more to implementing `Graph` than what's been discussed here. That's because there are so many different kinds of graphs. Consider a [matching](/articles/2019/04/02/the-maximum-matching-problem/), which is a graph in which every node has degree one. An `AdjacencyList` would certainly do the job, but it would be overkill. A backing `dict[int, int]` would do the job more efficiently and simply. Similar considerations apply for other specialized graphs.

Higher complexity is also possible. This article doesn't deal with the topic of loops, parallel edges or directed edges. Although the minimal graph API is compatible with them, concrete implementations may not be. This can lead to conflict should, for example, a function accepting a `Graph` as an argument assume that loops are disallowed whereas an implementation does not. For this reason, a `Graph` Protocol must declare its assumptions about disallowed graph features so that subclasses can behave accordingly.

# Consistency and Cohesion

The existence of a `Graph` Protocol makes it possible to write code that works with a well-defined interface, disregarding any and all implementation details of the underlying graph object. This article has outlined some clear advantages with regard to Python, but there's more to it than that. Graph capabilities factor prominently in the early stages of problem formulation. Even pseudocode uses a graph API, although it may not be defined anywhere. Graphs are, of course, used within every programming language. A common set of capabilities across all of the contexts in which graphs appear can benefit not just specific implementations, but designs and ideas.

A simple language around graph capabilities, used consistently, offers cohesion and reuse potential that's hard to achieve otherwise.

# Conclusion

Although graph theory is a complex topic, the behavior of graph-like objects need not be. Just ten operations suffice to define all of the behaviors associated with graphs. Codifying these behaviors as a `Python` protocol allows functions to focus on fundamental behaviors rather than implementation idiosyncrasies. Limiting the scope of the `Graph` protocol makes multiple special-purpose implementations practical. More broadly, a common vocabulary around graph behavior means that concepts, algorithms, and designs developed on one platform can readily be adapted to others.
