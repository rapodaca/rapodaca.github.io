---
title: Getting Started with DeepChem
summary: "Build a workbench for exploring machine learning primitives in chemistry."
twitter: true
summary-image: images/posts/20200914/summary.png
published: "2020-09-14T14:00:00Z"
---

Like many fields, chemistry is in the midst of a machine learning transformation. Chemistry also has some peculiarities that make getting started with machine learning a challenge. What would be helpful is a workbench that makes it possible to conduct simple but illustrative studies with minimal ceremony. [DeepChem](https://github.com/deepchem/deepchem) is a batteries-included suite that seeks to fill this need. This article describes DeepChem's installation, and works through an example showing one way to train a random forest model to predict experimental solubility data.

# About DeepChem

From the [README](https://github.com/deepchem/deepchem), DeepChem provides:

>  ... a high quality open-source toolchain that democratizes the use of deep-learning in drug discovery, materials science, quantum chemistry, and biology.

<div class="videowrapper">
  <iframe src="https://www.youtube.com/embed/sntikyFI8s8" allowfullscreen></iframe>
</div>

DeepChem goes beyond merely aggregating packages in that it also provides a suite of uniform machine learning primitives customized for chemistry and biology. For this reason, it can be useful to both beginners and experts.

# Installation

The [README](https://github.com/deepchem/deepchem) recommends running DeepChem through [Google Colab](https://colab.research.google.com/notebooks/intro.ipynb). In my experience, that approach seems less than ideal because it requires the re-installation of at least one dependency (RDKit) before each use. There are other reasons for running DeepChem on your own machine. For example, your use case may be more sophisticated than what Jupyter Notebooks allow.

A [previous article](/articles/2020/08/17/getting-started-rdkit-and-jupyter/) described the installation of a cheminformatics stack consisting of RDKit, Jupyter, and Anaconda. The procedure for installing DeepChem re-uses many elements from that approach. If you haven't done so already, begin by installing Anaconda on your system.

My approach installs DeepChem, RDKit, Jupyter and matplotlib into an Anaconda instance. I've found it to be reproducible on my macOS Mojave installation:

```console
conda create --name deepchem-test
conda activate deepchem-test
conda install -y -c conda-forge rdkit nb_conda_kernels matplotlib
pip3 install tensorflow==2.2.0
pip3 install --pre deepchem 
```

Three points are worth noting:

- `pip3` is my system's Python 3 Pip installation. You may be able to use just `pip`.
- It's important to install Pip dependencies *after* the Anaconda dependencies, and while the `deepchem-test` environment is activated.
- The DeepChem pre-release is required. The last stable release of DeepChem was one year ago (2.3.0). Unfortunately, all of DeepChem's examples are written to use the most recent API, which is not backward-compatible. To avoid this headwind, go with the pre-release.

# Starting a Notebook

Jupyter notebooks ("notebooks") offer a convenient alternative to the Python REPL thanks to inline graphics and publication capabilities. For this reason, the DeepChem example that follows will be presented as a notebook.

By way of preparation, ensure that your terminal prompt is prefixed with `(deepchem-test)`, or the name you chose for the Anaconda environment. If this isn't the case, activate the environment with:

```console
$ conda activate deepchem-test
(deepchem-test) $ jupyter notebook
```

# Example

What follows is a transcript of a notebook I created while working through the DeepChem project's [aqueous solubility tutorial](https://github.com/deepchem/deepchem/blob/master/examples/tutorials/03_Modeling_Solubility.ipynb). The goal is not develop a practical model, but rather to illustrate some of DeepChem's capabilities. For a more technical treatment of solubility modeling, see the [article by Pat Walters.](http://practicalcheminformatics.blogspot.com/2018/09/predicting-aqueous-solubility-its.html) More examples are available from the [DeepChem repository](https://github.com/deepchem/deepchem/tree/master/examples). An [entire subdirectory of examples](https://github.com/deepchem/deepchem/tree/master/examples/delaney) is dedicated to the Delaney solubility set.

<!-- https://stackoverflow.com/questions/9162933/make-iframe-height-dynamic-based-on-content-inside-jquery-javascript -->
<iframe src="/images/posts/20200914/solubility-notebook.html" onload="this.height=this.contentWindow.document.body.scrollHeight;" scrolling="no" class="jupyter"></iframe>

# Video Tutorial

A video tutorial from [Jan Jansen's helpful YouTube channel](https://www.youtube.com/c/JanJensenCopenhagen/videos) explains how to use [graph convolution](/articles/2020/03/09/a-brief-introduction-to-graph-convolutional-networks/) with DeepChem to predict aqueous solubility (to better effect than random forest).

<div class="videowrapper">
  <iframe src="https://www.youtube.com/embed/eiELMN7QIT0" allowfullscreen></iframe>
</div>

# Conclusion

DeepChem is a suite of machine learning primitives geared toward chemistry and biology. In addition to a wide range of functionality, DeepChem offers many examples illustrating how to build and use predictive models with datasets containing chemical graphs. This article shows how to install DeepChem from scratch and works through the training of a model for aqueous solubility step-by-step.


