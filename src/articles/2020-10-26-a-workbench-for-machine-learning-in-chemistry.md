---
title: A Workbench for Machine Learning in Chemistry
summary: Kick the tires on a short, hackable aqueous solubility predictor built from a DeepChem graph convolutional network.
twitter: true
summary-image: images/posts/20201026/summary.png
published: "2020-10-26T16:00:00Z"
---

Machine learning has made major inroads into molecular property prediction over the last few years. But with the deluge of techniques and tools comes an increased need to recast what works well into a form usable by non-experts. [DeepChem](https://deepchem.io) is a toolchain designed to do just that. This article presents a short, simple code example demonstrating how to use DeepChem to train and use a deep convolutional network to predict aqueous solubility.

# DeepChem Installation

A previous article described [the setup of a DeepChem environment](/articles/2020/09/14/getting-started-with-deepchem/). The approach is based on Anaconda, and includes everything needed to access all of DeepChem's rich functionality.

# The Code

Using DeepChem to make predictions can be broken down into four broad steps:

1. Build a data set.
2. Train a model.
3. Evaluate the model.
4. Use the model.

DeepChem simplifies the reduction of these steps to working code. The following 13 lines, adapted from the excellent book *[Deep Learning for the Life Sciences](https://www.oreilly.com/library/view/deep-learning-for/9781492039822/)*, are enough to build and use a graph convolutional network for aqueous solubility predictions.

<iframe src="/images/posts/20201026/graph-convolution.html" onload="this.height=this.contentWindow.document.body.scrollHeight;" scrolling="no" class="jupyter"></iframe>

The remaining sections detail each step in the process.

# Build the Dataset

DeepChem comes pre-loaded with a number of sample data sets. The one used here here was assembled for the paper *[ESOL: Estimating Aqueous Solubility Directly from Molecular Structure](https://dx.doi.org/10.1021/ci034243x)*. This 1,128-record set commonly goes by the author's name, Delaney. Crucial for the task at hand, each record in the Delaney set contains both an experimentally-determined aqueous solubility measurement and a SMILES string representing the molecular species. Aqueous solubility is expressed as the base-10 logarithm of solubility in units of moles per liter (logS). 

Looking at the first function call, however, it's clear that `load_delaney` is doing more than just loading raw data:

```python
tasks, datasets, transformers = dc.molnet.load_delaney(featurizer='GraphConv')
```

Let's start with the return value, which is a tuple of three elements:

- **`tasks`**: a single-member list containing the value "measured log solubility in mols per litre". This string appears as a heading in the source CSV file. It's the column containing the values that the model will be trained on.
- **`datasets`**: a list of three subsets of the Delaney set (see more below).
- **`transformers`**: a list whose only member is a [`NormalizationTransformer`](https://deepchem.readthedocs.io/en/latest/transformers.html?highlight=normalizationtransformer#deepchem.trans.NormalizationTransformer). A DeepChem `Transformer` ensures that numerical values fit within specific ranges. `NormalizationTransformer` applies a transform to each value that ensures a mean of zero and unit standard deviation for the set. This type of transformation is an example of a more general process called [feature scaling](https://en.wikipedia.org/wiki/Feature_scaling).

`datasets` contains not a single dataset but *three* of them, all of the same shape. For convenience, we spread them over three different variables:

```python
train_dataset, valid_dataset, test_dataset = datasets
```

Each dataset serves a specific purpose:

- **`train_dataset`**: Used for training.
- **`valid_dataset`**: Used for automated hyperparameter tuning. A hyperparameter is a value used during training that isn't part of the model. Test data can't be used to train hyperparameters because it can only be used for validation. To avoid this problem, a [validation set](https://en.wikipedia.org/wiki/Training,_validation,_and_test_sets#Validation_dataset) is used to probe the trained model's response to changes in hyperparameters.
- **`test_dataset`**: Used to evaluate the performance of a model after training.

Each dataset is an instance of DeepChem's [`DiskDataset`](https://deepchem.readthedocs.io/en/latest/datasets.html#diskdataset) class. This data structure is designed to handle sets of 100 GB or larger.

Let's have another look at the call to `load_delaney`:

```python
tasks, datasets, transformers = dc.molnet.load_delaney(featurizer='GraphConv')
```

The named parameter `featurizer` tells `load_delaney` which kind of post-processing will be applied to the molecule obtained after parsing a SMILES. Setting the featurizer to "GraphConv" tells DeepChem to apply its [`ConvMolFeaturizer`](https://deepchem.readthedocs.io/en/latest/featurizers.html?highlight=featurizer#convmolfeaturizer) to input molecules during training.  An alternative would be [`Weave`](https://deepchem.readthedocs.io/en/latest/featurizers.html?highlight=featurizers#weavefeaturizer).

# Train the Model

With training, validation, and test data sets in hand, a model can be trained. We begin by constructing an instance of [`GraphConvModel`](https://deepchem.readthedocs.io/en/latest/models.html?highlight=graphconvmodel#graphconvmodel). This class represents a graph convolutional network as described by Duvenaud in *[Convolutional Networks on Graphs for Learning Molecular Fingerprints](https://arxiv.org/abs/1509.09292)*.

```python
model = dc.models.GraphConvModel(n_tasks=1, mode='regression', dropout=0.2)
```

The constructor call passes three named parameters:

- **`n_task`**: The number of tasks to perform. In data sets containing more than one input value (which is not the case here), a value greater than one is acceptable.
- **`mode`**: Use `regression` to model continuous numerical values, or `classification` for labels.
- **`dropout`**: A value from 0 to 1.0 that tells `GraphConvModel` what percentage of nodes should be disregarded. Increasing [dropout](https://machinelearningmastery.com/dropout-for-regularizing-deep-neural-networks/) is a technique to reduce the tendency of deep networks to overfit on training data.

Additional parameters describing model behavior can also be passed. For example, the size and number of layers and number of atom features can both be specified.

After construction, the model can be trained with the following line which yields a warning on my system containing the text "UserWarning: Converting sparse IndexedSlices to a dense Tensor of unknown shape. This may consume a large amount of memory.":

```python
model.fit(train_dataset, nb_epoch=100) # => 0.11707531929016113
```

On my system, this step takes about 30 seconds.

The first parameter is the previously-created training dataset. The second parameter, `nb_epoch`, is the number of [epochs](https://machinelearningmastery.com/difference-between-a-batch-and-an-epoch/) to train for. The number of epochs, a hyperparameter, defines how many times the model will be trained with the training set. More epochs require more compute resources, and there will be a point of diminishing returns. One way to find it is to create a ["learning curve,"](https://en.wikipedia.org/wiki/Learning_curve_(machine_learning)) in which epoch count is plotted against error.

[`GraphConvModel#fit`](https://deepchem.readthedocs.io/en/latest/models.html?highlight=graphconvmodel#deepchem.models.KerasModel.fit) conveniently returns a numerical value representing "the average loss over the most recent checkpoint interval." Lower values indicate a better fitting final model.

# Evaluate the Model

The trained model can now be evaluated by comparing the error in the training and test sets.

```python
metric = dc.metrics.Metric(dc.metrics.pearson_r2_score)

print(model.evaluate(train_dataset, [metric], transformers)) # => {'pearson_r2_score': 0.9110650179980299}
print(model.evaluate(test_dataset, [metric], transformers)) # => {'pearson_r2_score': 0.759322765543715}
```

Unoptimized test error for this convolutional network approach (0.759) compares favorably with the [previously-described](/articles/2020/09/14/getting-started-with-deepchem/) random forest approach (0.362). However, the difference in error between training and test sets (0.911 vs. 0.759) for the convolutional network suggests overfitting.

# Use the Model

Having built, trained, and evaluated the model, we can now use it to predict the aqueous solubility of unknown molecules.

```python
featurizer = dc.feat.ConvMolFeaturizer()
smiles = ['c1c(O)cccc1O', 'c1c(F)cccc1O', 'c1c(Cl)cccc1O']
x = featurizer.featurize([Chem.MolFromSmiles(s) for s in smiles])

model.predict_on_batch(x) # => array([[2.0801175], [1.3159559], [1.3712412]], dtype=float32)
```

Although the trend seems right, the magnitude appears off. Water itself is only 55 M, so anything in the range of 100 M should raise eyebrows. Wikipedia reports a solubility for m-cresol (first SMILES) of 2.35 g/L, which translates to logS of -1.66. Clearly, there's a lot of room for future work here. For some ideas, have a look at Pat Walters' article *[Predicting Aqueous Solubility - It's Harder Than It Looks](http://practicalcheminformatics.blogspot.com/2018/09/predicting-aqueous-solubility-its.html)*.

Notice that a `ConvMolFeaturizer` is used to transform RDKit molecules into a form suitable for use by the model. This is the same transformation that was applied to RDKit molecules to train the model.

# Experiments

This article presents a compact but complete deep learning workbench. Setting aside issues of error, applicability to the problem domain, and interpretation, several questions can be addressed, including:

- How does the number of epochs (`nb_epoch`) affect time to train and error?
- What happens to the difference in error between training and test sets as dropout changes?
- What happens if you train and evaluate on solubility itself, rather than logS?
- What method does `load_delaney` use to divide the full set into training, validation, and test sets? Can you do better?
- How does GraphConv differ from Weave in performance?
- How does the performance of graph convolution compare with similarly-constructed approaches such as random forest?
- How would you replace the Delaney set with other solubility sets such as those found in [SqSolDB](https://doi.org/10.1038/s41597-019-0151-1)?
- How well do the predictions made by the various methods match [your intuition](https://doi.org/10.1186/s13321-017-0250-y)?

# Conclusion

One of the best ways to learn new technologies is to build a simple work bench. When learning new programming languages, the first work bench often consists of a simple "Hello, World!" program. This article describes something analogous: a 13-line program that trains and evaluates a deep graph convolutional network for aqueous solubility prediction.