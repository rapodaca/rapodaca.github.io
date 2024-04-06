---
title: ChemCell - Easily Convert Names and CAS Numbers to Chemical Structures in Excel
published: "2010-11-01T00:00:00.000Z"
---

*Note: the same functionality described in this article is [now available on Google Spreadsheets](http://blog.metamolecular.com/articles/2011/02/22/gchem-easily-convert-names-and-cas-numbers-to-chemical-structures-in-google-spreadsheets/).*

Chemical databases often start as a list of names or [Chemical Abstracts Service (CAS) Registry numbers](http://metamolecular.com/cheminformatics/what-is-a-cas-number/) contained in an Excel spreadsheet. But as more and more expectations get placed on these ad hoc datasets, a point inevitably comes when the assignment of chemical structures becomes necessary. Whether for the purpose of performing [substructure search](/articles/2008/10/02/fast-substructure-search-using-open-source-tools-part-1-fingerprints-and-databases/), [generating structure images](/articles/2008/09/11/imaging-chemical-structures-with-chemphoto-wysiwyg-drawing-settings/), clustering, or assigning molecular weight, generating chemical structures from common names and CAS Numbers can be a major problem. Given the task of doing so for hundreds of structures, many organizations resort to manual data entry. But what if there were an inexpensive, quick alternative? This article discusses one solution.

# ChemCell

[ChemCell](http://github.com/cdd/chemcell) is a macro that enables Microsoft Excel to convert columns of chemical names and CAS Numbers into [SMILES strings](http://en.wikipedia.org/wiki/Simplified_molecular_input_line_entry_specification). A poster I gave at the [4th annual Collaborative Drug Discovery (CDD) Community Meeting](/articles/2010/10/12/poster-at-the-cdd-communit-meeting/) describes [ChemCell in more detail](/images/posts/cdd-poster.pdf):

![CDD Poster](/images/posts/cdd-poster.png "CDD Poster")

# Using ChemCell

After [downloading ChemCell](http://github.com/cdd/chemcell), extract the archive, double-click on the file **chemcell.xls**, then open your spreadsheet containing trivial names, IUPAC names, or CAS Numbers.

To generate a SMILES string for a name contained in cell A4, click in any empty table cell and use this formula:

```bash
=getSMILES(A4)
```

`getSMILES` works just like any other Excel formula: it can be pasted down every row in a column, the resulting values can be sorted, and other calculations can be based off of it.

# How it Works

ChemCell uses [Chemical Structure Lookup Service](http://cactus.nci.nih.gov/chemical/structure/) (CSLS), a web service created for the purpose of providing structural information based on chemical names. By invoking the `getSMILES` function, your spreadsheet is calling CSLS and parsing the result.

Although it's possible to use PubChem to perform [one-off structure lookup based on CAS Number and/or name](/articles/2007/05/21/simple-cas-number-lookup-with-pubchem/), the CSLS Web API is implemented in such a way so as to easily enable the exposure of this functionality through Excel.

# Limitations

ChemCell's recall and accuracy were tested against a random sample of 1,000 name/structure pairings found in the [ChEBI 3-star dataset](http://www.ebi.ac.uk/chebi/downloadsForward.do). Rate of recall was found to be 70% (structures found) with 76% accuracy (exact matches). Most mismatches were due to unassigned stereochemistry in CSLS that was assigned in ChEBI. In other words, agreement between ChEBI and CSLS in terms of molecular atom connectivity was high.

# Just the Beginning

Converting names and CAS numbers to structures is but one possible use of the underlying ChemCell software. The core system could be used for a number of purposes, including: generation of Standard InChI Key (currently supoported); returning structure images; calculating logP, finding molecular weight, assigning IUPAC Name; and a number of other capabilities.

As more cheminformatics Web services like CSLS start to pop up, they could be integrated through Excel by making some very simple changes to the ChemCell code.

# Conclusions

ChemCell is a very small piece of software that exposes cheminformatics Web services through the familiar and ubiquitous interface of Microsoft Excel. Although the initial proof of concept succeeds relatively well in assigning structures to arbitrary names and CAS Numbers, the underlying approach could be adapted to expose a number of other interesting cheminformatics services.
