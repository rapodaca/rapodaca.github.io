---
title: Interactive Rust in a REPL and Jupyter Notebook with EVCXR
summary: "Explore Rust and its libraries with immediate feedback."
twitter: true
summary-image: images/posts/20200921/summary.png
published: "2020-09-21T14:00:00Z"
---

Interactive programming, in which expressions are entered and evaluated in real-time, can be a powerful tool for exploring a language and problem solving. This capability is most often associated with dynamically evaluated languages such as JavaScript and Python. Compiled languages such as Java and C++ can also be used interactively, but tooling tends to lag by many years. Rust is a newer compiled language for which interactive programming has recently emerged. This article discusses interactive programming with Rust courtesy of the [EVCXR](https://github.com/google/evcxr) crate.

# Of REPLs and Notebooks

Two broad approaches to interactive programming can be found today:

- REPL ("read-eval-print loop"). Expressions are entered and evaluated, one at a time, from a terminal. A history allows retrieval of previous entries. Examples include the Python interpreter and the JavaScript browser console.
- Notebook. Expression and output blocks are grouped into cells displayed within a Web browser. Some expressions can evaluate to graphical output such as images and charts. The result can be stored, published, and replayed. Examples include [Jupyter](https://jupyter.org) and [Pluto](https://github.com/fonsp/Pluto.jl).

Using EVCXR, both modes of interactive programming are now possible using Rust.

# REPL

The EVCXR REPL can be installed with the following command:

```console
$ cargo install evcxr_repl
```

Installation provides the `evcxr` command,. As a demonstration, consider a simple "Hello, World" program, written interactively.

```console
$ evcxr
>> let mut s = String::from("Hello, ");
>> s.push_str("World!");
> s
"Hello, World!"
```

EVCXR supports the inclusion of private and public crates through the `:dep` command. For example, the following snippet adds [ChemCore](https://github.com/rapodaca/chemcore), a cheminformatics toolkit written in Rust. Once added, the dependency works as expected.

```console
$ evcxr
>> :dep chemcore = "0.2.1"
>> :dep gamma = "0.6.1"
>> extern crate chemcore;
>> use chemcore::molecule::Molecule;
>> use gamma::graph::Graph;
>> let m = chemcore::daylight::read(&"[13c]1ccccc1").unwrap();
>> m.degree(0)
Ok(2)
>> m.neighbors(0)
Ok([5, 1])
>> m.edges()
[(0, 5), (0, 1), (1, 2), (2, 3), (3, 4), (4, 5)]
```

The additional dependency [`gamma`](https://github.com/metamolecular/gamma) (the graph library on which ChemCore is based) brings the `Graph` methods of `Molecule` into scope.

# Jupyter Kernel

Extensions to Jupyter are called "kernels," EVCXR offers a Jupyter kernel capable of allowing Rust to be used within a notebook. Installation is a straightforward adaption of [a procedure recently published here](/articles/2020/08/17/getting-started-rdkit-and-jupyter/).

```console
$ conda create --name evcxr
$ conda activate evcxr
$ conda install -y -c conda-forge nb_conda_kernels
$ cargo install evcxr_jupyter
$ evcxr_jupyter --install
$ jupyter notebook
```

The EVCXR project maintains a [Jupyter tour](https://github.com/google/evcxr/blob/master/evcxr_jupyter/samples/evcxr_jupyter_tour.ipynb) showcasing the capabilities of the kernel. The REPL examples from the previous section should run unmodified within Jupyter.

A very handy feature of of the EVCXR Jupyter kernel is custom HTML-based display. To access it, implement a `Debug` trait on the type of interest. Anything that can be rendered in HTML can then be displayed in a cell's output field. This is a particularly attractive feature in cheminformatics, where many data types have a preferred graphical representation.

To take a simple example, a Rust `Vector` can be represented as an HTML ordered list.

<iframe src="/images/posts/20200921/display-custom.html" onload="this.height=this.contentWindow.document.body.scrollHeight;" scrolling="no" class="jupyter"></iframe>

The [EVCXR kernel documentation](https://github.com/google/evcxr/blob/master/evcxr_jupyter/README.md) lists several projects with custom display support. In my hands, however, only one of them worked as described. [Petgraph](https://docs.rs/petgraph/0.5.0/petgraph/) is a graph data structures library that I [previously reviewed](/articles/2020/02/03/graphs-in-rust-an-introduction-to-petgraph/). [Petgraph-evcxr](https://github.com/timthelion/petgraph-evcxr) makes it possible to visualize Petgraph graphs in Jupyter cells.

<iframe src="/images/posts/20200921/petgraph-notebook.html" onload="this.height=this.contentWindow.document.body.scrollHeight;" scrolling="no" class="jupyter"></iframe>

# Just Because You Can Doesn't Mean You Should

EVCXR is a wonderful tool that can be used to great effect. Like all tools, however, it has limitations. The most important of these is that writing long programs within a REPL or in a notebook is not a great experience. Productivity will likely be much higher using proper tooling to produce lengthy Rust listings. Reserving the REPL and notebook environments to high-level manipulations plays to the strengths of all tools involved.

# More Resources

Despite its recent appearance, EVCXR has already inspired a book: *[Data Analysis with Rust Notebooks](https://datacrayon.com/shop/product/data-analysis-with-rust-notebooks/)*. I haven't read it yet, but it contains several examples of data manipulation and visualization using EVCXR, and apparently some videos as well.

[Papyrus](https://github.com/kurtlawrence/papyrus) is still another Rust REPL. A [book](https://kurtlawrence.github.io/papyrus/intro.html) on installing and using it is available.

Beyond REPLs and notebooks, Rust offers a [growing collection](https://github.com/ruse-lang/langs-in-rust) of scripting languages offering conveniences of both approaches to varying degrees. Examples include:

- [Rhai](https://github.com/jonathandturner/rhai)
- [Forge](https://github.com/zesterer/forge)
- [Gluon](https://github.com/gluon-lang/gluon)
- [Dyon](https://github.com/pistondevelopers/dyon)

A less interactive but notable alternative is the [Rust Playground](https://play.rust-lang.org). This Web application accepts Rust code as input and displays any output generated. It's not the same thing as a REPL or notebook, but can serve some of the same purposes.

# Conclusion

Rust supports a growing suite of interactive programming options including the EVCXR REPL, a Jupyter Rust kernel, and several scripting languages. Within certain constraints, these tools can make the process of using code written in Rust more visual and spontaneous. Beginners can dive right into examples with minimal ceremony. And experienced Rust developers can display their work to a much wider audience through interactive snippets than might otherwise be feasible