---
title: "OxMol: Rust/Python Bindings for ChemCore"
summary: "First steps toward bringing ChemCore to a Python interpreter near you."
twitter: true
summary-image: images/posts/20200615/summary.png
published: "2020-06-15T16:00:00Z"
---

Python is the most popular orchestration language in scientific computing. Across a variety of fields, Python provides high-level interfaces to fast code written in other languages. A [previous article](/articles/2020/06/01/chemcore-a-cheminformatics-toolkit-for-rust/) introduced [ChemCore](https://crates.io/crates/chemcore), a new cheminformatics library written in Rust. This article moves the idea another step forward by introducing [OxMol](https://github.com/thesketh/oxmol), Python bindings for ChemCore.

# Installation

The [OxMol documentation](https://oxmol.readthedocs.io/en/latest/installation.html) describes two installation methods. The simplest is just a one-liner:

```bash
pip install --index-url https://test.pypi.org/simple/ oxmol
```

On my macOS Mojave system, a slightly modified version of this command worked:

```bash
pip3 install --index-url https://test.pypi.org/simple/ oxmol
```

# Hello, Ethane

OxMol closely follows the ChemCore API. Molecule construction follows the same pattern you'd find in Rust.

```python
from oxmol import AtomSpec, BondSpec, Molecule

atoms = [ AtomSpec('C', 3), AtomSpec('C', 3) ]
bonds = [ BondSpec(0, 1, 1) ]
mol = Molecule(atoms, bonds)

# exercise the full Molecule interface

mol.is_empty() # False
mol.order() # 2
mol.size() # 1
mol.nodes # [0, 1]
mol.has_node(0) # True
mol.neighbors(0) # [1]
mol.degree(0) # 1
mol.edges # [(0, 1)]
mol.has_edge(0, 1) # True
mol.element(0) # PyElement::C
mol.isotope(0) # nil
mol.electrons(0) # 0
mol.hydrogens(0) # 3
mol.atom_parity(0) # nil
mol.bond_order(0, 1) # PyBondOrder::Single
mol.bond_parity(0, 1) # nil
```

# About OxMol

OxMol was created by [Travis Hesketh](https://twitter.com/t_sketh), a postgraduate researcher at the University of Strathclyde. The package currently supports the construction of `Molecule` instances conforming to the [Minimal Molecule API](/articles/2020/04/06/a-minimal-molecule-api/). The [README](https://github.com/thesketh/oxmol) notes these future directions:

- SMILES read/write
- substructure search
- coordinate representation and embedding
- descriptor calculation

ChemCore's top priority is a complete SMILES reader. So that functionality is likely to appear in OxMol first.

# PyO3

OxMol uses [PyO3](https://github.com/PyO3/pyo3), which provides two-way bindings between Python and Rust. The approach is similar to [pybind](https://github.com/pybind/pybind11) for C++/Python interop. The main reason to use PyO3 is all of the work it does for you. A suite of [procedural macros](https://doc.rust-lang.org/reference/procedural-macros.html) dynamically generates low-level glue code.

Even so, OxMol requires considerable glue code of its own. For example, see [`DefaultMolecule`](https://github.com/thesketh/oxmol/blob/master/src/default_molecule.rs). This wrapper exposes a Rust interface, but accepting and returning PyO3-specific types. In a nutshell, the `Molecule` interface is re-implemented using a delegate implementation provided by ChemCore. Fortunately, the interface was designed with ease of implementation in mind. Even so, it might be possible to take the automation one step further here.

# More Python-Rust Interop

PyO3 is but one option for Rust/Python interop. Others include:

- [RustPy](https://github.com/iduartgomez/rustypy). Bidirectional mappings using FFI.
- [rust-cpython](https://github.com/dgrunwald/rust-cpython). The project from which PyO3 was forked.
- [Calling Rust in Python](https://bheisler.github.io/post/calling-rust-in-python/). A soup-to-nuts exploration of wrapping Rust with Python from scratch.
- [Milksnake](https://github.com/getsentry/milksnake). Builds "regular native libraries that are then loaded with CFFI at runtime." Currently inactive.

# Conclusion

OxMol provides Python wrappers to the new Rust cheminformatics library ChemCore. The project's feature set is restricted by the currently limited feature set of the underlying Rust library. If you're interested in the combination of cheminformatics, Rust, and Python, it's a project worth checking out.