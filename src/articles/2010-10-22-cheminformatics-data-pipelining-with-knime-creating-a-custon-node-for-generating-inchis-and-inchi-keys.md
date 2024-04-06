---
title: "Cheminformatics Data Pipelining with KNIME - Creating a Custom Node for Generating InChIs and InChI Keys"
published: "2010-10-22T00:00:00.000Z"
---

KNIME is a graphical programming environment that many are considering for use in cheminformatics. One of the limitations of KNIME at the present is its relative lack of low-level cheminforamtics software components (nodes) compared to Pipeline Pilot, for example. Previous articles have [introduced KNIME as a tool for cheminformatics](/articles/2010/10/11/cheminformatics-data-pipelining-with-knime-getting-started) and outlined a method for [creating a KNIME node developer environment](/articles/2010/10/14/cheminformatics-data-pipelining-with-knime-configuring-a-node-developer-environment-on-ubuntu-linux). This article shows how to create a custom KNIME node for generating Standard InChIs and InChI Keys.

# The Problem

Although the KNIME cheminformatics package does enable the generation of InChIs through the Open Babel node, it does not enable the generation of InChI Keys - nor does that node generate Standard InChIs or InChI Keys.

We'll be building a node for the sole purpose of generating InChIs and InChI Keys using the latest (1.03) version of the InChI software.

# The Hack

The InChI Node makes use of the [IUPAC InChI toolkit](http://www.iupac.org/inchi/), which was [unfortunately implemented in C and only C](/articles/2008/12/10/mr-inchi-tear-down-this-wall/). Because KNIME Nodes are implemented in Java, we face the problem of how to deal with the platform-specific binary dependency InChI introduces - in the platform-independent context of a KNIME Node running in a JVM.

Fortunately, there is a way - albeit a hack. Provided we can ensure our platform has access to the InChI binary, we can use [a lightweight Java wrapper to InChI](/articles/2010/10/18/a-lightweight-and-portable-java-interface-to-inchi), saving ourselves the trouble of compiling numerous platform-specific versions of the node.

We could obviously build a full-blown JNI (or [JNA](http://today.java.net/article/2009/12/20/simplify-native-code-access-jna)) interface to InChI (or use an existing one), but with significantly increased costs in development and maintenance.

Given the trade-offs, this InChI Node will use the lightweight wrapper approach.

# Setting Up the Environment

Given that you're following my suggestion to [run the KNIME SDK on Ubuntu]/articles/2010/10/14/cheminformatics-data-pipelining-with-knime-configuring-a-node-developer-environment-on-ubuntu-linux/), possibly using VirtualBox, you should be able to create a new project. Creating a KNIME node project called "inchi" should give this project layout:

[![Figure](/images/posts/blank-knime-project.png "Figure")](/articles/2010/10/14/cheminformatics-data-pipelining-with-knime-configuring-a-node-developer-environment-on-ubuntu-linux/)

Although there are a lot of files, we'll only need to concern ourselves with one: **InChINodeModel.java**. Even better, we'll only need to implement a single method in this class, <code>execute</code>.

# The Code

Below is the source I added to implement the <code>execute</code> method:

```java
protected BufferedDataTable[] execute(final BufferedDataTable[] inData, final ExecutionContext exec) throws Exception {
  logger.warn("Calculating InChIs...");

  DataTableSpec inputTableSpec = inData[0].getDataTableSpec();
  DataColumnSpec[] outputColumnSpecs = new DataColumnSpec[inputTableSpec.getNumColumns() + 2];

  for (int i = 0; i < inputTableSpec.getNumColumns(); i++) {
    DataColumnSpec columnSpec = inputTableSpec.getColumnSpec(i);

    outputColumnSpecs[i] = columnSpec;
  }

  outputColumnSpecs[inputTableSpec.getNumColumns()] = new DataColumnSpecCreator("inchi", StringCell.TYPE).createSpec();
  outputColumnSpecs[inputTableSpec.getNumColumns() + 1] = new DataColumnSpecCreator("inchi_key", StringCell.TYPE).createSpec();

  DataTableSpec outputTableSpec = new DataTableSpec(outputColumnSpecs);
  BufferedDataContainer outputContainer = exec.createDataContainer(outputTableSpec);

  CloseableRowIterator it = inData[0].iterator();
  int rowNumber = 1;

  while (it.hasNext()) {
    DataRow inputRow = it.next();
    RowKey key = inputRow.getKey();
    DataCell[] cells = new DataCell[inputRow.getNumCells() + 2];

    for (int i = 0; i < inputRow.getNumCells(); i++) {
      cells[i] = inputRow.getCell(i);
    }

    DataCell molfileCell = inputRow.getCell(0);
    String inchi = getInChIFromMolfile(molfileCell.toString());
    String inchiKey = getInChIKeyFromMolfile(molfileCell.toString());
    cells[inputRow.getNumCells()] = new StringCell(inchi);
    cells[inputRow.getNumCells() + 1] = new StringCell(inchiKey);

    DataRow outputRow = new DefaultRow(key, cells);

    outputContainer.addRowToTable(outputRow);
    exec.checkCanceled();
    exec.setProgress(rowNumber / (double)inData[0].getRowCount(), "Adding row " + rowNumber);

    rowNumber++;
  }

  outputContainer.close();
  BufferedDataTable outputTable = outputContainer.getTable();
  return new BufferedDataTable[]{outputTable};
}
```

The code is fairly straightforward, if verbose. At a high level, we're transforming a tabular representation of a data stream into another tabular representation of that stream by adding two columns - one called "inchi", and the other called "inchi\_key". We preserve the contents and ordering of all input fields. We then populate the extra columns with the InChI and InChI key generated by the lightweight wrapper to the InChI binary.

The <code>execute</code> method invokes both <code>getInChIFromMolfile</code> and <code>getInChIKeyFromMolfile</code>, the implementations of which follow:

```java
private BufferedReader runInChI(String molfile) throws IOException {
  String[] command = {
    "/bin/sh",
    "-c",
    "echo \"" + molfile + "\" | inchi -STDIO -AuxNone -NoLabels -Key 2>/dev/null"
  };
  Process inchi = Runtime.getRuntime().exec(command);

  return new BufferedReader(new InputStreamReader(inchi.getInputStream()));
}

private String getInChIFromMolfile(String molfile) throws IOException {
  BufferedReader input = runInChI(molfile);
  String result = input.readLine();      
  input.close();

  return result == null ? "" : result;
}

private String getInChIKeyFromMolfile(String molfile) throws IOException {
  BufferedReader input = runInChI(molfile);
  input.readLine();
  String result = input.readLine();

  input.close();

  return result == null ? "" : result.substring(9);
}
```

# Compile

We can compile the node for deployment to the KNIME workbench by opening the **plugin.xml** file in Eclipse, scrolling to the bottom, clicking "Export Wizard", and following the instructions:

![KNIME Export Wizard](/images/posts/knime-export-wizard.png "KNIME Export Wizard")

I've set up my export task to copy the compiled package into my KNIME workbench plugin directory:

![KNIME Destination Dir](/images/posts/knime-destination-dir.png "KNIME Destination DIR")

# See It Run

Restarting the KNIME workbench gives a new Node called "InChI":

![KNIME Nodes with InChI](/images/posts/knime-nodes-with-inchi.png "KNIME Nodes with InChI")

The InChI node can be used, for example, to add InChIs to an SD File and write the contents to an CSV File:

![KNIME InChI Workflow](/images/posts/knime-inchi-workflow.png "KNIME InChI Workflow")

# Impressions

I found it cumbersome to develop the InChI Node because the only way to test was to use it in a KNIME workflow. And the only way I found to get each new version of the node into a KNIME workflow was to shut down the currently running instance of the KNIME workbench and restart it. All of this fiddling around added up to a lot of time spent just running tests.

An automated testing solution that streamlines the process of testing a KNIME model object would be a welcome addition to the SDK. I'm thinking of a small library that stubs out the essential behaviors of the KNIME workbench and which could be included in JUnit tests. Does something like this already exist?

# Conclusions

Building a custom KNIME cheminformatics node is not difficult, although it feels more complicated and verbose than it needs to be. Still, we have a working node that in principle we can use in our own automated workflows and share with others. There are some niceties that I've skipped over - for example the custom icon, placement of the node into a folder in the workbench, and enabling customization of the node's behavior through a popup dialog. But that's a story for another time.